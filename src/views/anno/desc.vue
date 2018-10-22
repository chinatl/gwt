<template>
<div>
    <div class="notice-desc" v-loading='loading'>
        <div class="article-title">
            <h3>{{data.title}}</h3>
            <p>
                <span>【公告】</span>
                <span @click="transfer_dialog = true" style='cursor:pointer'>{{data.createUserName}}</span>
                <span>{{data.createOrgName}}</span>
                <span>{{data.createTime}}</span>
            </p>
        </div>
        <div class="article-main">
            <div class="reveive-part" v-if="message_data.isShow">
                <span class="part">接收部门：</span>
                <span class="reve" v-for='(item,index) in reveive_part' :key='index'>
                     <svg-icon icon-class='tree'></svg-icon>{{item.DOMAIN_ORG_NAME}}
                </span>
            </div>
            <div class="active-content2" v-text="data.content"></div>
            <div class="file-info" v-if="file_list.length">
                附件： <span>{{file_list.length}} 个附件，共{{file_list | folderSize}}</span>
            </div>
            <file-list :list='file_list' @delete='delete_file' :remove='true'></file-list>
        </div>
        <p style="text-align:right" class="notice-desc-button">
            <el-button  size="medium" @click="return_anno" ><svg-icon icon-class='返回'></svg-icon>返回</el-button>
            <el-button type="warning" size="medium" @click="report_notice" v-if='!message_data.msgId'><svg-icon icon-class='警察'></svg-icon>举报</el-button>
            <el-button type="danger" size="medium" @click="del_anno" v-else><svg-icon icon-class='删除' ></svg-icon>删除</el-button>
        </p>
        <el-dialog :close-on-click-modal='false'
            title="举报信息"
            class="common-dialog "
            v-drag
            :visible.sync="role_visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules"  v-loading='form_loading' @submit.native.prevent>
                <el-form-item label="举报类型" prop='arrayContentType'>
                  <el-checkbox-group v-model="form.arrayContentType">
                    <el-checkbox label="信息涉密" name="arrayContentType"></el-checkbox>
                    <el-checkbox label="非法内容" name="arrayContentType"></el-checkbox>
                    <el-checkbox label="其他" name="arrayContentType"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="举报原因" prop='cause'>
                    <el-input v-model="form.cause" size="small" @keyup.native.enter='onSubmit' type="textarea" :autosize="{ minRows: 6, maxRows: 10}"></el-input>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
        </el-dialog>

      <el-dialog 
        :close-on-click-modal='false'
        title="用户信息"
        class="common-dialog"
        v-drag
        :visible.sync="transfer_dialog">
      <div>
        <div class="user_info_dialog">
            <div class="user_photo" style="width:221px">
              <img :src="require('@/assets/imgs/a9.jpg')" alt="" v-if="!temp_user_data.HEADIMG" class="radius">
              <img :src="temp_user_data.HEADIMG" alt="" v-else style="width:160px;height:160px" class="radius">
            </div>
            <div class="user_info">
              <div class="outName">{{temp_user_data.realName}}</div>
              <div class="outPhone">{{temp_user_data.mobilePhone}}</div>
              <p>职务：<span>{{temp_user_data.duty || '--'}}</span></p>
              <p>部门：<span>{{temp_user_data.orgAllName|| '--'}}</span></p>
              <p>级别：<span>{{temp_user_data.level || '--'}}</span></p>
              <p>固话：<span>{{temp_user_data.fixPhone || '--'}}</span></p>
              <div class="warning" v-if="temp_user_data.isDisable"><i class="el-icon-warning"></i> 该用户已停用！</div>
              <div class="warning" v-if="temp_user_data.changeFlag === 'Y'"><i class="el-icon-warning"></i> 该用户信息有改动！</div>
            </div>
        </div>
        <div style="text-align:right;padding-bottom:12px">
            <el-button size="small" @click="transfer_dialog = false">取消</el-button>
        </div>
      </div>  
    </el-dialog>
    </div>
</div>
</template>
<script>
import { SET_MESSAGE_DATA } from "@/store/mutations";
import fileList from "@/components/FileList";
import { mapGetters } from "vuex";
import formButton from "@/components/Button/formButton";
import AddUser from "@/components/AddUser";
import config from "@/config";
export default {
  components: {
    fileList,
    formButton,
    AddUser
  },
  data() {
    return {
      dialog: false,
      current: false,
      table_loading: false,
      tableData: [],
      file_list: [],
      data: { noticeProfile: "" },
      tbNoticeReceive: {},
      file_length: 0,
      file_size: 0,
      status: "",
      form: {
        arrayContentType: [],
        cause: ""
      },
      form_loading: {},
      role_visible: false,
      form_loading: false,
      loading: false,
      rules: {
        cause: [{ required: true, tigger: "blur", message: "请输入举报原因" }],
        arrayContentType: [
          {
            required: true,
            tigger: "change",
            message: "请选择举报类型",
            type: "array"
          }
        ]
      },
      tbNoticeSign: {}, //签收详情
      tbNoticeRefuse: {}, //签收详情
      isTimeOut: true,
      change_status: "",
      forward_list: [],
      reveive_part: [],
      transfer_dialog: false,
      temp_user_data: {}
    };
  },
  created() {
    this.$store.dispatch("readSession", SET_MESSAGE_DATA);
    this.get_meeting_data();
  },
  computed: {
    ...mapGetters(["message_data"])
  },
  beforeDestroy() {
    this.$store.commit("DEL_VIEW_BY_NAME", "公告详情");
  },
  methods: {
    del_anno() {
      this.$swal({
        confirmButtonText: "确定",
        showCancelButton: true,
        cancelButtonText: "取消",
        title: "请输入删除原因",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          return !value && "请输入删除原因，此为必填项！";
        }
      }).then(res => {
        if (res.value) {
          this.$post(
            `gwt/business/tbAnnouncement/del`,
            {
              id: this.message_data.id,
              deleteReason: res.value,
              msgTitle: `标题为“${this.data.title}”的公告因“${
                res.value
              }”被管理员删除，请知悉`,
              msgId: this.message_data.msgId
            },
            "json"
          ).then(res => {
            if (res.result !== "0000") {
              return;
            }
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.$router.push("/user-message/index");
          });
        }
      });
    },

    //返回
    return_anno() {
      this.$router.go(-1);
    },
    //举报
    report_notice() {
      this.role_visible = true;
      this.form.arrayContentType = [];
      this.form.cause = "";
      this.$nextTick(res => {
        this.$refs.form.resetFields();
      });
    },
    get_meeting_data() {
      this.loading = true;
      this.$post(
        "gwt/business/tbAnnouncement/getAnnoDetail",
        {
          annoId: this.message_data.id,
          needOrgListFlag: "Y"
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
          this.file_list = res.data.attachmentList.map(res => {
            res.fullAttaPath = config + res.attaPath + "/" + res.smallImgName;
            return res;
          });
          this.data = res.data.tbAnnouncement;
          this.reveive_part = res.data.receiveDoaminAndOrgs;
          this.$post(
            "gwt/system/sysUser/editUser",
            {
              orgUserxId: res.data.tbAnnouncement.createUser
            },
            "json"
          )
            .then(res => {
              if (res.result !== "0000") {
                return;
              }
              this.temp_user_data = res.data.sysUser;
              this.temp_user_data.mobilePhone = res.data.sysUser.mobilePhone;
              this.temp_user_data.duty = res.data.sysUser.sysOrgUserX.duty;
              this.temp_user_data.orgAllName =
                res.data.sysUser.sysOrgUserX.orgAllName;
              this.temp_user_data.level =
                res.data.sysUser.sysOrgUserX.userLevelName;
              this.temp_user_data.duty = res.data.sysUser.sysOrgUserX.duty;
              this.temp_user_data.fixPhone = res.data.sysUser.sysOrgUserX.phone;
              this.$post(
                "gwt/system/sysUserAttachRelation/getHead",
                {
                  userId: this.message_data.createUser
                },
                "json"
              )
                .then(response => {
                  if (response.result !== "0000") {
                    return;
                  }
                  if (!response.data.headInfo) {
                    return;
                  }
                  this.temp_user_data.HEADIMG =
                    config +
                    response.data.headInfo.attaPath +
                    "/" +
                    response.data.headInfo.storeName;
                  console.log(res);
                })
                .catch(res => {
                  console.log(res);
                });
            })
            .catch(res => {
              console.log(res);
            });
        })
        .catch(res => {
          this.loading = false;
        });
    },
    onCancel() {
      this.role_visible = false;
    },
    onSubmit() {
      this.$refs.form.validate(res => {
        if (!res) return;
        this.form_loading = true;
        this.$post(
          "gwt/system/sysReport/report",
          {
            appId: "37",
            arrayContentType: this.form.arrayContentType.join(","),
            cause: this.form.cause,
            contentId: this.data.id,
            reportored: this.data.createUser,
            reportoredOrg: this.data.createOrg,
            title: ` 标题为“${this.data.title}”的通知被举报，点击查看详情`,
            smsTitle: this.data.title,
            smsAppName: "公告"
          },
          "json"
        )
          .then(res => {
            this.form_loading = false;
            if (res.result !== "0000") {
              this.$swal({
                title: "操作失败！",
                text: res.msg,
                type: "error",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                showConfirmButton: true
              });
              return;
            }
            this.role_visible = false;
            this.$message({
              message: "举报成功",
              type: "success"
            });
          })
          .catch(res => {
            this.form_loading = false;
          });
      });
    },
    delete_file() {}
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.user_info_dialog {
  padding: 10px 40px;
  overflow: hidden;
  display: flex;
  .user_photo {
    padding: 0 30px;
  }
  .user_info {
    padding: 0 30px;
    .warning {
      margin-top: 12px;
      line-height: 24px;
      color: rgb(220, 20, 60);
      .el-icon-warning {
        font-size: 18px;
        vertical-align: sub;
      }
    }
    .outName {
      color: rgb(59, 164, 245);
      font-size: 24px;
      font-weight: 500;
    }
    .outPhone {
      margin-top: 10px;
      color: rgb(59, 164, 245);
      font-size: 16px;
      font-weight: 500;
    }
    p {
      color: rgb(103, 106, 108);
      font-size: 13px;
      font-weight: 700;
      margin-top: 10px;
      span {
        font-weight: normal;
      }
    }
  }
}
.sign-up {
  width: 90%;
  margin: 0 auto;
  background-color: #fff;
}
.notice-desc-button {
  .svg-icon {
    font-size: 16px;
    margin-right: 4px;
  }
}
.notice-desc {
  min-height: 400px;
  width: 90%;
  margin: 40px auto;
  padding: 40px 40px;
  background-color: #fff;
  color: rgb(103, 106, 108);

  .article-title {
    text-align: center;
    color: rgb(103, 106, 108);
    border-bottom: solid 1px #e0e0e0;
    padding-bottom: 30px;
    padding-top: 10px;
    position: relative;
    .img_status {
      position: absolute;
      top: 0;
      right: 0;
      text-align: center;
      .imgs {
        height: 133px;
        margin-bottom: -30px;
      }
      .tips {
        font-size: 15px;
        line-height: 26px;
      }
    }
    h3 {
      font-size: 24px;
      font-weight: normal;
      margin: 40px 0;
    }
    p {
      font-size: 13px;
      span {
        margin: 0 10px;
        color: #3271b4;
      }
    }
  }
  .article-main {
    padding: 24px 0;
    .reveive-part {
      line-height: 32px;
      .part {
        padding: 3px;
        font-weight: bold;
        color: rgb(103, 106, 108);
        font-size: 14px;
      }
      .reve {
        color: #0080cc;
        font-size: 13px;
        margin: 0 8px;
        .svg-icon {
          margin-right: 4px;
          border: 1px solid rgb(103, 106, 108);
          font-size: 20px;
          padding: 2px;
          color: rgb(103, 106, 108);
          border-radius: 50%;
          text-align: center;
        }
      }
    }
    .artive-address {
      font-size: 14px;
      line-height: 32px;
      p {
        span {
          color: #3271b4;
        }
      }
    }
    .active-content2 {
      font-size: 15px;
      line-height: 28px;
      margin: 0px 0;
      overflow: hidden;
      padding: 10px 20px;
      white-space: pre-wrap;
    }
    .file-info {
      span {
        font-size: 13px;
      }
    }
  }
}
</style>

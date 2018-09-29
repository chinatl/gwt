<template>
<div>
    <div class="notice-desc" v-loading='loading'>
        <div class="article-title">
            <h3>{{data.noticeTitle}}</h3>
            <p>
                <span>【{{data.noticeTypeName}}】</span>
                <span>{{data.userName}}</span>
                <span>{{data.orgName}}</span>
                <span>{{data.createTime}}</span>
            </p>
            <div class="img_status" v-if='status === "1002" || status === "1001"'>
              <div class="imgs">
                  <img :src="require('@/assets/imgs/已拒签.png')" v-if='status === "1002"'>
                  <img :src="require('@/assets/imgs/已签收.png')" v-if='status === "1001"'>
              </div>
              <p class="tips">{{ status === '1002' ? tbNoticeRefuse.REAL_NAME :tbNoticeSign.REAL_NAME}}</p>
              <p class="tips">
                {{ status === '1002' ? tbNoticeRefuse.REFUSE_TIME :tbNoticeSign.SIGN_TIME}}
                {{status === '1001' ? "签收": null}}
                {{status === '1002' ? "拒签": null}}
              </p>
            </div>
        </div>
        <div class="article-main">
            <div class="artive-address">
                <p v-if='status === "1002"'>拒签理由：<span>测试拒签</span></p>
                <p v-if='data.startTime'>开始时间：<span>{{data.startTime}}</span></p>
                <p v-if='data.noticeAdress'>会议地点：<span>{{data.noticeAdress}}</span></p>
            </div>
            <div class="active-content">
                {{data.noticeProfile}}
            </div>
            <div class="file-info" v-if="file_length">
                附件： <span>{{file_length}} 个附件，共{{file_list | folderSize}}</span>
            </div>
            <file-list :list='file_list' @delete='delete_file' :remove='true'></file-list>
        </div>
        <p style="text-align:right" class="notice-desc-button">
          <el-button type="warning" size="medium" @click="report_notice" v-if='change_status !== "1003"'><svg-icon icon-class='警察'></svg-icon>举报</el-button>
          <el-button type="danger" size="medium"  @click="refuse"  v-if='status === "1000" && isTimeOut && change_status !== "1003"'><svg-icon icon-class='拒签'></svg-icon>拒签</el-button>
          <el-button type="primary" size="medium" @click="reveive_report" v-if='status === "1000" && isTimeOut && change_status !== "1003"'><svg-icon icon-class='签收'></svg-icon>签收</el-button>
          <el-button type="success" size="medium" @click="forward_report" v-if='(status == "1004" || status == "1001") && isTimeOut && change_status !== "1003"'><svg-icon icon-class='转发'></svg-icon>转发</el-button>
        </p>
        <p class="change-notice" v-if="change_status === '1003'">该通知已变更，请查看变更后信息</p>
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
                    <el-input v-model="form.cause" size="small" @keyup.native.enter='onSubmit'></el-input>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
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
      select_arr: [
        {
          name: "人员报名",
          Q_isActive_L: "all"
        },
        {
          name: "上传附件",
          Q_isActive_L: "1"
        }
      ],
      file_list: [],
      data: {},
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
      change_status: ''
    };
  },
  created() {
    this.$store.dispatch("readSession", SET_MESSAGE_DATA);
    this.get_meeting_data();
    this.init_file(this.message_data.NOTICE_ID);
  },
  computed: {
    ...mapGetters(["message_data"])
  },
  beforeDestroy() {
    this.$store.commit("DEL_VIEW_BY_NAME", "通知详情");
  },
  methods: {
    //导入部门
    select_nav(index) {
      this.current = index;
    },
    // 查看人员报名表数据

    //转发
    forward_report() {
      this.$router.push({
        path: "/forward-notice/index"
      });
    },
    //签收
    reveive_report() {
      this.$post(
        "gwt/notice/tbNoticeSign/signNotice",
        {
          receId: this.message_data.RECEIVE_ID,
          noticeType: 7
        },
        "json"
      )
        .then(res => {
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
          this.$message({
            message: "签收成功",
            type: "success"
          });
          this.get_meeting_data();
        })
        .catch(res => {
          console.log(res);
        });
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
    //拒签
    refuse() {
      this.$swal({
        title: "请输入拒签理由",
        input: "text",
        confirmButtonText: "确定",
        showCancelButton: true,
        cancelButtonText: "取消",
        inputValidator: value => {
          return !value && "请输入拒签理由，此为必填项！";
        }
      }).then(res => {
        if (res.value) {
          this.$post(
            "gwt/notice/tbNoticeRefuse/refuseNotice",
            {
              receId: this.message_data.RECEIVE_ID,
              refuseReason: res.value
            },
            "json"
          ).then(res => {
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
            this.$message({
              message: "已拒签成功",
              type: "success"
            });
            this.get_meeting_data();
          });
        } else {
          this.$message({
            type: "warning",
            message: "已取消操作"
          });
        }
      });
    },
    //获取 init 数据
    get_meeting_data() {
      this.loading = true;
      this.$post(
        "gwt/notice/tbNotice/getNoticeTotalInfo",
        {
          receId: this.message_data.RECEIVE_ID
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
          this.data = res.data.tbNotice;
          this.tbNoticeReceive = res.data.tbNoticeReceive;
          this.tbNoticeSign = res.data.tbNoticeSign;
          this.tbNoticeRefuse = res.data.tbNoticeRefuse;
          this.status = res.data.tbNoticeReceive.recStatus;
          this.change_status  = res.data.tbNotice.noticeStatus;
        })
        .catch(res => {
          this.loading = false;
        });
    },
    init_file(noticeId) {
      this.$post(
        "gwt/system/tbNoticeAttachment/attachmentList",
        {
          noticeId,
          attaUploadNode: 1
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          if (!res.data.tbNoticeAttachmentPageBean.length) {
            return;
          }
          this.file_length =
            res.data.tbNoticeAttachmentPageBean[0].ATTA_INFOS.length;
          var num = 0;
          var file_list = res.data.tbNoticeAttachmentPageBean[0].ATTA_INFOS;
          for (var i = 0; i < file_list.length; i++) {
            num += file_list[i].attaSize;
            file_list[i].url =
              "/" + file_list[i].attaPath + "/" + file_list[i].smallImgName;
          }
          this.file_size = num;
          this.file_list = file_list;
        })
        .catch(res => {
          console.log(res);
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
            appId: "5",
            arrayContentType: this.form.arrayContentType.join(","),
            cause: this.form.cause,
            contentId: this.data.noticeId,
            reportored: this.data.createUser,
            reportoredOrg: this.data.createOrg,
            title: ` 标题为“${
              this.data.noticeTitle
            }”的通知被举报，点击查看详情`,
            smsTitle: this.data.noticeTitle,
            smsAppName: this.data.noticeTypeName
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
    .artive-address {
      font-size: 14px;
      line-height: 32px;
      p {
        span {
          color: #3271b4;
        }
      }
    }
    .active-content {
      font-size: 15px;
      line-height: 28px;
      margin: 12px 0;
      text-indent: 2em;
    }
    .file-info {
      span {
        font-size: 13px;
      }
    }
  }
}
</style>

<template>
<div>
    <div class="notice-desc" v-loading='loading'>
        <div class="article-title">
            <h3>{{message_data.title}}</h3>
            <p>
                <span>{{message_data.createUserName}}</span>
                <span>{{message_data.createOrgName}}</span>
                <span>{{message_data.createTime}}</span>
            </p>
        </div>
        <div class="article-main">
            <div class="active-content2" v-text="message_data.content"></div>
            <div class="file-info" v-if="file_length">
                附件： <span>{{file_length}} 个附件，共{{file_list | folderSize}}</span>
            </div>
            <file-list :list='file_list' @delete='delete_file' :remove='true'></file-list>
        </div>
        <p style="text-align:right" class="notice-desc-button">
            <el-button  size="medium" @click="return_anno" ><svg-icon icon-class='返回'></svg-icon>返回</el-button>
            <el-button type="warning" size="medium" @click="report_notice" v-if='change_status !== "1003"'><svg-icon icon-class='警察'></svg-icon>举报</el-button>
        </p>
        <p class="change-notice" v-if="change_status === '1003'">该通知已变更，请查看变更后信息</p>
        <p class="change-notice" v-if="!isTimeOut">该通知已过期，不可操作</p>
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
      forward_list: []
    };
  },
  created() {
    this.$store.dispatch("readSession", SET_MESSAGE_DATA);
    console.log(JSON.stringify(this.message_data, {}, 4));
    this.get_meeting_data();
  },
  computed: {
    ...mapGetters(["message_data"])
  },
  beforeDestroy() {
    this.$store.commit("DEL_VIEW_BY_NAME", "公告详情");
  },
  methods: {
    //返回
    return_anno() {
        this.$router.go(-1)
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
          this.data = res.data.tbAnnouncement;
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
            contentId: this.message_data.id,
            reportored: this.message_data.createUser,
            reportoredOrg: this.message_data.createOrg,
            title: ` 标题为“${
              this.message_data.title
            }”的通知被举报，点击查看详情`,
            smsTitle: this.message_data.title,
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

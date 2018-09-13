<template>
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
              <p class="tips">{{$store.getters.realName}}</p>
              <p class="tips">{{tbNoticeReceive.createTime}}
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
                附件： <span>{{file_length}} 个附件，共 {{file_size | fileSize}}</span>
            </div>
            <file-list :list='file_list' @delete='delete_file'></file-list>
        </div>
        <p style="text-align:right" class="notice-desc-button">
          <el-button type="warning" size="medium" @click="report_notice" ><svg-icon icon-class='警察'></svg-icon>举报</el-button>
          <el-button type="danger" size="medium"  @click="refuse"  v-if='status === "1000"'><svg-icon icon-class='拒签'></svg-icon>拒签</el-button>
          <el-button type="primary" size="medium" @click="reveive_report" v-if='status === "1000"'><svg-icon icon-class='签收'></svg-icon>签收</el-button>
          <el-button type="success" size="medium" @click="forward_report" v-if='status === "1001"'><svg-icon icon-class='转发'></svg-icon>转发</el-button>
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
                    <el-input v-model="form.cause" size="small" @keyup.native.enter='onSubmit'></el-input>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
        </el-dialog>        
    </div>
</template>
<script>
import { SET_MESSAGE_DATA } from "@/store/mutations";
import fileList from "@/components/FileList";
import { mapGetters } from "vuex";
import formButton from "@/components/Button/formButton";

export default {
  components: {
    fileList,
    formButton
  },
  data() {
    return {
      file_list: [],
      data: {},
      tbNoticeReceive: {},
      file_length: 0,
      file_size: 0,
      receId: "",
      status: "",
      form: {
        arrayContentType: [],
        cause: ""
      },
      form_loading: {},
      role_visible: false,
      form_loading: false,
      loading: true,
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
      }
    };
  },
  created() {
    this.$store.dispatch("readSession", SET_MESSAGE_DATA);
    this.get_rece_id();
  },
  computed: {
    ...mapGetters(["message_data"])
  },
  methods: {
    //转发
    forward_report() {},
    //签收
    reveive_report() {
      this.$post(
        "gwt/notice/tbNoticeSign/signNotice",
        {
          receId: this.receId,
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
          this.get_rece_id();
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
              receId: this.receId,
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
            this.get_rece_id();
          });
        } else {
          this.$message({
            type: "warning",
            message: "已取消操作"
          });
        }
      });
    },
    get_rece_id() {
      // getMsgStateByMsgId
      this.loading = true;
      this.$post(
        "gwt/notice/tbNoticeMsgBizInfo/getMessageBizInfo ",
        {
          messageId: this.message_data.MSG_ID,
          recvUser: this.message_data.RECV_USER,
          receiveOrgId: this.message_data.ORG_ID
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.receId = res.data.receId;
          this.status = res.data.status;
          this.get_meeting_data(res.data.receId);
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    },
    get_meeting_data(receId) {
      this.$post(
        "gwt/notice/tbNotice/getNoticeTotalInfo",
        //  "gwt/notice/tbNotice/getNoticeInfoByMessageId",
        {
          receId
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
          this.init_file(res.data.tbNotice.noticeId);
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    },
    init_file(noticeId) {
      this.$post(
        "gwt/system/tbNoticeAttachment/list",
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
          this.get_file_by_id(
            res.data.tbNoticeAttachmentPageBean.datas
              .map(res => res.noticeId)
              .join(",")
          );
        })
        .catch(res => {
          console.log(res);
        });
    },
    //根据id 査附件地址
    get_file_by_id(inIdAry) {
      if (!inIdAry) {
        return;
      }
      this.$post(
        "gwt/cloudisk/attachment/list",
        {
          inIdAry
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.file_length = res.data.attachmentList.length;
          var num = 0;
          for (var i = 0; i < res.data.attachmentList.length; i++) {
            num += res.data.attachmentList[i].attaSize;
            res.data.attachmentList[i].url =
              res.data.uploadProjectUrl +
              "/" +
              res.data.attachmentList[i].attaPath +
              "/" +
              res.data.attachmentList[i].smallImgName;
          }
          this.file_size = num;
          this.file_list = res.data.attachmentList;
        })
        .catch(res => {});
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
            appId: this.message_data.APP_ID,
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
    //gwt/system/tbNoticeAttachment/list
    delete_file() {}
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
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
    }
    .file-info {
      span {
        font-size: 13px;
      }
    }
  }
}
</style>

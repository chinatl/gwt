<template>
    <div class="report-notice-desc">
        <div class="article-title">
            <h3>{{data.noticeTitle}}</h3>
            <p>
                <span>【{{data.noticeTypeName}}】</span>
                <span>{{data.userName}}</span>
                <span>{{data.orgName}}</span>
                <span>{{data.createTime}}</span>
            </p>
        </div>
        <div class="article-main">
            <div class="artive-address">
                <p v-if="data.startTime">开始时间：<span>{{data.startTime}}</span></p>
                <p v-if="data.noticeAdress">会议地点：<span>{{data.noticeAdress}}</span></p>
            </div>
            <div class="active-content">
                <div v-for="(item,index) in data.noticeProfile.split('\n')" :key="index">
                  {{item}}
                </div>
            </div>
            <div class="file-info" v-if="file_list.length">
                附件： <span>{{file_list.length}} 个附件，共{{file_list | folderSize}}</span>
            </div>
            <file-list :list='file_list' @delete='delete_file' :remove='true'></file-list>
        </div>
        <p style="text-align:right"><el-button @click="del_dialog" type="danger"  icon="el-icon-delete"  size="medium">删除</el-button></p>

        <el-dialog :close-on-click-modal='false'
            title="通知删除"
            class="common-dialog"
            v-drag
            :visible.sync="visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules" v-loading='form_loading' @submit.native.prevent>
                <el-form-item label="删除原因" prop='deleteReason'>
                    <el-input v-model="form.deleteReason" size="small" placeholder="请输入删除原因"></el-input>
                </el-form-item>
                <form-button @cancel='onCancel_first' @submit="onSubmit_first" submit_name='确定'></form-button>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { SET_REPORT_DATA } from "@/store/mutations";
import fileList from "@/components/FileList";
import formButton from "@/components/Button/formButton";
import { mapGetters } from "vuex";
export default {
  components: {
    fileList,
    formButton
  },
  data() {
    return {
      file_list: [],
      data: {},
      file_length: 0,
      file_size: 0,
      form: {
        deleteReason: ""
      },
      form_loading: false,
      visible: false,
      rules: {
        deleteReason: [
          { required: true, tigger: "blur", message: "请输入删除原因" }
        ]
      }
    };
  },
  beforeDestroy() {
    this.$store.commit("DEL_VIEW_BY_NAME", "举报详情描述");
  },
  created() {
    this.$store.dispatch("readSession", SET_REPORT_DATA);
    this.init(this.report_data.contentId);
    this.init_file(this.report_data.contentId);
  },
  computed: {
    ...mapGetters(["report_data"])
  },
  methods: {
    del_dialog() {
      this.visible = true;
      this.$nextTick(res => {
        this.$refs.form.resetFields();
      });
      this.form.deleteReason = "";
    },
    onCancel_first() {
      this.visible = false;
    },
    onSubmit_first() {
      this.$refs.form.validate(res => {
        if (!res) return;
        this.form_loading = true;
        this.$post(
          "gwt/notice/tbNotice/del",
          {
            noticeId: this.report_data.contentId,
            msgTitle: `标题为“${this.data.noticeTitle}”的公告因“${
              this.form.deleteReason
            }”被管理员删除，请知悉`,
            cause: this.form.deleteReason,
            msgId: this.report_data.msgId
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
            this.$message({
              message: "删除成功！",
              type: "success"
            });
            this.$router.push({
              path: "/user-message/index"
            });
            this.visible = false;
          })
          .catch(res => {
            this.form_loading = false;
            console.log(res);
          });
      });
    },
    //查内容
    init(noticeId) {
      this.$post(
        "gwt/notice/tbNotice/get",
        {
          noticeId
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.data = res.data.tbNotice;
        })
        .catch(res => {
          console.log(res);
        });
    },
    //差附件
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
          if (res.data.tbNoticeAttachmentPageBean.length) {
            this.file_list = res.data.tbNoticeAttachmentPageBean[0].ATTA_INFOS;
          }
          // this.get_file_by_id(
          //   res.data.tbNoticeAttachmentPageBean.map(res => res.ATTA_IDS).join(",")
          // );
        })
        .catch(res => {
          console.log(res);
        });
    },
    //根据id 査附件地址
    get_file_by_id(inIdAry) {
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
    delete_file() {}
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.report-notice-desc {
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
    padding: 20px 0;
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

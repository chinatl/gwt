<template>
<div>
    <div class="notice-desc" v-loading='loading'>
        <div class="article-title">
            <h3>{{data.noticeTitle}}</h3>
            <p>
                <span v-if="message_data.FORWARD_ID">【转发】</span>
                <span v-if="message_data.FROM_NOTICE_ID">【变更】</span>
                <span>【{{data.noticeTypeName}}】</span>
                <span>{{data.userName}}</span>
                <span>{{data.orgName}}</span>
                <span>{{data.createTime}}</span>
            </p>
            <div class="img_status" v-if='status == "1002" || status == "1001"'>
              <div class="imgs">
                  <img :src="require('@/assets/imgs/已拒签.png')" v-if='status == "1002"'>
                  <img :src="require('@/assets/imgs/已签收.png')" v-if='status == "1001"'>
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
                <p v-if='status === "1002"'>拒签理由：<span>{{tbNoticeRefuse.REFUSE_REASON}}</span></p>
                <p v-if='data.endTime'>结束时间：<span>{{data.endTime}}</span></p>
                <p v-if='data.noticeAdress'>会议地点：<span>{{data.noticeAdress}}</span></p>
                 <p v-if="message_data.FORWARD_ID">转发自：
                <span>
                   {{ forward_list[forward_list.length-1] && forward_list[forward_list.length-1].REAL_NAME}} 
                  {{ forward_list[forward_list.length-1] && forward_list[forward_list.length-1].DEPT_ALLNAME}}
                </span>
                <el-popover
                  placement="bottom-start"
                  width="360"
                  trigger="hover">
                  <div class="forward-notice">
                    <p>转发信息</p>
                    <ul>
                      <li v-for="(item,index) in forward_list" :key="index"> 
                        <div class="li">
                          <div>
                            <span>{{item.REAL_NAME}}</span>
                            <span>{{item.TYPE_NAME}}</span>
                          </div>
                          <div>
                            {{item.CREATE_TIME}}
                          </div>
                        </div>
                        <p class="text-indent" style="color:#333;font-weight:normal" v-if="item.FORWARD_DESC">{{item.FORWARD_DESC}}</p>
                      </li>
                    </ul>
                  </div>
                  <span slot="reference"><little-button name='转发详情'></little-button></span>
                </el-popover>
                </p>
            </div>
            <div class="active-content2" v-text="data.noticeProfile"></div>
            <div class="file-info" v-if="file_length">
                附件： <span>{{file_length}} 个附件，共{{file_list | folderSize}}</span>
            </div>
            <file-list :list='file_list' @delete='delete_file' :remove='true'></file-list>
        </div>
        <p style="text-align:right" class="notice-desc-button">
          <el-button type="warning" size="medium" @click="report_notice" v-if='change_status !== "1003"'><svg-icon icon-class='警察'></svg-icon>举报</el-button>
          <el-button type="danger" size="medium"  @click="refuse"  v-if='status == "1000" && !isTimeOut && change_status !== "1003"'><svg-icon icon-class='拒签'></svg-icon>拒签</el-button>
          <el-button type="primary" size="medium" @click="reveive_report" v-if='status == "1000" && !isTimeOut && change_status !== "1003"'><svg-icon icon-class='签收'></svg-icon>签收</el-button>
          <el-button type="success" size="medium" @click="forward_report" v-if='( status == "1003" || status == "1004" || status == "1001") && !isTimeOut && change_status !== "1003"'><svg-icon icon-class='转发'></svg-icon>转发</el-button>
        </p>
        <p class="change-notice" v-if="change_status === '1003'">该通知已变更，请查看变更后信息</p>
        <p class="change-notice" v-if="isTimeOut">该通知已过期，不可操作</p>
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
    <div class="stuff-common" v-if="status == 1001" v-loading='uploading'>
        <t-title>材料上传</t-title>
         <div class="common-action">
            <div class="common-table-bar">
                <span class="current">附件上传</span>
            </div>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                v-loading ='loading'
                style="width: 100%">
                <el-table-column
                prop="REAL_NAME"
                align="center"
                label="姓名">
                </el-table-column>
                <el-table-column
                prop="DUTY"
                align="center"
                label="职务">
                </el-table-column>
                <el-table-column
                prop="MOBILE_PHONE"
                align="center"
                label="联系方式	">
                </el-table-column>
                <el-table-column
                prop="ORG_ALL_NAME"
                align="center"
                label="所属部门">
                </el-table-column>
                <el-table-column
                align="center"
                label="附件列表">
                    <template slot-scope="scope">
                        <div class="file-list">
                            <p v-for="(item,index) in scope.row.ATTA_INFOS" :key='index'>
                               <svg-icon :icon-class='fileType(item.type)'></svg-icon> {{item.originalName}}
                            </p>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="common-page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNo"
            :page-sizes="$store.getters.page_list"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="total">
            </el-pagination>
        </div>
        <div class="common-action" v-if="!isTimeOut && change_status!== '1003'">
            <upload-button  @on-change="upload_img">添加附件</upload-button>
            <file-list :list='user_upload_list' @delete='delete_user_file'></file-list>
        </div>
        <div class="stuff-footer" v-show="is_upload" v-if="!isTimeOut">
            <p class="tips">附件上传完成后，需确认才能提交</p>
            <p class="stuff-button"><el-button type="primary" size="medium" @click="submit_upload">确认提交</el-button></p>
        </div>
    </div>

</div>
</template>
<script>
import { SET_MESSAGE_DATA } from "@/store/mutations";
import fileList from "@/components/FileList";
import { mapGetters } from "vuex";
import formButton from "@/components/Button/formButton";
import AddUser from "@/components/AddUser";
import uploadButton from "@/components/Button/uploadButton";
import { action_fail, delete_item } from "@/utils/user";
import { fileType } from "@/utils";
import littleButton from "@/components/Button/littleButton";
import qs from "qs";
export default {
  components: {
    fileList,
    formButton,
    AddUser,
    uploadButton,
    littleButton
  },
  data() {
    return {
      uploading: false,
      dialog: false,
      current: false,
      table_loading: false,
      tableData: [],
      file_list: [],
      data: {
        noticeProfile:''
      },
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
      user_upload_list: [],
      pageSize: 5,
      pageNo: 1,
      total: 0,
      is_upload: false,
      isTimeOut: false,
      change_status: "",
      forward_list: []
    };
  },
  beforeDestroy(e) {
    sessionStorage.setItem("send_status", 3);
    this.$store.commit("DEL_VIEW_BY_NAME", "材料征集详情");
    sessionStorage.removeItem("stuff-desc/index/pageNo");
    sessionStorage.removeItem("stuff-desc/index/total");
  },
  created() {
    var total = sessionStorage.getItem("stuff-desc/index/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("stuff-desc/index/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    //页数存到localstorage里面
    var pageSize = localStorage.getItem("stuff-desc/index/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 5;
    this.$store.dispatch("readSession", SET_MESSAGE_DATA);
    this.get_meeting_data();
    this.init_file(this.message_data.NOTICE_ID);
    this.status = this.message_data.REC_STATUS;
    if (this.status == 1001) {
      this.get_user_sign_table(this.pageSize, this.pageNo);
    }
    this.get_forward_info();
  },
  computed: {
    ...mapGetters(["message_data", "user_info"])
  },
  methods: {
    get_forward_info() {
      if (!this.message_data.FORWARD_ID) {
        return;
      }
      this.$post(
        "gwt/notice/tbNoticeForward/getForwardHistory",
        {
          noticeId: this.message_data.NOTICE_ID,
          forwardId: this.message_data.FORWARD_ID
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.forward_list = res.data.forwardHistoryList;
        })
        .catch(res => {
          console.log(res);
        });
    },
    fileType(name) {
      return fileType(name);
    },
    handleSizeChange(e) {
      localStorage.setItem("stuff-desc/index/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.get_user_sign_table(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("stuff-desc/indexpageNo", e);
      this.pageNo = e;
      this.get_user_sign_table(this.pageSize, e);
    },
    submit_upload() {
      this.$post(
        "gwt/system/tbNoticeAttachment/addFiles",
        {
          noticeId: this.message_data.NOTICE_ID,
          forwardId: this.message_data.FORWARD_ID,
          attaUploadNode: 2,
          attaIds: this.user_upload_list
            .filter(res => res.is_normal)
            .map(res => res.id)
            .join(",")
        },
        "json"
      )
        .then(res => {
          if (action_fail(res)) return;
          this.is_upload = false;
          this.get_user_sign_table(this.pageSize, this.pageNo);
        })
        .catch(res => {
          console.log(res);
        });
    },
    //删除用户自己签收附件
    delete_user_file(index) {
      delete_item({
        url: "gwt/cloudisk/attachment/del",
        title: "您确定要删除附件吗?",
        data: {
          id: this.user_upload_list[index].id
        },
        success: res => {
          if (action_fail(res)) return;
          this.get_user_sign_table(this.pageSize, this.pageNo);
        }
      });
    },
    upload_img(e) {
      this.uploading = true;
      var formData = new FormData();
      formData.append("selectFile", e.raw);
      formData.append("ownerSystem", "gwt-platform");
      formData.append("ownerModule", "Anno");
      formData.append("ownerAperation", "ownerAperation");
      formData.append("uploadOpt", "add");
      formData.append("editFileId", undefined);
      this.$post("gwt/uploadFile/upload", formData, "form")
        .then(res => {
          this.uploading = false;
          if (action_fail(res, "上传成功！", "上传失败！")) return;
          res.data.attachment.url = e.url;
          res.data.attachment.is_normal = true;
          this.user_upload_list.push(res.data.attachment);
          this.is_upload = true;
        })
        .catch(res => {
          this.uploading = false;
          console.log(res);
        });
    },

    //导入部门
    select_nav(index) {
      this.current = index;
    },
    // 查看附件列表
    get_user_sign_table(pageSize, pageNo) {
      this.$post(
        `gwt/system/tbNoticeAttachment/attachmentList?${qs.stringify({
          pageSize,
          pageNo
        })}`,
        {
          noticeId: this.message_data.NOTICE_ID,
          attaUploadNode: 2
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.tableData = res.data.tbNoticeAttachmentPageBean;
          this.total = res.data.totalCount;
          for (var i = 0; i < res.data.tbNoticeAttachmentPageBean.length; i++) {
            if (
              res.data.tbNoticeAttachmentPageBean[i].UPLOAD_USER ==
              this.user_info.sysOrgUserX.id
            ) {
              this.user_upload_list = res.data.tbNoticeAttachmentPageBean[
                i
              ].ATTA_INFOS.map(res => {
                res.url = "/" + res.attaPath + "/" + res.smallImgName;
                return res;
              });
              break;
            }
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
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
          this.change_status = res.data.tbNotice.noticeStatus;
          if (this.status == 1001) {
            this.get_user_sign_table(this.pageSize, this.pageNo);
          }
          if (!res.data.tbNotice.endTime) {
            this.isTimeOut = false;
          } else {
            this.isTimeOut =
              +new Date(res.data.tbNotice.endTime.replace(/-/g, "/")) -
                Date.now() <
              0;
          }
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
.file-list {
  width: 60%;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  margin: 0 auto;
  text-align: left;
  .svg-icon {
    font-size: 16px;
  }
}
.stuff-footer {
  padding: 0px 20px 40px;
  .tips {
    color: rgb(220, 20, 60);
    font-size: 13px;
    margin-bottom: 12px;
  }
  .stuff-button {
    font-size: 14px;
  }
}
.stuff-common {
  margin: 0 auto;
  width: 90%;
  background-color: #fff;
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
      white-space: pre-wrap;
      padding: 10px 20px;
    }
    .file-info {
      span {
        font-size: 13px;
      }
    }
  }
}
</style>

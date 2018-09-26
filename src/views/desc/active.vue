<template>
<div>
    <div class="notice-desc" v-loading='desc_loading'>
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
                <p v-if='status === "1002"'>拒签理由：<span>{{tbNoticeRefuse.REFUSE_REASON}}</span></p>
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
  
    </div>
    <div class="stuff-common">
        <t-title>人员报名</t-title>
         <div class="common-action">
            <div class="common-table-bar">
              <span v-for='(item,index) in receive_type'
                @click="select_nav(item,index)"
                :class="current === index ? 'current':''"
                :key="index">{{item.value}}（{{tabCounts[item.name]}}）</span>
            </div>
        </div>
        <div class="meeting-div" v-show="dataType === 0">
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
                    prop="appName"
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
                    show-overflow-tooltip
                    label="所属部门">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="附件列表">
                        <template slot-scope="scope">
                            <div class="file-list">
                                <p v-for="(item,index) in scope.row.ATTA_INFOS" :key='index' @click="one_file_download(item.id)">
                                <svg-icon :icon-class='fileType(item.suffix)'></svg-icon> {{item.originalName}}
                                </p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="批量下载">
                        <template slot-scope="scope">
                          <little-button name='批量下载' @click.native="download_file(scope.row)"></little-button>
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
        </div>
        <div class="meeting-div" v-show="dataType === 1">
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
                    show-overflow-tooltip
                    label="所属部门">
                    </el-table-column>
                    <el-table-column
                    prop="CREATE_USER_NAME"
                    align="center"
                    show-overflow-tooltip
                    label="报名人员">
                    </el-table-column>
                    <el-table-column
                    prop="CREATE_TIME"
                    align="center"
                    label="报名时间">
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
            <div class="common-action">
              <div>
                <el-button type="success" 
                @click="export_sign_user"
                :disabled="!tableData.length" size="small" icon="el-icon-printer" style="font-size:14px">导出报名名单</el-button>
              </div>
            </div>
        </div>
        <div class="meeting-div" v-show="dataType === 2">
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
                    show-overflow-tooltip
                    label="所属部门">
                    </el-table-column>
                    <el-table-column
                    prop="SIGN_TIME"
                    align="center"
                    label="签收时间">
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
          
        </div>
        <div class="meeting-div" v-show="dataType === 3">
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
                    prop="appName"
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
                    show-overflow-tooltip
                    label="所属部门">
                    </el-table-column>
                    <el-table-column
                    prop="ORG_ALL_NAME"
                    align="center"
                    label="报名人员">
                    </el-table-column>
                    <el-table-column
                    prop="ORG_ALL_NAME"
                    align="center"
                    label="报名时间">
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
        </div>
        <div class="meeting-div" v-show="dataType === 4">
            <div class="common-table">
                <el-table
                    :data="tableData"
                    border
                    v-loading ='loading'
                    style="width: 100%">
                    <el-table-column
                    prop="RECEIVE_NAME"
                    align="center"
                    label="接收方">
                    </el-table-column>
                    <el-table-column
                    prop="READ_FLAG"
                    align="center"
                    label="阅读状态">
                    </el-table-column>
                    <el-table-column
                    prop="ORG_ALL_NAME"
                    align="center"
                    show-overflow-tooltip
                    label="所属部门	">
                    </el-table-column>
                    <el-table-column
                    prop="RECEIVE_NAME"
                    align="center"
                    label="接收人姓名">
                    </el-table-column>
                    <el-table-column
                    prop="MOBILE_PHONE"
                    align="center"
                    label="电话">
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
             <div class="common-action">
              <div>
                <el-button type="success" 
                @click="re_tip_user"
                :disabled="!tableData.length" size="small" icon="el-icon-message" style="font-size:14px">再次提醒</el-button>
              </div>
            </div>
        </div>
        <div class="meeting-div" v-show="dataType === 5">
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
        </div>
    </div>
</div>
</template>
<script>
import { SET_MESSAGE_DATA } from "@/store/mutations";
import fileList from "@/components/FileList";
import { mapGetters } from "vuex";
import { action_fail, delete_item } from "@/utils/user";
import { fileType } from "@/utils";
import qs from "qs";
import littleButton from "@/components/Button/littleButton";
import { Base64 } from "js-base64";
import md5 from "js-md5";
export default {
  components: {
    fileList,
    littleButton
  },
  data() {
    return {
      dataType: 0,
      receive_type: [
        {
          name: "attachment",
          value: "附件",
          dataType: 0
        },
        {
          name: "registUsers",
          value: "已报名",
          dataType: 1
        },
        {
          name: "signUsers",
          value: "已签收",
          dataType: 2
        },
        {
          name: "refuseUsers",
          value: "已拒签",
          dataType: 3
        },
        {
          name: "unSignUsers",
          value: "未签收",
          dataType: 4
        },
        {
          name: "smsNoticeFailedUsers",
          value: "短信通知失败",
          dataType: 5
        }
      ],
      add_user_dialog: false,
      dialog: false,
      current: 0,
      table_loading: false,
      tableData: [],
      register_tableData: [],
      file_list: [],
      data: {},
      tbNoticeReceive: {},
      file_length: 0,
      status: "",
      form: {
        arrayContentType: [],
        cause: ""
      },
      form_loading: {},
      role_visible: false,
      form_loading: false,
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
      has_select_user_list: [],
      add_user_loading: false,
      add_form: {},
      tabCounts: {},
      loading: false,
      desc_loading: false
    };
  },
  beforeDestroy(e) {
    sessionStorage.removeItem("active-desc/index/pageNo");
    sessionStorage.removeItem("active-desc/index/total");
  },
  created() {
    var total = sessionStorage.getItem("active-desc/index/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("active-desc/index/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    //页数存到localstorage里面
    var pageSize = localStorage.getItem("active-desc/index/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 5;
    this.$store.dispatch("readSession", SET_MESSAGE_DATA);
    this.status = this.message_data.REC_STATUS;

    this.get_meeting_data();
    this.init_file(this.message_data.NOTICE_ID);
    this.get_type_nmuber();
    this.filter_nav();
    this.init();
  },
  computed: {
    ...mapGetters(["message_data", "user_info"])
  },
  methods: {
    init(pageSize, currentPage) {
      var url = "";
      var data = {
        noticeId: this.message_data.NOTICE_ID,
        dataType: this.dataType,
        attaUploadNode: undefined
      };
      if (this.dataType === 0) {
        url = `gwt/system/tbNoticeAttachment/attachmentList`;
        data.attaUploadNode = 2;
      } else if (this.dataType === 5) {
        url = `gwt/notice/tbNotice/smsNoticeFailedList`;
        data.dataType = 4;
      } else {
        url = `gwt/notice/tbNotice/itemList`;
      }
      this.$post(
        `${url}?${qs.stringify({
          currentPage,
          pageSize
        })}`,
        data,
        "json"
      ).then(res => {
        if (res.result !== "0000") {
          return;
        }
        if (this.dataType === 0) {
          this.tableData = res.data.tbNoticeAttachmentPageBean;
          this.total = res.data.totalCount;
        } else if (this.dataType === 5) {
          this.tableData = res.data.tbNoticeSmsNoticeFailedPageBean.datas || [];
          this.total = res.data.tbNoticeSmsNoticeFailedPageBean.totalCount - 0;
        } else {
          this.tableData = res.data.tbNoticeItemPageBean.datas;
          this.total = res.data.tbNoticeItemPageBean.totalCount - 0;
        }
      });
    },
    //再次提醒用户
    re_tip_user() {
      this.$post(
        "gwt/notice/tbNotice/smsRemind",
        {
          noticeId: this.message_data.NOTICE_ID
        },
        "json"
      )
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    //导出报名名单
    export_sign_user() {
      var data = {
        noticeId: this.message_data.NOTICE_ID
      };
      var object = Base64.encode(JSON.stringify(data));
      var sign = md5(object + this.$store.getters.sign);
      window.open(
        `gwt/notice/tbNoticeRegister/exportRegistList?${qs.stringify({
          object,
          sign,
          token: this.$store.getters.token
        })}`
      );
    },
    filter_nav() {
      if (this.message_data.NOTICE_TYPE === 1) {
        this.receive_type = [
          {
            name: "attachment",
            value: "附件",
            dataType: 0
          },
          {
            name: "registUsers",
            value: "已报名",
            dataType: 1
          },
          {
            name: "signUsers",
            value: "已签收",
            dataType: 2
          },
          {
            name: "refuseUsers",
            value: "已拒签",
            dataType: 3
          },
          {
            name: "unSignUsers",
            value: "未签收",
            dataType: 4
          },
          {
            name: "smsNoticeFailedUsers",
            value: "短信通知失败",
            dataType: 5
          }
        ];
      } else if (this.message_data.NOTICE_TYPE === 2) {
        this.receive_type = [
          {
            name: "signUsers",
            value: "已签收",
            dataType: 2
          },
          {
            name: "refuseUsers",
            value: "已拒签",
            dataType: 3
          },
          {
            name: "unSignUsers",
            value: "未签收",
            dataType: 4
          },
          {
            name: "smsNoticeFailedUsers",
            value: "短信通知失败",
            dataType: 5
          }
        ];
      } else if (this.message_data.NOTICE_TYPE === 3) {
        this.receive_type = [
          {
            name: "attachment",
            value: "附件",
            dataType: 0
          },
          {
            name: "signUsers",
            value: "已签收",
            dataType: 2
          },
          {
            name: "refuseUsers",
            value: "已拒签",
            dataType: 3
          },
          {
            name: "unSignUsers",
            value: "未签收",
            dataType: 4
          },
          {
            name: "smsNoticeFailedUsers",
            value: "短信通知失败",
            dataType: 5
          }
        ];
      }
      this.dataType = this.receive_type[0].dataType;
    },
    one_file_download(item) {
      var data = {
        id: item.id
      };
      var object = Base64.encode(JSON.stringify(data));
      var sign = md5(object + this.$store.getters.sign);
      window.open(
        `gwt/uploadFile/download?${qs.stringify({
          object,
          sign,
          token: this.$store.getters.token
        })}`
      );
    },
    //批量下载
    download_file(item) {
      var data = {
        fileIds: this.fileIds.map(res => res + "").join(","),
        dirIds: this.dirIds.map(res => res + "").join(","),
        orgId: this.folderform.orgId
      };
      var object = Base64.encode(JSON.stringify(data));
      var sign = md5(object + this.$store.getters.sign);
      window.open(
        `gwt/cloudisk/cloudiskAttachment/BatchDownload?${qs.stringify({
          object,
          sign,
          token: this.$store.getters.token
        })}`
      );
      this.$post(
        "gwt/system/tbNoticeAttachment/batchDownload",
        {
          inIdAry: item.ATTA_INFOS.map(res => {
            return res.id;
          }).join(",")
        },
        "json"
      ).then(res => {
        console.log(res);
      });
    },
    fileType(name) {
      return fileType(name);
    },
    select_nav(item, index) {
      this.current = index;
      this.dataType = item.dataType;
      this.pageNo = 1;
      this.init(this.pageSize, 1);
    },
    //查看类型数量
    get_type_nmuber() {
      this.$post(
        "gwt/notice/tbNotice/tabCounts",
        {
          noticeId: this.message_data.NOTICE_ID,
          forwardId: "",
          attaUploadNode: 2
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.tabCounts = res.data.tabCounts;
        })
        .catch(res => {
          console.log(res);
        });
    },
    delete_file(index) {
      console.log(index);
    },
    handleSizeChange(e) {
      localStorage.setItem("active-desc/index/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("active-desc/indexpageNo", e);
      this.pageNo = e;
    },
    //获取 init 数据
    get_meeting_data() {
      this.loading = true;
      this.$post(
        "gwt/notice/tbNotice/get",
        {
          noticeId: this.message_data.NOTICE_ID,
          forwardId: ""
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
          var file_list = res.data.tbNoticeAttachmentPageBean[0].ATTA_INFOS;
          for (var i = 0; i < file_list.length; i++) {
            file_list[i].url =
              "/" + file_list[i].attaPath + "/" + file_list[i].smallImgName;
          }
          this.file_list = file_list;
        })
        .catch(res => {
          console.log(res);
        });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.meeting-div {
  min-height: 300px;
}
.file-list {
  width: 60%;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  margin: 0 auto;
  text-align: left;
  p {
    cursor: pointer;
    &:hover {
      color: #3ba4f5;
    }
  }
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

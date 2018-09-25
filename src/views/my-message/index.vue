<template>
    <div class="common">
        <t-title>我的消息</t-title>
        <div class="common-action">
            <div>
                <el-select v-model="msgType" size="medium" style="margin-right:8px;" @change="condition">
                    <el-option label="全部类型" value=""></el-option>
                    <el-option label="公告" value="1"></el-option>
                    <el-option label="会议通知" value="2"></el-option>
                    <el-option label="通知" value="3"></el-option>
                    <el-option label="材料征集" value="4"></el-option>
                    <el-option label="举报" value="5"></el-option>
                    <el-option label="调岗" value="6"></el-option>
                </el-select>
                <el-date-picker
                v-model="startTime"
                type="date"
                size='medium' 
                @change="condition"
                placeholder="开始日期">
              </el-date-picker>
                <el-input v-model="title" placeholder="请输入标题" style="width:200px" size='medium' @keyup.native.enter="condition"></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="condition">搜索</el-button>
            </div>
        </div>
        <div class="message-list" v-loading='loading' style="min-height:500px;padding:0 20px">
            <message-item 
              v-for="(item,index) in tableData" 
              :data='item'
              :key='index'
              @click="go_desc(item)"
              @delete='del_one_list(item.RECV_ID)'
              ></message-item>
        </div>
        <div class="common-page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="$store.getters.page_list"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { SET_MESSAGE_DATA } from "@/store/mutations";
import MessageItem from "@/components/MessageItem";
import qs from "qs";
import { delete_item } from "@/utils/user";
import { parseTime } from "@/utils";
export default {
  components: {
    MessageItem
  },
  data() {
    return {
      pageNo: 1,
      loading: false,
      pageSize: 10,
      total: 0,
      tableData: [],
      meeting_type_list: [],
      title: "",
      startTime: "",
      msgType: ""
    };
  },
  created() {
    var total = sessionStorage.getItem("message/index/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("message/index/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    var pageSize = localStorage.getItem("message/index/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 10;
    this.init(this.pageSize, this.pageNo);
    //初始化查询
  },
  methods: {
    //条件查询
    condition() {
      sessionStorage.setItem("message/index/pageNo", 1);
      this.pageNo = 1;
      this.init(this.pageSize, 1);
    },
    handleSizeChange(e) {
      localStorage.setItem("message/index/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("message/index/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
    },
    init(pageSize, pageNo) {
      this.loading = true;
      this.$post(
        `gwt/business/msgRecvUser/list?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          title: this.title,
          startTime: this.startTime && parseTime(this.startTime, "{y}-{m}-{d}"),
          msgType: this.msgType,
          endTime: ""
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
          var tableData = res.data.messagePageBean.datas;
          this.total = res.data.messagePageBean.totalCount - 0;
          sessionStorage.setItem(
            "message/index/total",
            res.data.messagePageBean.totalCount
          );
          var arr = tableData.map(res => {
            return { recvId: res.RECV_ID, msgId: res.MSG_ID };
          });
          this.$post(
            "gwt/business/msgRecvUser/getMsgStateByMsgId",
            { data: arr },
            "json"
          )
            .then(res => {
              if (res.result !== "0000") {
                return;
              }
              for (var i = 0; i < tableData.length; i++) {
                tableData[i].REC_STATUS = res.data.stateList[i].REC_STATUS;
                tableData[i].NOTICE_ID = res.data.stateList[i].NOTICE_ID;
              }
              this.tableData = tableData;
            })
            .catch(res => {
              console.log(res);
            });
        })
        .catch(res => {
          this.loading = false;
        });
    },
    go_desc(item) {
      console.log(JSON.stringify(item, {}, 4));
      if (item.TYPE_DESC === "举报") {
        this.$store.dispatch("get_report_desc", item.MSG_ID);
        this.$router.push({
          path: "/report/index"
        });
      }
      if (
        item.TYPE_DESC === "材料征集" ||
        item.TYPE_DESC === "会议通知" ||
        item.TYPE_DESC === "通知"
      ) {
        this.$post(
          "gwt/notice/tbNotice/getNoticeInfoByMessageId",
          {
            messageId: item.MSG_ID,
            recvId: item.RECV_ID,
            receOrgId: "",
            ORG_ID: item.ORG_ID
          },
          "json"
        ).then(res => {
          if (res.result !== "0000") {
            return;
          }
          console.log(res.data.tbNoticeReceive.id);
          item.RECEIVE_ID = res.data.tbNoticeReceive.id;
          this.$store.commit(SET_MESSAGE_DATA, item);
          if (item.TYPE_DESC === "通知") {
            this.$router.push({
              path: "/notice-desc/index"
            });
            //通知
          } else if (item.TYPE_DESC === "材料征集") {
            this.$router.push({
              path: "/stuff-desc/index"
            });
            //材料征集
          } else if (item.TYPE_DESC === "会议通知") {
            this.$router.push({
              path: "/meeting-desc/index"
            });
            //会议通知
          }
        });
      }
    },
    del_one_list(id) {
      delete_item({
        url: "gwt/business/msgRecvUser/delete",
        data: {
          id
        },
        success: res => {
          this.init(this.pageSize, this.pageNo);
        }
      });
    },
    handleClose(e) {
      console.log(e);
    }
  }
};
</script>
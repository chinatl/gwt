<template>
    <div class="my-active">
        <t-title title="已发通知"></t-title>
        <div class="common-action">
            <div>
                <el-select v-model="noticeType" size="medium" style="margin-right:8px;" @change="condition">
                    <el-option v-for="(item,index) in meeting_type_list" :key='index' :label="item.itemName" :value="item.sn"></el-option>
                </el-select>
                <el-date-picker
                    v-model="date"
                    type="daterange"
                    align="right"
                    size="medium"
                    unlink-panels
                     style="margin-right:8px;"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="condition">
                </el-date-picker>
                <el-input v-model="noticeTitle" placeholder="请输入标题名称" style="width:200px" size='medium' @keyup.native.enter="condition"></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="condition">搜索</el-button>
            </div>
        </div>
        <ul class="message-list" v-loading ='loading'>
            <li v-for="(item,index) in message_list" :key="index" @click="get_active_desc(item)">
              <div class="message-area">
                  <img :src="require('@/assets/imgs/message.png')">
              </div>
              <div class="message-info">
                  <div class="h3">
                    {{item.NOTICE_TITLE}}
                    <div class="message-action">
                      <little-button name='撤销' @click="revoke_item(item)" :disabled='check_change_status(item)'></little-button>
                      <little-button name='变更' @click="change_notice(item)" :disabled='check_endTime(item)'></little-button>
                    </div>
                  </div>
                  <div class="caozuo">
                      <span class="reportColor">{{item.ITEM_NAME}}</span>
                      <span class="info-detail">{{item.REAL_NAME}}</span>
                      <span class="info-detail">{{item.ORG_ALL_NAME}}</span>
                      <span class="info-time">{{item.CREATE_TIME}}</span>
                  </div>
              </div>
            </li>
        </ul>
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
import littleButton from "@/components/Button/littleButton";
import {
  SET_MEETING_TYPE_LIST,
  SET_NOTICE_DATA,
  SET_MESSAGE_DATA
} from "@/store/mutations";
import { mapGetters } from "vuex";
import qs from "qs";
import { action_fail } from "@/utils/user";
import { parseTime } from "@/utils";
export default {
  components: {
    littleButton
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 5,
      total: 0,
      loading: false,
      daterange: "",
      input: "",
      date: null,
      message_list: [],
      noticeType: "",
      noticeTitle: ""
    };
  },
  beforeDestroy() {
    sessionStorage.removeItem("public-notice/active/pageNo");
    sessionStorage.removeItem("public-notice/active/total");
    this.$store.commit("DEL_VIEW_BY_NAME", "已发通知");
  },
  created() {
    this.$store.dispatch("readSession", SET_MEETING_TYPE_LIST);
    var total = sessionStorage.getItem("public-notice/active/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("public-notice/active/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    //页数存到localstorage里面
    var pageSize = localStorage.getItem("public-notice/active/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 5;
    this.init(this.pageSize, this.pageNo);
  },
  computed: {
    ...mapGetters(["meeting_type_list"])
  },
  methods: {
    //获取详情
    get_active_desc(item) {
      this.$store.commit(SET_MESSAGE_DATA, item);
      this.$router.push({
        path: "/active-desc/index"
      });
    },
    //通知变更
    change_notice(item) {
      if (+new Date(item.CREATE_TIME) > Date.now() - 1000 * 60 * 2) {
        this.$message({
          message: "通知发送不到2分钟，不能变更，请使用撤销功能",
          type: "warning"
        });
        return;
      }
      this.$store.commit(SET_NOTICE_DATA, item);
      this.$router.push({
        path: "/notice-change/index"
      });
    },
    check_endTime(item) {
      if (item.NOTICE_TYPE === 1) {
        return +new Date(item.START_TIME) < Date.now();
      } else if (item.NOTICE_TYPE === 3) {
        return +new Date(item.END_TIME) < Date.now();
      } else {
        return false;
      }
    },
    check_change_status(item) {
      if (item.NOTICE_TYPE === 1) {
        return (
          +new Date(item.START_TIME) < Date.now() ||
          +new Date(item.CREATE_TIME) < Date.now() - 1000 * 60 * 2
        );
      } else if (item.NOTICE_TYPE === 3) {
        return (
          +new Date(item.END_TIME) < Date.now() ||
          +new Date(item.CREATE_TIME) < Date.now() - 1000 * 60 * 2
        );
      } else {
        return +new Date(item.CREATE_TIME) < Date.now() - 1000 * 60 * 2;
      }
    },
    //撤销
    revoke_item(item) {
      if (+new Date(item.CREATE_TIME) < Date.now() - 1000 * 60 * 2) {
        this.$message({
          message: "通知超过2分钟，不能撤销，请使用变更功能",
          type: "warning"
        });
        return;
      }
      this.$post(
        "gwt/notice/tbNoticeSendTemp/validateChange",
        {
          noticeId: item.NOTICE_ID,
          changeType: "cancel"
        },
        "json"
      )
        .then(res => {
          if (action_fail(res, "撤销成功")) return;
          this.init(this.pageSize, this.pageNo);
        })
        .catch(res => {
          console.log(res);
        });
    },
    condition() {
      this.pageNo = 1;
      sessionStorage.setItem("public-notice/active/pageNo", 1);
      this.init(this.pageSize, 1);
    },
    handleSizeChange(e) {
      localStorage.setItem("public-notice/active/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("public-notice/active/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
    },
    init(pageSize, pageNo) {
      console.log(this.date);
      var startTime = "";
      var endTime = "";
      if (this.date) {
        startTime = parseTime(this.date[0], "{y}-{m}-{d} {h}:{i}:{s}");
        endTime = parseTime(this.date[1], "{y}-{m}-{d} {h}:{i}:{s}");
      }
      this.$post(
        `gwt/notice/tbNotice/sendedList?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          noticeType: this.noticeType,
          startTime,
          endTime,
          noticeTitle: this.noticeTitle
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.message_list = res.data.noticePageBean.datas;
          this.total = res.data.noticePageBean.totalCount - 0;
          sessionStorage.setItem(
            "public-notice/active/total",
            res.data.noticePageBean.totalCount
          );
        })
        .catch(res => {
          console.log(res);
        });
    },

    handleClose(e) {
      console.log(e);
    },

    pickerOptions() {}
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-content {
  width: 80%;
  margin: 0 auto;
  text-align: center;
  h3 {
    font-weight: 600;
    font-size: 30px;
    color: rgb(87, 87, 87);
  }
  p {
    font-size: 18px;
    font-weight: 300;
    margin-top: 20px;
    .el-icon-warning {
      font-size: 30px;
      color: rgb(248, 187, 148);
    }
  }
  .foot-dialog {
    padding-top: 20px;
  }
}
.my-active {
  background-color: #fff;
  border-radius: 6px;
  padding-bottom: 20px;
  .message-block {
    text-align: right;
  }

  .message-list {
    padding: 0 20px;
    padding-bottom: 10px;
    border-top: 1px solid #ccc;
    margin: 0 20px;
    li {
      list-style: none;
      overflow: hidden;
      &:hover {
        background-color: rgb(250, 250, 250);
        cursor: pointer;
        .message-info {
          .h3 {
            color: rgb(87, 144, 195);
          }
        }
        .message-area {
          .el-icon-close {
            display: block;
          }
        }
      }
      .message-area {
        padding: 20px 0;
        width: 120px;
        float: left;
        text-align: center;
        position: absolute;
        .el-icon-close {
          position: absolute;
          top: 10px;
          left: 10px;
          display: none;
          &:hover {
            color: #54cfde;
          }
        }
      }
      .message-info {
        padding: 20px 0;
        margin-left: 120px;
        border-bottom: 1px solid #ccc;
        .h3 {
          font-size: 15px;
          letter-spacing: 0.5px;
          margin-bottom: 22px;
          color: #666;
          .message-action {
            float: right;
            .common-tabel-svg {
              margin-left: 8px;
              padding: 6px 9px;
              .svg-icon {
                margin-right: 4px;
                font-size: 14px;
              }
            }
          }
        }
        .caozuo {
          .reportColor {
            background-color: #55cfde;
            font-weight: 100;
            vertical-align: baseline;
            padding: 4px 6px;
            border-radius: 5px;
            margin-right: 15px;
            font-size: 11px;
            color: #fff;
            &.current {
              background-color: #fab858;
            }
          }
          .info-detail {
            letter-spacing: 0.5px;
            color: #54cfde;
            margin-right: 15px;
            display: inline-block;
            font-size: 14px;
          }
          .info-time {
            position: relative;
            font-size: 14px;
            color: #989898;
            display: inline-block;
            float: right;
          }
        }
      }
    }
  }
}
</style>


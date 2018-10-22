<template>
    <div class="my-active">
        <t-title title="已发通知"></t-title>
        <div class="common-action">
            <div>
                <el-date-picker
                    v-model="beginendTime"
                    type="date"
                    align="right"
                    size="medium"
                    placeholder="开始日期"
                    @change="condition(0)">
                </el-date-picker>
                <el-date-picker
                  v-model="endendTime"
                  @change="condition(1)"
                  style="margin-right:8px;"
                  type="date"
                  size="medium"
                  placeholder="结束日期">
                </el-date-picker>
                <el-input v-model="noticeTitle" placeholder="请输入标题名称" style="width:200px" size='medium' @keyup.native.enter="condition"></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="condition">搜索</el-button>
            </div>
        </div>
        <div class="common-table" v-loading='loading' style="min-height:500px;padding:0 20px">
          <ul class="message-list" >
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
                        <span class="reportColor" 
                        v-if="item.FROM_NOTICE_ID"
                        style="background-color: #fab858;">{{item.FROM_NOTICE_ID ?'变更':null}}</span>
                        <span class="reportColor">{{item.ITEM_NAME}}</span>
                        <span class="info-detail">{{item.REAL_NAME}}</span>
                        <span class="info-detail">{{item.ORG_ALL_NAME}}</span>
                        <span class="info-time">{{item.CREATE_TIME}}</span>
                    </div>
                </div>
              </li>
          </ul>
            <no-data v-if="!message_list.length"></no-data>
        </div>
        <div class="common-page"  v-if="message_list.length">
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
  SET_NOTICE_DATA,
  SET_MESSAGE_DATA
} from "@/store/mutations";
import { mapGetters } from "vuex";
import qs from "qs";
import { action_fail, delete_item } from "@/utils/user";
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
      noticeTitle: "",
       beginendTime: "",
      endendTime: ""
    };
  },
  beforeDestroy() {
    sessionStorage.removeItem("website-notice/active/pageNo");
    sessionStorage.removeItem("website-notice/active/total");
  },
  created() {
    var total = sessionStorage.getItem("website-notice/active/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("website-notice/active/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    //页数存到localstorage里面
    var pageSize = localStorage.getItem("website-notice/active/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 5;
    this.init(this.pageSize, this.pageNo);
  },
  methods: {
    //获取详情
    get_active_desc(item) {
      this.$store.commit(SET_MESSAGE_DATA, item);
      this.$router.push({
        path: "/website-active-desc/index"
      });
    },
    //通知变更
    change_notice(item) {
      if (item.NOTICE_STATUS === 1003) {
        this.$message({
          message: "通知已经更改，无法再使用变更功能",
          type: "warning"
        });
        return;
      }
      if (+new Date(item.CREATE_TIME.replace(/-/g,"/")) > Date.now() - 1000 * 60 * 2) {
        this.$message({
          message: "通知发送不到2分钟，不能变更，请使用撤销功能",
          type: "warning"
        });
        return;
      }
      this.$store.commit(SET_NOTICE_DATA, item);
      this.$router.push({
        path: "/website-change/index"
      });
    },
    check_endTime(item) {
      if (item.NOTICE_TYPE === 1) {
        return +new Date(item.START_TIME.replace(/-/g,"/")) < Date.now();
      } else if (item.NOTICE_TYPE === 7) {
        return +new Date(item.END_TIME.replace(/-/g,"/")) < Date.now();
      } else {
        return false;
      }
    },
    check_change_status(item) {
      if (item.NOTICE_TYPE === 1) {
        return (
          +new Date(item.START_TIME.replace(/-/g,"/")) < Date.now() ||
          +new Date(item.CREATE_TIME.replace(/-/g,"/")) < Date.now() - 1000 * 60 * 2
        );
      } else if (item.NOTICE_TYPE === 3) {
        return (
          +new Date(item.END_TIME.replace(/-/g,"/")) < Date.now() ||
          +new Date(item.CREATE_TIME.replace(/-/g,"/")) < Date.now() - 1000 * 60 * 2
        );
      } else {
        return +new Date(item.CREATE_TIME.replace(/-/g,"/")) < Date.now() - 1000 * 60 * 2;
      }
    },
    //撤销
    revoke_item(item) {
      if (+new Date(item.CREATE_TIME.replace(/-/g,"/")) < Date.now() - 1000 * 60 * 2) {
        this.$message({
          message: "通知超过2分钟，不能撤销，请使用变更功能",
          type: "warning"
        });
        return;
      }
      delete_item({
        title: "您确定要撤销该通知吗",
        text: "撤销通知，请谨慎操作！",
        url: "gwt/notice/tbNoticeSendTemp/validateChange",
        data: {
          noticeId: item.NOTICE_ID,
          changeType: "cancel"
        },
        success: res => {
          if (action_fail(res, "撤销成功")) return;
          item.noticeId = item.NOTICE_ID;
          item.noticeTypeName = item.ITEM_NAME;
          item.noticeType = item.NOTICE_TYPE;
          item.changeType = "cancel";
          this.$store.commit(SET_NOTICE_DATA, item);
          this.$router.push({
            path: "/re-drafts/index"
          });
        }
      });
    },
    condition() {
      if (this.beginendTime && this.endendTime) {
        if (+this.beginendTime > +this.endendTime) {
          this.$message({
            message: "开始时间应小于结束时间",
            type: "warning"
          });
          if (index) {
            this.endendTime = "";
          } else {
            this.beginendTime = "";
          }
          return;
        }
      }
      this.pageNo = 1;
      sessionStorage.setItem("website-notice/active/pageNo", 1);
      this.init(this.pageSize, 1);
    },
    handleSizeChange(e) {
      localStorage.setItem("website-notice/active/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("website-notice/active/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
    },
    init(pageSize, pageNo) {
      var endendTime = "";
      var beginendTime = "";
      if (this.endendTime) {
        endendTime = parseTime(this.endendTime, "{y}-{m}-{d}");
      }
      if (this.beginendTime) {
        beginendTime = parseTime(this.beginendTime, "{y}-{m}-{d}");
      }
      this.loading = true;
      this.$post(
        `gwt/website/tbWebsite/sendedList?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          noticeType: this.noticeType,
          startTime:beginendTime,
          endTime:endendTime,
          noticeTitle: this.$filterText(this.noticeTitle)
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
          this.message_list = res.data.noticePageBean.datas;
          this.total = res.data.noticePageBean.totalCount - 0;
          sessionStorage.setItem(
            "website-notice/active/total",
            res.data.noticePageBean.totalCount
          );
        })
        .catch(res => {
          this.loading = false;
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


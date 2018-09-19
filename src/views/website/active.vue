<template>
    <div class="my-active">
        <t-title title="已发通知"></t-title>
        <div class="common-action">
            <div>
                <el-select v-model="type" size="medium" style="margin-right:8px;">
                    <el-option v-for="(item,index) in meeting_type_list" :key='index' :label="item.itemName" :value="item.itemKey"></el-option>
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
                    :picker-options="pickerOptions">
                </el-date-picker>
                <el-input v-model="noticeTitle" placeholder="请输入域名称" style="width:200px" size='medium' @keyup.native.enter="condition_search"></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="condition_search">搜索</el-button>
            </div>
        </div>
        <ul class="message-list" v-loading ='loading'>
            <li v-for="(item,index) in message_list" :key="index">
              <div class="message-area">
                  <img :src="require('@/assets/imgs/message.png')">
              </div>
              <div class="message-info">
                  <div class="h3">
                    {{item.NOTICE_TITLE}}
                    <div class="message-action">
                      <little-button name='撤销'></little-button>
                      <little-button name='变更'></little-button>
                    </div>
                  </div>
                  <div class="caozuo">
                      <span class="reportColor">会议通知</span>
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
import { SET_MEETING_TYPE_LIST } from "@/store/mutations";
import { mapGetters } from "vuex";
import qs from "qs";
export default {
  components: {
    littleButton
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 5,
      total: 0,
      noticeTitle:'',
      loading: false,
      type: "",
      daterange: "",
      date: "",
      message_list: [],
    };
  },
  created() {
    this.$store.dispatch("readSession", SET_MEETING_TYPE_LIST);

    var total = sessionStorage.getItem("website-notice/active/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("website-notice/active/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    //页数存到localstorage里面
    var pageSize = localStorage.getItem("website-notice/active/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 5;

    this.init(this.pageSize, this.pageNo);
  },
  computed: {
    ...mapGetters(["meeting_type_list"])
  },
  methods: {
    condition_search() {
      console.log(1)
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
      this.$post(
        `gwt/website/tbWebsite/sendedList?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          noticeType: "",
          startTime: "",
          endTime: "",
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
            "website-notice/active/total",
            res.data.noticePageBean.totalCount
          );
        })
        .catch(res => {
          console.log(res);
        });
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
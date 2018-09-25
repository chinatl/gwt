<template>
    <div class="common">
        <t-title title="已转发通知"></t-title>
        <div class="common-action">
            <div>
                <el-select v-model="noticeType" size="medium" style="margin-right:8px;" @change="condition">
                    <el-option v-for="(item,index) in meeting_type_list" :key='index' :label="item.itemName" :value="index"></el-option>
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
                   >
                </el-date-picker>
                <el-input v-model="Q_noticeTitle_SL" placeholder="请输入标题" style="width:200px" size='medium'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="condition">搜索</el-button>
            </div>
        </div>
        <!-- <div class="common-table" v-loading='loading' style="min-height:500px;padding:0 20px">
           <notice-item 
              v-for="(item,index) in tableData" 
              :data='item'
              :key='index'
              @click="go_desc(item)"
              ></notice-item>
        </div> -->
        <ul class="message-list" v-loading ='loading'>
            <li v-for="(item,index) in tableData" :key="index" @click="get_active_desc(item)">
              <div class="message-area">
                  <img :src="require('@/assets/imgs/message.png')">
              </div>
              <div class="message-info">
                  <div class="h3">
                    {{item.NOTICE_TITLE}}
                  </div>
                  <div class="caozuo">
                      <span class="reportColor">{{item.ITEM_NAME}}</span>
                  </div>
              </div>
            </li>
        </ul>
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
</template>
<script>
import { SET_MEETING_TYPE_LIST } from "@/store/mutations";
import { mapGetters } from "vuex";
import NoticeItem from "@/components/NoticeItem";
import qs from "qs";
export default {
  components: {
    NoticeItem
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 5,
      total: 0,
      loading: false,
      noticeType: "",
      date: "0",
      Q_noticeTitle_SL: "",
      tableData: []
    };
  },
  created() {
    this.$store.dispatch("readSession", SET_MEETING_TYPE_LIST);
    var total = sessionStorage.getItem("public-notice/forwarded/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("public-notice/forwarded/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    var pageSize = localStorage.getItem("public-notice/forwarded/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 10;
    this.init(this.pageSize, this.pageNo);
  },
  computed: {
    ...mapGetters(["meeting_type_list"])
  },
  methods: {
    condition() {
      this.pageNo = 1;
      sessionStorage.setItem("public-notice/forwarded/pageNo", 1);
      this.init(this.pageSize, 1);
    },
    go_desc(item) {
      return;
    },
    init(pageSize, pageNo) {
      this.loading = true;
      this.$post(
        `gwt/notice/tbNoticeForward/list?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          account: this.noticeType == 0 ? 0 : this.noticeType,
          noticeType: this.noticeType,
          begincreateTime: this.date[0],
          endcreateTime: this.date[1],
          noticeTitle: this.Q_noticeTitle_SL
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
          this.tableData = res.data.tbNoticePageBean.datas;
          sessionStorage.setItem(
            "public-notice/forwarded/total",
            res.data.tbNoticePageBean.totalCount
          );
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    },
    handleSizeChange(e) {
      localStorage.setItem("public-notice/forwarded/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("public-notice/forwarded/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
    }
  }
};
</script>

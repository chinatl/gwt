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
                    format="yyyy-MM-dd "
                    value-format="yyyy-MM-dd"
                    @change="condition"
                   >
                </el-date-picker>
                <el-input v-model="Q_noticeTitle_SL" placeholder="请输入标题"
                @keyup.native.enter="condition"
                 style="width:200px" size='medium'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="condition">搜索</el-button>
            </div>
        </div>
        <div class="common-table" v-loading='loading' style="min-height:500px;padding:0 20px">
           <notice-item 
              v-for="(item,index) in tableData" 
              :data='item'
              :key='index'
              @click="get_active_desc(item)"
              ></notice-item>
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
</template>
<script>
import { SET_MEETING_TYPE_LIST, SET_MESSAGE_DATA } from "@/store/mutations";
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
      noticeType: 0,
      date: "",
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
  beforeDestroy() {
    this.$store.commit("DEL_VIEW_BY_NAME", "已转发通知");
  },
  methods: {
    get_active_desc(item) {
      this.$store.commit(SET_MESSAGE_DATA, item);
      this.$router.push({
        path: "/active-desc/index"
      });
    },
    condition() {
      sessionStorage.setItem("public-notice/forwarded/pageNo", 1);
      this.pageNo = 1;
      this.init(this.pageSize, 1);
    },
    init(pageSize, pageNo) {
      this.loading = true;
      this.$post(
        `gwt/notice/tbNoticeForward/list?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          account: this.noticeType == 0 ? "" : this.noticeType,
          noticeType: this.noticeType == 0 ? "" : this.noticeType,
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
          this.tableData = res.data.tbNoticeForwardPageBean.datas.map(res => {
            res.NOTICE_TITLE = res.dataMap.NOTICE_TITLE;
            res.RECE_TIME = res.createTime;
            res.NOTICE_TYPE_NAME =
              res.dataMap.NOTICE_TYPE === 1
                ? "会议通知"
                : res.dataMap.NOTICE_TYPE === 2
                  ? "通知"
                  : "材料征集";
            res.NOTICE_ID = res.dataMap.NOTICE_ID;
            res.NOTICE_TYPE = res.dataMap.NOTICE_TYPE;
            return res;
          });
          sessionStorage.setItem(
            "public-notice/forwarded/total",
            res.data.tbNoticeForwardPageBean.totalCount
          );
          this.total = parseInt(res.data.tbNoticeForwardPageBean.totalCount);
        })
        .catch(res => {
          this.loading = false;
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

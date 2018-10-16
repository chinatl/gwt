<template>
    <div class="common">
        <t-title title="通知签收"></t-title>
        <div class="common-action">
            <div>
                <el-select v-model="noticeType" size="medium" style="margin-right:8px;" @change="condition">
                    <el-option v-for="(item,index) in meeting_type_list" :key='index' :label="item.itemName" :value="item.sn"></el-option>
                </el-select>
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
                <el-input v-model="Q_noticeTitle_SL" placeholder="请输入名称" style="width:200px" size='medium' @keyup.native.enter="condition"></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="condition">搜索</el-button>
            </div>
        </div>
        <div class="common-table" v-loading='loading' style="min-height:500px;padding:0 20px">
           <notice-item 
              v-for="(item,index) in tableData" 
              :data='item'
              :key='index'
              @click="go_desc(item)"
              ></notice-item>
            <no-data v-if="!tableData.length"></no-data>
        </div>
        <div class="common-page" v-if="tableData.length">
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
import { parseTime } from "@/utils";
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
      date: "",
      Q_noticeTitle_SL: "",
      tableData: [],
      beginendTime: "",
      endendTime: ""
    };
  },
  created() {
    this.$store.dispatch("readSession", SET_MEETING_TYPE_LIST);
    var total = sessionStorage.getItem("public-notice/signin/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("public-notice/signin/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    var noticeType = sessionStorage.getItem("public-notice/signin/noticeType");
    this.noticeType = noticeType ? noticeType : "";
    var pageSize = localStorage.getItem("public-notice/signin/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 10;
    this.init(this.pageSize, this.pageNo);
  },
  computed: {
    ...mapGetters(["meeting_type_list"])
  },
  beforeDestroy() {
    // this.$store.commit("DEL_VIEW_BY_NAME", "通知签收");
  },
  methods: {
    condition(index) {
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
      sessionStorage.setItem(
        "public-notice/signin/noticeType",
        this.noticeType
      );
      this.pageNo = 1;
      sessionStorage.setItem("public-notice/signin/pageNo", 1);
      this.init(this.pageSize, 1);
    },
    go_desc(item) {
      this.$post(
        "gwt/notice/tbNotice/changStatus",
        {
          receId: item.RECEIVE_ID
        },
        "json"
      )
        .then(res => {
        })
        .catch(res => {
          console.log(res);
        });
      this.$store.commit(SET_MESSAGE_DATA, item);
      if (item.NOTICE_TYPE === 2) {
        this.$router.push({
          path: "/notice-desc/index"
        });
        //通知
      } else if (item.NOTICE_TYPE === 3) {
        this.$router.push({
          path: "/stuff-desc/index"
        });
        //材料征集
      } else if (item.NOTICE_TYPE === 1) {
        this.$router.push({
          path: "/meeting-desc/index"
        });
        //会议通知
      }
    },
    init(pageSize, pageNo) {
      this.loading = true;
      var endendTime = "";
      var beginendTime = "";
      if (this.endendTime) {
        endendTime = parseTime(this.endendTime, "{y}-{m}-{d}");
      }
      if (this.beginendTime) {
        beginendTime = parseTime(this.beginendTime, "{y}-{m}-{d}");
      }
      this.$post(
        `gwt/notice/tbNotice/getUserReceiveNoticeList?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          noticeType: this.noticeType,
          begincreateTime: beginendTime,
          endcreateTime: endendTime,
          noticeTitle: this.$filterText(this.Q_noticeTitle_SL)
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
          this.tableData = res.data.tbNoticePageBean.datas;
          this.total = res.data.tbNoticePageBean.totalCount - 0;
          sessionStorage.setItem(
            "public-notice/signin/total",
            res.data.tbNoticePageBean.totalCount
          );
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    },
    handleSizeChange(e) {
      localStorage.setItem("public-notice/signin/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("public-notice/signin/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
    }
  }
};
</script>

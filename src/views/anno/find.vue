<template>
    <div class="common">
        <t-title title="公告查阅"></t-title>
        <div class="common-action">
            <div>
                <!-- <el-select v-model="noticeType" size="medium" style="margin-right:8px;" @change="condition">
                    <el-option v-for="(item,index) in meeting_type_list" :key='index' :label="item.itemName" :value="index"></el-option>
                </el-select> -->
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
                <el-input v-model="Q_noticeTitle_SL" placeholder="请输入公告标题"
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
      noticeType: 0,
      date: "",
      Q_noticeTitle_SL: "",
      tableData: [],
      beginendTime: "",
      endendTime: ""
    };
  },
  created() {
    // this.$store.dispatch("readSession", SET_MEETING_TYPE_LIST);
    var total = sessionStorage.getItem("anno-find/forwarded/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("anno-find/forwarded/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    var pageSize = localStorage.getItem("anno-find/forwarded/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 10;
    this.init(this.pageSize, this.pageNo);
  },
  computed: {
    // ...mapGetters(["meeting_type_list"])
  },

  methods: {
    get_active_desc(item) {
      if (item.readStats === "0") {
        this.$post(
          "gwt/business/tbAnnoReceiveUser/updateStatus",
          {
            recvId: item.RECV_ID,
            annoId: item.NOTICE_ID
          },
          "json"
        )
          .then(res => {})
          .catch(res => {
            console.log(res);
          });
      }
      if (item.isDelete === "1") {
        this.$post(
          "gwt/business/tbAnnoDeleteReason/getByAnnoId",
          {
            annoId: item.id
          },
          "json"
        )
          .then(res => {
            if (res.result !== "0000") {
              return;
            }
            this.init(this.pageSize, this.pageNo);
            this.$swal({
              title: "删除原因！",
              text:
                "由于“" +
                res.data.tbAnnoDeleteReason.deleteReason +
                "”，通知已被“" +
                res.data.tbAnnoDeleteReason.deleteUserName +
                "”被删除",
              type: "warning",
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "确定",
              showConfirmButton: true
            });
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
        return;
      }
      this.$store.commit(SET_MESSAGE_DATA, item);
      this.$router.push({
        path: "/anno-desc/index"
      });
    },
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
      sessionStorage.setItem("anno-find/forwarded/pageNo", 1);
      this.pageNo = 1;
      this.init(this.pageSize, 1);
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
        `gwt/business/tbAnnouncement/getUserAnnoList?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          // account: this.noticeType == 0 ? "" : this.noticeType,
          // noticeType: this.noticeType == 0 ? "" : this.noticeType,
          endTime: endendTime,
          startTime: beginendTime,
          title: this.$filterText(this.Q_noticeTitle_SL)
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
          this.tableData = res.data.tbAnnouncementBean.datas.map(res => {
            res.NOTICE_TITLE = res.title;
            res.REAL_NAME = res.createUserName;
            res.ORG_ALL_NAME = res.createOrgName;
            res.ORDER_TIME = res.createTime;
            return res;
          });
          sessionStorage.setItem(
            "anno-find/forwarded/total",
            res.data.tbAnnouncementBean.totalCount
          );
          this.total = parseInt(res.data.tbAnnouncementBean.totalCount);
        })
        .catch(res => {
          this.loading = false;
        });
    },
    handleSizeChange(e) {
      localStorage.setItem("anno-find/forwarded/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("anno-find/forwarded/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
    }
  }
};
</script>

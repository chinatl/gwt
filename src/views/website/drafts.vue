<template>
    <div class="common">
        <t-title title="草稿箱"></t-title>
        <div class="common-action">
            <div>
                <el-date-picker
                    v-model="beginendTime"
                    type="date"
                    align="right"
                    size="medium"
                    placeholder="开始日期"
                    @change="condition_search(0)">
                </el-date-picker>
                <el-date-picker
                  v-model="endendTime"
                  @change="condition_search(1)"
                  style="margin-right:8px;"
                  type="date"
                  size="medium"
                  placeholder="结束日期">
                </el-date-picker>
                <el-input v-model="noticeTitle" placeholder="请输入标题" style="width:200px" size='medium' @keyup.native.enter='condition_search'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="condition_search">搜索</el-button>
            </div>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                v-loading='loading'
                style="width: 100%">
                <el-table-column
                align="center"
                width="200"
                label="通知类型">
                    <template slot-scope="scope">
                        <span class="href" @click="go_drafts(scope.row)">{{scope.row.noticeTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                align="center"
                show-overflow-tooltip
                label="通知标题">
                  <template slot-scope='scope'>
                    <span  class="href"  @click="go_drafts(scope.row)">{{scope.row.noticeTitle || '无标题通知'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                align="center"
                width="240"
                label="保存时间">
                     <template slot-scope="scope">
                        <span class="href">{{scope.row.updateTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="name"
                label="操作"
                align="center"
                width='120'
                >
                 <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    v-wave
                    @click="handleDelete(scope.row.noticeId)">删除</el-button>
                </template>
                </el-table-column>
            </el-table>
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
import { SET_NOTICE_DATA } from "@/store/mutations";
import { mapGetters } from "vuex";
import { parseTime } from "@/utils";
import qs from "qs";
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 5,
      total: 0,
      type: 0,
      date: null,
      loading: false,
      tableData: [],
      noticeTitle: "",
      beginendTime: "",
      endendTime: ""
    };
  },
  created() {
    var total = sessionStorage.getItem("website-notice/drafts/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("website-notice/drafts/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    //页数存到localstorage里面
    var pageSize = localStorage.getItem("website-notice/drafts/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 5;

    this.init(this.pageSize, this.pageNo);
  },
  computed: {
  
  },
  beforeDestroy() {
    // this.$store.commit("DEL_VIEW_BY_NAME", "草稿箱");
  },
  methods: {
    go_drafts(item) {
      this.$store.commit(SET_NOTICE_DATA, item);
      this.$router.push({
        path: "/website-re-drafts/index"
      });
    },
    condition_search(index) {
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
      sessionStorage.setItem("website-notice/drafts/pageNo", 1);
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
        `gwt/website/tbWebsite/list?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          noticeStatus: "1001",
          receiveNoticeType: "0",
          noticeTitle: this.$filterText(this.noticeTitle),
          beginupdateTime: beginendTime,
          endupdateTime: endendTime
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
            "website-notice/drafts/total",
            res.data.tbNoticePageBean.totalCount
          );
        })
        .catch(res => {
          this.loading = false;
        });
    },
    handleSizeChange(e) {
      localStorage.setItem("website-notice/drafts/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("website-notice/drafts/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
    },
    handleDelete(noticeId) {
      this.$swal({
        title: "您确定要删除信息吗？",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn btn-success"
      }).then(res => {
        if (!res.value) {
          return;
        }
        this.$post(
          "gwt/website/tbWebsiteDraft/del",
          {
            noticeId
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
              message: "删除成功！",
              type: "success"
            });
            this.init(this.pageSize, this.pageNo);
          })
          .catch(res => {
            console.log(res);
          });
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" >
.field {
  background-color: #fff;
  border-radius: 6px;
  padding-bottom: 10px;
}
</style>

<template>
    <div class="common">
        <t-title :title="is_del ?'已删除通知':'通知维护'"></t-title>
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
                <el-input v-model="Q_noticeTitle_SL" placeholder="请输入标题" style="width:200px" size='medium' @keyup.native.enter='condition'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="condition">搜索</el-button>
                <el-button type="warning" icon="el-icon-circle-close" size='medium' v-wave @click="ndel_list" v-if="!is_del">已删除通知</el-button>
                <el-button type="primary" size='medium' v-wave @click="ndel_list" v-else>全部通知</el-button>
            </div>
        </div>
        <div class="common-table">
            <el-table  :data="tableData" border style="width: 100%" v-show="!is_del" v-loading='loading'>
                <el-table-column align="center" prop='noticeTypeName' label="通知类型" width="200">
                   <template slot-scope="scope">
                    <span class="reportColor" 
                      v-if="scope.row.fromNoticeId"
                      style="background-color: #fab858;">{{scope.row.fromNoticeId ?'变更':null}}</span>
                    <span class="href">{{scope.row.noticeTypeName}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop='noticeTitle' label="通知标题" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="href" @click="get_active_desc(scope.row)">{{scope.row.noticeTitle}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop='userName' label="发布人" width="160"></el-table-column>
                <el-table-column align="center" prop='orgName' label="发布部门" width="180" show-overflow-tooltip></el-table-column>
                <el-table-column  align="center" prop='createTime' label="发布时间"  width="200"></el-table-column>
                <el-table-column prop="name"
                label="操作"
                align="center"
                width='120'
                v-show='!is_del'
                >
                 <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)" v-wave>删除</el-button>
                </template>
                </el-table-column>
            </el-table>
            <el-table  :data="tableData" border style="width: 100%" v-show="is_del" v-loading='loading'>
                <el-table-column align="center" prop='noticeTypeName' label="通知类型" width="120"></el-table-column>
                <el-table-column align="center" prop='noticeTitle' label="通知标题"  show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop='userName' label="发布人" width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop='orgName' label="发布部门" width="180" show-overflow-tooltip></el-table-column>
                <el-table-column  align="center" prop='createTime' label="发布时间"  width="180"></el-table-column>
                <el-table-column  align="center" prop='updateUserName' label="删除人" width="140" show-overflow-tooltip></el-table-column>
                <el-table-column  align="center" prop='updateTime' label="删除时间" width="180"></el-table-column>
                <el-table-column  align="center" prop='deleteReason' label="删除理由" show-overflow-tooltip></el-table-column>
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
import {  SET_MESSAGE_DATA } from "@/store/mutations";
import { mapGetters } from "vuex";
import NoticeItem from "@/components/NoticeItem";
import littleButton from "@/components/Button/littleButton";
import { parseTime } from "@/utils";
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
      loading: false,
      noticeType: 0,
      date: "",
      Q_noticeTitle_SL: "",
      tableData: [],
      is_org: "",
      totalCount: "",
      delCount: 0, //删除总条数,
      is_del: false,
      beginendTime: "",
      endendTime: ""
    };
  },
  created() {
    var total = sessionStorage.getItem("website-maintain-notice/maintain/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("website-maintain-notice/maintain/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    var pageSize = localStorage.getItem("website-maintain-notice/maintain/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 10;
    this.init(this.pageSize, this.pageNo);
  },
  beforeDestroy() {
    sessionStorage.removeItem("website-maintain-notice/maintain/pageNo");
    sessionStorage.removeItem("website-maintain-notice/maintain/total");
  },
  methods: {
    get_active_desc(item) {
      item.NOTICE_ID = item.noticeId;
      item.NOTICE_TYPE = item.noticeType - 0;
      item.REC_STATUS = item.noticeStatus;
      this.$store.commit(SET_MESSAGE_DATA, item);
      this.$router.push({
        path: "/website-active-desc/index"
      });
    },
    condition(e) {
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
      sessionStorage.setItem("website-maintain-notice/maintain/pageNo", 1);
      this.init(this.pageSize, 1);
    },
    //初始化数据列表
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
      var url;
      if (this.is_del) {
        url = "gwt/website/tbWebSiteMaintenance/getWebsiteDeleteList";
      } else {
        url = "gwt/website/tbWebSiteMaintenance/list";
      }
      this.$post(
        `${url}?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          account: this.noticeType == 0 ? 0 : this.noticeType,
          noticeType: this.noticeType == 0 ? 0 : this.noticeType,
          beginendTime : beginendTime,
          endendTime: endendTime,
          noticeTitle: this.$filterText(this.Q_noticeTitle_SL)
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
          if (this.is_del) {
            this.tableData = res.data.noticeDeletePageBean.datas || [];
            this.total = res.data.noticeDeletePageBean.totalCount - 0;
            sessionStorage.setItem(
              "website-maintain-notice/maintain/total",
              res.data.noticeDeletePageBean.totalCount
            );
          } else {
            this.tableData = res.data.tbNoticeMaintenancePageBean.datas || [];
            this.total = res.data.tbNoticeMaintenancePageBean.totalCount - 0;
            sessionStorage.setItem(
              "website-maintain-notice/maintain/total",
              res.data.tbNoticeMaintenancePageBean.totalCount
            );
          }
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    },
    //获取已删除的通知

    handleSizeChange(e) {
      localStorage.setItem("website-maintain-notice/maintain/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("website-maintain-notice/maintain/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
    },
    handleDelete(row) {
      this.$swal({
        confirmButtonText: "确定",
        showCancelButton: true,
        cancelButtonText: "取消",
        title: "请输入删除原因",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          return !value && "请输入删除原因，此为必填项！";
        }
      }).then(res => {
        if (res.value) {
          this.$post(
            `gwt/notice/tbNoticeMaintenance/del`,
            {
              noticeId: row.noticeId,
              deleteReason: res.value,
              nowUser: this.userid
            },
            "json"
          ).then(res => {
            if (res.result !== "0000") {
              return;
            }
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.init(this.pageSize, this.pageNo);
          });
        }
      });
    },
    //删除通知列表
    ndel_list() {
      this.is_del = !this.is_del;
      this.pageNo = 1;
      this.init(this.pageSize, 1);
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

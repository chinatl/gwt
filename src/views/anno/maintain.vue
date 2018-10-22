<template>
    <div class="common">
        <t-title title="公告维护"></t-title>
        <div class="common-action">
            <div>
                <!-- <el-select v-model="noticeType" size="medium" style="margin-right:8px;" @change="condition">
                    <el-option v-for="(item,index) in meeting_type_list" :key='index' :label="item.itemName" :value="index"></el-option>
                </el-select> -->
               <!-- <el-date-picker
                    v-model="date"
                    type="daterange"
                    align="right"
                    size="medium"
                    unlink-panels
                    style="margin-right:8px;"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                   >
                </el-date-picker> -->
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
            </div>
            <div>
                <el-button type="success" icon="el-icon-plus" size='medium' v-wave @click="build_anno">发布公告</el-button>
            </div>
        </div>
        <div class="common-table">
            <el-table  :data="tableData" border style="width: 100%" v-loading='loading'>
                <el-table-column align="center" prop='noticeTitle' label="通知标题"  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="href" @click="get_active_desc(scope.row)">{{scope.row.title}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop='content' label="内容"  show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop='createUserName' label="发布人"  show-overflow-tooltip width="140"></el-table-column>
                <el-table-column align="center" prop='createOrgName' label="发布部门"  show-overflow-tooltip width="140"></el-table-column>
                <el-table-column  align="center" prop='createTime' label="发布时间"  show-overflow-tooltip width="180"></el-table-column>
                <el-table-column prop="name"
                label="操作"
                align="center"
                width='120'
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
import { SET_MEETING_TYPE_LIST, SET_MESSAGE_DATA } from "@/store/mutations";
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
    this.$store.dispatch("readSession", SET_MEETING_TYPE_LIST);
    var total = sessionStorage.getItem("anno-maintain/maintain/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("anno-maintain/maintain/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    var pageSize = localStorage.getItem("anno-maintain/maintain/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 10;
    this.init(this.pageSize, this.pageNo);
  },
  computed: {
    ...mapGetters(["meeting_type_list"])
  },
  beforeDestroy() {
    // sessionStorage.removeItem("anno-maintain/maintain/pageNo");
    // sessionStorage.removeItem("anno-maintain/maintain/total");
  },
  methods: {
    build_anno() {
      this.$router.push("/anno-build/index");
    },
    get_active_desc(item) {
      item.isShow = true;
      this.$store.commit(SET_MESSAGE_DATA, item);
      this.$router.push("/anno-desc/index");
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
      this.pageNo = 1;
      sessionStorage.setItem("anno-maintain/maintain/pageNo", 1);
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
      this.$post(
        `gwt/business/tbAnnouncement/getAnnoMaintainList?${qs.stringify({
          currentPage: pageNo,
          endTime: pageSize
        })}`,
        {
          startTime: beginendTime,
          endendTime: endendTime,
          title: this.$filterText(this.Q_noticeTitle_SL)
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }

          this.tableData = res.data.tbAnnouncementBean.datas || [];
          this.total = res.data.tbAnnouncementBean.totalCount - 0;
          sessionStorage.setItem(
            "anno-maintain/maintain/total",
            res.data.tbAnnouncementBean.totalCount
          );
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    },
    //获取已删除的通知

    handleSizeChange(e) {
      localStorage.setItem("anno-maintain/maintain/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("anno-maintain/maintain/pageNo", e);
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
            `gwt/business/tbAnnouncement/del`,
            {
              id: row.id,
              deleteReason: res.value
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

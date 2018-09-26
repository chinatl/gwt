<template>
    <div class="common">
        <t-title title="通知维护"></t-title>
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
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                   >
                </el-date-picker>
                <el-input v-model="Q_noticeTitle_SL" placeholder="请输入标题" style="width:200px" size='medium'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="condition">搜索</el-button>
                <el-button type="warning" icon="el-icon-circle-close" size='medium' v-wave @click="ndel_list" v-show="is_ndel">已删除通知</el-button>
                <el-button type="primary" icon="el-icon-circle-close" size='medium' v-wave @click="ydel_list" v-show="is_ydel">全部删除通知</el-button>
            </div>
        </div>
        <div class="common-table">
            <el-table  :data="tableData" border style="width: 100%" v-show="is_ndel">
                <el-table-column align="center" prop='noticeTypeName' label="通知类型"></el-table-column>
                <el-table-column align="center" prop='noticeTitle' label="通知标题">
                  <template slot-scope="scope">
                    <span class="href" @click="get_active_desc(scope.row)">{{scope.row.noticeTitle}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop='userName' label="发布人"></el-table-column>
                <el-table-column  align="center" prop='updateTime' label="发布时间"></el-table-column>
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
            <el-table  :data="tableData" border style="width: 100%" v-show="is_ydel">
                <el-table-column align="center" prop='noticeTypeName' label="通知类型"></el-table-column>
                <el-table-column align="center" label="通知标题">
                  <template slot-scope="scope">
                    <span class="href" @click="get_active_desc(scope.row)">{{scope.row.noticeTitle}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop='userName' label="发布人"></el-table-column>
                <el-table-column  align="center" prop='createTime' label="发布时间"></el-table-column>
                <el-table-column  align="center" prop='updateUserName' label="删除人"></el-table-column>
                <el-table-column  align="center" prop='updateTime' label="删除时间"></el-table-column>
                <el-table-column  align="center" prop='deleteReason' label="删除理由"></el-table-column>
                
            </el-table>
        </div>
        <div class="common-page" v-show="is_ndel">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="total">
            </el-pagination>
         
        </div>
        <div class="common-page" v-show="is_ydel">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="delCount">
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
      is_org: "",
      totalCount: "",
      userid: "",
      is_ndel: true,
      is_ydel: false,
      delCount: 0 //删除总条数
    };
  },
  created() {
    this.$store.dispatch("readSession", SET_MEETING_TYPE_LIST);
    var total = sessionStorage.getItem("public-notice/maintain/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("public-notice/maintain/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    var pageSize = localStorage.getItem("public-notice/maintain/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 10;
    this.is_currentorg();
    this.init_user();
    this.init(this.pageSize, this.pageNo);
  },
  computed: {
    ...mapGetters(["meeting_type_list"])
  },

  methods: {
    get_active_desc(item) {
      item.NOTICE_ID = item.noticeId;
      item.NOTICE_TYPE = item.noticeType - 0;
      item.REC_STATUS = item.noticeStatus;
      this.$store.commit(SET_MESSAGE_DATA, item);
      this.$router.push({
        path: "/active-desc/index"
      });
    },
    condition() {
      this.pageNo = 1;
      sessionStorage.setItem("public-notice/maintain/pageNo", 1);
      this.init(this.pageSize, 1);
    },
    init_user() {
      this.$post(`gwt/getCurrentOrgUser`, {}, "json").then(res => {
        if (res.result !== "0000") {
          return;
        }
        this.userid = res.data.hashMap.id;
      });
    },
    is_currentorg() {
      this.$post(`gwt/isCurrentOrgManager`, {}, "json").then(res => {
        console.log(res);
        if (res.result !== "0000") {
          return;
        }
        this.is_org = res.data.hashMap;
      });
    },

    //初始化数据列表
    init(pageSize, pageNo) {
      this.loading = true;
      this.$post(
        `gwt/notice/tbNoticeMaintenance/list?${qs.stringify({
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
          console.log(res);
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
          this.tableData = res.data.tbNoticeMaintenancePageBean.datas || [];
          sessionStorage.setItem(
            "public-notice/maintain/total",
            res.data.tbNoticeMaintenancePageBean.totalCount
          );
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    },
    //获取已删除的通知
    get_delNotice(pageSize, pageNo) {
      this.loading = true;
      this.$post(
        `gwt/notice/tbNoticeMaintenance/getNoticeDeleteList?${qs.stringify({
          currentPage: 1,
          pageSize: 10
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
          console.log(res);
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
          this.tableData = res.data.noticeDeletePageBean.datas;
          //   sessionStorage.setItem(
          //     "public-notice/maintain/total",
          //     res.data.tbNoticeMaintenancePageBean.totalCount
          //   );
          this.delCount = parseInt(res.data.noticeDeletePageBean.totalCount);
          console.log(this.delCount);
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    },
    handleSizeChange(e) {
      console.log(e);
      localStorage.setItem("public-notice/maintain/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
      this.get_delNotice(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("public-notice/maintain/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
      this.get_delNotice(e, 1);
    },
    handleEdit(index, item) {},
    handleDelete(row) {
      console.log(row);
      if (this.is_org !== true) {
        this.$swal({
          title: "提示信息！",
          text: "您无权删除通知！",
          type: "warning",
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          showConfirmButton: true
        });
        // return;
      }
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
        console.log(res);
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
            console.log(res);
            if (res.result !== "0000") {
              return;
            }
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.init(this.pageSize, 1);
          });
        }
      });
    },
    //删除通知列表
    ndel_list() {
      this.is_ndel = !this.is_ndel;
      this.is_ydel = !this.is_ydel;
      this.get_delNotice(this.pageSize, 1);
    },
    ydel_list() {
      this.is_ndel = !this.is_ndel;
      this.is_ydel = !this.is_ydel;
      this.init(this.pageSize, 1);
    },
    pickerOptions(e) {
      console.log(e);
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

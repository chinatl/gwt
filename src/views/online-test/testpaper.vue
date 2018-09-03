<template>
    <div class="common">
        <t-title>试卷管理</t-title>
        <div class="common-action">
            <div class="common-table-bar">
                <span v-for="(item,index) in select_arr" :key='index' 
                @click='change_nav(item.status)'
                :class="status == item.status ? 'current':''">{{item.name}}</span>
            </div>
            <div>
                <el-button type="success" icon="el-icon-plus" size='medium' @click="add_test">创建试卷</el-button>
            </div>
        </div>
        <div class="common-table">
              <el-table
                :data="tableData"
                border
                v-loading = 'table_loading'
                style="width: 100%">
                <el-table-column prop="paperName" align="center" label="试卷名称"></el-table-column>
                <el-table-column prop="examLong" align="center" label="考试时长" width="100"></el-table-column>
                <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
                <el-table-column prop="endTime" align="center" label="截止时间"></el-table-column>
                <el-table-column prop="score" align="center" label="卷面分值" width="80"></el-table-column>
                <el-table-column prop="userNum" align="center" label="参考人数"  width="80"></el-table-column>
                <el-table-column
                prop="name"
                label="操作"
                align="center"
                width="360"
                >
                 <template slot-scope="scope">
                    <little-button name='开启考试' @click="open_test(scope.row)" v-if='status === 1'></little-button>
                    <little-button name='编辑' @click="edit_paper(scope.row)"  v-if='status === 1'></little-button>
                    <little-button name='删除' @click="del_paper(scope.row.paperId)"  v-if='status === 1'></little-button>
                    <little-button name='试卷配置' @click="config_paper(scope.row)"  v-if='status === 1'></little-button>
                    <little-button name='考试详情' @click="test_desc(scope.row)"  v-if='status !== 1'></little-button>
                    <little-button name='下架' @click="test_desc(scope.row)"  v-if='status === 2'></little-button>
                </template>
                </el-table-column>
            </el-table>
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
import { SET_TEST_DESC_DATA } from "@/store/mutations";
import littleButton from "@/components/Button/littleButton";
export default {
  components: {
    littleButton
  },
  data() {
    return {
      select_arr: [
        {
          status: 1,
          name: "未开启"
        },
        {
          status: 2,
          name: "已开启"
        },
        {
          status: 3,
          name: "已结束"
        }
      ],
      status: 1,
      tableData: [],
      table_loading: false,
      pageNo: 1,
      pageSize: 5,
      total: 0
    };
  },
  created() {
    this.init(this.pageSize, this.pageNo);
  },
  methods: {
    //开启一场考试
    open_test() {
      this.$message({
        type: "warning",
        message: "请到试卷配置页面更新当前试卷的分数!"
      });
    },
    //删除一场考试
    del_paper(paperId) {
      this.$swal({
        title: "您确定要删除这套试卷吗？",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn btn-success"
      }).then(res => {
        if (res.value) {
          this.$post(`api/exam/test/deletePaper.do`, {
            paperId
          })
            .then(res => {
              this.init(this.pageSize, this.pageNo);
              this.$swal({
                title: "删除成功！",
                text: "您已删除了本试卷。",
                type: "success",
                timer: 1500,
                showConfirmButton: false
              });
            })
            .catch(res => {});
        }
      });
    },
    //编辑一场考试
    edit_paper() {},
    config_paper() {},
    //考试详情
    test_desc(item) {
      this.$store.commit(SET_TEST_DESC_DATA, item);
      this.$router.push({
        path: "/online-test/testdesc"
      });
    },
    handleSizeChange(e) {
      this.pageNo = 1;
      this.init(e, 1);
    },
    handleCurrentChange() {
      this.init(this.pageSize, e);
    },
    //创建试卷
    add_test() {
      this.$router.push({
        path: "/online-test/create"
      });
    },
    change_nav(current) {
      this.status = current;
      this.pageNo = 1;
      this.init(this.pageSize, 1);
    },
    init(pageSize, pageNo) {
      this.table_loading = true;
      this.$post("api/exam/test/queryPaperInfoList.do", {
        sEcho: 1,
        iColumns: 7,
        sColumns: ",,,,,,",
        iDisplayStart: (pageNo - 1) * pageSize,
        iDisplayLength: pageSize,
        mDataProp_0: "paperName",
        mDataProp_1: "examLong",
        mDataProp_2: "createTime",
        mDataProp_3: "endTime",
        mDataProp_4: "score",
        mDataProp_5: "userNum",
        mDataProp_6: "function",
        iSortCol_0: 0,
        sSortDir_0: "asc",
        status: this.status
      })
        .then(res => {
          this.table_loading = false;
          this.total = res.recordsTotal;
          if (!res.data) {
            this.tableData = [];
          } else {
            this.tableData = res.data;
          }
        })
        .catch(res => {
          this.table_loading = false;
        });
    }
  }
};
</script>


<template>
    <div class="common">
        <t-title>考试详情</t-title>
        <div class="test-desc">
            <p>
                <span class="name">试卷名称：</span>
                <span class="value">{{test_desc_data.paperName}}</span>
            </p>
            <p>
                <span class="name">截止时间：</span>
                <span class="value">{{test_desc_data.endTime}}</span>
            </p>
            <p>
                <span class="name">考试时长：</span>
                <span class="value">{{test_desc_data.examLong}}</span>
            </p>
            <p>
                <span class="name">卷面总分：</span>
                <span class="value">{{test_desc_data.score + '分'}}</span>
            </p>
            <p class="button">
                <el-button size="small" type="primary">试卷试题分析</el-button>
                <el-button size="small" type="primary">试卷成绩分析</el-button>
                <el-button size="small" type="success">合格率</el-button>
            </p>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                v-loading = 'table_loading'
                style="width: 100%">
                <el-table-column prop="userName" align="center" label="姓名"></el-table-column>
                <el-table-column prop="deptName" align="center" label="部门"></el-table-column>
                <el-table-column prop="startTime" align="center" label="考试时间"></el-table-column>
                <el-table-column prop="status" align="center" label="状态">
                    <template slot-scope="scope">
                        {{scope.row.status === 1 ? '未考试':''}}
                        {{scope.row.status === 2 ? '正在考试':''}}
                        {{scope.row.status === 3 ? '已考试':''}}
                    </template>
                </el-table-column>
                <el-table-column prop="paperScore" align="center" label="得分" width="80"></el-table-column>
                <el-table-column
                prop="name"
                label="操作"
                align="center"
                >
                 <template slot-scope="scope">
                    <little-button name='试卷详情' @click="paper_desc(scope.row)"></little-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
         <div class="common-page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNo"
            :page-sizes="[5, 10, 15, 20]"
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
import { mapGetters } from "vuex";
export default {
  components: {
    littleButton
  },
  data() {
    return {
      tableData: [],
      table_loading: false,
      pageSize: 5,
      pageNo: 1,
      total: 0
    };
  },
  computed: {
    ...mapGetters(["test_desc_data"])
  },
  created() {
    this.init(this.pageSize, this.pageNo);
  },
  methods: {
    //   试卷详情
    paper_desc() {},
    handleSizeChange(e) {
      this.pageNo = 1;
      this.init(e, 1);
    },
    handleCurrentChange() {
      this.init(this.pageSize, e);
    },
    init(pageSize, pageNo) {
      this.table_loading = true;
      this.$post("api/exam/test/examPaperInfoList.do", {
        sEcho: 3,
        iColumns: 6,
        sColumns: ",,,,,",
        iDisplayStart: (pageNo - 1) * pageSize,
        iDisplayLength: pageSize,
        mDataProp_0: "userName",
        mDataProp_1: "deptName",
        mDataProp_2: "startTime",
        mDataProp_3: "function",
        mDataProp_4: "paperScore",
        mDataProp_5: "function",
        iSortCol_0: 0,
        sSortDir_0: "asc",
        paperId: 1
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

<style rel="stylesheet/scss" lang="scss">
.test-desc {
  padding: 20px 60px;
  font-size: 14px;
  line-height: 40px;
  .name {
    font-weight: 600;
    margin-right: 10px;
  }
  .button {
    margin-top: 12px;
    .el-button {
      font-size: 13px;
    }
  }
}
</style>

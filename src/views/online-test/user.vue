<template>
    <div class="common">
        <t-title>我的考试</t-title>
        <div class="common-table" style="margin-top:20px">
              <el-table
                :data="tableData"
                border
                v-loading = 'table_loading'
                style="width: 100%">
                <el-table-column prop="paperName" align="center" label="试卷名称"></el-table-column>
                <el-table-column prop="examLong" align="center" label="试卷状态" width="100"></el-table-column>
                <el-table-column prop="createTime" align="center" label="考试时长"></el-table-column>
                <el-table-column prop="endTime" align="center" label="考试时间"></el-table-column>
                <el-table-column prop="endTime" align="center" label="卷面总分"></el-table-column>
                <el-table-column prop="score" align="center" label="试卷得分" width="80"></el-table-column>
                <el-table-column
                prop="name"
                label="操作"
                align="center"
                >
                 <template slot-scope="scope">
                    <little-button name='删除'></little-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="common-page">
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
    </div>
</template>

<script>
import littleButton from "@/components/Button/littleButton";
export default {
  components: {
    littleButton
  },
  data() {
    return {
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
    handleSizeChange(e) {
      this.pageNo = 1;
      this.init(e, 1);
    },
    handleCurrentChange() {
      this.init(this.pageSize, e);
    },
    init(pageSize, pageNo) {
      this.table_loading = true;
      this.$post("api/exam/myExamList.do", {
        sEcho: 1,
        iColumns: 6,
        sColumns: ",,,,,",
        iDisplayStart: (pageNo - 1) * pageSize,
        iDisplayLength: pageSize,
        mDataProp_0: "paperName",
        mDataProp_1: "endTime",
        mDataProp_2: "examLong",
        mDataProp_3: "score",
        mDataProp_4: "createDept",
        mDataProp_5: "function",
        iSortCol_0: 0,
        sSortDir_0: "asc",
        userId: 313
      })
        .then(res => {
          if (res.data) {
            this.tableData = res.data;
          } else {
            this.tableData = [];
          }
          this.table_loading = false;
        })
        .catch(res => {
          this.table_loading = false;
        });
    }
  }
};
</script>


<template>
    <div class="common field">
        <t-title> 学习进度</t-title>
        <div class="padding20 resource-title">
            当前课程:<span class="resource-name">课程标题五</span>
        </div>
        <div class="common-action">
            <div class="common-table-bar">
                <span v-for="(item,index) in select_arr" :key='index' 
                @click='init(index + 1)'
                :class="current == (index + 1)? 'current':''">{{item}}</span>
            </div>
        </div>
        <div class="common-table">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="userName" align="center" label="姓名"></el-table-column>
                <el-table-column prop="deptName" align="center" label="所属部门"></el-table-column>
                <el-table-column prop="startTime" align="center" label="开始学习时间" v-if='current === 1'></el-table-column>
                <el-table-column prop="progress" align="center" label="学习进度" v-if='current === 1'></el-table-column>
                <el-table-column align="center" label="测试成绩" v-if='current === 1'>
                     <template slot-scope="scope">
                        {{scope.row.testResults || '未测试'}}
                      </template>
                </el-table-column>
                <el-table-column prop="userTelephone" align="center" label="联系方式" v-if='current !== 1'></el-table-column>
                <el-table-column align="center" label="操作" v-if='current !== 1 && current !==3'></el-table-column>
            </el-table>
        </div>
        <div class="common-page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[5, 10,15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 5,
      total: 0,
      tableData: [],
      current: 1,
      select_arr: ["已开始学习", "未开始学习", "发送失败"]
    };
  },
  created() {
    this.init(1);
  },
  computed: {
    ...mapGetters(["edu_list_data"])
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    init(index) {
      this.current = index;
      this.$post("api/course/queryCourseStudy.do", {
        sEcho: 1,
        iColumns: 5,
        sColumns: ",,,,",
        iDisplayStart: 0,
        iDisplayLength: 10,
        mDataProp_0: "userName",
        mDataProp_1: "deptName",
        mDataProp_2: "startTime",
        mDataProp_3: "function",
        mDataProp_4: "function",
        iSortCol_0: 0,
        sSortDir_0: "asc",
        status: this.current,
        courseId: this.edu_list_data.courseId
      })
        .then(res => {
          this.total = res.recordsTotal;
          if (!res.data) {
            this.tableData = [];
            return;
          }
          this.tableData = res.data;
        })
        .catch(res => {
          console.log(res);
        });
    }
    //上架或者下架app
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.resource-title {
  font-size: 16px;
  font-weight: 600;
  color: rgb(103, 106, 108);
  .resource-name {
    color: #3ba4f5;
  }
  .add-title {
    float: right;
  }
}
</style>

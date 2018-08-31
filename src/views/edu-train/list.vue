<template>
    <div class="common">
        <t-title>课程列表</t-title>
        <div class="common-action between">
            <div class="common-table-bar">
               <span :class='current === 2 ? "current":""'
                @click="get_create_list">已创建课程</span>
               <span :class='current === 1 ? "current":""'
                @click="get_build_list"
               >已发布课程</span>
            </div>
            <div>
                <el-button icon="el-icon-plus" type="success" size="medium">创建课程</el-button>
            </div>
        </div>
        <div class="edu-train-select">
            <el-select size='medium' v-model="ctypeId" @change="init">
                <el-option value="0" label="全部课程类型"></el-option>
                <el-option v-for="(item,index) in class_list" :key="index" :label="item.typeName" :value="item.ctypeId"></el-option>
            </el-select>
            <el-input size='medium' placeholder="请输入标题" style="width:300px" v-model="courseTitle"></el-input>
            <el-button type="primary" icon="el-icon-search" size='medium' @click="init">查询</el-button>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                v-loading='table_loading'
                style="width: 100%">
                <el-table-column
                prop="courseTitle"
                align="center"
                label="课程标题">
                </el-table-column>
                <el-table-column
                prop="typeName"
                align="center"
                label="课程类型">
                </el-table-column>
                <el-table-column
                prop="ceateTime"
                align="center"
                width="160"
                label="创建时间">
                </el-table-column>
                <el-table-column
                prop="learnerNum"
                align="center"
                width="80"
                label="学习人数">
                </el-table-column>
                <el-table-column
                prop="name"
                label="操作"
                align="center"
                width="440"
                >
                 <template slot-scope="scope">
                   <little-button name='编辑'></little-button>
                   <little-button name='课程章节' @click="go_chapter(scope.row)"></little-button>
                   <little-button name='练习题' @click='go_excrcise(scope.row)'></little-button>
                   <little-button name='学习进度' @click="go_projress(scope.row)"></little-button>
                   <little-button name='下架' @click="lower_frame(scope.row.courseId)"></little-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="common-page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
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
import { SET_TRAIN_LIST_DATA } from "@/store/mutations";
import { mapGetters } from "vuex";
export default {
  components: {
    littleButton
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 5,
      total: 0,
      select: {},
      tableData: [],
      current: 2,
      ctypeId: "0",
      courseTitle: "",
      table_loading: false
    };
  },
  created() {
    var current = sessionStorage.getItem("edu-list");
    this.current = current ? current - 0 : 1;
    this.$store.dispatch("get_class_list");
    this.init();
  },
  computed: {
    ...mapGetters(["class_list"])
  },
  methods: {
    //下架
    lower_frame(courseId) {
      this.$swal({
        title: "您确定要下架这个课程吗？",
        text: "我已确认本通知不含涉密信息。",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn btn-success"
      }).then(res => {
        if (res.value) {
          this.$post("api/course/offDown.do", {
            courseId,
            status: 4
          })
            .then(res => {
              this.$swal({
                title: "操作成功！",
                text: "当前操作您已设置成功。",
                type: "success",
                timer: 1500,
                showConfirmButton: false
              });
            })
            .catch(res => {});
        }
      });
    },
    //练习题
    go_excrcise(item) {
      this.$store.commit(SET_TRAIN_LIST_DATA, item);
      this.$router.push({
        path: "/edu-train/exercise"
      });
    },
    //学习进度
    go_projress(item) {
      this.$store.commit(SET_TRAIN_LIST_DATA, item);
      this.$router.push({
        path: "/edu-train/progress"
      });
    },
    //练习题

    //课程章节
    go_chapter(item) {
      this.$store.commit(SET_TRAIN_LIST_DATA, item);
      this.$router.push({
        path: "/edu-train/chapter"
      });
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    //获取已发布课程列表
    get_build_list() {
      this.current = 1;
      sessionStorage.setItem("edu-list", 1);
      this.init();
    },
    //获取已创建课程列表
    get_create_list() {
      this.current = 2;
      sessionStorage.setItem("edu-list", 2);
      this.init();
    },
    init() {
      this.table_loading = true;
      this.$post("api/course/queryCourseInfo.do", {
        sEcho: 1,
        iColumns: 4,
        sColumns: ",,,",
        iDisplayStart: 0,
        iDisplayLength: 10,
        mDataProp_0: "courseTitle",
        mDataProp_1: "typeName",
        mDataProp_2: "ceateTime",
        mDataProp_3: "function",
        iSortCol_0: 0,
        sSortDir_0: "asc",
        courseStatus: this.current,
        courseTitle: this.courseTitle,
        ctypeId: this.ctypeId
      })
        .then(res => {
          this.table_loading = false;
          this.total = res.recordsTotal;
          if (!res.data) {
            this.tableData = [];
            return;
          }
          this.tableData = res.data;
        })
        .catch(res => {
          this.table_loading = false;
        });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.edu-train-select {
  padding: 0 20px;
  margin-bottom: 10px;
  display: flex;
  width: 800px;
  .el-select {
    margin-right: 12px;
  }
  .el-input--medium {
    margin-right: 12px;
  }
}
</style>


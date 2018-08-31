<template>
    <div>
        <div class="common">
            <t-title title="课程练习题"></t-title>
            <div class="padding20 resource-title">
                当前课程:<span class="resource-name">{{edu_list_data.courseTitle}}</span>
                <span class="add-title" @click="add_resource"><el-button type="success" size='small' icon="el-icon-plus" v-wave>添加练习题</el-button></span>
            </div>
            <div class="common-table">
                <el-table
                    :data="tableData"
                    border
                    v-loading='table_loading'
                    style="width: 100%">
                    <el-table-column
                    prop="practiceTitle"
                    align="left"
                    show-overflow-tooltip
                    label="章节名称">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    width="200"
                    label="题目类型">
                        <template slot-scope="scope">
                            {{scope.row.practiceType === 1 ? '单选题' : '多选题'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="操作"
                    align="center"
                    width="200"
                    >
                      <template slot-scope="scope">
                        <el-button type="primary" size='mini' @click.native="edit_resource(scope.row)" v-wave>编辑</el-button>
                        <el-button type="danger" size='mini' v-wave @click="del_chartep(scope.row.chapterId)">删除</el-button>
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
        <el-dialog
            :title="group_type === 'add' ? '添加练习题' :'修改练习题'"
            class="common-dialog"
            :visible.sync="group_visible">
            <el-form ref="form" :model="form" label-width="120px" :rules="rules"  class="demo-ruleForm">
                <el-form-item label="题目类型" prop='practiceType'>
                    <el-select v-model="form.practiceType" placeholder="请选择"  size="small" style="width:100%" @change="change_type">
                        <el-option label="单选" value="1"></el-option>
                        <el-option label="多选" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题描述" prop='practiceTitle'>
                    <el-input v-model="form.practiceTitle" size="small" placeholder="章节内容"></el-input>
                </el-form-item>
                <el-form-item label="选项">
                    <div class="excrcise-form" v-for="(item,index) in options" :key='index'>
                        <span class="A">{{NumberArr[index]}}</span>
                        <el-input v-model="item.value" size="small" placeholder="选项内容"></el-input>
                        <el-button type="primary" size="small" @click="add_options" v-if="index == 0">增加</el-button>
                        <el-button type="danger" size="small" @click="del_options(index)" v-else>删除</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="正确答案">
                    <el-select v-model="form.answer" placeholder="请选择" 
                        :multiple='form.practiceType === "2"'
                     size="small" style="width:100%">
                        <el-option :label="item" :value="item" v-for='(item,index) in answer_option' :key='index'></el-option>
                    </el-select>
                </el-form-item>
                <form-button @cancel='onCancel_resource' @submit="onSubmit_resource"></form-button>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import formButton from "@/components/Button/formButton";
import uploadButton from "@/components/Button/uploadButton";
import fileList from "@/components/FileList";
import { mapGetters } from "vuex";
export default {
  components: {
    formButton,
    uploadButton,
    fileList
  },
  data() {
    return {
      group_type: "",
      group_visible: false,
      url: "http://192.168.31.47:8888/sysres",
      tableData: [],
      table_loading: false,
      form: {
        practiceType: "1",
        answer: "",
        practiceTitle: ""
      },
      rules: {
        practiceType: [
          { required: true, message: "请输入章节标题", trigger: "blur" }
        ],
        practiceTitle: [
          { required: true, message: "请输入章节内容", trigger: "blur" }
        ]
      },
      pageSize: 5,
      pageNo: 1,
      total: 0,
      options: [{ value: "" }],
      NumberArr: ["A", "B", "C", "D", "E", "F", "G"]
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["edu_list_data"]),
    answer_option() {
      return this.NumberArr.slice(0, this.options.length);
    }
  },
  methods: {
    change_type(e) {
      if (e === "1") {
        this.form.answer = "";
      } else {
        this.form.answer = [];
      }
    },
    //删除一个选项
    del_options(index) {
      this.options.splice(index, 1);
      if (e === "1") {
        this.form.answer = "";
      } else {
        this.form.answer = [];
      }
    },
    //增加一个选项
    add_options() {
      if (this.options.length === 6) {
        this.$message({
          type: "error",
          message: "最多只能有8个选项"
        });
        return;
      }
      this.options.push({ value: "" });
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    init() {
      this.$post("api/course/question/queryPracticeList.do", {
        sEcho: 1,
        iColumns: 2,
        sColumns: ",",
        iDisplayStart: 0,
        iDisplayLength: 10,
        mDataProp_0: "practiceTitle",
        mDataProp_1: "function",
        iSortCol_0: 0,
        sSortDir_0: "asc",
        courseId: this.edu_list_data.courseId
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
    },
    add_resource() {
      this.group_visible = true;
      this.group_type = "add";
    },
    edit_resource(data) {
      this.group_visible = true;
      this.group_type = "update";
      this.form.practiceType = data.practiceType + "";
      this.form.practiceTitle = data.practiceTitle;
      this.form.practiceId = data.practiceId;
      if (data.practiceType === 1) {
        this.form.answer = data.answer;
      } else {
        this.form.answer = data.answer.split(",");
      }
      var arr = [];
      if (data.optionA) {
        arr.push({
          value: data.optionA
        });
      }
      if (data.optionB) {
        arr.push({
          value: data.optionB
        });
      }
      if (data.optionC) {
        arr.push({
          value: data.optionC
        });
      }
      if (data.optionD) {
        arr.push({
          value: data.optionD
        });
      }
      if (data.optionE) {
        arr.push({
          value: data.optionE
        });
      }
      if (data.optionF) {
        arr.push({
          value: data.optionF
        });
      }
      this.options = arr;
    },
    onCancel_resource() {
      this.group_visible = false;
    },
    //提交
    onSubmit_resource() {
      var answer;
      if (this.form.practiceType === "1") {
        if (!this.form.answer) {
          this.$message({
            type: "error",
            message: "请选择一个正确答案"
          });
          return;
        }
        answer = this.form.answer;
      } else {
        if (this.form.answer.length < 1) {
          this.$message({
            type: "error",
            message: "请至少选择一个正确答案"
          });
          return;
        }
        answer = this.form.answer.join(",");
      }
      let obj = {};
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value === "") {
          this.$message({
            type: "error",
            message: "选项不能为空"
          });
          return;
        } else {
          obj["option" + this.NumberArr[i]] = this.options[i].value;
        }
      }
      var practiceId = "";
      if (this.group_type === "update") {
        practiceId = this.form.practiceId;
      }
      this.$post("api/course/question/addPractice.do", {
        courseId: this.edu_list_data.courseId,
        practiceId: practiceId,
        practiceType: this.form.practiceType,
        practiceTitle: this.form.practiceTitle,
        optionA: obj.optionA || "",
        optionB: obj.optionB || "",
        optionC: obj.optionC || "",
        optionD: obj.optionD || "",
        optionE: obj.optionE || "",
        optionF: obj.optionF || "",
        answer
      }).then(res => {
        var message = "创建新习题成功！";
        if (this.group_type === "update") {
          message = "修改习题成功！";
        }
        this.$message({
          type: "success",
          message
        });
        this.init();
        this.group_visible = false;
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.resource-title {
  font-size: 16px;
  font-weight: 600;
  color: rgb(103, 106, 108);
  margin-bottom: 10px;
  .resource-name {
    color: #3ba4f5;
  }
  .add-title {
    float: right;
  }
}
.excrcise-form {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .A {
    margin: 0 10px;
  }
  .el-button {
    margin-left: 10px;
  }
}
</style>


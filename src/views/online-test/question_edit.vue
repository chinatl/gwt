<template>
<div>
    <div class="common">
        <t-title>编辑题库</t-title>
        <div class="edu-form">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="题库名称" prop='name'>
                    <el-input v-model="name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="题库状态">
                    <el-select v-model="status" placeholder="请选择" 
                     size="small" style="width:100%">
                      <el-option label="公开" value="1"></el-option>
                      <el-option label="内部" value="2"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="通知简介">
                        <el-input type="textarea" v-model="description" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                </el-form-item>
                <form-button cancel_name='取消' submit_name='确定' @submit="submit_edit_question"></form-button>
            </el-form>
        </div> 
    </div>
    <div class="common edit-question-list">
        <t-title>试题列表</t-title>
           <div class="common-action">
            <div>
                <el-input v-model="questionName" placeholder="请输入标题" style="width:200px" size='medium'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave>搜索</el-button>
            </div>
            <div>
                <el-button type="danger" icon="el-icon-close" size='medium' @click="add_ques" v-wave>批量删除</el-button>
                <el-button type="success" icon="el-icon-plus" size='medium' @click="add_resource" v-wave>创建试题</el-button>
            </div>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                v-loading = 'table_loading'
                @selection-change="handleSelectionChange"
                style="width: 100%">
                 <el-table-column
                    type="selection"
                    align="center"
                    width="60">
                </el-table-column>
                <el-table-column label="试题类型" align="center" width='120'>
                   <template slot-scope="scope"> 
                       {{scope.row.type === '1' ? '单选题':'多选题'}}
                    </template>
                </el-table-column>
                <el-table-column prop="questionName" label="试题题目" align="center"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width='160'></el-table-column>
                <el-table-column prop="name" label="操作" align="center" width='200'>
                 <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type='success'
                    icon="el-icon-edit-outline"
                    @click="edit_resource(scope.row)" v-wave>修改</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.$index, scope.row)" v-wave>删除</el-button>
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
    <!-- 创建或修改试题 -->
        <el-dialog
        :title="group_type === 'add' ? '创建试题' :'修改试题'"
        class="common-dialog"
        :visible.sync="group_visible">
        <el-form ref="dialog_form" :model="dialog_form" label-width="120px" :rules="dialog_rules">
            <el-form-item label="所选题库" prop='type'>
               <el-input v-model="name" size="small" readonly></el-input>
            </el-form-item>
            <el-form-item label="题目类型" prop='type'>
                <el-select v-model="dialog_form.type" placeholder="请选择"  size="small" style="width:100%" @change="change_type">
                    <el-option label="单选" value="1"></el-option>
                    <el-option label="多选" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="问题" prop='questionName'>
                <el-input v-model="dialog_form.questionName" size="small" placeholder="章节内容"></el-input>
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
                <el-select v-model="dialog_form.answer" placeholder="请选择" 
                    :multiple='dialog_form.type === "2"'
                    size="small" style="width:100%">
                    <el-option :label="item" :value="item" v-for='(item,index) in answer_option' :key='index'></el-option>
                </el-select>
            </el-form-item>
              <el-form-item label="解析">
                <el-input type="textarea" v-model="dialog_form.analysis" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
            </el-form-item>
            <form-button @cancel='onCancel_resource' @submit="onSubmit_resource"></form-button>
        </el-form>
    </el-dialog>
</div>
</template>

<script>
import formButton from "@/components/Button/formButton";
import { SET_QUESTION_DATA } from "@/store/mutations";
export default {
  components: {
    formButton
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入题库名称", trigger: "blur" }]
      },
      tableData: [],
      table_loading: false,
      questionName: "",
      pageSize: 5,
      pageNo: 1,
      total: 0,
      group_visible: false,
      group_type: "",
      dialog_form: {
        type: "1"
      },
      options: [{ value: "" }],
      NumberArr: ["A", "B", "C", "D", "E", "F", "G"],
      dialog_rules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        type: [{ required: true }],
        questionName: [
          { required: true, message: "请输入问题", trigger: "blur" }
        ],
        answer: [{ required: true }]
      }
    };
  },
  computed: {
    form() {
      return this.$store.getters.question_data;
    },
    id() {
      return this.$store.getters.question_data.id;
    },
    name: {
      get() {
        return this.$store.getters.question_data.name;
      },
      set(value) {
        this.$store.commit("set_question_data", {
          name: "name",
          value
        });
      }
    },
    status: {
      get() {
        return this.$store.getters.question_data.status + "";
      },
      set(value) {
        this.$store.commit("set_question_data", { name: "status", value });
      }
    },
    description: {
      get() {
        return this.$store.getters.question_data.description;
      },
      set(value) {
        this.$store.commit("set_question_data", {
          name: "description",
          value
        });
      }
    },
    answer_option() {
      return this.NumberArr.slice(0, this.options.length);
    }
  },
  created() {
    this.init();
  },
  methods: {
    //   ok
    submit_edit_question() {
      this.$refs.form.validate(res => {
        if (!res) {
          return;
        }
        this.$post("api/exam/quesbank/insertQuestLib.do", {
          description: this.description,
          status: this.status,
          name: this.name,
          id: this.id
        })
          .then(res => {
            this.$message({
              type: "success",
              message: "修改成功！"
            });
            // this.$refs.form.resetFields();
            this.$store.commit(SET_QUESTION_DATA, this.form);
          })
          .catch(res => {});
      });
    },
    //获取选择
    handleSelectionChange() {},
    //创建试题
    add_ques() {},
    change_type(e) {
      if (e === "1") {
        this.dialog_form.answer = "";
      } else {
        this.dialog_form.answer = [];
      }
    },
    del_options(index) {
      this.options.splice(index, 1);
      if (e === "1") {
        this.dialog_form.answer = "";
      } else {
        this.dialog_form.answer = [];
      }
    },
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
    add_resource() {
      this.group_visible = true;
      this.group_type = "add";
    },
    edit_resource(data) {
      this.group_visible = true;
      this.group_type = "update";
      this.dialog_form.type = data.type + "";
      this.dialog_form.questionName = data.questionName;
      this.dialog_form.id = data.id;

      this.$get("api/exam/quesbank/editQuestionInfo.do", {
        id: data.id
      })
        .then(response => {
          var data = response.data;
          if (data.type === "1") {
            this.dialog_form.answer = data.answer;
          } else {
            this.dialog_form.answer = data.answer.split(",");
          }
          this.dialog_form.analysis = data.analysis;
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
        })
        .catch(res => {
          console.log(res);
        });
    },
    onCancel_resource() {
      this.group_visible = false;
    },
    //提交
    onSubmit_resource() {
      var answer;
      if (this.dialog_form.type === "1") {
        if (!this.dialog_form.answer) {
          this.$message({
            type: "error",
            message: "请选择一个正确答案"
          });
          return;
        }
        answer = this.dialog_form.answer;
      } else {
        if (this.dialog_form.answer.length < 1) {
          this.$message({
            type: "error",
            message: "请至少选择一个正确答案"
          });
          return;
        }
        answer = this.dialog_form.answer.join(",");
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
      var id = "";
      if (this.group_type === "update") {
        id = this.dialog_form.id;
      }
      this.$post("api/exam/quesbank/insertQuestInfo.do", {
        type: this.dialog_form.type,
        questionName: this.dialog_form.questionName,
        optionA: obj.optionA || "",
        optionB: obj.optionB || "",
        optionC: obj.optionC || "",
        optionD: obj.optionD || "",
        optionE: obj.optionE || "",
        optionF: obj.optionF || "",
        answer,
        analysis: this.dialog_form.analysis,
        libraryId: this.id,
        id
      }).then(res => {
        var message = "创建新试题成功！";
        if (this.group_type === "update") {
          message = "修改试题成功！";
        }
        this.$message({
          type: "success",
          message
        });
        this.init();
        this.group_visible = false;
      });
    },
    //查询所有题库列表
    init() {
      this.$post("api/exam/quesbank/queryQuestInfoList.do", {
        sEcho: 1,
        iColumns: 5,
        sColumns: ",,,,",
        iDisplayStart: 0,
        iDisplayLength: 10,
        mDataProp_0: "function",
        mDataProp_1: "function",
        mDataProp_2: "questionName",
        mDataProp_3: "createTime",
        mDataProp_4: "function",
        iSortCol_0: 0,
        sSortDir_0: "asc",
        id: this.id,
        questionName: this.questionName
      })
        .then(res => {
          this.total = res.recordsTotal;
          if (res.data) {
            this.tableData = res.data;
          } else {
            this.tableData = [];
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    handleSizeChange() {},
    handleCurrentChange() {}
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.edu-form {
  width: 800px;
  margin: 40px;
}
.edit-question-list {
  margin-top: 20px;
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



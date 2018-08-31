<template>
    <div class="common">
        <t-title>题库列表</t-title>
        <div class="common-action">
            <div>
                <el-input v-model="input" placeholder="请输入角色名称" style="width:200px" size='medium'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave>查询</el-button>
            </div>
            <div>
                <el-button type="success" icon="el-icon-plus" size='medium' @click="add_role" v-wave>创建题库</el-button>
            </div>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                v-loading='table_loading'
                style="width: 100%">
                <el-table-column  prop="name" align="center"  label="题库名称" width="120"></el-table-column>
                <el-table-column  prop="num" align="center"  label="试题数量" width="80"></el-table-column>
                <el-table-column  prop="status" align="center"  label="题库状态" width="80">
                  <template slot-scope="scope">
                     {{scope.row.status ? '启用':'内部'}}
                  </template>
                </el-table-column>
                <el-table-column  prop="description" align="center"  label="说明" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="addTime" align="center"  label="创建信息" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="upTime" align="center"  label="最后修改" show-overflow-tooltip></el-table-column>
                <el-table-column
                prop="name"
                label="操作"
                align="center"
                width="380"
                >
                 <template slot-scope="scope">
                     <little-button name='编辑' @click="edit_role(scope.$index, scope.row)"></little-button>
                     <little-button name='删除' @click="del_question(scope.row.id)"></little-button>
                     <little-button name='创建试题' @click="create_question(scope.row)"></little-button>
                     <little-button name='批量导入试题' @click="handleDelete(scope.$index, scope.row)"></little-button>
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
        <!-- 角色新增弹出框 -->
            <el-dialog
            :title="role_type === 'add' ? '创建题库':'修改题库'"
            class="common-dialog"
            v-drag
            :visible.sync="role_visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules"  class="demo-ruleForm">
                <el-form-item label="题库名称" prop='name'>
                    <el-input v-model="form.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="题库状态" prop='name'>
                    <el-select v-model="form.status" size="small" style="width:100%">
                        <el-option label='公开' value="1"></el-option>
                        <el-option label='内部' value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明">
                        <el-input type="textarea" v-model="form.description" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
        </el-dialog>
<!-- 创建试题 -->
        <el-dialog
            title='创建试题'
            class="common-dialog"
            :visible.sync="subject_visible">
            <el-form ref="form" :model="subject_form" label-width="120px" :rules="subject_rules"  class="demo-ruleForm">
                <el-form-item label="所选题库" prop='name'>
                    <el-input v-model="subject_form.name" size="small" placeholder="章节内容" readonly></el-input>
                </el-form-item>
                <el-form-item label="题目类型" prop='practiceType'>
                    <el-select v-model="subject_form.practiceType" placeholder="请选择"  size="small" style="width:100%" @change="change_type">
                        <el-option label="单选" value="1"></el-option>
                        <el-option label="多选" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题描述" prop='practiceTitle'>
                    <el-input v-model="subject_form.practiceTitle" size="small" placeholder="问题描述"></el-input>
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
                    <el-select v-model="subject_form.answer" placeholder="请选择" 
                        :multiple='subject_form.practiceType === "2"'
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
import littleButton from "@/components/Button/littleButton";
export default {
  components: {
    formButton,
    littleButton
  },
  data() {
    return {
      role_type: "add",
      pageNo: 1,
      pageSize: 5,
      total: 0,
      input: "",
      role_visible: false,
      form: {
        name: "",
        description: "",
        status: "1"
      },
      tableData: [],
      table_loading: false,
      rules: {
        name: [{ required: true, message: "请输入题库名称", trigger: "blur" }],
        status: [
          { required: true, message: "请选择题库状态", trigger: "change" }
        ]
      },
      options: [{ value: "" }],
      NumberArr: ["A", "B", "C", "D", "E", "F", "G"],
      subject_rules: {
        practiceType: [
          { required: true, message: "请选择题目类型", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入章节标题", trigger: "blur" }],
        practiceTitle: [
          { required: true, message: "请输入问题", trigger: "blur" }
        ]
      },
      subject_form: {
        practiceType: "1",
        answer: "",
        practiceTitle: "",
        libraryId: "",
        name: ""
      },
      subject_visible: false,
      answer: ""
    };
  },
  computed: {
    answer_option() {
      return this.NumberArr.slice(0, this.options.length);
    }
  },
  created() {
    this.init(this.pageSize, this.pageNo);
  },
  methods: {
    del_question(id) {
      this.$swal({
        title: "您确定要删除当前题库吗？",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn btn-success"
      }).then(res => {
        if (res.value) {
          this.$post(`api/exam/quesbank/deleteLib.do`, {
            id
          })
            .then(res => {
              this.init(this.pageSize, this.pageNo);
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
    init(pageSize, pageNo) {
      this.table_loading = true;
      this.$post("api/exam/quesbank/queryQuestLib.do", {
        sEcho: 1,
        iColumns: 7,
        sColumns: ",,,,,,",
        iDisplayStart: pageNo - 1,
        iDisplayLength: pageSize,
        mDataProp_0: "name",
        mDataProp_1: "num",
        mDataProp_2: "function",
        mDataProp_3: "description",
        mDataProp_4: "addTime",
        mDataProp_5: "upTime",
        mDataProp_6: "function",
        iSortCol_0: 0,
        sSortDir_0: "asc",
        qlibName: ""
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
    },
    handleSizeChange(e) {
      this.pageNo = 1;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      this.init(this.pageSize, e);
    },
    handleDelete() {},
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$post("api/exam/quesbank/insertQuestLib.do", {
            name: this.form.name,
            description: this.form.description,
            status: this.form.status
          })
            .then(res => {
              this.$message({
                type: "success",
                message: "创建题库成功！"
              });
              this.init(this.pageSize, this.pageNo);
              this.group_visible = false;
            })
            .catch(res => {});
        } else {
          return false;
        }
      });
    },
    onCancel() {},
    add_role() {
      this.role_type = "add";
      this.role_visible = true;
    },
    edit_role() {
      this.role_type = "update";
      this.role_visible = true;
    },
    //创建试题
    create_question(item) {
      this.subject_form.name = item.name;
      this.subject_form.libraryId = item.id;
      this.subject_visible = true;
      this.$nextTick(res => {
        this.$refs.form.resetFields();
      });
    },
    change_type(e) {
      if (e === "1") {
        this.subject_form.answer = "";
      } else {
        this.subject_form.answer = [];
      }
    },
    //删除一个选项
    del_options(index) {
      this.options.splice(index, 1);
      if (e === "1") {
        this.subject_form.answer = "";
      } else {
        this.subject_form.answer = [];
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
    onCancel_resource() {
      this.subject_visible = false;
    },
    onSubmit_resource() {
      var answer;
      if (this.subject_form.practiceType === "1") {
        if (!this.subject_form.answer) {
          this.$message({
            type: "error",
            message: "请选择一个正确答案"
          });
          return;
        }
        answer = this.subject_form.answer;
      } else {
        if (this.subject_form.answer.length < 1) {
          this.$message({
            type: "error",
            message: "请至少选择一个正确答案"
          });
          return;
        }
        answer = this.subject_form.answer.join(",");
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

      this.$post("api/exam/quesbank/insertQuestInfo.do", {
        libraryId: this.subject_form.libraryId,
        type: this.subject_form.practiceType,
        questionName: this.subject_form.practiceTitle,
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
        this.subject_visible = false;
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
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

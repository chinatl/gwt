<template>
    <div class="common">
        <t-title title="创建试卷"></t-title>
        <div class="page-form">
              <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                    <el-form-item label="试卷名称" prop='paperName'>
                        <el-input v-model="form.paperName" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="考试时长" prop="examLong">
                        <el-input v-model="form.examLong" size="small">
                              <span slot="suffix" class="el-input__icon" style="color:#666">分钟</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="考试时间" prop='date'>
                        <el-date-picker
                            v-model="form.date"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            size="small"
                            align="right">
                        </el-date-picker>
                    </el-form-item>
                     <el-form-item label="及格分数" prop="passScore">
                        <el-input v-model="form.passScore" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="选择考试部门">
                        <div class="flex">
                            <el-input v-model="form.name" size="small" placeholder="选择考试部门"></el-input>
                            <add-user-button @click="yield_dialog= true">选择部门</add-user-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="选择考试人">
                        <div class="flex">
                            <el-input v-model="form.name" size="small" placeholder="选择考试人"></el-input>
                            <add-user-button @click="dialog= true">选择接收人</add-user-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="通知简介">
                        <el-input type="textarea" v-model="form.paperDesc" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                    </el-form-item>
                    <form-button  cancel_name='返回' submit_name='提交' @submit="submit" @cancel='cancel'></form-button>
            </el-form>
        </div>
        <add-yield :show="yield_dialog" @ok='yield_dialog = false' @close='yield_dialog = false'></add-yield>
        <add-user :show='dialog' @close='dialog = false' @cancel='dialog = false'></add-user>
    </div>
</template>
<script>
import addUserButton from "@/components/Button/addUserButton";
import addUser from "@/components/AddUser";
import addYield from "@/components/AddYield";
import formButton from "@/components/Button/formButton";
import { parseTime } from "@/utils";
export default {
  components: {
    addUser,
    addYield,
    addUserButton,
    formButton
  },
  data() {
    return {
      dialog: false,
      input: "",
      form: {},
      part: "1",
      rules: {
        paperName: [
          { required: true, message: "请输入试卷名称", trigger: "blur" }
        ],
        examLong: [
          { required: true, message: "请输入考试时长", trigger: "blur" }
        ],
        date: [
          { required: true, message: "请输入考试时间", trigger: "change" }
        ],
        passScore: [
          { required: true, message: "请输入及格分数", trigger: "blur" }
        ]
      },
      file_list: [],
      yield_dialog: false //部门管理弹窗
    };
  },
  created() {},
  methods: {
    cancel(){
      this.$router.push({
        path:'/online-test/testpaper'
      })
    },
    submit() {
      this.$refs.form.validate(res => {
        if (!res) return;
        this.$post("api/exam/test/savePaper.do", {
          paperName: this.form.paperName,
          examLong: this.form.examLong,
          startTime: parseTime(this.form.date[0], "{y}/{m}/{d} {h}:{i}:{s}"),
          endTime: parseTime(this.form.date[1], "{y}/{m}/{d} {h}:{i}:{s}"),
          passScore: this.form.passScore,
          paperDesc: this.form.paperDesc,
          token: this.$store.getters.token,
          examUser: JSON.stringify([
            {
              username: " allan",
              deptid: "1113",
              userid: "3662",
              deptname: "扶贫办2",
              source: 1
            }
          ]),
          examDept: JSON.stringify([])
        })
          .then(res => {
            this.$swal({
              title: "操作成功！",
              text: "当前操作您已设置成功。",
              type: "success",
              timer: 1500,
              showConfirmButton: true
            }).then(res => {
              this.$router.push({
                path: "/online-test/testpaper"
              });
            });
          })
          .catch(res => {
            console.log(res);
          });
      });
    }
  }
};
</script>

<template>
    <div class="common">
        <t-title title="更新试卷"></t-title>
        <div class="page-form">
              <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                    <el-form-item label="试卷名称" prop='paperName'>
                        <el-input v-model="paperName" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="考试时长" prop="examLong">
                        <el-input v-model="examLong" size="small">
                              <span slot="suffix" class="el-input__icon" style="color:#666">分钟</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="考试时间">
                        <el-date-picker
                            v-model="date"
                            type="datetimerange"
                            @change="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            size="small"
                            align="right">
                        </el-date-picker>
                    </el-form-item>
                     <el-form-item label="及格分数">
                        <el-input v-model="passScore" size="small"></el-input>
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
                        <el-input type="textarea" v-model="paperDesc" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                    </el-form-item>
                    <form-button submit_name='提交' @submit="submit" cancel_name='返回' @cancel='cancel'></form-button>
            </el-form>
        </div>
        <add-yield :show="yield_dialog" @ok='yield_dialog = false' @close='yield_dialog = false'></add-yield>
        <add-user :show='dialog' @close='dialog = false'></add-user>
    </div>
</template>
<script>
import addUserButton from "@/components/Button/addUserButton";
import addUser from "@/components/AddUser";
import addYield from "@/components/AddYield";
import formButton from "@/components/Button/formButton";
import { parseTime } from "@/utils";
import { mapGetters } from "vuex";
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
      rules: {
        paperName: [
          { required: true, message: "请输入试卷名称", trigger: "blur" }
        ],
        examLong: [
          { required: true, message: "请输入考试时长", trigger: "blur" }
        ],
        passScore: [
          { required: true, message: "请输入及格分数", trigger: "blur" }
        ]
      },
      file_list: [],
      yield_dialog: false //部门管理弹窗
    };
  },
  computed: {
    form() {
      return this.$store.getters.refresh_data;
    },
    paperName: {
      get() {
        return this.$store.getters.refresh_data.paperName;
      },
      set(value) {
        this.$store.commit("set_refresh_data", {
          name: "paperName",
          value
        });
      }
    },
    examLong: {
      get() {
        return this.$store.getters.refresh_data.examLong.replace("分钟", "");
      },
      set(value) {
        this.$store.commit("set_refresh_data", {
          name: "examLong",
          value
        });
      }
    },
    passScore: {
      get() {
        return this.$store.getters.refresh_data.passScore;
      },
      set(value) {
        this.$store.commit("set_refresh_data", {
          name: "passScore",
          value
        });
      }
    },
    paperDesc: {
      get() {
        return this.$store.getters.refresh_data.paperDesc;
      },
      set(value) {
        this.$store.commit("set_refresh_data", {
          name: "paperDesc",
          value
        });
      }
    },
    date: {
      get() {
        return this.$store.getters.refresh_data.date;
      },
      set(value) {
        this.$store.commit("set_refresh_data", {
          name: "date",
          value
        });
      }
    }
  },
  methods: {
    cancel() {
      this.$router.push({
        path: "/online-test/testpaper"
      });
    },
    pickerOptions(value) {
      this.$store.commit("set_refresh_data", {
        name: "date",
        value
      });
    },
    submit() {
      this.$refs.form.validate(res => {
        if (!res) return;
        console.log(this.date[0] + "");
        console.log(new Date(this.date[0]) + "");
        this.$post("api/exam/test/updatePaper.do", {
          paperName: this.paperName,
          examLong: this.examLong,
          startTime: this.date[0] + "",
          endTime: this.date[1] + "",
          passScore: this.passScore,
          paperDesc: this.paperDesc,
          paperId: this.paperId,
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
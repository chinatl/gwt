<template>
    <div class="first-login-new" v-loading='loading'>
        <div class="first-login-edit">
            <el-form ref="form" :model="form" label-width="120px" :rules="rules" status-icon>
                <el-form-item label="设置新密码" prop='passWord'>
                    <el-input v-model="form.passWord" size="small" placeholder="请输入8-20位，字母与数字组合的新密码" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop='re_password'>
                    <el-input v-model="form.re_password" size="small" placeholder="请再次输入新密码" type="password" @keyup.native.enter='return_login'></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="first-action">
            <el-button size="small" type='primary' @click="next_step">返回登录页</el-button>
            <el-button size="small" type='primary'  @click="return_login">下一步</el-button>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(value)) {
          callback("请输入8位以上，字母与数字组合的新密码");
        } else {
          callback();
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.passWord) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        passWord: "",
        re_password: ""
      },
      rules: {
        passWord: [
          {
            validator: validatePass,
            tigger: "blur"
          }
        ],
        re_password: [
          {
            validator: validatePass2,
            tigger: "blur"
          }
        ]
      },
      loading: false
    };
  },
  methods: {
    next_step() {
      this.$router.push({
        path: "/login"
      });
    },
    return_login() {
      this.$refs.form.validate(res => {
        if (res) {
          this.loading = true;
          this.$post(
            "gwt/system/sysUser/resetPwd",
            {
              realName: sessionStorage.getItem("login-user-name"),
              passWord: this.form.passWord,
              mobilePhone: sessionStorage.getItem("login-user-phone"),
              code: sessionStorage.getItem("login-user-code")
            },
            "json"
          )
            .then(res => {
              this.loading = false;
              if (res.result !== "0000") {
                this.$swal({
                  title: "操作失败！",
                  text: res.msg,
                  type: "error",
                  showConfirmButton: true
                });
                return;
              }
              this.$router.push({
                path: "/forgetpwd/finish"
              });
            })
            .catch(res => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.first-login-new {
  position: relative;
  height: 100%;
  .first-login-edit {
    text-align: center;
    padding: 80px 80px;
    h3 {
      letter-spacing: 2px;
      color: #f1a917;
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: 100;
    }
    p {
      font-size: 16px;
      color: #676a6c;
      margin: 30px 0;
    }
  }
  .first-action {
    height: 72px;
    text-align: right;
    line-height: 72px;
    padding-right: 20px;
    background-color: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: solid 1px #e3eaf2;
  }
}
</style>


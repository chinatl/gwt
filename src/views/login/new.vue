<template>
    <div class="first-login-new" v-loading='loading'>
        <div class="first-login-content">
            <h3>新用户验证！</h3>
            <p>首次登录用户，请验证姓名并修改密码，才能使用本系统！</p>
            <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                <el-form-item label="请验证姓名：" prop='name'>
                        <el-input v-model="form.name" size="small" placeholder="请输入姓名"></el-input>
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
    return {
      form: {
        name: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入姓名",
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
            "gwt/system/sysUser/validateName",
            {
              mobilePhone: this.$store.getters.user_info.mobilePhone,
              realName: this.form.name
            },
            "json"
          )
            .then(res => {
              this.loading = false;
              if (res.result !== '0000') {
                this.$swal({
                  title: "操作失败！",
                  text: res.msg,
                  type: "error",
                  showConfirmButton: true
                });
                return;
              }
              this.$router.push({
                path: "/firstlogin/edit"
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
  .first-login-content {
    text-align: center;
    padding: 40px 80px;
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


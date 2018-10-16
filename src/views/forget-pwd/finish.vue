<template>
    <div class="first-login-new">
        <div class="forget-pwd">
            <p class="forget-icon"><i class="el-icon-success"></i></p>   
            <p class="forget-text">您的密码已修改成功</p>
            <p class="forget-tips">密码修改成功，请重新登陆</p>
        </div>
        <div class="first-action">
            <el-button size="small" type='primary' @click.prevent.stop="next_step">返回登录</el-button>
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
      sessionStorage.removeItem("set-forget");
      this.$router.push({
        path: "/login"
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.first-login-new {
  position: relative;
  height: 100%;
  .forget-pwd {
    padding: 40px;
    text-align: center;
    .forget-icon {
      color: #a1d783;
      font-size: 60px;
    }
    .forget-text {
      margin-top: 20px;
      letter-spacing: 2px;
      color: #f1a917;
      margin-bottom: 30px;
      font-size: 30px;
    }
    .forget-tips {
      color: #676a6c;
      font-size: 16px;
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


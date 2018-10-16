<template>
<div class="forget-sub" v-loading='loading'>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules" status-icon :validate-on-rule-change='false' @submit.native.prevent>
        <el-form-item label="验证姓名:" prop="realName">
            <el-input v-model="form.realName" size='medium' placeholder="请输入姓名" maxlength="20" @keyup.native.enter='submit'></el-input>
        </el-form-item>
    </el-form>
     <div class="forget-action">
            <el-button size="small" type='primary' @click="next_step">返回登录页</el-button>
            <el-button size="small" type='primary'  @click="submit">下一步</el-button>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        realName: ""
      },
      rules: {
        realName: [{ required: true, message: "请输入姓名", tigger: "blur" }]
      },
      loading: false
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate(res => {
        if (!res) return;
        this.loading = true;
        this.$post(
          "gwt/system/sysUser/validateName",
          {
            realName: this.form.realName,
            mobilePhone: sessionStorage.getItem("login-user-phone")
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
            sessionStorage.setItem("login-user-name", this.form.realName);
            this.$router.push({ path: "/forgetpwd/reset" });
          })
          .catch(res => {
            this.loading = false;
            console.log(res);
          });
      });
    },
    next_step() {
      this.$router.push({
        path: "/login"
      });
    }
  }
};
</script>
<style>
.forget-sub {
  height: 100%;
  position: relative;
  padding: 80px 120px;
}
.phone-flex {
  display: flex;
  align-items: center;
}
.forget-action {
  height: 72px;
  text-align: right;
  line-height: 72px;
  padding-right: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: solid 1px #e3eaf2;
  background-color: #fff;
}
</style>

<template>
  <div class="forget-sub" v-loading='loading'>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules" status-icon :validate-on-rule-change='false'>
        <el-form-item label="验证手机号:" prop="phone" required>
            <el-input v-model="form.phone" size='medium' placeholder="请输入手机号" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="验证码:" prop="userCode">
            <div class='phone-flex'>
                <el-input v-model="form.userCode" placeholder="请输入短信验证码" maxlength="6" size='medium'></el-input>
                <el-button :type="isSend ? 'info':'primary'" style="margin-left:10px;width:140px" size='medium' v-wave @click="get_validate">{{send_message}}</el-button>
            </div>
        </el-form-item>
    </el-form>
     <div class="forget-action">
            <el-button size="small" type='primary' @click="next_step">返回登录页</el-button>
            <el-button size="small" type='primary'  @click="submit">下一步</el-button>
        </div>
    </div>
</template>
<script>
import { validatePhone } from "@/utils/validate";
export default {
  data() {
    return {
      loading: false,
      form: {
        phone: ""
      },
      rules: {
        phone: [{ validator: validatePhone, tigger: "change" }],
        userCode: [
          {
            required: true,
            message: "请输入短信验证码",
            tigger: "blur"
          }
        ]
      },
      send_message: "获取验证码",
      isSend: false,
      userCode: "",
      isSendPhone: false
    };
  },
  created() {
    var phone = sessionStorage.getItem("forgetpwd/phone");
    this.form.phone = phone;

    var isSend = sessionStorage.getItem("forget-phone-isSend");
    this.isSend = isSend === "true" ? true : false;
    var send_message = sessionStorage.getItem("forget-phone-message");
    this.send_message = send_message ? send_message : "获取验证码";
    if (this.isSend) {
      var isSend = sessionStorage.setItem("forget-phone-isSend", "true");
      var a = 61 - parseInt(this.send_message);
      this.send_message = 60 - a + "秒";
      clearInterval(timer);
      var timer = setInterval(res => {
        a++;
        this.send_message = 60 - a + "秒";
        sessionStorage.setItem("forget-phone-message", this.send_message);
        if (a == 60) {
          this.send_message = "获取验证码";
          this.isSend = false;
          clearInterval(timer);
          var isSend = sessionStorage.setItem("forget-phone-isSend", "false");
          sessionStorage.setItem("forget-phone-message", this.send_message);
        }
      }, 1000);
    }
  },
  methods: {
    get_validate() {
      if (!this.form.phone) {
        return;
      }
      if (this.isSend) {
        this.$message({
          message: "您已发送验证码，请稍后再发",
          type: "warning"
        });
        return;
      }
      this.loading = true;
      this.$post(
        "gwt/getPhoneValidateCode",
        {
          phone: this.form.phone
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
          sessionStorage.setItem("forgetpwd/phone", this.form.phone);
          clearInterval(this.timer);
          this.loading = false;
          this.isSendPhone = true;
          this.$message({
            message: "短信验证码已发送，请注意查收",
            type: "success"
          });
          this.isSend = true;
          var isSend = sessionStorage.setItem("forget-phone-isSend", "true");
          var a = 0;
          this.send_message = 60 - a + "秒";
          this.timer = setInterval(res => {
            a++;
            this.send_message = 60 - a + "秒";
            sessionStorage.setItem("forget-phone-message", this.send_message);
            if (a == 60) {
              this.send_message = "获取验证码";
              this.isSend = false;
              clearInterval(this.timer);
              var isSend = sessionStorage.setItem(
                "forget-phone-isSend",
                "false"
              );
              sessionStorage.setItem("forget-phone-message", this.send_message);
            }
          }, 1000);
        })
        .catch(res => {
          this.loading = false;
        });
    },
    submit() {
      this.$refs.form.validate(res => {
        if (!res) return;
        this.loading = true;
        this.$post(
          "gwt/checkPhoneValidateCode",
          {
            userCode: this.form.userCode,
            phone: this.form.phone
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
            this.$router.push({ path: "/forgetpwd/identity" });
            this.send_message = "获取验证码";
            this.isSend = false;
            clearInterval(this.timer);
            var isSend = sessionStorage.setItem("forget-phone-isSend", "false");
            sessionStorage.setItem("forget-phone-message", this.send_message);
            sessionStorage.setItem("login-user-phone", this.form.phone);
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

<template>
  <div class="message-page">
      <div class="message-content" v-loading='loading'>
          <div class="message-tab">
            安全验证
          </div>
          <div class="message-con">
               <h3>手机短信验证！</h3>
               <p>您的绑定手机号为：155****5555</p>
               <div class="send">
                   <el-input size="small" placeholder="请输入验证码"></el-input>
                   <!-- <el-button size="small" type="success" v-wave>获取验证码</el-button> -->
                   <div :class="isSend ? 'erp-btn info' : 'erp-btn'" v-wave>{{send_message}}</div>
               </div>
          </div>
          <div class="message-action">
                <el-button size="small" @click="return_login">返回登录页</el-button>
                <el-button size="small" type='primary'  @click="submit">确认</el-button>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      send_message: "获取验证码",
      loading: false,
      isSend: true
    };
  },
  computed: {},
  created() {
    var isSend = sessionStorage.getItem("isSend");
    this.isSend = isSend === "true" ? true : false;
  },
  methods: {
    /*获取验证码*/
    get_validate() {
      if (this.isSend) {
        this.$message({
          message: "您已发送验证码，请稍后再发",
          type: "error"
        });
        return;
      }
      this.loading = true;
      this.$get("user/mailVerification", {
        email: this.register_form.email
      })
        .then(res => {
          clearInterval(this.timer);
          this.loading = false;
          this.$message({
            message: res.data,
            type: "success"
          });
          this.isSend = true;
          var a = 0;
          this.timer = setInterval(res => {
            a++;
            this.email_message = 60 - a + "s para reenviar";
            if (a == 60) {
              this.email_message = "email_message";
              this.isSend = false;
              clearInterval(this.timer);
            }
          }, 1000);
        })
        .catch(res => {
          this.loading = false;
        });
    },
    return_login() {
      this.$router.push({
        path: "/login"
      });
    },
    submit() {}
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.message-page {
  background-color: #f3f3f4;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .message-content {
    width: 600px;
    box-shadow: 3px 3px 4px #ccc;
    border-radius: 5px;
    border: solid 1px #e3eaf2;
    margin: 100px auto;
    background-color: #fff;
    .message-tab {
      text-align: center;
      height: 74px;
      line-height: 74px;
      color: #46c4d3;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 2px;
    }
    .message-con {
      height: 260px;
      background-color: rgb(250, 250, 250);
      border-bottom: solid 1px #e3eaf2;
      border-top: solid 1px #e3eaf2;
      padding: 60px 140px;
      text-align: center;
      h3 {
        letter-spacing: 2px;
        color: #f1a917;
        margin-bottom: 20px;
        font-size: 24px;
        font-weight: 100;
      }
      p {
        font-size: 16px;
        line-height: 40px;
        color: #676a6c;
      }
      .send {
        display: flex;
        margin-top: 12px;
        padding: 0 20px;
        .erp-btn {
          font-size: 14px;
          font-size: 14px;
          margin-left: 12px;
          max-width: 120px;
          min-width: 120px;
        }
      }
    }
    .message-action {
      height: 72px;
      text-align: right;
      line-height: 72px;
      padding-right: 20px;
    }
  }
}
</style>


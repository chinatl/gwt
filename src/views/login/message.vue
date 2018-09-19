<template>
  <div class="message-page">
      <div class="message-content" v-loading='loading'>
          <div class="message-tab">
            安全验证
          </div>
          <div class="message-con">
               <h3>手机短信验证！</h3>
               <p>您的绑定手机号为：{{$store.getters.user_info.mobilePhone}}</p>
               <div class="send">
                   <el-input size="small" placeholder="请输入验证码" v-model="userCode" maxlength="6" @keyup.native.enter='submit'></el-input>
                   <!-- <el-button size="small" type="success" v-wave>获取验证码</el-button> -->
                   <div :class="isSend ? 'erp-btn info' : 'erp-btn'" v-wave @click="get_validate">{{send_message}}</div>
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
import Cookies from "js-cookie";
export default {
  data() {
    return {
      send_message: "获取验证码",
      loading: false,
      isSend: false,
      userCode: "",
      isSendPhone: false
    };
  },
  created() {
    var isSend = sessionStorage.getItem("login-isSend");
    this.isSend = isSend === "true" ? true : false;
    var send_message = sessionStorage.getItem("login-message");
    this.send_message = send_message ? send_message : "获取验证码";
    if (this.isSend) {
      var isSend = sessionStorage.setItem("login-isSend", "true");
      var a = 61 - parseInt(this.send_message);
      this.send_message = 60 - a + "秒";
      clearInterval(this.timer);
      this.timer = setInterval(res => {
        a++;
        this.send_message = 60 - a + "秒";
        sessionStorage.setItem("login-message", this.send_message);
        if (a == 60) {
          this.send_message = "获取验证码";
          this.isSend = false;
          clearInterval(this.timer);
          var isSend = sessionStorage.setItem("login-isSend", "false");
          sessionStorage.setItem("login-message", this.send_message);
        }
      }, 1000);
    }
  },
  methods: {
    /*获取验证码*/
    get_validate() {
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
          phone: this.$store.getters.user_info.mobilePhone
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
          clearInterval(this.timer);
          this.isSendPhone = true;
          this.$message({
            message: "短信验证码已发送，请注意查收",
            type: "success"
          });
          this.isSend = true;
          var isSend = sessionStorage.setItem("login-isSend", "true");
          var a = 0;
          this.send_message = 60 - a + "秒";
          this.timer = setInterval(res => {
            a++;
            this.send_message = 60 - a + "秒";
            sessionStorage.setItem("login-message", this.send_message);
            if (a == 60) {
              this.send_message = "获取验证码";
              this.isSend = false;
              clearInterval(this.timer);
              var isSend = sessionStorage.setItem("login-isSend", "false");
              sessionStorage.setItem("login-message", this.send_message);
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
    submit() {
      if (!this.isSendPhone) {
        this.$message({
          message: "请先获取验证码",
          type: "error"
        });
        return;
      }
      if (!this.userCode) {
        this.$message({
          message: "请输入短信验证码",
          type: "error"
        });
        return;
      }
      this.loading = true;
      this.$post(
        "gwt/checkPhoneValidateCode",
        {
          userCode: this.userCode,
          phone: this.$store.getters.user_info.mobilePhone
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
          this.$post("gwt/system/sysEquipmentAuth/save", {}, "json").then(
            res => {
              for (var k in res.data) {
                localStorage.setItem("equipmentUuid", res.data[k]);
                localStorage.setItem("equipmentUuidKey", k);
              }
            }
          );
          this.$message({
            type: "success",
            message: "登录成功！"
          });
          this.isSend = false;
          sessionStorage.setItem("login-info", Math.random());
          this.$router.push({ path: "/user-message/index" });

          clearInterval(this.timer);
          sessionStorage.setItem("login-message", "获取验证码");
          sessionStorage.setItem("login-isSend", "false");

          this.$store.dispatch("get_meeting_type_list");
          this.$store.dispatch("get_part_tree");
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    }
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
        padding: 0 30px;
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


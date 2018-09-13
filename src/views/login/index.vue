<template>
  <div class="login-container" :style="note1">
    <div class="login-form">
      <div class="login-img" :style="note"></div>
      <el-form  :model="loginForm" :rules="loginRules" ref="loginForm" v-loading='loading'>
        <el-form-item prop="username">
          <el-input v-model.trim="loginForm.username" size="medium" placeholder="用户名" maxlength="30">
            <i slot="suffix" class="el-input__icon">
              <svg-icon icon-class='user' style="font-size:22px;color:#666;margin-top:8px"></svg-icon>
            </i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model.trim="loginForm.password" size="medium" placeholder="密码" :type="pwdType" @keyup.native.enter="handleLogin" maxlength="30">
            <i slot="suffix" class="el-input__icon" @click="showPwd">
              <svg-icon :icon-class='pwdType === "password" ? "password":"logineye"' class="password-login"></svg-icon>
            </i>
          </el-input>
        </el-form-item>
        <el-form-item prop="userCode" v-if="show_code">
          <div class="login-flex">
            <el-input v-model.trim="loginForm.userCode" size="medium" placeholder="请输入图片验证码" maxlength="6"  @keyup.native.enter="handleLogin">
            </el-input>
            <img :src="img_src" alt="" title="" @click="get_img_code">
          </div>
        </el-form-item>
        <p class="forget-pwd">
          <span @click="$router.push({path:'/forgetpwd/phone'})">忘记密码了？</span>
        </p>
        <el-form-item>
          <el-button type="primary" class="login-button" size="medium" @click.prevent="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="login-qrcode">
        <div class="qrcode-block">
          <div id="and_qrcode" ref="and_qrcode" style="height:100px"></div>
          <div class="phone-btn">
            <svg-icon icon-class='Android'></svg-icon>
            <span>Android</span>
          </div>
        </div>
        <div class="qrcode-block">
          <div id="app_qrcode" ref="app_qrcode"  style="height:100px"></div>
          <div class="phone-btn">
            <svg-icon icon-class='Iphone'></svg-icon>
            <span>iphone</span>
          </div>
        </div>
    </div>
    <div class="copy">© 2017-2020 电子政务办 & 神航星云 联合出品</div>
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import QRCode from "qrcodejs2";
import {
  SET_USER_INFO,
  SET_USER_SIGN,
  SET_USER_TOKEN
} from "@/store/mutations";
import config from "@/config";
export default {
  name: "login",
  components: { QRCode },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    // const validatePass = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error("密码不能小于6位"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      loginForm: {
        username: "",
        password: "",
        userCode: ""
      },
      note: {
        backgroundImage: "url(" + require("@/assets/imgs/logo2.png") + ")"
      },
      note1: {
        backgroundImage: "url(" + require("@/assets/imgs/bodybg.jpg") + ")"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
        userCode: [
          {
            required: true,
            trigger: "change",
            message: "请输入图片验证码"
          }
        ]
      },
      loading: false,
      pwdType: "password",
      app_loading: true,
      apple_qrcode: null,
      android_qrcode: null,
      show_code: false,
      img_src: ""
    };
  },
  created() {
    this.$nextTick(res => {
      this.android_qrcode = new QRCode("and_qrcode", {
        width: 100, // 设置宽度
        height: 100 // 设置高度
      });
      this.apple_qrcode = new QRCode("app_qrcode", {
        width: 100, // 设置宽度
        height: 100 // 设置高度
      });
      var iosUrl = localStorage.getItem("iosUrl");
      if (iosUrl) {
        this.app_qrcode(iosUrl);
      }
      var androidUrl = localStorage.getItem("androidUrl");
      if (androidUrl) {
        this.and_qrcode(androidUrl);
      }
    });
    this.getQRURL();
  },
  methods: {
    //获取图片验证码
    get_img_code() {
      this.$axios({
        url: config + "gwt/getValidateCode",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzUxMiJ9.eyJyYW5kb21LZXkiOiJvdnp4NjIiLCJzdWIiOiIwMzY1MV80NzIxY2ZlMS05ZjliLTRhMmYtYmE3NS1iZDY3N2M5ODFhNTYiLCJleHAiOjE1MzY2NjM2MDMsImlhdCI6MTUzNjA1ODgwM30.K4SzgVFE28vZCmdXYOIZkoKM6uZLjUYoJdtSAkFWtyiwEalte72mtYRftmsKFbAft7IZrn-IC_16kc-CA3nwJw"
        },
        responseType: "blob"
      })
        .then(res => {
          this.img_src = window.URL.createObjectURL(res.data);
        })
        .catch(res => {
          console.log(res);
        });
    },
    //获取二维码下载地址
    getQRURL() {
      this.app_loading = true;
      this.$get("gwt/getQRCodeUrl")
        .then(res => {
          this.app_loading = false;
          if (res.result !== "0000") {
            return;
          }
          localStorage.setItem("iosUrl", res.data.iosUrl);
          localStorage.setItem("androidUrl", res.data.androidUrl);
          this.app_qrcode(res.data.iosUrl);
          this.and_qrcode(res.data.androidUrl);
        })
        .catch(res => {
          this.app_loading = false;
        });
    },
    app_qrcode(text) {
      this.apple_qrcode.makeCode(text);
    },
    and_qrcode(text) {
      this.android_qrcode.makeCode(text);
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$post(
            "gwt/login",
            {
              username: this.loginForm.username,
              password: this.loginForm.password,
              userCode: this.loginForm.userCode,
              loginCodeFlag: false
            },
            "json"
          )
            .then(res => {
              this.loading = false;
              if (!res.data.code) {
                this.$swal({
                  title: "登陆失败",
                  text: res.msg,
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  showConfirmButton: true
                });
                return;
              }
              if (res.data.code === "usererror") {
                this.show_code = true;
                this.get_img_code();
                this.$swal({
                  title: "登陆失败",
                  text: `用户名或密码错误,剩余${res.data.resCounts}次重试机会`,
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  showConfirmButton: true
                });
              } else if (res.data.code === "locked") {
                this.$swal({
                  title: "登陆失败",
                  text: `用户名或密码错误次数上限,账号已被锁定,请${
                    res.data.locktime
                  }后再操作`,
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  showConfirmButton: true
                });
              } else if (res.data.code === "unauthorized") {
                this.$router.push({
                  path: "/login/message"
                });
                this.$store.commit(SET_USER_INFO, res.data);
                this.$store.commit(SET_USER_TOKEN, "Bearer " + res.data.token);
                this.$store.commit(SET_USER_SIGN, res.data.randomKey);
              } else if (res.data.code === "firstlogin") {
                this.$router.push({
                  path: "/firstlogin"
                });
                this.$store.commit(SET_USER_INFO, res.data);
                this.$store.commit(SET_USER_TOKEN, "Bearer " + res.data.token);
                this.$store.commit(SET_USER_SIGN, res.data.randomKey);
              } else {
                this.$store.commit(SET_USER_INFO, res.data);
                this.$store.commit(SET_USER_TOKEN, "Bearer " + res.data.token);
                this.$store.commit(SET_USER_SIGN, res.data.randomKey);
                this.$message({
                  type: "success",
                  message: "登录成功！"
                });
                this.$router.push({ path: "/message/index" });
                //这里写一下初始化的数据
                this.$store.dispatch("get_meeting_type_list");
              }
            })
            .catch(res => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.password-login {
  font-size: 16px;
  color: #666;
  margin-right: 2px;
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
.login-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    display: inline-block;
    width: 100%;
    height: 36px;
    border-radius: 4px;
    border: solid 1px #e6e6e6;
    margin-left: 12px;
    cursor: pointer;
  }
}
.login-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: linear-gradient(to bottom, #001f79, #1e74c7, #80ddff);
  .login-form {
    width: 360px;
    background-color: #fff;
    margin: 0 auto;
    background: #fff;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 3px 0 rgba(12, 12, 12, 0.03);
    border-radius: 3px;
    padding: 30px 30px 0 30px;
    margin-top: 10%;
    .login-img {
      height: 59px;
      background-position: center top;
      background-repeat: no-repeat;
      margin-bottom: 10px;
    }
    .login-button {
      width: 100%;
    }
    .forget-pwd {
      font-size: 13px;
      color: #337ab7;
      margin-top: 0px;
      margin-bottom: 12px;
      cursor: pointer;
      &:hover {
        color: #37aeeb;
      }
    }
  }
  .login-qrcode {
    width: 360px;
    margin: 0 auto;
    display: flex;
    margin-top: 40px;
    .qrcode-block {
      text-align: center;
      flex: 1;
      #app_qrcode,
      #and_qrcode {
        img {
          background-color: #fff;
          padding: 2px;
          margin: 0 auto;
        }
      }
      .phone-btn {
        color: #fff;
        border-color: #fff;
        height: 40px;
        line-height: 40px;
        border-radius: 5px;
        padding-left: 14px;
        padding-right: 17px;
        margin-top: 20px;
        display: inline-block;
        border: 1px solid #e7eaec;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
  .copy {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 12px;
    text-align: center;
    font-size: 14px;
    line-height: 24px;
    color: #fff;
  }
}
</style>

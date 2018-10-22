<template>
<div class="login-container" :style="note1">
  <div class="login-main">
    <div  class="loign-logo">
      <img :src="require('@/assets/login/logo.png')" alt="">
    </div>
  <div class="new-login-form" v-loading='loading'>
    <h3>登录</h3>
    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" >
      <el-form-item prop="username">
        <div class="input-img">
          <el-input v-model.trim="loginForm.username"  placeholder="请输入用户名" maxlength="30">
          </el-input>
          <img :src="require('@/assets/login/user.png')" alt="" class="icon">
        </div>
      </el-form-item>
      <!-- <input type="password" style="position:absolute;z-index:100;opacity:0;width:0;height:0"> -->

      <el-form-item prop="password">
        <div class="input-img">
          <el-input v-model.trim="loginForm.password" placeholder="请输入密码" 
            :type="pwdType" @keyup.native.enter="handleLogin"
            maxlength="30">
          </el-input>
          <img :src="require('@/assets/login/pwd.png')" alt="" class="icon">
        </div>
      </el-form-item>
      <el-form-item prop="userCode" v-if="show_code">
        <div class="login-flex">
        <div class="input-img">
            <el-input v-model.trim="loginForm.userCode"  placeholder="请输入验证码" maxlength="6"
              @keyup.native.enter="handleLogin">
            </el-input>
            <img :src="require('@/assets/login/code.png')" alt="" class="icon">
        </div>
          <img :src="img_src" alt="" title="" @click="get_img_code" class="code">
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-button"  @click.prevent="handleLogin" style="width:100%;margin-top:10px">登录</el-button>
      </el-form-item>
    </el-form>
    <p class="forget-pwd">
        <span @click="$router.push({path:'/forgetpwd/phone'})">忘记密码</span>
      </p>
    <div class="login-qrcode">
      <div class="qrcode-block">
        <div id="and_qrcode" ref="and_qrcode" style="height:100px"></div>
        <div class="phone-btn">
          <img :src="require('@/assets/login/安卓icon.png')" alt="" class="icon">
         <a :href="and_QRCode"><span> Android 下载</span></a>
        </div>
      </div>
      <div class="qrcode-block">
        <div id="app_qrcode" ref="app_qrcode" style="height:100px"></div>
        <div class="phone-btn">
            <img :src="require('@/assets/login/苹果icon.png')" alt="" class="icon">
          <span>IOS 下载</span>
        </div>
      </div>
    </div>
    <div class="qq_qq">
      <div class="qrcode-block">QQ群（ <span>166179255</span>  ）</div>
      <div class="qrcode-block">客服（ <span><a href="tencent://message/?uin=656074767&Site=http://vps.shuidazhe.com&Menu=yes">656074767</a></span> ）</div>
    </div>
  </div>
    </div>
    <div class="copy">© 2017-2020 电子政务办 & 神航星云 联合出品</div>
</div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import QRCode from "qrcodejs2";
import Cookies from "js-cookie";
import {
  SET_USER_INFO,
  SET_USER_SIGN,
  SET_USER_TOKEN,
  SET_IS_ADMIN,
  SET_GROUP_LIST
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
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于8位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        userCode: ""
      },
      note1: {
        backgroundImage: "url(" + require("@/assets/login/background.png") + ")"
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
      img_src: "",
      and_QRCode: ""
    };
  },
  created() {
    var equipmentUuid = localStorage.getItem("equipmentUuid");
    var equipmentUuidKey = localStorage.getItem("equipmentUuidKey");
    Cookies.set(equipmentUuidKey, equipmentUuid);
    this.$nextTick(res => {
      this.android_qrcode = new QRCode("and_qrcode", {
        width: 80, // 设置宽度
        height: 80 // 设置高度
      });
      this.apple_qrcode = new QRCode("app_qrcode", {
        width: 80, // 设置宽度
        height: 80 // 设置高度
      });
      this.app_qrcode(
        "https://itunes.apple.com/us/app/gwt/id1255423292?l=zh&ls=1&mt=8"
      );
      this.and_qrcode("https://meet1.inetgov.com/apk/gwt_android.apk");
    });
    // this.getQRURL();
    sessionStorage.removeItem("login-info");
    sessionStorage.removeItem("login-user-phone");
    sessionStorage.setItem("gwt-current-silder", "0");
    sessionStorage.setItem("gwt-current-silder-child", "-1");
    sessionStorage.setItem("set-forget", "false");
  },
  methods: {
    //获取图片验证码
    get_img_code() {
      this.$axios({
        url: config + "gwt/getValidateCode",
        headers: {
          userAgent: "PC"
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
          this.and_QRCode = res.data.androidUrl;
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
    set_vuex_data(res) {
      this.$store.commit(SET_USER_INFO, res.data.loginInfo.sysUser);
      this.$store.commit(SET_USER_TOKEN, "Bearer " + res.data.token);
      this.$store.commit(SET_USER_SIGN, res.data.randomKey);
      this.$store.commit(SET_IS_ADMIN, res.data.isAdmin);
      this.$store.commit(SET_GROUP_LIST, res.data.sysAllOrgs);
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
              if (res.data.code === "userdelete") {
                this.$swal({
                  title: "登陆失败",
                  text: `该用户名不存在`,
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  showConfirmButton: true
                });
              } else if (res.data.code === "userdisable") {
                this.$swal({
                  title: "登陆失败",
                  text: `用户已被停用，请联系管理员`,
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  showConfirmButton: true
                });
              } else if (res.data.code === "usererror") {
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
                this.set_vuex_data(res);
                this.$router.push({
                  path: "/login/message"
                });
              } else if (res.data.code === "firstlogin") {
                this.set_vuex_data(res);
                this.$router.push({
                  path: "/firstlogin"
                });
              } else if (res.data.code === "authorized") {
                this.set_vuex_data(res);
                this.$message({
                  type: "success",
                  message: "登录成功！"
                });
                sessionStorage.setItem("login-info", Math.random());
                this.$router.push({ path: "/user-message/index" });
                //这里写一下初始化的数据
                this.$store.dispatch("get_meeting_type_list");
                this.$store.dispatch("get_part_tree");
              } else {
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
            })
            .catch(res => {
              console.log(res);
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
.qq_qq {
  margin-top: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  span {
    color: #3ba4f5;
  }
}
.login-container {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  .login-main {
    width: 1100px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .login-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .code {
      display: inline-block;
      width: 60%;
      height: 40px;
      border-radius: 4px;
      border: solid 1px #e6e6e6;
      margin-left: 12px;
      cursor: pointer;
    }
  }
  .loign-logo {
    img {
      width: 400px;
    }
  }
  .new-login-form {
    margin-left: 200px;
    width: 440px;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 8px;
    padding: 30px 60px;
    h3 {
      color: rgb(59, 164, 245);
      font-size: 30px;
      font-weight: normal;
      margin-bottom: 40px;
      margin-top: 30px;
      line-height: 0;
      text-align: center;
    }
    .input-img {
      position: relative;
      .el-input {
        input {
          padding-left: 40px;
        }
      }
      .icon {
        position: absolute;
        top: 7px;
        left: 12px;
        width: 24px;
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
  .forget-pwd {
    font-size: 16px;
    color: rgb(59, 164, 245);
    margin-top: 0px;
    margin-bottom: 12px;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: #37aeeb;
    }
  }
  .login-qrcode {
    margin: 0 auto;
    display: flex;
    margin-top: 20px;
    .qrcode-block {
      text-align: center;
      flex: 1;
      #app_qrcode,
      #and_qrcode {
        img {
          background-color: #fff;
          padding: 4px;
          margin: 0 auto;
        }
      }
      .phone-btn {
        color: #000;
        border-color: #fff;
        border-radius: 5px;
        padding-left: 14px;
        padding-right: 17px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
        vertical-align: middle;
        img {
          width: 24px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>

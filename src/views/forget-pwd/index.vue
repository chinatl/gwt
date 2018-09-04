<template>
  <div class="forget-page">
      <div class="forget-content">
          <ul class="forget-tab">
              <li class="current"><span>1</span>验证手机号</li>
              <li :class="current > 1 ? 'current':''"><span>2</span>验证身份</li>
              <li :class="current > 2 ? 'current':''"><span>3</span>重置密码</li>
              <li :class="current > 3 ? 'current':''"><span>4</span>成功</li>
          </ul>
          <div class="forget-con">
            <transition name='show' mode="out-in">
                <router-view></router-view>
            </transition>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    current() {
      if (this.$route.name === "验证手机号") {
        return 1;
      } else if (this.$route.name === "验证身份") {
        return 2;
      } else if (this.$route.name === "重置密码") {
        return 3;
      } else {
        return 4;
      }
    }
  },
  methods: {
    return_login() {
      this.$router.push({
        path: "/login"
      });
    },
    next_step() {
      if (this.current === 1) {
        this.$router.push({
          path: "/forgetpwd/identity"
        });
      } else if (this.current === 2) {
        this.$router.push({
          path: "/forgetpwd/reset"
        });
      } else {
        this.$router.push({
          path: "/forgetpwd/finish"
        });
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.forget-page {
  background-color: #f3f3f4;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .forget-content {
    width: 800px;
    box-shadow: 3px 3px 4px #ccc;
    border-radius: 5px;
    border: solid 1px #e3eaf2;
    margin: 100px auto;
    background-color: #fff;
    .forget-tab {
      display: flex;
      text-align: center;
      height: 74px;
      line-height: 74px;
      li {
        flex: 1;
        color: #bbb;
        cursor: default;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 2px;
        &.current {
          color: #45c3d2;
          span {
            background-color: #45c3d2;
            border: solid 3px #c7ecf2;
          }
        }
        span {
          color: #fff;
          width: 28px;
          height: 28px;
          border-radius: 50px;
          background-color: #bbb;
          border: solid 3px #fff;
          display: inline-block;
          vertical-align: baseline;
          margin-right: 8px;
          font-size: 18px;
          line-height: 23px;
          padding-left: 2px;
        }
      }
    }
    .forget-con {
      height: 332px;
      background-color: rgb(250, 250, 250);
      border-bottom: solid 1px #e3eaf2;
    }
  }
}
</style>


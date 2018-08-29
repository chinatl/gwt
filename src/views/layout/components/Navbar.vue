<template>
  <div class="nav-class" :style="{left:!sidebar.opened ? '36px':'180px'}">
      <div class="user-info">
        <div class="left-part">
            <div class="hamburger-containe" @click="toggleSideBar"> 
                <svg-icon icon-class="菜单" />
            </div>
            <Breadcrumb /> 
        </div>
        <div class="right-part">
          <span>当前部门：</span>
          <span class="value">超级管理员机构<svg-icon icon-class="刷新" /></span>
          <span class="user-pic">
            <svg-icon icon-class="头像" />
          </span>
           <el-dropdown  @command='has_command'>
            <span class="el-dropdown-link" style="cursor:pointer">
                超级管理员<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="user">个人中心</el-dropdown-item>
                <el-dropdown-item command="b">安全退出</el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
        </div>
      </div>
      <div class="history-list">
        <tags-view></tags-view>
      </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ScrollPane from "@/components/ScrollPane";
import tagsView from "./TagsView";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ScrollPane,
    tagsView
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "visitedViews"])
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  methods: {
    has_command(e) {
      if (e === "user") {
        this.$router.push({
          path: "/person-center/index"
        });
      } else {
        this.$router.push({
          path: "/login"
        });
      }
    },
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    isActive(route) {
      return route.path === this.$route.path;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      if (!tags) {
        return;
      }
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el);
            break;
          }
        }
      });
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
.nav-class {
  height: 80px;
  position: fixed;
  top: 0;
  left: 180px;
  right: 0;
  z-index: 20;
  background-color: #f3f3f4;
  transition: left 0.1s;
  .user-info {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    .left-part {
      padding-top: 16px;
      .hamburger-containe {
        font-size: 20px;
        // background-color: #3ba4f5;
        // padding: 6px 12px;
        color: #000;
        border-radius: 4px;
        float: left;
        margin-top: 12px;
        margin-right: 4px;
        &:hover {
          color: #3ba4f5;
          cursor: pointer;
        }
      }
    }
    .right-part {
      font-size: 13px;
      color: #676a6c;
      padding: 0 20px;
      .value {
        color: #337ab7;
        font-weight: 600;
        margin: 0px 8px;
        .svg-icon {
          margin-left: 6px;
          font-size: 18px;
        }
      }
      .user-pic {
        font-size: 32px;
        margin: 0 10px;
      }
    }
  }
  .history-list {
    background: #fff;
    height: 34px;
    border-bottom: 1px solid #d8dce5;
    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
      0 0 3px 0 rgba(0, 0, 0, 0.04);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    .tags-view-wrapper {
      background: #fff;
      height: 34px;
      border-bottom: 1px solid #d8dce5;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
      .tags-view-item {
        display: inline-block;
        position: relative;
        height: 26px;
        line-height: 26px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 5px;
        margin-top: 4px;
        &:first-of-type {
          margin-left: 15px;
        }
        &.active {
          background-color: #42b983;
          color: #fff;
          border-color: #42b983;
          &::before {
            content: "";
            background: #fff;
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            position: relative;
            margin-right: 2px;
          }
        }
      }
    }
  }
}
.tags-view-container {
  .tags-view-wrapper {
    background: #fff;
    height: 34px;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>


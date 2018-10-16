<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <div class="gwt-slider" v-loading='slider_loading'
    element-loading-background="rgba(0, 0, 0, 0.5)"
    >
      <div class="gwt-logo"  style="height:48px;text-align:center">
          <img :src="require('@/assets/imgs/logox.png')" alt="" v-if="sidebar.opened" style="width:180px;padding:12px 12px 6px 12px">
          <img :src="require('@/assets/imgs/glogo.png')" alt="" v-else style="margin-top:8px;cursor:pointer" @click="toggleSideBar">
      </div>
      <div  v-for="(item,index) in slider_list" :key="index" :class="sidebar.opened ? 'gwt-slider-item' : 'hide-item'">
        <div class="gwt-title" @click="go_route(item,index)" :class="get_current(item)">
          <el-tooltip class="item" effect="dark" :content="item.resName" placement="right" v-if="!sidebar.opened">
            <span class="title-icon"><svg-icon :icon-class='item.resName'></svg-icon></span>
          </el-tooltip>
          <span v-else><svg-icon :icon-class='item.resName'></svg-icon></span>
          <span class="hide">{{item.resName}}</span>
          <i class="el-icon-arrow-right" v-if="item.children && !item.isShow && item.children.length"></i>
          <i class="el-icon-arrow-down" v-if="item.children && item.isShow &&  item.children.length"></i>
        </div>
        <collapse-transition>
          <ul class="gwt-child" v-show="item.isShow && sidebar.opened">
            <li v-for="(li_item,li_index) in item.children"
              :class="get_current(li_item)"
             :key="li_index" @click="push_page(li_item,li_index)">{{li_item.resName}}</li>
          </ul>
      </collapse-transition>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import "element-ui/lib/theme-chalk/base.css";
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
import { SET_IS_ADMIN } from "@/store/mutations";
export default {
  components: {
    CollapseTransition
  },
  data() {
    return {
      current: 0,
      child_current: -1,
      silder_list: [],
      loading: true
    };
  },
  computed: {
    ...mapGetters([
      "sidebar",
      "is_admin",
      "slider_list",
      "slider_loading",
      "levelList"
    ])
  },
  methods: {
    get_current(item) {
      if (
        this.$route.path === item.resUrl ||
        this.levelList.map(res => res.path).includes(item.resUrl)
      ) {
        return "current";
      } else {
        return "";
      }
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    push_page(item, index) {
      this.child_current = index;
      sessionStorage.setItem("gwt-current-silder-child", index);
      this.$router.push(item.resUrl + "?t=" + Date.now());
    },
    go_route(item, index) {
      if (!this.sidebar.opened) {
        this.$store.dispatch("ToggleSideBar");
      }
      this.current = index;
      this.child_current = -1;
      sessionStorage.setItem("gwt-current-silder-child", -1);
      sessionStorage.setItem("gwt-current-silder", index);
      if (item.children && item.children.length) {
        for (var i = 0; i < this.slider_list.length; i++) {
          if (i !== index) {
            this.slider_list[i].isShow = false;
          }
        }
        this.slider_list[index].isShow = !this.slider_list[index].isShow;
        this.$set(this.slider_list, index, this.slider_list[index]);
      } else {
        this.$router.push(item.resUrl + "?t=" + Date.now());
      }
    }
  },
  created() {
    var current = sessionStorage.getItem("gwt-current-silder");
    var child_current = sessionStorage.getItem("gwt-current-silder-child");
    this.current = current ? current - 0 : 0;
    this.child_current = child_current ? child_current - 0 : -1;
    this.$store.dispatch("get_slider_list");
    // this.get_menu_list();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.gwt-slider {
  width: 100%;
  height: 100%;
  background-color: rgb(48, 65, 86);
  color: rgb(191, 203, 217);
  font-size: 14px;
  .gwt-logo {
    // img {
    //   width: 180px;
    //   padding: 20px 10px;
    // }
  }
  .hide-item {
    .gwt-title {
      background-color: rgb(48, 65, 86);
      height: 56px;
      line-height: 56px;
      transition: backgroundColor 0.5s;
      position: relative;
      cursor: pointer;
      .title-icon {
        height: 56px;
        width: 36px;
        display: block;
        text-align: center;
        padding: 0 10px;
      }
      &.current {
        color: rgb(64, 158, 255);
        background-color: rgb(38, 52, 69);
      }
      .hide {
        display: none;
      }
      i {
        display: none;
        float: right;
        margin-top: 22px;
      }
      &:hover {
        color: rgb(64, 158, 255);
        background-color: rgb(38, 52, 69);
      }
    }
  }
  .gwt-slider-item {
    .gwt-title {
      background-color: rgb(48, 65, 86);
      height: 56px;
      line-height: 56px;
      padding-left: 20px;
      padding-right: 20px;
      transition: backgroundColor 0.5s;
      position: relative;
      cursor: pointer;
      &.current {
        color: rgb(64, 158, 255);
        background-color: rgb(38, 52, 69);
      }
      cursor: pointer;
      i {
        float: right;
        margin-top: 22px;
      }
      &:hover {
        color: rgb(64, 158, 255);
        background-color: rgb(38, 52, 69);
      }
    }
  }
  .gwt-child {
    background-color: #1f2d3d;
    overflow: hidden;
    line-height: 56px;
    li {
      padding-left: 45px;
      height: 56px;
      cursor: pointer;
      &.current {
        color: rgb(64, 158, 255);
      }
      &:hover {
        color: rgb(64, 158, 255);
        background-color: rgb(0, 21, 40);
      }
    }
  }
}
</style>


<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <div class="gwt-slider">
      <div class="gwt-logo">
          <img :src="require('@/assets/imgs/logox.png')" alt="">
      </div>
      <div class="gwt-slider-item" v-for="(item,index) in silder_list" :key="index">
        <div class="gwt-title" @click="go_route(item,index)" :class="current === index ? 'current':''">
          <span></span>
          {{item.resName}}
          <i class="el-icon-arrow-right" v-if="item.children && !item.isShow && item.children.length"></i>
          <i class="el-icon-arrow-down" v-if="item.children && item.isShow &&  item.children.length"></i>
        </div>
        <collapse-transition>
          <ul class="gwt-child" v-show="item.isShow">
            <li v-for="(li_item,li_index) in item.children"
              :class="child_current === li_index ? 'current' : '' "
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
import { SET_SILDER_LIST, SET_IS_ADMIN } from "@/store/mutations";
export default {
  components: {
    CollapseTransition
  },
  data() {
    return {
      current: 0,
      child_current: -1,
      silder_list: []
    };
  },
  computed: {
    ...mapGetters(["sidebar", "slierbar_list", "is_admin"])
  },
  methods: {
    push_page(item, index) {
      this.child_current = index;
      sessionStorage.setItem("gwt-current-silder-child", index);
      this.$router.push(item.resUrl);
    },
    go_route(item, index) {
      this.current = index;
      this.child_current = -1;
      sessionStorage.setItem("gwt-current-silder-child", -1);
      sessionStorage.setItem("gwt-current-silder", index);
      if (item.children && item.children.length) {
        for (var i = 0; i < this.silder_list.length; i++) {
          if (i !== index) {
            this.silder_list[i].isShow = false;
          }
        }
        this.silder_list[index].isShow = !this.silder_list[index].isShow;
        this.$set(this.silder_list, index, this.silder_list[index]);
      } else {
        this.$router.push(item.resUrl);
      }
    }
  },
  created() {
    var current = sessionStorage.getItem("gwt-current-silder");
    var child_current = sessionStorage.getItem("gwt-current-silder-child");
    this.current = current ? current - 0 : 0;
    this.child_current = child_current ? child_current - 0 : -1;
    this.$store.dispatch("readSession", SET_SILDER_LIST);
    this.$store.dispatch("readSession", SET_SILDER_LIST);

    var newArr = [];
    var appArr = [];
    for (var i = 0; i < this.slierbar_list.length; i++) {
      if (this.slierbar_list[i].remark === "0") {
        if (this.slierbar_list[i].parentId === "-1") {
          newArr.push(this.slierbar_list[i]);
        }
      } else {
        if (this.is_admin) {
          if (this.slierbar_list[i].parentId === "0") {
            appArr.push(this.slierbar_list[i]);
          }
        } else {
          appArr.push(this.slierbar_list[i]);
        }
      }
    }
    for (var k = 0; k < appArr.length; k++) {
      appArr[k].children = [];
      appArr[k].isShow = false;
      for (var i = 0; i < this.slierbar_list.length; i++) {
        if (this.slierbar_list[i].parentId === appArr[k].resId) {
          appArr[k].children.push(this.slierbar_list[i]);
        }
      }
    }
    for (var j = 0; j < newArr.length; j++) {
      newArr[j].children = [];
      newArr[j].isShow = false;
      for (var i = 0; i < this.slierbar_list.length; i++) {
        if (
          this.slierbar_list[i].appId === newArr[j].resId &&
          this.slierbar_list[i].resId !== newArr[j].resId
        ) {
          newArr[j].children.push(this.slierbar_list[i]);
        }
      }
    }
    this.silder_list = [
      {
        resName: "我的消息",
        resUrl: "/user-message/index"
      },
      ...appArr,
      ...newArr,
      {
        resName: "通讯录",
        resUrl: "/mail-list/index"
      },
      {
        resName: "云盘",
        children: [
          {
            resName: "个人云盘",
            resUrl: "/user-cloud-disk/index"
          },
          {
            resName: "部门云盘",
            resUrl: "/part-cloud-disk/index"
          }
        ]
      }
    ];
    if (this.child_current !== -1) {
      this.silder_list[this.current].isShow = true;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.gwt-slider {
  width: 100%;
  height: 100%;
  background-color: #273240;
  color: rgb(191, 203, 217);
  font-size: 14px;
  .gwt-logo {
    img {
      width: 180px;
      padding: 20px 10px;
    }
  }
  .gwt-title {
    background-color: #273240;
    height: 56px;
    line-height: 56px;
    padding-left: 30px;
    padding-right: 20px;
    transition: backgroundColor 0.5s;
    &.current {
      color: #fff;
      background-color: #202e3e;
    }
    cursor: pointer;
    i {
      float: right;
      margin-top: 16px;
    }
    &:hover {
      color: #fff;
      background-color: #202e3e;
    }
  }
  .gwt-child {
    background-color: #273240;
    overflow: hidden;
    line-height: 56px;
    li {
      padding-left: 45px;
      height: 56px;
      cursor: pointer;

      &.current {
        color: #fff;
        background-color: #202e3e;
      }
      &:hover {
        color: #efefef;
        background-color: #202e3e;
      }
    }
  }
}
</style>


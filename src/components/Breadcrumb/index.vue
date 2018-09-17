<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{item.meta.title}}</span>
        <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb();
  },
  data() {
    return {};
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  computed: {
    levelList() {
      return this.$store.getters.levelList;
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name);
      const second = matched[matched.length - 1];
      if(!second){
        return
      }
      if (second.meta.temp) {
        second.meta.title = this.$store.getters.field_manager_data.name;
      }
      if (second.meta.up) {
        var newArr = [];
        for (var i = 0; i < this.levelList.length; i++) {
          if (this.levelList[i].path === second.path) {
            break;
          }
          newArr.push(this.levelList[i]);
        }
        newArr.push(second);
        this.$store.commit("SET_LEVELLIST", newArr);
      } else {
        const first = matched[0];
        if (first && first.name !== "首页") {
          matched = [{ path: "/dashboard", meta: { title: "首页" } }].concat(
            matched
          );
        }
        this.$store.commit("SET_LEVELLIST", matched);
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 10px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>

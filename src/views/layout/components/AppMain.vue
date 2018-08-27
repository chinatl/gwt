<template>
  <section class="app-main">
      <transition name="fade" mode="out-in">
        <!-- <router-view :key="key"></router-view> -->
        <router-view></router-view>
      </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.app-main {
  /*50 = navbar  */
  /* min-height: calc(100vh - 50px); */
  position: relative;
  overflow: hidden;
  padding: 100px 30px 20px 30px;
  background-color: #f3f3f4;
}
</style>

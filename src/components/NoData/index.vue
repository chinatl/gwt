<template>
    <div class="no-data">
        <img :src="src" alt="">
        <p>暂无数据</p>
    </div>
</template>
<script>
import noData from "@/assets/imgs/no-data.png";
export default {
  data() {
    return {
      src: noData
    };
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.no-data {
  padding: 60px;
  text-align: center;
  p {
    margin: 40px;
    font-size: 28px;
    color: rgb(103, 106, 108);
  }
}
</style>

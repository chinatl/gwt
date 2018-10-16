<template>
    <div class="arrow-button">
        <span>排序：</span>
        <span class="direction-btn" @click="setTop">
            <svg-icon icon-class='置顶'></svg-icon>
        </span>
        <span class="direction-btn" @click="top">
            <svg-icon icon-class='上箭头'></svg-icon>
        </span>
        <span class="direction-btn" @click="bottom">
            <svg-icon icon-class='下箭头'></svg-icon>
        </span>
        <span class="direction-btn" @click="setBottom">
            <svg-icon icon-class='置底'></svg-icon>
        </span>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    setTop() {
      this.$emit("setTop");
    },
    top() {
      this.$emit("top");
    },
    bottom() {
      this.$emit("bottom");
    },
    setBottom() {
      this.$emit("setBottom");
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.arrow-button {
  display: inline-block;
  font-size: 14px;
  line-height: 30px;
  .direction-btn {
    background-color: #23c6c8;
    color: #fff;
    text-align: center;
    width: 35px;
    display: inline-block;
    border-radius: 4px;
    cursor: pointer;
    font-size: 24px;
    line-height: 30px;
    margin-left: 4px;
    opacity: 1;
    &:hover {
      opacity: 0.7;
    }
    &:active {
      opacity: 1;
    }
  }
}
</style>

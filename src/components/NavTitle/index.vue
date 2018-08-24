<template>
    <div class="nav-title">
        {{title}}
        <span class="secret" v-if='warning'><svg-icon icon-class='警告'></svg-icon> 请勿处理涉密信息！</span>
        <slot></slot>
    </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: {
    title: {
      type: String
    },
    warning: {
      default: false,
      type: Boolean
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.nav-title {
  background-color: rgb(255, 255, 255);
  -webkit-border-image: none;
  color: inherit;
  margin-bottom: 0px;
  min-height: 48px;
  border-radius: 6px 6px 0px 0px;
  font-size: 24px;
  font-weight: 600;
  padding: 15px 20px 15px 40px;
  color: #37aeeb;
  position: relative;
  border-bottom: 2px solid #efefef;
  &::before {
    height: 24px;
    width: 8px;
    background-color: #37aeeb;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    display: inline-block;
    position: absolute;
    left: 0px;
    top: 16px;
    content: "";
  }
  .el-button {
    float: right;
    margin-top: -4px;
  }
  .secret {
    font-size: 16px;
    font-weight: 200;
    color: #ff0000;
    vertical-align: bottom;
    margin-left: 40px;
    .svg-icon {
      font-size: 24px;
      margin-right: 6px;
    }
  }
}
</style>

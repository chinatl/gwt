<template>
    <div class="two-layout">
        <div class="left-block">
            <slot name="left"></slot>
        </div>
        <div class="right-block">
            <slot name="right"></slot>
        </div>
        <slot name='else'></slot>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
.two-layout {
  overflow: hidden;
  .left-block,
  .right-block {
    background-color: #fff;
    border-radius: 6px;
    padding-bottom: 20px;
  }
  .left-block {
    width: 24%;
    float: left;
  }
  .right-block {
    width: 75%;
    float: right;
  }
}
</style>

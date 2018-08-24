<template>
    <el-upload
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-change="upload_img"
    :show-file-list="false"
    :auto-upload="false">
        <el-button :size='size' :type="type" :icon="icon">
            <slot></slot>
        </el-button>
    </el-upload>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    type: {
      default: "primary",
      type: String
    },
    icon: {
      default: "el-icon-plus",
      type: String
    },
    size: {
      default: "small",
      type: String
    }
  },
  methods: {
    upload_img(e) {
      this.$emit("on-change", e);
    }
  }
};
</script>

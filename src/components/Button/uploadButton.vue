<template>
    <el-upload
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-change="upload_img"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :auto-upload="false">
        <el-button :size='size' :type="type" :icon="icon" v-wave>
            <slot></slot>
        </el-button>
    </el-upload>
</template>
<script>
import { fileType } from "@/utils";
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
      console.log(e);
      if (e.size / 1024 / 1024 > 20) {
        this.$message({
          message: "请上传20M以内的文件",
          type: "error"
        });
        return;
      }
      if (fileType(e.name) === "unknown") {
        this.$message({
          message: "不支持的文件类型",
          type: "error"
        });
        return;
      }
      this.$emit("on-change", e);
    },
    beforeAvatarUpload(file) {
      this.$emit("beforeUpload", file);
    }
  }
};
</script>

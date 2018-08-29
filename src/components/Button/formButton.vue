<template>
    <el-form-item align='right' style="padding-top:6px">
        <el-button :size="size" @click='onCancel' v-wave>{{cancel_name}}</el-button>
        <el-button type="primary" @click="onSubmit" :size="size" v-wave>{{submit_name}}</el-button>
    </el-form-item>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    cancel_name: {
      type: String,
      default: "取消"
    },
    submit_name: {
      type: String,
      default: "确定"
    },
    size: {
      type: String,
      default: "small"
    },
    cancel: {}
  },
  methods: {
    onCancel() {
      this.$emit("cancel");
    },
    onSubmit() {
      this.$emit("submit");
    }
  }
};
</script>

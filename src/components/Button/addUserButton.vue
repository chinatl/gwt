<template>
    <el-button :size='size' :type="type" :icon="icon" @click="click" class="add-user-button" v-wave><slot></slot></el-button>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    type: {
      default: "success",
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
    click(e) {
      this.$emit("click");
    }
  }
};
</script>
<style>
.add-user-button {
  width: 140px;
}
</style>


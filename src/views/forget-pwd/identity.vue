<template>
    <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="验证姓名:">
            <el-input v-model="form.name" size='medium' placeholder="请输入姓名"></el-input>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
  data() {
    return {
      form: {}
    };
  }
};
</script>
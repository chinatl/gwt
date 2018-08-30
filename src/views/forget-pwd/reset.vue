<template>
    <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="设置新密码:">
            <el-input v-model="form.name" size='medium' placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码:">
            <el-input v-model="form.name" size='medium' placeholder="请再次输入密码" maxlength="6"></el-input>
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
}
</script>
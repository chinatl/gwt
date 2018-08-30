<template>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="验证手机号:" prop="phone">
            <el-input v-model="form.name" size='medium' placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="验证码:">
            <div class='phone-flex'>
                <el-input v-model="form.name" placeholder="请输入手机号" maxlength="6" size='medium'></el-input>
                <el-button type="primary" style="margin-left:10px" size='medium'>获取验证码</el-button>
            </div>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
  data() {
    return {
      form: {},
      rules: {
        phone: [{ required: true, tigger: "blur", message: "必填" }]
      }
    };
  }
};
</script>
<style >
.phone-flex {
    display: flex;
    align-items: center;
}
</style>

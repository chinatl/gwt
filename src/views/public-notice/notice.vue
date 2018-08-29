<template>
    <div class="common">
        <t-title title="通知" warning></t-title>
        <div class="page-form">
              <el-form ref="form" :model="form" label-width="80px" :rules="rules"  class="demo-ruleForm">
                    <el-form-item label="标题" prop='name'>
                        <el-input v-model="form.name" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="接收部门">
                        <div class="flex">
                            <el-input v-model="form.name" size="small" placeholder="请选择接受部门"></el-input>
                            <add-user-button @click="yield_dialog= true">选择部门</add-user-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="接收人">
                        <div class="flex">
                            <el-input v-model="form.name" size="small"></el-input>
                            <add-user-button @click="dialog= true">选择接收人</add-user-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="通知简介">
                        <el-input type="textarea" v-model="form.desc" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                    </el-form-item>
                    <el-form-item label="附件">
                      <upload-button  @on-change="upload_img">添加附件</upload-button>
                      <file-list :list='file_list' @delete='delete_file'></file-list>
                    </el-form-item>
                    <el-form-item align='left'>
                        <el-checkbox v-model="form.checked"><span>我已确认本通知不含涉密信息</span></el-checkbox>
                    </el-form-item>
                    <form-button cancel_name='保持草稿' submit_name='发送'></form-button>
            </el-form>
        </div>
        <add-yield :show="yield_dialog" @ok='yield_dialog = false' @close='yield_dialog = false'></add-yield>
        <add-user :show='dialog' @close='dialog = false'></add-user>
    </div>
</template>
<script>
import fileList from "@/components/FileList";
import uploadButton from "@/components/Button/uploadButton";
import addUserButton from "@/components/Button/addUserButton";
import formButton from "@/components/Button/formButton";
import addUser from "@/components/AddUser";
import addYield from "@/components/AddYield";
export default {
  components: {
    fileList,
    addUser,
    uploadButton,
    addYield,
    addUserButton,
    formButton
  },
  data() {
    return {
      dialog: false,
      input: "",
      form: {
        name: "",
        name1: "",
        type: "",
        city: [],
        jiaose: ""
      },
      part: "1",
      rules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        name1: [{ required: true, message: "请输入部门全称", trigger: "blur" }],
        city: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        date: [{ required: true, message: "请选择开始时间", trigger: "blur" }]
      },
      file_list: [],
      yield_dialog: false //部门管理弹窗
    };
  },
  methods: {
    delete_file(index) {
      this.file_list.splice(index, 1);
    },
    upload_img(e) {
      this.file_list.push(e);
    },
    onSubmit() {},
    save_message() {},
    handleNodeClick() {}
  }
};
</script>

<template>
    <div class="common">
        <t-title title="创建通知" warning></t-title>
        <div class="page-form" v-loading='loading'>
              <el-form ref="form" :model="form" label-width="120px" :rules="rules"  class="demo-ruleForm">
                    <el-form-item label="标题" prop='noticeTitle'>
                        <el-input v-model="form.noticeTitle" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="签收截止时间" prop='endTime'>
                        <el-date-picker
                            v-model="form.endTime"
                            type="datetime"
                            size="small"
                            placeholder="结束时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="接收部门">
                        <div class="flex">
                            <el-input v-model="form.part" size="small" readonly placeholder="请选择接收部门"></el-input>
                            <add-user-button @click="yield_dialog= true">选择部门</add-user-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="通知简介">
                        <el-input type="textarea" v-model="form.noticeProfile" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                    </el-form-item>
                    <el-form-item label="附件">
                      <upload-button  @on-change="upload_img">添加附件</upload-button>
                      <file-list :list='file_list' @delete='delete_file'></file-list>
                    </el-form-item>
                    <el-form-item align='left'>
                        <el-checkbox v-model="form.checked"><span>我已确认本通知不含涉密信息</span></el-checkbox>
                    </el-form-item>
                    <form-button cancel_name='保持草稿' submit_name='发送' @submit="onSubmit"></form-button>
            </el-form>
        </div>
        <add-yield :show="yield_dialog" @submit='submit_part' @close='yield_dialog = false'></add-yield>
    </div>
</template>
<script>
import fileList from "@/components/FileList";
import uploadButton from "@/components/Button/uploadButton";
import addUserButton from "@/components/Button/addUserButton";
import formButton from "@/components/Button/formButton";
import addYield from "@/components/AddYield";
import { parseTime } from "@/utils";
export default {
  components: {
    fileList,
    uploadButton,
    addYield,
    addUserButton,
    formButton
  },
  data() {
    return {
      loading: false,
      form: {
        noticeTitle: "",
        endTime: "",
        noticeProfile: "",
        part: ""
      },
      rules: {
        noticeTitle: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ]
      },
      file_list: [],
      yield_dialog: false, //部门管理弹窗
      has_select_part: [],
      file_id_list: []
    };
  },
  methods: {
    //保存选择的部门
    submit_part(list) {
      this.yield_dialog = false;
      this.has_select_part = list;
      this.form.part = list.map(res => res.name).join(",");
    },
    delete_file(index) {
      this.$post("gwt/cloudisk/attachment/del", {
        id: this.file_id_list[index]
      }).then(res => {
        if (res.result !== "0000") {
          this.$swal({
            title: "上传失败！",
            text: res.msg,
            type: "error",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            showConfirmButton: true
          });
          return;
        }
        this.file_list.splice(index, 1);
        this.file_id_list.splice(index, 1);
      });
    },
    upload_img(e) {
      var formData = new FormData();
      formData.append("selectFile", e.raw);
      formData.append("ownerSystem", "gwt-platform");
      formData.append("ownerModule", "website");
      formData.append("ownerAperation", "undefined");
      formData.append("userId", "1");
      formData.append("uploadOpt", "add");
      formData.append("editFileId", "undefined");
      this.$post("gwt/uploadFile/upload", formData, "form")
        .then(res => {
          if (res.result !== "0000") {
            this.$swal({
              title: "上传失败！",
              text: res.msg,
              type: "error",
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "确定",
              showConfirmButton: true
            });
            return;
          }
          this.file_list.push(e);
          this.file_id_list.push(res.data.attachment.id);
        })
        .catch(res => {
          console.log(res);
        });
    },
    onSubmit() {
      if (!this.form.checked) {
        this.$message({
          message: "请勾选我已确认本消息不含涉密信息",
          type: "warning"
        });
        return;
      }
      this.loading = true;
      this.$post(
        "gwt/website/tbWebsite/save",
        {
          noticeId: "",
          noticeTitle: this.form.noticeTitle,
          noticeProfile: this.form.noticeProfile,
          endTime: parseTime(this.form.endTime, "{y}-{m}-{d} {h}:{i}:{s}"),
          attrArray: this.file_id_list.join(","),
          changeType: "",
          changeNoticeId: "",
          domainArray: "",
          orgArray: this.has_select_part.map(res => res.id.replace(/.*\D/g,'')).join(",")
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            this.$swal({
              title: "操作成功！",
              text: res.msg,
              type: "error",
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "确定",
              showConfirmButton: true
            });
            return;
          }
          this.$message({
            message: "创建成功！",
            type: "success"
          });
          this.$router.push({
            path: "/website-active/index"
          });
        })
        .catch(res => {
          this.loading = false;
        });
    },
    save_message() {},
    handleNodeClick() {}
  }
};
</script>

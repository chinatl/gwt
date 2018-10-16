<template>
    <div class="common">
      <t-title title="创建公告" ></t-title>
      <div class="page-form" v-loading='loading'>
          <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-form-item label="标题" prop='title'>
                <el-input v-model="form.title" size="small" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="接收部门">
                <div class="flex">
                    <el-input v-model="form.part" size="small" placeholder="请选择接收部门" readonly @click.native="yield_dialog= true"></el-input>
                    <add-user-button @click="add_part_dialog= true">选择部门</add-user-button>
                </div>
            </el-form-item>
            <el-form-item label="公告内容" prop="content">
                <el-input type="textarea" v-model="form.content" :autosize="{ minRows: 6, maxRows: 10}"></el-input>
            </el-form-item>
            <el-form-item label="附件">
                <div class="flex">
                  <upload-button  @on-change="upload_img">添加附件</upload-button>
                  <span style="margin-left:20px" v-if="file_list.length">{{file_list.length}} 个附件，共{{file_list | folderSize}} </span>
                </div>
                <file-list :list='file_list' @delete='delete_file'></file-list>
            </el-form-item>
            <form-button cancel_name='取消' submit_name='发布' @submit="onSubmit" @cancel='save_message'></form-button>
          </el-form>
          <add-anno-part
            :user-list='hasSelectPart'
            :show="add_part_dialog"
            :loading='add_part_loading'
            @submit='submit_part'
            @close='add_part_dialog = false' ></add-anno-part>
      </div>
    </div>
</template>
<script>
import fileList from "@/components/FileList";
import uploadButton from "@/components/Button/uploadButton";
import addUserButton from "@/components/Button/addUserButton";
import addYield from "@/components/AddYield";
import formButton from "@/components/Button/formButton";
import { parseTime } from "@/utils";
import { action_fail } from "@/utils/user";
import { mapGetters } from "vuex";
import { SET_NOTICE_DATA } from "@/store/mutations";
import AddAnnoPart from "@/components/AddAnnoPart";

export default {
  components: {
    fileList,
    uploadButton,
    AddAnnoPart,
    addUserButton,
    formButton
  },
  data() {
    return {
      loading: false,
      form: {
        noticeTitle: " ",
        noticeAdress: "",
        noticeProfile: "",
        startTime: "",
        endTime: ""
      },
      rules: {
        title: [{ required: true, message: "请输入公告标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入公告内容", trigger: "blur" }
        ]
      },
      file_list: [],
      yield_dialog: false, //部门管理弹窗
      dialog: false,
      noticeId: "",
      hasSelectPart: [],
      add_part_dialog: false,
      add_part_loading: false
    };
  },
  beforeDestroy() {
    this.$store.commit("DEL_VIEW_BY_NAME", "创建公告");
  },
  computed: {
    ...mapGetters(["notice_data", "is_permisssion"])
  },
  created() {
    this.add_part_dialog = false;
  },
  methods: {
    submit_part(res) {
      this.hasSelectPart = res;
      this.form.part = res
        .map(res => {
          return res.allName;
        })
        .join("、");
      this.add_part_dialog = false;
    },
    delete_file(index) {
      this.$post(
        "gwt/cloudisk/attachment/del",
        {
          id: this.file_list[index].id
        },
        "json"
      )
        .then(res => {
          if (action_fail(res)) return;
          this.file_list.splice(index, 1);
        })
        .catch(res => {
          console.log(res);
        });
    },
    upload_img(e) {
      if (this.file_list.length >= 10) {
        this.$message({
          message: "最多只能上传十份附件！",
          type: "warning"
        });
        return;
      }
      this.loading = true;
      var formData = new FormData();
      formData.append("selectFile", e.raw);
      formData.append("ownerSystem", "gwt-platform");
      formData.append("ownerModule", "Anno");
      formData.append("ownerAperation", undefined);
      formData.append("userId", "1");
      formData.append("uploadOpt", "add");
      formData.append("editFileId", undefined);
      this.$post("gwt/uploadFile/upload", formData, "form")
        .then(res => {
          this.loading = false;
          if (action_fail(res, "上传成功！", "上传失败！")) return;
          res.data.attachment.url = e.url;
          this.file_list.push(res.data.attachment);
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    },
    onSubmit() {
      this.$refs.form.validate(res => {
        if (!res) return;
        if (!this.hasSelectPart.length) {
          this.$message({
            message: "请选择一个接收部门",
            type: "warning"
          });
          return;
        }
        this.loading = true;
        this.$post(
          "gwt/business/tbAnnouncement/save",
          {
            title: this.form.title,
            content: this.form.content,
            attrArray: this.file_list.map(res => res.id).join(","),
            orgArray: this.hasSelectPart
              .map(res => res.id.replace(/.*\D/g, ""))
              .join(",")
          },
          "json"
        )
          .then(res => {
            this.loading = false;
            if (action_fail(res, "添加公告操作成功")) return;
            this.$router.push({
              path: "/anno-maintain/index"
            });
          })
          .catch(res => {
            this.loading = false;
            console.log(res);
          });
      });
    },
    save_message() {
      this.$router.go(-1);
    }
  }
};
</script>

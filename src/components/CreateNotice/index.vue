<template>
<div class="common">
    <t-title :title="title" warning></t-title>
    <div class="page-form" >
      <div class="script_bgc">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules" v-loading='loading'>
            <el-form-item 
            v-for="(item,index) in formArray" 
            :key="index"
            :prop="item.prop"
            v-if="!(item.type === 'part' && !is_permisssion)"
            :label="item.label">
              <el-input v-model="form[item.prop]" v-if="item.type === 'input'" size='small' maxlength="50"></el-input>
              <el-date-picker v-model="form[item.prop]" type="datetime" size="small" placeholder="选择日期时间" v-if="item.type =='date'"></el-date-picker>
              <div class="flex" v-if="item.type === 'part'">
                <el-input v-model="form.part" size="small" placeholder="请选择接收部门" readonly @click.native="yield_dialog= true"></el-input>
                <add-user-button @click="yield_dialog= true">选择部门</add-user-button>
              </div>
              <div class="flex" v-if="item.type === 'user'">
                <el-input v-model="form.name" size="small" placeholder="请选择接收人" readonly @click.native="dialog= true"></el-input>
                <add-user-button @click="dialog= true">选择接收人</add-user-button>
              </div>
              <el-input type="textarea" v-model="form[item.prop]" :autosize="{ minRows: 6, maxRows: 10}" v-if="item.type === 'textarea'"></el-input>
            </el-form-item>
            <el-form-item label="附件">
                <div class="flex">
                    <upload-button @on-change="upload_img">添加附件</upload-button>
                    <span style="margin-left:20px" v-if="file_list.length">{{file_list.length}} 个附件，共{{file_list | folderSize}} </span>
                </div>
                <file-list :list='file_list' @delete='delete_file'></file-list>
            </el-form-item>
            <el-form-item align='left'>
                <el-checkbox v-model="form.checked"><span>我已确认本通知不含涉密信息</span></el-checkbox>
            </el-form-item>
            <form-button cancel_name='保存草稿' submit_name='发送' @submit="onSubmit" @cancel='save_message'></form-button>
        </el-form>
    </div>
    <add-yield :show="yield_dialog" @submit='submit_yield'  :user-list='has_select_part_list'  @close='cancel_yield'></add-yield>
    <add-user :show='dialog' @close='cancel_user_dialog' :user-list='has_select_user_list' @cancel='cancel_user_dialog' @submit="submit_user_dialog"></add-user>
  </div>
</div>
</template>
<script>
import fileList from "@/components/FileList";
import uploadButton from "@/components/Button/uploadButton";
import addUserButton from "@/components/Button/addUserButton";
import addUser from "@/components/AddUser";
import addYield from "@/components/AddYield";
import formButton from "@/components/Button/formButton";
import { parseTime } from "@/utils";
import { action_fail } from "@/utils/user";
import { validateTime } from "@/utils/validate";
import { mapGetters } from "vuex";
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
      form: {
        noticeTitle: "",
        noticeAdress: "",
        noticeProfile: "",
        startTime: "",
        endTime: ""
      },
      file_list: [],
      has_select_user_list: [],
      has_select_part_list: [],
      yield_dialog: false, //部门管理弹窗
      dialog: false,
      loading: false
    };
  },
  props: {
    title: {
      default: "会议通知",
      type: String
    },
    rules: {
      type: Object
    },
    formArray: {
      default: [],
      type: Array,
      required: true
    },
    view: {
      type: String
    },
    noticeType: {
      type: Number
    }
  },
  beforeDestroy() {
    this.$store.commit("DEL_VIEW_BY_NAME", this.view);
  },
  computed: {
    ...mapGetters(["is_permisssion"])
  },
  created() {
    this.$store.dispatch("get_user_send_permission");
  },
  methods: {
    cancel_user_dialog(list) {
      this.dialog = false;
      this.form.name = list.map(res => res.REAL_NAME).join("、");
      this.has_select_user_list = list;
    },
    cancel_yield(list) {
      this.yield_dialog = false;
      this.has_select_part_list = list;
    },
    submit_yield(list) {
      this.yield_dialog = false;
      this.form.part = list.map(res => res.name).join("、");
      this.has_select_part_list = list;
    },
    submit_user_dialog(list) {
      this.dialog = false;
      this.form.name = list.map(res => res.REAL_NAME).join("、");
      this.has_select_user_list = list;
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
      formData.append("ownerAperation", "ownerAperation");
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
      if (
        !this.has_select_user_list.length &&
        !this.has_select_part_list.length
      ) {
        this.$message({
          message: "请选择一个接收人或接收部门",
          type: "warning"
        });
        return;
      }
      if (!this.form.checked) {
        this.$message({
          message: "请确认该通知不含涉密信息！",
          type: "warning"
        });
        return;
      }
      this.$refs.form.validate(res => {
        if (!res) return;
        this.$swal({
          confirmButtonText: "确定",
          showCancelButton: true,
          cancelButtonText: "取消",
          title: "请输入密码！",
          input: "password",
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValidator: value => {
            return !value && "请输入密码！";
          }
        }).then(response => {
          if (response.value) {
            this.$post(
              "gwt/system/sysUserZone/judgePhone",
              {
                password: response.value
              },
              "json"
            )
              .then(res => {
                if (res.result !== "0000") {
                  this.$swal({
                    title: "操作失败！",
                    text: res.msg,
                    type: "error",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    showConfirmButton: true
                  });
                  return;
                }
                this.$post(
                  "gwt/notice/tbNotice/save",
                  {
                    publishPwd: response.value,
                    noticeId: "",
                    noticeTitle: this.form.noticeTitle,
                    noticeType: this.noticeType, //会议 2//通知 3//材料
                    noticeAdress: this.form.noticeAdress,
                    noticeProfile: this.form.noticeProfile,
                    startTime: parseTime(
                      this.form.startTime,
                      "{y}-{m}-{d} {h}:{i}:{s}"
                    ),
                    endTime: parseTime(
                      this.form.endTime,
                      "{y}-{m}-{d} {h}:{i}:{s}"
                    ),
                    selectedUsers: this.has_select_user_list
                      .map(res => res.ID)
                      .join(","),
                    attrArray: this.file_list.map(res => res.id).join(","),
                    orgArray: this.has_select_part_list
                      .map(res => res.id.replace(/.*\D/g, ""))
                      .join(",")
                  },
                  "json"
                )
                  .then(res => {
                    if (action_fail(res, "会议创建成功！")) return;
                    this.$router.push({
                      path: "/active/index"
                    });
                  })
                  .catch(res => {
                    console.log(res);
                  });
              })
              .catch(res => {
                console.log(res);
              });
          }
        });
      });
    },
    save_message() {
      if (
        !(
          this.form.noticeTitle ||
          this.form.startTime ||
          this.file_list.length ||
          this.form.noticeProfile ||
          this.has_select_part_list.length ||
          this.has_select_user_list.length ||
          this.form.endTime
        )
      ) {
        this.$message({
          type: "warning",
          message: "至少填写一项信息!"
        });
        return;
      }
      this.$post(
        "gwt/notice/tbNoticeDraft/save",
        {
          noticeId: "",
          noticeTitle: this.form.noticeTitle,
          noticeType: this.noticeType, //会议 2//通知 3//材料
          noticeAdress: this.form.noticeAdress,
          noticeProfile: this.form.noticeProfile,
          startTime: parseTime(this.form.startTime, "{y}-{m}-{d} {h}:{i}:{s}"),
          endTime: parseTime(this.form.endTime, "{y}-{m}-{d} {h}:{i}:{s}"),
          selectedUsers: this.has_select_user_list.map(res => res.ID).join(","),
          attrArray: this.file_list.map(res => res.id).join(","),
          orgArray: this.has_select_part_list
            .map(res => res.id.replace(/.*\D/g, ""))
            .join(",")
        },
        "json"
      )
        .then(res => {
          if (action_fail(res, "保存为草稿成功！")) return;
          this.$router.push({
            path: "/drafts/index"
          });
        })
        .catch(res => {
          console.log(res);
        });
    },
    handleNodeClick() {}
  }
};
</script>

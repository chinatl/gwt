<template>
    <div class="common">
        <t-title :title="notice_data.noticeTypeName" warning></t-title>
        <div class="page-form" v-loading='loading'>
      <div class="script_bgc">

              <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                    <el-form-item label="标题" prop='noticeTitle'>
                        <el-input v-model="form.noticeTitle" size="small" maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="会议地点" v-if="notice_data.noticeType == '1'">
                        <el-input v-model="form.noticeAdress" size="small" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop='startTime' v-if="notice_data.noticeType == '1'">
                        <el-date-picker
                            ref='start_time'
                            v-model="form.startTime"
                            type="datetime"
                            size="small"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop='endTime' v-if="notice_data.noticeType == '3'">
                        <el-date-picker
                            ref='end_time'
                            v-model="form.endTime"
                            type="datetime"
                            size="small"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="接收部门" v-if='is_permisssion'>
                        <div class="flex">
                            <el-input v-model="form.part" size="small" placeholder="请选择接收部门" readonly @click.native="yield_dialog= true"></el-input>
                            <add-user-button @click="yield_dialog= true">选择部门</add-user-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="接收人">
                        <div class="flex">
                            <el-input v-model="form.name" size="small" placeholder="请选择接收人" readonly @click.native="dialog= true"></el-input>
                            <add-user-button @click="dialog= true">选择接收人</add-user-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="通知简介">
                        <el-input type="textarea" v-model="form.noticeProfile" :autosize="{ minRows: 6, maxRows: 10}"></el-input>
                    </el-form-item>
                    <el-form-item label="附件">
                        <div class="flex">
                          <upload-button  @on-change="upload_img">添加附件</upload-button>
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
        <add-yield 
        :show="yield_dialog" 
        @submit='submit_yield'
        @close='cancel_yield'
        :user-list='has_select_part_list'
        ></add-yield>
        <add-user 
        @cancel='cancel_user_dialog'
        :show='dialog' @close='cancel_user_dialog' 
        :user-list='has_select_user_list'
        @submit="submit_user_dialog"></add-user>
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
import { validateTime, validateEndTime } from "@/utils/validate";
import { mapGetters } from "vuex";
import { SET_NOTICE_DATA } from "@/store/mutations";
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
      loading: false,
      form: {
        noticeTitle: " ",
        noticeAdress: "",
        noticeProfile: "",
        startTime: "",
        endTime: ""
      },
      rules: {
        noticeTitle: [
          { required: true, message: "请输入会议标题", trigger: "blur" }
        ],
        noticeAdress: [
          { required: true, message: "请输入会议地点", trigger: "blur" }
        ],
        startTime: [
          { required: true, validator: validateTime, trigger: "change" }
        ],
        endTime: [
          { required: true, validator: validateEndTime, trigger: "change" }
        ]
      },
      file_list: [],
      has_select_user_list: [],
      has_select_part_list: [],
      yield_dialog: false, //部门管理弹窗
      dialog: false,
      noticeId: ""
    };
  },
  beforeDestroy() {
    this.$store.commit("DEL_VIEW_BY_NAME", "通知编辑");
  },
  created() {
    this.$store.dispatch("readSession", SET_NOTICE_DATA);
    this.$store.dispatch("get_user_send_permission");
    this.init();
    this.noticeId =
      this.notice_data.changeType === "cancel" ? "" : this.notice_data.noticeId;
    sessionStorage.setItem("send_status", this.notice_data.noticeType);
  },
  computed: {
    ...mapGetters(["notice_data", "is_permisssion"])
  },
  methods: {
    cancel_yield(list) {
      this.yield_dialog = false;
      this.has_select_part_list = list;
    },
    cancel_user_dialog(list) {
      this.dialog = false;
      this.form.name = list.map(res => res.REAL_NAME).join("、");
      this.has_select_user_list = list;
    },
    init() {
      this.$post(
        "gwt/notice/tbNotice/getNoticeDraftDetail",
        {
          pk: "noticeId",
          changeType: this.notice_data.changeType
            ? this.notice_data.changeType
            : "",
          noticeId: this.notice_data.noticeId
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.form.noticeTitle = res.data.tbNotice.noticeTitle;
          this.form.noticeAdress = res.data.tbNotice.noticeAdress;
          if (res.data.tbNotice.startTime) {
            this.$refs.start_time.$children[0].currentValue =
              res.data.tbNotice.startTime;
            this.form.startTime = +new Date(
              res.data.tbNotice.startTime.replace(/-/g, "/")
            );
          }
          if (res.data.tbNotice.endTime) {
            this.$refs.end_time.$children[0].currentValue =
              res.data.tbNotice.endTime;
            this.form.endTime = +new Date(
              res.data.tbNotice.endTime.replace(/-/g, "/")
            );
          }

          this.form.name = res.data.receiveUserNames.join("、");
          this.form.part = res.data.receiveOrgNames.join("、");
          this.form.noticeProfile = res.data.tbNotice.noticeProfile;
          this.file_list = res.data.attrIds;
          var id_arr = res.data.tbNoticeDraft.draftOrgId.split(",");
          this.has_select_part_list = [];
          for (var i = 0; i < res.data.receiveOrgNames.length; i++) {
            this.has_select_part_list.push({
              name: res.data.receiveOrgNames[i],
              id: id_arr[i]
            });
          }
          this.has_select_user_list = [];
          var user_arr_id = res.data.tbNoticeDraft.draftUserId.split(",");
          if (res.data.selectedUser) {
            this.has_select_user_list = res.data.selectedUser.map(res => {
              res.ORG_NAME = res.ORG_ALL_NAME;
              return res;
            });
          }
        })
        .catch(res => {
          console.log(res);
        });
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
                    noticeId: this.noticeId,
                    publishPwd: response.value,
                    noticeTitle: this.form.noticeTitle,
                    noticeType: this.notice_data.noticeType, //会议 2//通知 3//材料
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
      this.loading = true;
      this.$post(
        "gwt/notice/tbNoticeDraft/save",
        {
          noticeId: this.noticeId,
          noticeTitle: this.form.noticeTitle,
          noticeType: this.notice_data.noticeType, //会议 2//通知 3//材料
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
          this.loading = false;
          if (action_fail(res, "保存为草稿成功！")) return;
          this.$router.push({
            path: "/drafts/index"
          });
          console.log(res);
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    }
  }
};
</script>

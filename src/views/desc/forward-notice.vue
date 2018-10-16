<template>
    <div class="common">
        <t-title title="转发部门"></t-title>
        <div class="page-form" v-loading='loading'>
              <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="接收部门" v-if="is_permisssion">
                    <div class="flex">
                        <el-input v-model="form.part" size="small" placeholder="请选择接收部门" readonly></el-input>
                        <add-user-button @click="yield_dialog= true">选择部门</add-user-button>
                    </div>
                </el-form-item>
                <el-form-item label="接收人">
                    <div class="flex">
                        <el-input v-model="form.name" size="small" placeholder="请选择接收人" readonly></el-input>
                        <add-user-button @click="dialog= true">选择接收人</add-user-button>
                    </div>
                </el-form-item>
                <el-form-item label="转发说明">
                    <el-input type="textarea" v-model="form.forwardDesc" :autosize="{ minRows: 6, maxRows: 10}" maxlength="30" placeholder="请输入30字以内的转发说明"></el-input>
                </el-form-item>
                <form-button @submit="onSubmit" @cancel='save_message'></form-button>
            </el-form>
        </div>
        <add-yield 
        :show="yield_dialog" 
        @submit='submit_yield'
        :user-list='has_select_part_list'
        @close='cancel_yield'></add-yield>
        <add-user 
        :show='dialog' @close='cancel_user_dialog' 
        :user-list='has_select_user_list'
        @cancel='cancel_user_dialog'
        @submit="submit_user_dialog"></add-user>
    </div>
</template>
<script>
import addUserButton from "@/components/Button/addUserButton";
import addUser from "@/components/AddUser";
import addYield from "@/components/AddYield";
import formButton from "@/components/Button/formButton";
import { action_fail } from "@/utils/user";
import { SET_MESSAGE_DATA } from "@/store/mutations";
import { mapGetters } from "vuex";
export default {
  components: {
    addUser,
    addYield,
    addUserButton,
    formButton
  },
  data() {
    return {
      loading: false,
      form: {
        noticeTitle: "",
        noticeAdress: "",
        noticeProfile: "",
        forwardDesc: ""
      },
      file_list: [],
      has_select_user_list: [],
      has_select_part_list: [],
      yield_dialog: false, //部门管理弹窗
      dialog: false
    };
  },
  beforeDestroy() {
    this.$store.commit("DEL_VIEW_BY_NAME", "转发通知");
  },
  created() {
    this.$store.dispatch("readSession", SET_MESSAGE_DATA);
    this.$store.dispatch("get_user_send_permission");
  },
  computed: {
    ...mapGetters(["message_data", "is_permisssion"])
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
      this.loading = true;
      this.$post(
        "gwt/notice/tbNoticeForward/save",
        {
          orgArray: this.has_select_part_list
            .map(res => res.id.replace(/.*\D/g, ""))
            .join(","),
          selectedUsers: this.has_select_user_list.map(res => res.ID).join(","),
          noticeId: this.message_data.NOTICE_ID,
          parentId: this.message_data.FORWARD_ID,
          forwardDesc: this.form.forwardDesc
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (action_fail(res, "通知转发成功！")) return;
          this.$router.go(-1);
        })
        .catch(res => {
          this.loading = false;
        });
    },
    save_message() {
      this.$router.go(-1);
    }
  }
};
</script>

<template>
    <create-notice
    title="通知"
    :form-array='form_array'
    :rules='rules'
    view='创建通知'
    :noticeType='2'
    ></create-notice>
</template>
<script>
import CreateNotice from "@/components/CreateNotice";
import { validateTime } from "@/utils/validate";
export default {
  components: {
    CreateNotice
  },
  data() {
    return {
      rules: {
        noticeTitle: [
          { required: true, message: "请输入会议标题", trigger: "blur" }
        ],
      },
      form_array: [
        {
          label: "标题",
          type: "input",
          prop: "noticeTitle"
        },
        {
          label: "接收部门",
          type: "part"
        },
        {
          label: "接收人",
          type: "user"
        },
        {
          label: "通知简介",
          type: "textarea",
          prop: "noticeProfile"
        }
      ]
    };
  }
};
</script>

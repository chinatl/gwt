<template>
    <create-notice
    title="会议通知"
    :form-array='form_array'
    :rules='rules'
    view='创建会议'
    :noticeType='1'
    ></create-notice>
</template>
<script>
import CreateNotice from "@/components/CreateNotice";
import { validateTime } from "@/utils/validate";
export default {
  components: {
    CreateNotice
  },
  created() {
    sessionStorage.setItem("send_status", 1);
  },
  data() {
    return {
      rules: {
        noticeTitle: [
          { required: true, message: "请输入会议标题", trigger: "blur" }
        ],
        startTime: [
          { required: true, validator: validateTime, trigger: "change" }
        ]
      },
      form_array: [
        {
          label: "标题",
          type: "input",
          prop: "noticeTitle"
        },
        {
          label: "会议地点",
          type: "input",
          prop: "noticeAdress"
        },
        {
          label: "开始时间",
          type: "date",
          prop: "startTime"
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

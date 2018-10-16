<template>
    <create-notice
    title="材料征集"
    :form-array='form_array'
    :rules='rules'
    view='材料征集'
    :noticeType='3'
    ></create-notice>
</template>
<script>
import CreateNotice from "@/components/CreateNotice";
import { validateEndTime } from "@/utils/validate";
export default {
  components: {
    CreateNotice
  },
  created() {
    sessionStorage.setItem("send_status", 3);
  },
  data() {
    return {
      rules: {
        noticeTitle: [
          { required: true, message: "请输入标题", trigger: "blur" }
        ],
        endTime: [
          { required: true, validator: validateEndTime, trigger: "change" }
        ]
      },

      form_array: [
        {
          label: "标题",
          type: "input",
          prop: "noticeTitle"
        },

        {
          label: "结束时间",
          type: "date",
          prop: "endTime"
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

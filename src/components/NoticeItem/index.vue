<template>
    <div class="user-message" @click="item_click">
        <div class="user-message-left">
            <img :src="require('@/assets/imgs/message.png')">
        </div>
        <div class="user-message-right">
            <div class="user-message-title">
                 {{data.NOTICE_TITLE}}
                <span class="status">
                    {{data.REC_STATUS === 1000 ? "未签收": null}}
                    {{data.REC_STATUS === 1001  ?  data.NOTICE_TYPE_NAME ==="会议通知" ? "未报名": '已签收' : null}}
                    {{data.REC_STATUS === 1002 ? "已拒签": null}}
                    {{data.REC_STATUS === 1003 ? "未报名": null}}
                    {{data.REC_STATUS === 1004 ? "已报名": null}} 
                </span>
            </div>
            <div class="user-message-info">
                <little-button :name='data.NOTICE_TYPE_NAME'></little-button>
                <span class="current">{{data.REAL_NAME}}</span>
                <span class="current">{{data.ORG_ALL_NAME}}</span>
                <span class="time">{{data.RECE_TIME}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import littleButton from "@/components/Button/littleButton";
export default {
  components: {
    littleButton
  },
  data() {
    return {};
  },
  props: {
    data: {
      type: Object,
      default: {},
      required: true
    }
  },
  methods: {
    item_click() {
      this.$emit("click");
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.user-message {
  height: 99px;
  position: relative;
  &:hover {
    background-color: rgb(250, 250, 250);
    cursor: pointer;
    .user-message-left {
      .el-icon-close {
        display: block;
      }
    }
    .user-message-right {
      .user-message-title {
        color: rgb(87, 144, 195);
      }
    }
  }
  .user-message-left {
    padding: 20px 20px;
    width: 120px;
    height: 100%;
    position: absolute;
    text-align: right;
    float: left;
    .new-message {
      width: 8px;
      height: 8px;
      position: absolute;
      top: 40px;
      left: 10px;
      border-radius: 50%;
      background: red;
    }
    .el-icon-close {
      position: absolute;
      top: 10px;
      left: 10px;
      display: none;
      &:hover {
        color: #54cfde;
      }
    }
  }
  .user-message-right {
    padding: 20px 10px;
    height: 100%;
    margin-left: 120px;
    border-bottom: 1px solid #ccc;
    .user-message-title {
      font-size: 15px;
      letter-spacing: 0.5px;
      margin-bottom: 22px;
      color: #666;
      .status {
        float: right;
        font-size: 12px;
        color: rgb(220, 20, 60);
      }
    }
    .user-message-info {
      .current {
        letter-spacing: 0.5px;
        color: #54cfde;
        margin-right: 15px;
        display: inline-block;
        font-size: 13px;
      }
      .time {
        position: relative;
        font-size: 14px;
        color: #989898;
        display: inline-block;
        float: right;
      }
    }
  }
}
</style>

<template>
    <div class="user-message" @click="item_click">
        <div class="user-message-left">
            <span class="new-message" v-if="data.STATE === 0"></span>
            <img :src="require('@/assets/imgs/report-s.png')" v-if='data.TYPE_ID === 5'>
            <img :src="require('@/assets/imgs/message.png')" v-else>
            <i class="el-icon-close" @click.stop="delete_a_message"></i>
        </div>
        <div class="user-message-right">
            <div class="user-message-title">
                 {{data.TITLE}}
                <span class="status">
                    {{data.REC_STATUS === 1000 ? "未签收": null}}
                    {{data.REC_STATUS === 1001 ?( data.TYPE_DESC === "会议通知" ? "未报名": "已签收") :null }}
                    {{data.REC_STATUS === 1002 ? "已拒签": null}}
                    {{data.REC_STATUS === 1003 ? "未报名": null}}
                    {{data.REC_STATUS === 1004 ? "已报名": null}} 
                    {{(data.TYPE_DESC === '调岗' && data.REC_STATUS == 0) ? '未处理' : null}}
                    {{(data.TYPE_DESC === '调岗' && data.REC_STATUS == 1) ? '已转入' : null}}
                    {{(data.TYPE_DESC === '调岗' && data.REC_STATUS == 2) ? '已拒绝' : null}}
                    {{(data.TYPE_DESC === '调岗' && data.REC_STATUS == 3) ? '已撤回' : null}}
                    {{(data.TYPE_DESC === '公告' && data.FROM_NOTICE_ID) ? '已删除' : null}}
                </span>
            </div>
            <div class="user-message-info">
                <little-button name=' 变更 ' v-if="data.FROM_NOTICE_ID && data.TYPE_DESC !== '公告'"></little-button>
                <little-button name='转发' v-if="data.FORWARD_ID "></little-button>
                <little-button :name='data.TYPE_DESC'></little-button>
                <span class="current">{{data.CREATE_USER_NAME}}</span>
                <span class="current">{{data.DEPT}}</span>
                <span class="time">{{data.UPDATE_TIME}}</span>
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
    delete_a_message() {
      this.$emit("delete");
    },
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
      .zhuanfa {
        background-color: #fab858;
      }
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

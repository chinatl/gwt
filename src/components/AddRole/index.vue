<template>
<el-dialog :visible.sync="dialog" title='添加联系人' class="select-user-dialog" v-drag :close-on-click-modal='false'>
<div v-loading='loading'>
    <div class="select-user-container">
        <div class="select-left">
            <div class="select-part-top">
                <el-input v-model="input" size="small">
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <div class="select-part-bottom scrollbar">
                <div class="all-checked">
                    <el-checkbox v-model="user_all_checked" @change="all_user_box">全选</el-checkbox>
                </div>
                <div class="role-checked scrollbar">
                    <ul  v-if="allList.length">
                        <li v-for='(item,index) in allList' :key='index' v-if="item.realName.includes(input)">
                            <el-checkbox v-model="item.checked" @change="user_select_checkbox($event,index,item.userId)">
                                <span style="width:80px;display:inline-block">{{item.realName}}</span>
                                {{item.ORG_ALL_NAME}}
                            </el-checkbox>
                        </li>
                    </ul>
                    <p v-else style="padding:20px">暂无人员!</p>
                </div>
            </div>
        </div>
        <div class="select-right">
            <div class="has-selected">
                <span>已选{{has_select_user.length}}人</span>
                <el-button size="mini" @click="clear_all_user"><span class="span">清空</span></el-button>
            </div>
            <div class="has-user-list scrollbar">
                <ul>
                    <li v-for='(item,index) in has_select_user' :key="index">
                        <div>
                            <svg-icon icon-class='user'></svg-icon>
                            <span class="user-name">{{item.realName}}</span>
                        </div>
                        <div>
                            <i class="el-icon-close" @click="delete_user(index,item.userId)"></i>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="select-action-button">
        <el-button size="small" @click="save_message" v-wave>取消</el-button>
        <el-button type="primary" @click="onSubmit" size="small" v-wave>确定</el-button>
    </div>
</div>
</el-dialog>
</template>
<script>
import { SET_PART_TREE, SET_USER_LIST } from "@/store/mutations";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      part: 1,
      defaultProps: {
        children: "childrens",
        label: "allName"
      },
      checked: false,
      input: "",
      has_select_user: [],
      all_checked: false,
      user_all_checked: false,
      user_list: []
    };
  },
  props: {
    allList: {
      default: []
    },
    show: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    userList: {
      // type: Array,
      default: []
    }
  },
  watch: {
    show(res) {
      if (res) {
        this.has_select_user = this.userList;
        var arr = this.userList.map(res => res.userId);
        var index = 0;
        for (var i = 0; i < this.allList.length; i++) {
          if (arr.includes(this.allList[i].userId)) {
            index++;
            this.allList[i].checked = true;
          } else {
            this.allList[i].checked = false;
          }
        }
        if (index === this.allList.length && index) {
          this.user_all_checked = true;
        } else {
          this.user_all_checked = false;
        }
        this.all_list = [...this.allList];
      }
    }
  },
  created() {
    this.$store.dispatch("readSession", SET_PART_TREE);
    this.$store.dispatch("readSession", SET_USER_LIST);
  },
  computed: {
    dialog: {
      get() {
        return this.show;
      },
      set(res) {
        this.$emit("close");
      }
    },
    ...mapGetters(["part_tree", "part_user_list"])
  },
  methods: {
    //切换筛选条件
    checkout_type(e) {
      if (e) {
        this.user_list = [];
      } else {
        for (var j = 0; j < this.part_user_list.length; j++) {
          this.part_user_list[j].checked = false;
          for (var i = 0; i < this.has_select_user.length; i++) {
            if (
              this.has_select_user[i].userId === this.part_user_list[j].userId
            ) {
              this.part_user_list[j].checked = true;
            }
          }
        }
        this.allList = [...this.part_user_list];
      }
    },
    //用户查询单点选择框
    user_select_checkbox(e, index, userId) {
      if (e) {
        this.has_select_user.push(this.allList[index]);
      } else {
        for (var i = 0; i < this.has_select_user.length; i++) {
          if (this.has_select_user[i].userId === userId) {
            this.has_select_user.splice(i, 1);
          }
        }
      }
      this.change_all_checked();
    },
    //用户查询全选
    all_user_box(e) {
      if (e) {
        this.has_select_user = [];
        for (var i = 0; i < this.allList.length; i++) {
          this.allList[i].checked = true;
          this.has_select_user.push(this.allList[i]);
        }
      } else {
        for (var j = 0; j < this.allList.length; j++) {
          this.allList[j].checked = false;
          for (var i = 0; i < this.has_select_user.length; i++) {
            if (this.has_select_user[i].userId === this.allList[j].userId) {
              this.has_select_user.splice(i, 1);
            }
          }
        }
      }
    },
    //清空按钮
    clear_all_user() {
      this.has_select_user = [];
      //part 用来区分部门和用户
      this.user_all_checked = false;
      for (var i = 0; i < this.allList.length; i++) {
        this.allList[i].checked = false;
      }
    },
    //删除一个选择的用户
    delete_user(index, userId) {
      this.has_select_user.splice(index, 1);
      for (var i = 0; i < this.allList.length; i++) {
        if (this.allList[i].userId === userId) {
          this.allList[i].checked = false;
        }
      }
      this.change_all_checked();
    },
    //全选
    all_select_checkbox(e) {
      if (e) {
        for (var i = 0; i < this.user_list.length; i++) {
          this.user_list[i].checked = true;
          this.has_select_user.push(this.user_list[i]);
        }
      } else {
        for (var j = 0; j < this.user_list.length; j++) {
          this.user_list[j].checked = false;
          for (var i = 0; i < this.has_select_user.length; i++) {
            if (this.has_select_user[i].userId === this.user_list[j].userId) {
              this.has_select_user.splice(i, 1);
            }
          }
        }
      }
    },
    //动态改变 all-checked
    change_all_checked() {
      var index = 0;
      for (var i = 0; i < this.allList.length; i++) {
        if (this.allList[i].checked) {
          index++;
        }
      }
      if (index === this.allList.length) {
        this.user_all_checked = true;
      } else {
        this.user_all_checked = false;
      }
    },
    //选择一个用户
    select_checkbox(e, index, userId) {
      if (e) {
        this.has_select_user.push(this.user_list[index]);
      } else {
        for (var i = 0; i < this.has_select_user.length; i++) {
          if (this.has_select_user[i].userId === userId) {
            this.has_select_user.splice(i, 1);
          }
        }
      }
      this.change_all_checked();
    },
    onSubmit() {
      this.$emit("submit", this.has_select_user);
    },
    save_message() {
      this.$emit("cancel", this.has_select_user);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.select-user-dialog {
  .el-dialog {
    width: 720px;
    .el-dialog__header {
      border-bottom: 1px solid #e5e5e5;
      .el-dialog__title {
        color: rgb(103, 106, 108);
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
  .el-dialog__body {
    padding: 20px 20px;
    padding-bottom: 16px;
    .select-user-container {
      overflow: hidden;
      .select-left {
        width: 400px;
        float: left;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #e7e7e7;
        .select-part-top {
          height: 40px;
          color: #3172b4;
          display: flex;
          padding: 2px 8px;
          background-color: #e7e7e7;
          align-items: center;
        }
        .select-part-bottom {
          padding: 10px 8px 10px 8px;
          background-color: #f8f9fb;
          overflow: hidden;

          .all-checked {
            border-bottom: 1px solid #cfcfcf;
            padding-bottom: 6px;
          }
          .role-checked {
            overflow: auto;
            overflow-x: hidden;
            width: 100%;
            height: 349px;
            ul {
              li {
                height: 32px;
                line-height: 32px;
                .el-checkbox {
                  width: 100%;
                }
              }
            }
          }
          .select-part-tree {
            width: 236px;
            float: left;
            border: 1px solid #e7eaec;
            padding: 6px;
            height: 375px;
            background-color: #fff;
          }
          .select-part-checkbox {
            height: 375px;
            background-color: #fff;
            float: right;
            width: 136px;
            padding-left: 18px;
            .all-checked {
              border-bottom: 1px solid #efefef;
              height: 40px;
              line-height: 40px;
              .el-checkbox__label {
                font-size: 15px;
                font-weight: 600;
                letter-spacing: 6px;
              }
            }
            .role-checked {
              ul {
                li {
                  height: 32px;
                  line-height: 32px;
                  .el-checkbox {
                    width: 100%;
                  }
                }
              }
            }
          }
        }
      }
      .select-right {
        width: 260px;
        float: right;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #e7e7e7;
        .has-selected {
          height: 40px;
          color: #3172b4;
          display: flex;
          padding: 2px 8px;
          background-color: #e7e7e7;
          align-items: center;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          font-weight: 600;
          font-size: 13px;
          .span {
            color: #3172b4;
            font-size: 14px;
          }
        }
        .has-user-list {
          height: 395px;
          background-color: #f8f9fb;
          overflow-y: auto;
          ul {
            padding: 10px 12px;
            li {
              display: flex;
              justify-content: space-between;
              line-height: 24px;
              .svg-icon {
                font-size: 20px;
                vertical-align: sub;
                color: #2e88e7;
              }
              .user-name {
                height: 20px;
                font-size: 14px;
                color: #2e88e7;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 160px;
                display: inline-block;
              }
              .part-name {
                width: 110px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                display: inline-block;
                padding-right: 4px;
              }
              .el-icon-close {
                cursor: pointer;
                color: #2e88e7;
                float: right;
                margin-right: 4px;
                margin-top: 6px;
              }
            }
          }
        }
      }
    }
    .select-action-button {
      margin-top: 10px;
      text-align: right;
    }
  }
}
</style>

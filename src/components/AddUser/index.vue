<template>
<el-dialog :visible.sync="dialog" title='添加联系人' class="select-user-dialog" v-drag :close-on-click-modal='false'>
<div v-loading='loading'>
    <div class="add-user-container">
        <div class="select-left">
            <div class="select-part-top">
                <el-select v-model="part" size="small" style="width:100px" @change="checkout_type">
                    <el-option :value="1" label="部门"></el-option>
                    <el-option :value="0" label="姓名"></el-option>
                </el-select>
                <el-input v-model="filterText" size="small">
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <div class="select-part-bottom scrollbar">
                <div v-show="part">
                    <div class="select-part-tree common-temp scrollbar" style="overflow-y:auto;overflow-x: hidden">
                        <el-tree :data="part_tree"
                        :filter-node-method="filterNode"
                        :props="defaultProps" @node-click="handleNodeClick" ref='tree'></el-tree>
                    </div>
                    <div class="select-part-checkbox">
                        <div class="all-checked">
                            <el-checkbox v-model="all_checked" @change="all_select_checkbox">全选</el-checkbox>
                        </div>
                        <div class="one-checked scrollbar" style="overflow:auto;height:335px">
                            <ul>
                                <li v-for='(item,index) in user_list' :key='index' >
                                    <el-checkbox v-model="item.checked" @change="select_checkbox($event,index,item.ID)">{{item.REAL_NAME}}</el-checkbox>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div v-show='!part' class="all-user-css">
                    <div class="all-checked">
                        <el-checkbox v-model="user_all_checked" @change="all_user_box">全选</el-checkbox>
                    </div>
                    <div class="one-checked scrollbar">
                        <ul>
                            <li v-for='(item,index) in has_user_data' :key='index' v-show="item.REAL_NAME.includes(filterText)">
                                <el-checkbox v-model="item.checked" @change="user_select_checkbox($event,index,item.ID)">
                                    <span style="width:80px;display:inline-block">{{item.REAL_NAME}}</span>
                                    {{item.ORG_ALL_NAME}}
                                </el-checkbox>
                            </li>
                        </ul>
                    </div>
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
                        <div style="width:200px">
                            <svg-icon icon-class='user'></svg-icon>
                            <span class="user-name">{{item.REAL_NAME}}</span>
                        </div>
                        <div class="flex">
                            <span class="part-name">{{item.ORG_NAME}}</span>
                            <i class="el-icon-close" @click="delete_user(index,item.ID)"></i>
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
import { generate_tree } from "@/utils";
export default {
  data() {
    return {
      part: 1,
      defaultProps: {
        children: "childrens",
        label: "name"
      },
      checked: false,
      filterText: "",
      has_select_user: [],
      all_checked: false,
      user_all_checked: false,
      has_user_data: [],
      user_list: [],
      part_tree: []
    };
  },
  props: {
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
    },
    address: {
      default: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    show(res) {
      if (res) {
        this.has_select_user = this.userList;
      }
    }
  },
  created() {
    this.$store.dispatch("readSession", SET_PART_TREE);
    this.$store.dispatch("readSession", SET_USER_LIST);
    var addressBookUserFlag;
    if (!this.address) {
      addressBookUserFlag = "Y";
    }
    this.$post(
      "gwt/system/sysOrg/getOrgTreeData",
      {
        defaultTopOrg: "",
        addressBookUserFlag
      },
      "json"
    )
      .then(res => {
        if (res.result !== "0000") {
          return;
        }
        this.part_tree = generate_tree(res.data.nodes);
      })
      .catch(res => {
        console.log(res);
      });
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
    ...mapGetters(["part_user_list"])
  },
  methods: {
    show_item(REAL_NAME) {
      return REAL_NAME.includes(this.filterText);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //切换筛选条件
    checkout_type(e) {
      if (e) {
        this.user_list = [];
      } else {
        for (var j = 0; j < this.part_user_list.length; j++) {
          this.part_user_list[j].checked = false;
          for (var i = 0; i < this.has_select_user.length; i++) {
            if (this.has_select_user[i].ID === this.part_user_list[j].ID) {
              this.part_user_list[j].checked = true;
            }
          }
        }
        this.has_user_data = [...this.part_user_list];
      }
    },
    //用户查询单点选择框
    user_select_checkbox(e, index, ID) {
      if (e) {
        this.has_select_user.push(this.has_user_data[index]);
      } else {
        for (var i = 0; i < this.has_select_user.length; i++) {
          if (this.has_select_user[i].ID === ID) {
            this.has_select_user.splice(i, 1);
          }
        }
      }
      this.change_all_checked();
    },
    //用户查询全选
    all_user_box(e) {
      if (e) {
        for (var i = 0; i < this.has_user_data.length; i++) {
          this.has_user_data[i].checked = true;
          this.has_select_user.push(this.has_user_data[i]);
        }
      } else {
        for (var j = 0; j < this.has_user_data.length; j++) {
          this.has_user_data[j].checked = false;
          for (var i = 0; i < this.has_select_user.length; i++) {
            if (this.has_select_user[i].ID === this.has_user_data[j].ID) {
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
      if (this.part) {
        this.all_checked = false;
        for (var i = 0; i < this.user_list.length; i++) {
          this.user_list[i].checked = false;
        }
      } else {
        this.user_all_checked = false;
        for (var i = 0; i < this.has_user_data.length; i++) {
          this.has_user_data[i].checked = false;
        }
      }
    },
    //删除一个选择的用户
    delete_user(index, ID) {
      this.has_select_user.splice(index, 1);
      if (this.part) {
        for (var i = 0; i < this.user_list.length; i++) {
          if (this.user_list[i].ID === ID) {
            this.user_list[i].checked = false;
          }
        }
      } else {
        for (var i = 0; i < this.has_user_data.length; i++) {
          if (this.has_user_data[i].ID === ID) {
            this.has_user_data[i].checked = false;
          }
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
            if (this.has_select_user[i].ID === this.user_list[j].ID) {
              this.has_select_user.splice(i, 1);
            }
          }
        }
      }
    },
    //动态改变 all-checked
    change_all_checked() {
      var index = 0;
      if (this.part) {
        for (var i = 0; i < this.user_list.length; i++) {
          if (this.user_list[i].checked) {
            index++;
          }
        }
        if (index === this.user_list.length) {
          this.all_checked = true;
        } else {
          this.all_checked = false;
        }
      } else {
        for (var i = 0; i < this.has_user_data.length; i++) {
          if (this.has_user_data[i].checked) {
            index++;
          }
        }
        if (index === this.has_user_data.length) {
          this.user_all_checked = true;
        } else {
          this.user_all_checked = false;
        }
      }
    },
    //选择一个用户
    select_checkbox(e, index, ID) {
      if (e) {
        this.has_select_user.push(this.user_list[index]);
      } else {
        for (var i = 0; i < this.has_select_user.length; i++) {
          if (this.has_select_user[i].ID === ID) {
            this.has_select_user.splice(i, 1);
          }
        }
      }
      this.change_all_checked();
    },
    //点击部门事件
    handleNodeClick(data) {
      this.$post(
        "gwt/system/sysUser/loadOrgUser",
        {
          orgId: data.id,
          fromCommon: "Y"
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          for (var j = 0; j < res.data.userOrgs.length; j++) {
            res.data.userOrgs[j].checked = false;
            for (var i = 0; i < this.has_select_user.length; i++) {
              if (res.data.userOrgs[j].ID === this.has_select_user[i].ID) {
                res.data.userOrgs[j].checked = true;
              }
            }
          }
          this.user_list = [...res.data.userOrgs];
          this.change_all_checked();
        })
        .catch(res => {
          console.log(res);
        });
    },
    onSubmit() {
      console.log(this.has_select_user);
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
    .add-user-container {
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
          .all-user-css {
            width: 100%;
            float: left;
            border: 1px solid #e7eaec;
            padding: 12px;
            height: 375px;
            background-color: #fff;
            .all-checked {
              border-bottom: 1px solid #cfcfcf;
              padding-bottom: 6px;
            }
            .one-checked {
              overflow: auto;
              overflow-x: hidden;
              width: 100%;
              height: 335px;
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
            .one-checked {
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
                font-size: 14px;
                color: #2e88e7;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 100px;
                display: inline-block;
                height: 20px;
              }
              .part-name {
                width: 80px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                display: inline-block;
                padding-right: 4px;
                height: 20px;
              }
              .el-icon-close {
                vertical-align: sub;
                height: 20px;
                cursor: pointer;
                color: #2e88e7;
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

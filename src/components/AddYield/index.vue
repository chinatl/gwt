<template>
<el-dialog :visible.sync="dialog" title='选择接收部门' class="select-user-dialog" v-drag :close-on-click-modal='false'>
    <div class="select-user-container">
        <div class="select-left">
            <div class="select-part-top">
                <el-input v-model="input" size="small" placeholder="请选择部门名称">
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <div class="select-part-bottom">
                <div class="select-part-yield">
                    <ul>
                        <li v-for="(item,index) in field_list" :key="index"
                        @click="check_field_part(index)"
                        :class="current === index ? 'avtive' : ''">{{item.name}}</li>
                    </ul>
                </div>
                <div class="common-temp scrollbar" style="height:240px;overflow:auto">
                  <el-tree 
                  ref="tree"
                  :data="data" :props="defaultProps"
                  :default-expanded-keys="expanded_keys"
                  :default-checked-keys='checked_keys'
                  @check="handleNodeClick"  show-checkbox  node-key="id"></el-tree>
                </div>
            </div>
        </div>
        <div class="select-right">
            <div class="has-selected">
                <span>已选({{has_select_arr.length}})</span>
                <el-button size="mini" @click="clear_all_list"><span class="span">清空</span></el-button>
            </div>
            <div class="has-yield-list">
                <ul>
                    <li v-for="(item,index) in has_select_arr" :key="index">
                        <div>
                            <svg-icon icon-class='tree'></svg-icon>
                            <span class="user-name">{{item.name}}</span>
                        </div>
                        <div @click="del_item(item,index)">
                            <i class="el-icon-close"></i>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="select-action-button">
        <el-button size="small" @click="cancel" v-wave>取消</el-button>
        <el-button type="primary" @click="onSubmit" size="small" v-wave>确定</el-button>
    </div>
</el-dialog>
</template>
<script>
import { generate_tree } from "@/utils";
export default {
  data() {
    return {
      part: "1",
      checked: false,
      input: "",
      activeNames: "",
      field_list: [],
      current: 0,
      data: [],
      defaultProps: {
        children: "childrens",
        label: "name"
      },
      expanded_keys: [],
      has_select_arr: []
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true
    },
    userList: {
      default: [],
      required: false
    }
  },
  watch: {
    show(res) {
      this.has_select_arr = this.userList;
    }
  },
  computed: {
    checked_keys() {
      if (this.field_list.length) {
        return this.field_list[this.current].checkedKeys;
      } else {
        return [];
      }
    },
    dialog: {
      get() {
        return this.show;
      },
      set(res) {
        this.$emit("close");
      }
    }
  },
  created() {
    this.$post(
      "gwt/system/sysOrg/getSelfDoaminOrgTree",
      {
        addressBookUserFlag: "",
        addressBookOrgFlag: "Y"
      },
      "json"
    ).then(res => {
      if (res.result !== "0000") {
        return;
      }
      this.field_list = generate_tree(res.data.nodes);
      for (var i = 0; i < this.field_list.length; i++) {
        this.field_list[i].checkedNodes = [];
        this.field_list[i].checkedKeys = [];
      }
      if (this.field_list.length) {
        this.data = this.field_list[0].childrens;
        if (this.data.length) {
          this.expanded_keys = [this.data[0].id];
        }
      }
    });
  },
  methods: {
    //删除一个
    del_item(item, index) {
      if (item.childrens && item.childrens.length) {
        this.$message({
          message: "所选部门有子部门，不可删除",
          type: "error"
        });
        return;
      }
      this.has_select_arr.splice(index, 1);
      for (
        var i = 0;
        i < this.field_list[this.current].checkedKeys.length;
        i++
      ) {
        if (this.field_list[this.current].checkedKeys[i] === item.id) {
          this.$refs.tree.setChecked(id, false);
          this.field_list[this.current].checkedNodes.splice(i, 1);
          this.field_list[this.current].checkedKeys.splice(i, 1);
        }
      }
    },
    clear_all_list() {
      this.has_select_arr = [];
      for (var i = 0; i < this.field_list.length; i++) {
        this.field_list[i].checkedNodes = [];
        this.field_list[i].checkedKeys = [];
      }
      this.$refs.tree.setCheckedKeys([]);
    },
    check_field_part(index) {
      this.current = index;
      this.data = this.field_list[index].childrens;
      if (this.data.length) {
        this.expanded_keys = [this.data[0].id];
      }
    },
    handleNodeClick(node, { checkedNodes, checkedKeys }) {
      this.field_list[this.current].checkedNodes = checkedNodes;
      this.field_list[this.current].checkedKeys = checkedKeys;
      var arr = [];
      for (var i = 0; i < this.field_list.length; i++) {
        [].push.apply(arr, this.field_list[i].checkedNodes);
      }
      this.has_select_arr = arr;
    },
    onSubmit() {
      this.$emit("submit", this.has_select_arr);
    },
    cancel() {
      this.$emit("close");
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
        height: 437px;
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
          background-color: #fff;
          overflow: hidden;
          .el-icon-star-off {
            color: #ffa227;
            font-size: 18px;
            margin: 0 4px;
          }
          .select-part-yield {
            border-bottom: dashed 1px #ddd;
            padding: 8px 0px;
            ul {
              overflow: hidden;
              li {
                float: left;
                padding: 4px 6px;
                border-radius: 50px;
                margin: 4px 6px 4px 0;
                line-height: 1.5;
                color: #3ba4f5;
                border: solid 1px #3ba4f5;
                background-color: #fff;
                &:hover {
                  color: #fff;
                  border: solid 1px #3ba4f5;
                  background-color: #3ba4f5;
                  cursor: pointer;
                }
                &.avtive {
                  color: #fff;
                  border: solid 1px #ffa227;
                  background-color: #ffa227;
                }
              }
            }
          }
          .select-breadcrumb {
            margin-top: 12px;
          }
          .select-yield {
            margin-top: 16px;
            .el-collapse-item__content {
              padding-bottom: 0px;
            }
            .yield-box {
              padding-left: 10px;
              padding-bottom: 4px;
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
        .has-yield-list {
          height: 395px;
          background-color: #f8f9fb;
          overflow-y: auto;
          ul {
            padding: 10px 12px;
            li {
              display: flex;
              justify-content: space-between;
              line-height: 28px;
              .svg-icon {
                font-size: 16px;
                vertical-align: sub;
              }
              .user-name {
                letter-spacing: 1px;
                font-size: 14px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                max-width: 180px;
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

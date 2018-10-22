<template>
<el-dialog :visible.sync="dialog" title='选择接收部门' class="select-user-dialog" v-drag :close-on-click-modal='false'>
  <div  v-loading ='loading'>
    <div class="select-user-container33">
        <div class="select-left">
            <div class="select-part-top">
                <el-select v-model="select_part" size="small" style="margin-right:6px;width:300px" @change="change_type_part" v-if="is_admin">
                    <el-option :value="item.dicId" :label="item.itemName" v-for='(item,index) in all_options' :key="index"></el-option>
                </el-select>
                <el-input v-model="filterText" size="small" placeholder="请选择部门名称">
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <div style="height:32px;line-height:32px;padding-left:35px;font-weight:900">
              <el-checkbox v-model="all_checked" 
              :indeterminate = 'indeterminate'
              @change="all_select_change">全选</el-checkbox>
            </div>
            <div class="select-part-bottom2 common-temp scrollbar" v-loading='tree_loading'>
                <el-tree
                  :expand-on-click-node='false'
                  :data="change_data"
                  show-checkbox
                  node-key="id"
                  @check="handleCheckChange"
                  :default-checked-keys='checked_keys'
                  :filter-node-method="filterNode"
                  ref="tree"
                  :check-strictly='true'
                  :highlight-current= 'true'
                  :default-expand-all='default_expand'
                  :props="defaultProps">
                </el-tree>
            </div>
        </div>
        <div class="select-right">
            <div class="has-selected">
                <span>已选({{has_select_arr.length}})</span>
                <el-button size="mini" v-wave @click="remove_all"><span class="span">清空</span></el-button>
            </div>
            <div class="has-yield-list scrollbar">
                <ul>
                    <li v-for='(item,index) in has_select_arr' :key="index">
                        <div>
                            <svg-icon icon-class='tree'></svg-icon>
                            <span class="user-name">{{item.allName}}</span>
                        </div>
                        <div @click="del_tree_node(item.id,index)">
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
  </div>
</el-dialog>
</template>
<script>
import { resolve_tree, generate_tree } from "@/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      select_part: "",
      part: "",
      filterText: "",
      tree_data: [],
      defaultProps: {
        children: "childrens",
        label: "name"
      },
      has_select_arr: [],
      checked_keys: [],
      all_tree_data: [],
      all_options: [],
      default_expand: false,
      tree_loading: false,
      all_checked: false,
      indeterminate: false
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true
    },
    loading: {
      type: Boolean,
      default: false,
      required: true
    },
    userList: {
      default: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    show(res) {
      if (res) {
        this.has_select_arr = [...this.userList];
        var arr = [];
        for (var i = 0; i < this.has_select_arr.length; i++) {
          var tempList = this.all_tree_data
            .filter(res => res.originId == this.has_select_arr[i].originId)
            .map(res => res.id);
          arr.push(...tempList);
        }
        this.checked_keys = arr;
        this.$nextTick(res => {
          this.$refs.tree.setCheckedKeys(this.checked_keys);
        });
      }
    }
  },
  computed: {
    ...mapGetters(["is_admin"]),
    change_data() {
      if (this.select_part) {
        return generate_tree(
          this.all_tree_data.filter(res => {
            if (res.nodeType === "ORG") {
              return res.deptType == this.select_part;
            } else {
              return true;
            }
          })
        );
      } else {
        return generate_tree(this.all_tree_data);
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
    this.get_all_data();
    this.get_all_dept();
  },
  methods: {
    get_tree_children_id(item) {
      var checkedKeys = [];
      var checkedNodes = [];
      if (!item.childrens || !item.childrens.length) {
        return {
          checkedKeys: [item.id],
          checkedNodes: [item]
        };
      } else {
        get_id([item]);
        return {
          checkedKeys,
          checkedNodes: checkedNodes.filter(res => res.nodeType === "ORG")
        };
      }
      function get_id(arr) {
        console.log(arr);
        if (!arr) {
          return;
        }
        for (var i = 0; i < arr.length; i++) {
          checkedKeys.push(arr[i].id);
          checkedNodes.push(arr[i]);
          get_id(arr[i].childrens);
        }
      }
    },
    all_select_change(e) {
      this.indeterminate = false;
      if (e) {
        this.has_select_arr = this.all_tree_data.filter(
          res => res.nodeType === "ORG"
        );
        this.checked_keys = this.all_tree_data.filter(res => res.id);
        this.$refs.tree.setCheckedKeys(this.all_tree_data.map(res => res.id));
      } else {
        this.checked_keys = [];
        this.has_select_arr = [];
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    change_type_part(val) {
      if (val) {
        this.default_expand = true;
      } else {
        this.default_expand = false;
      }
    },
    get_all_dept() {
      this.$post("gwt/system/sysOrg/getDeptType", {}, "json")
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.all_options = [
            {
              itemName: "全部类型",
              dicId: ""
            },
            ...res.data.getDeptType
          ];
        })
        .catch(res => {
          console.log(res);
        });
    },
    get_all_data() {
      this.tree_loading = true;
      this.$post(
        "gwt/system/sysOrg/getDoaminOrgTree",
        {
          userExetendId: "",
          addressBookUserFlag: "",
          addressBookOrgFlag: ""
        },
        "json"
      )
        .then(res => {
          this.tree_loading = false;

          if (res.result !== "0000") {
            return;
          }
          this.all_tree_data = res.data.nodes;
          var arr = res.data.nodes.map(res => {
            return res;
          });
          this.tree_data = generate_tree(arr);
        })
        .catch(res => {
          this.tree_loading = false;
        });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 清空
    remove_all() {
      this.has_select_arr = [];
      this.checkedKeys = [];
      this.$refs.tree.setCheckedKeys([]);
      this.is_all_checked();
    },
    del_tree_node(id, index) {
      this.has_select_arr.splice(index, 1);
      for (var j = 0; j < this.checked_keys.length; j++) {
        if (this.checked_keys[j] === id) {
          this.checked_keys.splice(j, 1);
        }
      }
      this.$refs.tree.setCheckedKeys(this.checked_keys);
      this.is_all_checked();
    },
    handleCheckChange(node) {
      var is_add = true;
      if (this.checked_keys.includes(node.id)) {
        is_add = false;
      } else {
        is_add = true;
      }
      var { checkedKeys, checkedNodes } = this.get_tree_children_id(node);
      if (is_add) {
        this.has_select_arr.push(...checkedNodes);
        this.checked_keys.push(...checkedKeys);
      } else {
        for (var i = 0; i < checkedKeys.length; i++) {
          for (var j = 0; j < this.checked_keys.length; j++) {
            if (this.checked_keys[j] === checkedKeys[i]) {
              this.checked_keys.splice(j, 1);
              continue;
            }
          }
        }
        for (var j = 0; j < checkedNodes.length; j++) {
          for (var i = 0; i < this.has_select_arr.length; i++) {
            if (checkedNodes[j].id === this.has_select_arr[i].id) {
              this.has_select_arr.splice(i, 1);
              continue;
            }
          }
        }
      }
      this.$refs.tree.setCheckedKeys(this.checked_keys);
      this.is_all_checked();
    },
    is_all_checked() {
      if (this.has_select_arr.length === 0) {
        this.all_checked = false;
        this.indeterminate = false;
      } else {
        if (
          this.has_select_arr.length ===
          this.all_tree_data.filter(res => res.nodeType === "ORG").length
        ) {
          this.all_checked = true;
          this.indeterminate = false;
        } else {
          this.indeterminate = true;
          this.all_checked = false;
        }
      }
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
    .select-user-container33 {
      overflow: hidden;
      .select-left {
        height: 457px;
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
        .select-part-bottom2 {
          padding: 0px 8px 20px 8px;
          background-color: #fff;
          overflow: auto;
          width: 100%;
          height: 395px;
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
                vertical-align: baseline;
              }
              .user-name {
                letter-spacing: 1px;
                font-size: 14px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                display: inline-block;
                width: 160px;
                height: 16px;
                line-height: 16px;
                margin-left: 5px;
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

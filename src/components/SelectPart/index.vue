<template>
<el-dialog :visible.sync="dialog" title='选择接收部门' class="select-user-dialog" v-drag :close-on-click-modal='false'>
  <div  v-loading ='loading'>
    <div class="select-user-container">
        <div class="select-left">
            <div class="select-part-top">
                <el-select v-model="select_part" size="small" style="margin-right:6px;width:300px" @change="change_type_part">
                    <el-option :value="item.dicId" :label="item.itemName" v-for='(item,index) in all_options' :key="index"></el-option>
                </el-select>
                <el-input v-model="filterText" size="small" placeholder="请选择部门名称">
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <div class="select-part-bottom common-temp scrollbar">
                <el-tree
                :check-strictly='true'
                :expand-on-click-node='false'
                :data="change_data"
                show-checkbox
                node-key="id"
                @check="handleCheckChange"
                :default-checked-keys='checked_keys'
                :filter-node-method="filterNode"
                ref="tree"
                :highlight-current= 'true'
                :default-expand-all='default_expand'
                :props="defaultProps">
                </el-tree>
            </div>
        </div>
         <!-- :default-expanded-keys="[2, 3]"
                :default-checked-keys="[5]" -->
        <div class="select-right">
            <div class="has-selected">
                <span>已选({{has_select_arr.length}})</span>
                <el-button size="mini" v-wave @click="remove_all"><span class="span">清空</span></el-button>
            </div>
            <div class="has-yield-list">
                <ul>
                    <li v-for='(item,index) in has_select_arr' :key="index">
                        <div>
                            <svg-icon icon-class='tree'></svg-icon>
                            <span class="user-name">{{item.name}}</span>
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
      default_expand: false
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
        return  generate_tree(this.all_tree_data)
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
          this.all_options =[{
            itemName:'全部类型',
            dicId:''
          },...res.data.getDeptType] ;
        })
        .catch(res => {
          console.log(res);
        });
    },
    get_all_data() {
      this.$post("gwt/system/sysOrg/getSelfDoaminOrgTree", {}, "json").then(
        res => {
          if (res.result !== "0000") {
            return;
          }
          this.all_tree_data = res.data.nodes;
          var arr = res.data.nodes.map(res => {
            if (res.nodeType === "DOMAIN" || res.nodeType === "DOMAIN_GROUP") {
              res.disabled = true;
            }
            return res;
          });
          this.tree_data = generate_tree(arr);
        }
      );
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 清空
    remove_all() {
      this.has_select_arr = [];
      this.$refs.tree.setCheckedKeys([]);
    },
    del_tree_node(id, index) {
      this.$refs.tree.setChecked(id, false);
      this.has_select_arr.splice(index, 1);
    },
    handleCheckChange(e, { checkedKeys, checkedNodes }) {
      console.log(e);
      this.checkedKeys = checkedKeys;
      this.has_select_arr = checkedNodes;
    },
    handleNodeClick() {},
    onSubmit() {
      this.$emit("submit", this.has_select_arr);
    },
    cancel() {
      this.$emit("close");
    },
    save_message() {},
    handleChange() {}
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
          padding: 10px 8px 20px 8px;
          background-color: #fff;
          overflow: auto;
          width: 100%;
          height: 100%;
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

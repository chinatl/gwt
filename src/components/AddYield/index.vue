<template>
<el-dialog :visible.sync="dialog" title='选择接收部门' class="select-user-dialog" v-drag :close-on-click-modal='false'>
    <div class="select-user-container">
        <div class="yield-select-left"  ref="yield_left">
            <div class="select-part-top">
                <el-input v-model="filterText" size="small" placeholder="请选择部门名称">
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
                <div class="common-temp scrollbar" style="height:320px;overflow:auto" v-loading='loading'>
                  <el-tree 
                  :expand-on-click-node='false'
                  ref="tree"
                  :data="data" :props="defaultProps"
                  :default-expanded-keys="expanded_keys"
                  :default-checked-keys='checked_keys'
                  :filter-node-method="filterNode"
                  :check-strictly='true'
                  @check="handleNodeClick"  show-checkbox  node-key="id"></el-tree>
                </div>
            </div>
        </div>
        <div class="yield-select-right">
            <div class="has-selected">
                <span>已选({{has_select_arr.length}})</span>
                <el-button size="mini" @click="clear_all_list"><span class="span">清空</span></el-button>
            </div>
            <div class="has-yield-list1 scrollbar"  ref="yield_right">
                <ul>
                    <li v-for="(item,index) in has_select_arr" :key="index">
                        <div>
                            <svg-icon icon-class='tree'></svg-icon>
                            <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start" v-if='item.name.length >10'>
                              <span class="user-name">{{item.name}}</span>
                            </el-tooltip>
                            <span class="user-name" v-else>{{item.name}}</span>
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
      loading: false,
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
      has_select_arr: [],
      filterText: "",
      all_tree_data: [],
      checked_keys: []
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
      if (res) {
        this.has_select_arr = [...this.userList];
        var arr = [];
        for (var i = 0; i < this.has_select_arr.length; i++) {
          var tempList = this.all_tree_data
            .filter(res => res.originId === this.has_select_arr[i].originId)
            .map(res => res.id);
          arr.push(...tempList);
        }
        this.checked_keys = arr;
        this.$nextTick(res => {
          this.$refs.tree.setCheckedKeys(this.checked_keys);
          this.$refs.yield_right.style.height =
            (this.$refs.yield_left.clientHeight - 40 )+ "px";
        });
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    dialog: {
      get() {
        return this.show;
      },
      set(res) {
        this.$emit("close", this.userList);
      }
    },
  },
  created() {
    this.$post("gwt/system/sysAddressBookGroup/getGroupTree", {}, "json").then(
      res => {
        if (res.result !== "0000") {
          return;
        }
        this.all_tree_data = res.data.nodes.map(res => {
          res.disabled = !res.originId;
          return res;
        });
        this.field_list = generate_tree(res.data.nodes);
        for (var i = 0; i < this.field_list.length; i++) {
          if (this.field_list[i].name === "常用联系人") {
            this.field_list.splice(i, 1);
          }
        }
        if (this.field_list.length) {
          this.data = this.field_list[0].childrens;
          if (this.data.length) {
            this.expanded_keys = [this.data[0].id];
          }
        }
      }
    );
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      if (data.allName) {
        return data.allName.indexOf(value) !== -1;
      } else {
        return data.name.indexOf(value) !== -1;
      }
    },
    //删除一个
    del_item(item, index) {
      this.has_select_arr.splice(index, 1);
      var has_select_arr = this.all_tree_data
        .filter(res => item.originId === res.originId)
        .map(res => res.id);
      for (var i = 0; i < has_select_arr.length; i++) {
        for (var j = 0; j < this.checked_keys.length; j++) {
          if (this.checked_keys[j] === has_select_arr[i]) {
            this.checked_keys.splice(j, 1);
          }
        }
      }
      this.$refs.tree.setCheckedKeys(this.checked_keys);
    },
    clear_all_list() {
      this.has_select_arr = [];
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
      if (node.originId === "") {
        this.$refs.tree.setChecked(node.id, false);
        return;
      }
      if (node.nodeType === "ORG_GROUP_CHILD") {
        return;
      }
      if (node.nodeType === "DOMAIN_GROUP") {
        return;
      }
      var is_add = true;
      if (this.checked_keys.includes(node.id)) {
        is_add = false;
      } else {
        is_add = true;
      }
      this.loading = true;
      this.$post(
        "gwt/notice/tbNoticeRecePermission/getAllReceByOrgId",
        {
          getAllFlag: "N",
          receiveNoticeType: sessionStorage.getItem("send_status"),
          orgId: node.id.replace(/.*\D/, "")
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.data.sysUserPageBean.totalCount - 0 === 0) {
            this.$refs.tree.setChecked(node.id, false);
            this.$message({
              message: "该部门无接收人！",
              type: "info"
            });
            return;
          }
          var has_select_arr = this.all_tree_data
            .filter(res => node.originId === res.originId)
            .map(res => res.id);
          if (is_add) {
            [].push.apply(this.checked_keys, has_select_arr);
            this.has_select_arr.push(node);
          } else {
            for (var i = 0; i < has_select_arr.length; i++) {
              for (var j = 0; j < this.checked_keys.length; j++) {
                if (this.checked_keys[j] === has_select_arr[i]) {
                  this.checked_keys.splice(j, 1);
                }
              }
            }
            for (var i = 0; i < this.has_select_arr.length; i++) {
              if (node.originId === this.has_select_arr[i].originId) {
                this.has_select_arr.splice(i, 1);
              }
            }
          }
          this.$refs.tree.setCheckedKeys(this.checked_keys);
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    },
    onSubmit() {
      this.$emit("submit", this.has_select_arr);
    },
    cancel() {
      this.$emit("close", this.userList);
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
      display: flex;
      justify-content: space-between;
      .yield-select-left {
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
      .yield-select-right {
        width: 260px;
        float: right;
        border-radius: 6px;
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
        .has-yield-list1 {
          background-color: #f8f9fb;
          overflow-y: auto;
          ul {
            padding: 10px 12px;
            li {
              display: flex;
              justify-content: space-between;
              line-height: 24px;
              .svg-icon {
                font-size: 16px;
                display: inline-block;
                vertical-align: super;
              }
              .user-name {
                letter-spacing: 1px;
                font-size: 14px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                max-width: 160px;
                display: inline-block;
                padding-right: 4px;
                padding-left: 4px;
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

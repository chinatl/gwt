<template>
    <t-layout>
        <div slot="left">
            <div class="mail-list">
                <el-button icon="el-icon-plus" size="small" type="success" @click="add_user">新增人员组</el-button>
                <el-button icon="el-icon-plus" size="small" type="primary" @click="add_group">新增部门组</el-button>
            </div>
            <div class="mail-content common-temp" >
                <div class="main-input">
                    <el-input size="small" v-model="keyword"></el-input>
                </div>
                <div style="overflow:auto" class="tree_data scrollbar">
                  <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"  
                  :highlight-current = 'true'
                  :default-expanded-keys='expanded_keys' node-key="id"></el-tree>
                </div>
            </div>
        </div>
        <div slot="right">
           <t-title title="通讯录">
               <div class="main-title">
                   <el-input size="small" placeholder="请输入姓名/手机号/部门名称"></el-input>
                   <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
               </div>
           </t-title>
           <div class="desc-group" v-if='temp_data.nodeType !== "nodeType"'>
              <i class="el-icon-caret-right"></i>
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>常用联系人</el-breadcrumb-item>
                <el-breadcrumb-item v-if="temp_data.pId === 'USER_GROUP_'">{{temp_data.name}}</el-breadcrumb-item>
              </el-breadcrumb>
              <span class="rename" @click="rename"
              v-if="(temp_data.nodeType === 'USER_GROUP_CHILD' ||
              temp_data.nodeType === 'ORG_GROUP_CHILD') &&
              temp_data.id !== 'USER_GROUP_0'
              ">
                <i class="el-icon-edit-outline"></i>重命名 
              </span>
              <span class="delete"
              @click='del_group'
              v-if="(temp_data.nodeType === 'USER_GROUP_CHILD' ||
              temp_data.nodeType === 'ORG_GROUP_CHILD') &&
              temp_data.id !== 'USER_GROUP_0'
              ">
                <i class="el-icon-close"></i>删除
              </span>
            </div>
            <div class="action-part-info" v-else>
              <div class="h3">
                运城扶贫办
                <span class="set-us">
                  <little-button name='设为常用'></little-button>
                </span>
              </div>
              <p>部门类型：<span>地市政府</span></p>
              <p>部门类型：<span>研祥</span></p>
            </div>
            <div class="common-action">
                <arrow-button></arrow-button>
                <div>
                  <el-button type="success" size="small" 
                  v-if='temp_data.nodeType === "USER_GROUP_CHILD"'
                  @click="add_user_usually" icon="el-icon-plus">新增人员</el-button>
                  <el-button type="success" size="small" 
                  v-if='temp_data.nodeType === "ORG_GROUP_CHILD"'
                  @click="add_part_usually"
                  icon="el-icon-plus">新增部门</el-button>
                </div>
            </div>
            <div class="common-table">
                <el-table
                    v-if='temp_data.nodeType === "USER_GROUP_CHILD"'
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="name"
                    align="center"
                    width="80"
                    label="选择">
                       <template slot-scope="scope">
                          <el-checkbox v-model="scope.row.checked"></el-checkbox>
                       </template>
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    align="center"
                    label="头像">
                    </el-table-column>
                    <el-table-column
                    prop="realName"
                    align="center"
                    label="姓名">
                    </el-table-column>
                    <el-table-column
                    prop="mobilePhone"
                    align="center"
                    label="手机号码">
                    </el-table-column>
                    <el-table-column
                    prop="fixedPhone"
                    align="center"
                    label="固定电话">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="操作"
                    align="center"
                    width="120"
                    >
                    <template slot-scope="scope">
                      <little-button name='移除' @click="remove_usually_user(scope.row.userxId)"></little-button>
                    </template>
                    </el-table-column>
                </el-table>
                <el-table   
                :data="part_tableData"
                border
                v-if='temp_data.nodeType === "ORG_GROUP_CHILD"'
                style="width: 100%">
                  <el-table-column
                    prop="name"
                    align="center"
                    width="80"
                    label="选择">
                       <template slot-scope="scope">
                          <el-checkbox v-model="scope.row.checked"></el-checkbox>
                       </template>
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    align="center"
                    label="图标">
                    </el-table-column>
                    <el-table-column
                    prop="orgAllName"
                    align="center"
                    label="部门">
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    align="center"
                    width="120"
                    >
                    <template slot-scope="scope">
                      <little-button name='移除'></little-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="common-page">
              <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="$store.getters.page_list"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="total">
            </el-pagination>
            </div>
        </div>
        <template slot="else">
          <add-user :show='add_dialog' @close='add_dialog = false' :loading='dialog_loading' @submit="submit_add_user"></add-user>
          <select-part :show="add_part_dialog"
           :loading='add_part_loading'
           @submit='submit_part'
           @close='add_part_dialog = false' ></select-part>
        </template>
    </t-layout>
</template>
<script>
import arrowButton from "@/components/Button/arrowButton";
import { delete_item } from "@/utils/user";
import { generate_tree } from "@/utils";
import littleButton from "@/components/Button/littleButton";
import qs from "qs";
import AddUser from "@/components/AddUser";
import SelectPart from "@/components/SelectPart";
import tree_data from "@/utils/text.json";
console.log(generate_tree(tree_data));
export default {
  components: {
    arrowButton,
    AddUser,
    littleButton,
    SelectPart
  },
  data() {
    return {
      add_dialog: false,
      dialog_loading: false,
      add_part_dialog: false,
      add_part_loading: false,
      keyword: "",
      defaultProps: {
        children: "childrens",
        label: "name"
      },
      data: [],
      tableData: [],
      part_tableData: [],
      expanded_keys: [],
      temp_data: {
        nodeType: "USER_GROUP_CHILD",
        name: "默认"
      },
      pageSize: 5,
      pageNo: 1,
      total: 0
    };
  },
  created() {
    this.get_group_tree();
  },
  methods: {
    handleCurrentChange(e) {
      this.pageNo = e;
      if (this.temp_data.nodeType === "USER_GROUP_CHILD") {
        this.search_message_user(this.pageSize, 1);
      } else if (this.nodeType === "ORG_GROUP_CHILD") {
        this.search_group_part(this.pageSize, 1);
      }
    },
    //
    handleSizeChange(e) {
      this.pageNo = 1;
      this.pageSize = e;
      if (this.temp_data.nodeType === "USER_GROUP_CHILD") {
        this.search_message_user(e, 1);
      } else if (this.nodeType === "ORG_GROUP_CHILD") {
        this.search_group_part(e, 1);
      }
    },
    //点击常用分组 查下面的组
    search_group_part(pageNo, pageSize) {
      this.$post(
        "gwt/system/sysAddressBookOrg/getOrgbyGroupId",
        {
          groupId: this.temp_data.id.replace(/.*\D/, ""),
          currentPage: pageNo,
          pageSize: pageSize
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.part_tableData = res.data.sysAddressBookOrgItemPageBean.datas;
          this.total = res.data.sysAddressBookOrgItemPageBean.totalCount - 0;
        })
        .catch(res => {
          console.log(res);
        });
    },
    //点常用联系人分组查联系人
    search_message_user(pageSize, pageNo) {
      this.$post(
        `gwt/system/sysAddressBookUser/getPersoByGroupId?${qs.stringify({
          pageSize: pageSize,
          pageNo: pageNo
        })}`,
        {
          groupId: this.temp_data.id.replace("USER_GROUP_", "")
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            this.tableData = [];
            return;
          }
          this.tableData = res.data.sysAddressBookPersonItemPageBean.datas;
          this.total = res.data.sysAddressBookPersonItemPageBean.totalCount - 0;
          sessionStorage.setItem(
            "mail-list/index/total",
            res.data.sysAddressBookPersonItemPageBean.totalCount
          );
        })
        .catch(res => {
          console.log(res);
        });
    },
    //弹窗确定修改人员
    submit_add_user(data) {
      this.dialog_loading = true;
      this.$post(
        "gwt/system/sysAddressBookUser/batchAddUsersForGroup",
        {
          userIds: data.map(res => res.ID).join(","),
          groupId: this.temp_data.id.replace(/.*\D/, "")
        },
        "json"
      )
        .then(res => {
          this.dialog_loading = false;
          if (res.result !== "0000") {
            this.$swal({
              title: "操作失败！",
              text: res.msg,
              type: "error",
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "确定",
              showConfirmButton: true
            });
            return;
          }
          this.add_dialog = false;
          this.$message({
            message: "人员操作成功",
            type: "success"
          });
        })
        .catch(res => {
          this.dialog_loading = false;
        });
    },
    //新增常用人员
    add_user_usually() {
      this.add_dialog = true;
    },
    //确定提交
    submit_part(arr) {
      this.add_part_loading = true;
      this.$post(
        "gwt/system/sysAddressBookOrg/batchAddOrgsForGroup",
        {
          orgIds: arr.map(res => res.replace(/.*\D/, "")).join(","),
          groupId: this.temp_data.id.replace(/.*\D/, "")
        },
        "json"
      )
        .then(res => {
          this.add_part_loading = false;
          if (res.result !== "0000") {
            this.$swal({
              title: "操作失败！",
              text: res.msg,
              type: "error",
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "确定",
              showConfirmButton: true
            });
            return;
          }
          this.add_part_dialog = false;
          this.$message({
            message: "部门操作成功",
            type: "success"
          });
        })
        .catch(res => {
          this.add_part_loading = false;
        });
    },
    add_part_usually() {
      this.add_part_dialog = true;
    },
    // 移除常用联系人
    remove_usually_user(userxId) {
      delete_item({
        url: "gwt/system/sysAddressBookUser/delUser",
        data: {
          groupId: 1331,
          userxId
        },
        title: "您确定要移除吗？",
        text: "移除后将无法恢复，请谨慎操作！",
        success: res => {
          this.search_message_user(this.pageSize, this.pageNo);
        }
      });
    },
    //设为常用联系人
    set_usually_user() {
      this.$swal({
        title: "选择常用联系人组",
        input: "select",
        inputOptions: {
          SRB: "塞尔维亚",
          UKR: "乌克兰",
          HRV: "克罗地亚"
        },
        inputPlaceholder: "默认分组",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: function(value) {
          return !value && "組名不能為空！";
        }
      }).then(function(result) {});
    },
    get_group_tree() {
      this.$post(
        "gwt/system/sysAddressBookGroup/getGroupTree",
        {
          userxId: "75"
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.data = generate_tree(res.data.nodes);
        })
        .catch(res => {
          console.log(res);
        });
    },
    handleNodeClick(data) {
      if (data.nodeType === "USER_GROUP" || data.nodeType === "ORG_GROUP") {
        this.expanded_keys[0] = data.id;
        return;
      }
      console.log(data)
      this.temp_data = data;
      if (data.nodeType === "USER_GROUP_CHILD") {
        this.search_message_user(this.pageSize, this.pageNo);
      }
      if (data.nodeType === "ORG_GROUP_CHILD") {
        this.search_group_part(this.pageSize, this.pageNo);
      }
    },
    add_user() {
      this.$swal({
        confirmButtonText: "确定",
        showCancelButton: true,
        cancelButtonText: "取消",
        title: "请输入常用联系人组名称",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          return !value && "組名不能為空！";
        }
      }).then(res => {
        if (res.value) {
          this.$post(
            "gwt/system/sysAddressBookGroup/addGroup",
            {
              groupName: res.value,
              groupType: 1
            },
            "json"
          )
            .then(res => {
              if (res.result !== "0000") {
                vue.swal({
                  title: "操作失败！",
                  text: res.msg,
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  showConfirmButton: true
                });
                return;
              }
              this.get_group_tree();
              this.$message({
                message: "新增人员分組成功！",
                type: "success"
              });
            })
            .catch(res => {});
        }
      });
    },
    add_group() {
      this.$swal({
        confirmButtonText: "确定",
        showCancelButton: true,
        cancelButtonText: "取消",
        title: "请输入常用部门组名称",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          return !value && "組名不能為空！";
        }
      }).then(res => {
        if (res.value) {
          this.$post(
            "gwt/system/sysAddressBookGroup/addGroup",
            {
              groupName: res.value,
              groupType: 2
            },
            "json"
          )
            .then(res => {
              if (res.result !== "0000") {
                vue.swal({
                  title: "操作失败！",
                  text: res.msg,
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  showConfirmButton: true
                });
                return;
              }
              this.get_group_tree();
              this.$message({
                message: "新增部门分組成功！",
                type: "success"
              });
            })
            .catch(res => {
              console.log(res);
            });
        }
      });
    },
    del_group() {},
    rename() {
      var title = "请输入新的部门分组名称";
      var groupType = 2;
      if (this.temp_data.nodeType === "USER_GROUP_CHILD") {
        title = "请输入新的联系人分组名称";
        groupType = 1;
      }
      this.$swal({
        confirmButtonText: "确定",
        showCancelButton: true,
        cancelButtonText: "取消",
        title,
        input: "text",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          return !value && "組名不能為空！";
        }
      }).then(res => {
        if (res.value) {
          this.$post(
            "gwt/system/sysAddressBookGroup/addGroup",
            {
              groupName: res.value,
              groupType,
              groupId: this.temp_data.id.replace(/.*\D/, "")
            },
            "json"
          )
            .then(res => {
              if (res.result !== "0000") {
                vue.swal({
                  title: "操作失败！",
                  text: res.msg,
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  showConfirmButton: true
                });
                return;
              }
              this.get_group_tree();
              this.$message({
                message: "新增部门分組成功！",
                type: "success"
              });
            })
            .catch(res => {
              console.log(res);
            });
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.action-part-info {
  background-color: #fff;
  color: inherit;
  padding: 15px 40px 0px;
  color: rgb(103, 106, 108);
  .h3 {
    font-weight: 600;
    margin-bottom: 12px;
    .set-us {
      float: right;
    }
  }
  p {
    font-size: 14px;
    span {
      font-weight: 600;
      line-height: 30px;
    }
  }
}
.mail-list {
  margin: 12px 20px;
  display: flex;
  button {
    flex: 1;
    font-size: 14px;
    &.el-button--small {
      padding: 9px 0;
    }
  }
}
.mail-content {
  margin: 0 20px;
  height: 550px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 6px;
  border-radius: 4px;
  .main-input {
    margin-bottom: 6px;
  }
  .tree_data {
    height: 498px;
  }
}
.main-title {
  float: right;
  width: 60%;
  display: flex;
  .el-button {
    margin-left: 5px;
    height: 32px;
    margin-top: 0;
  }
}
.desc-group {
  margin: 20px 20px 10px 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  .el-icon-caret-right {
    color: #57c7d5;
    font-size: 16px;
  }
  .rename {
    color: #f8ac5a;
    margin: 0 12px;
    margin-left: 20px;
    cursor: pointer;
    .svg-icon {
      margin-right: 4px;
    }
  }
  .delete {
    color: #ed5666;
    margin: 0 12px;
    cursor: pointer;
    .svg-icon {
      margin-right: 4px;
    }
  }
}
</style>
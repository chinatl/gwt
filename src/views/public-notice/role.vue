<template>
    <t-layout>
        <div slot="left">
            <div class="user-role">
                <el-button icon="el-icon-news" size="small" :type="current === 1 ? 'primary':'info'" @click="check_role(1)" v-wave>发布权限</el-button>
                <el-button icon="el-icon-message" size="small" :type="current === 2 ? 'primary':'info'" @click="check_role(2)" v-wave>接收权限</el-button>
                <el-button icon="el-icon-document" size="small" :type="current === 3 ? 'primary':'info'" @click="check_role(3)" v-wave>阅读权限</el-button>
            </div>
            <div class="role-page-content common-temp">
                <div class="main-input">
                    <el-input size="small" v-model="filterText" placeholder="搜索部门名称"></el-input>
                </div>
                <div class="flex">
                    <el-select size="small" v-show="current === 2" v-model="select.type" style="width:100%">
                        <el-option label="默认" value="0"></el-option>
                        <el-option label="会议通知" value="1"></el-option>
                        <el-option label="通知" value="2"></el-option>
                        <el-option label="材料征集" value="3"></el-option>
                    </el-select>
                </div>
                <div class="scrollbar ROLE-TABLE" :style="{
                  height:current === 2 ? '460px':'490px'
                }">
                  <el-tree :data="tree_data" :props="defaultProps"
                  :highlight-current = 'true'
                  :filter-node-method="filterNode"
                  ref="tree"
                  @node-click="handleNodeClick"></el-tree>
                </div>
            </div>
        </div>
        <div slot="right">
            <t-title>{{ current === 1 ? '跨部门通知权限' : current === 2 ? ' 通知接收权限' : '跨部门阅读权限'}}</t-title>
            <div class="common-action">
                <div>
                    <el-input size="medium" placeholder="请输入姓名/手机号"  v-model="searchParam"  style="width:200px" @keyup.native.enter="condition"></el-input>
                    <el-button type="primary" icon="el-icon-search" size="medium"  style="margin-right:8px" v-wave @click="condition">搜索</el-button>
                  
                </div>
                <div v-if='current === 2'>
                    <el-button type="success" icon="el-icon-plus" size="medium"  style="margin-right:8px" @click="add_user_dialog" v-wave>新增接收人</el-button>
                </div>
            </div>
            <div class="common-table">
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column prop="realName" align="center" label="姓名"></el-table-column>
                    <el-table-column  align="center" label="性别">
                    <template slot-scope="scope">
                      {{scope.row.sex === '0' ? '女':'男'}}
                    </template>
                    </el-table-column>
                    <el-table-column prop="name" align="center" label="人员级别">
                      <template slot-scope="scope">
                      {{scope.row.sysOrgUserX.userLevelName}}
                    </template>
                    </el-table-column>
                    <el-table-column prop="name" align="center" label="手机号码">
                       <template slot-scope="scope">
                      {{scope.row.mobilePhone}}
                    </template>
                    </el-table-column>
                    <el-table-column prop="phone" align="center" label="固定电话"></el-table-column>
                    <el-table-column
                    prop="name"
                    label="操作"
                    align="center"
                    width="120"
                    >
                    <template slot-scope="scope">
                        <little-button name='删除'  v-if='scope.row.sendFlag && current !== 2'  @click.native="del_send_sys(scope.row.sysOrgUserX.id)"></little-button>
                        <little-button name='添加' v-if='!scope.row.sendFlag && current !== 2' @click.native="add_send_sys(scope.row.sysOrgUserX.id)"></little-button>
                        <little-button name='删除' v-if="current === 2" @click.native="del_reve_sys(scope.row.sysOrgUserX.id)"></little-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="common-page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="pageNo"
              :page-sizes="$store.getters.page_list"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              background
              :total="total">
              </el-pagination>
            </div>
        </div> 
        <div slot="else">
          <add-user 
          :show='dialog' @close='dialog = false' 
          :user-list='has_select_user_list'
          @cancel='dialog = false'
          @submit="submit_user_dialog"></add-user>
        </div>
    </t-layout>
</template>
<script>
import addUserButton from "@/components/Button/addUserButton";
import addUser from "@/components/AddUser";
import { generate_tree } from "@/utils";
import littleButton from "@/components/Button/littleButton";
import { action_fail, delete_item } from "@/utils/user";
import qs from "qs";
export default {
  components: {
    addUserButton,
    littleButton,
    addUser
  },
  data() {
    return {
      filterText:'',
      dialog: false,
      has_select_user_list: [],
      pageSize: 5,
      pageNo: 1,
      total: 0,
      searchParam: "", //条件搜索参数
      dialog: false,
      current: 1, // 1.发布权限 2.接收权限 3.阅读权限
      keyword: "",
      defaultProps: {
        children: "childrens",
        label: "name"
      },
      tree_data: [],
      tableData: [],
      select: {
        type: "0"
      },
      temp_data: {}
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.get_tree_data();
  },
  beforeDestroy() {
    this.$store.commit("DEL_VIEW_BY_NAME", "权限维护");
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //增加用户弹窗
    add_user_dialog() {
      this.dialog = true;
    },
    //确定选择用户
    submit_user_dialog(list) {
      this.$post(
        "gwt/notice/tbNoticeRecePermission/saveReceByOrgId",
        {
          userIds: list.map(res => res.ID).join(","),
          orgId: this.temp_data.id,
          receiveNoticeType: this.select.type
        },
        "json"
      )
        .then(res => {
          if (action_fail(res)) return;
          this.dialog = false;
          this.init(this.pageSize, this.pageNo);
        })
        .catch(res => {
          console.log(res);
        });
    },
    search_all_sys() {
      this.$post(
        "gwt/notice/tbNoticeRecePermission/getAllReceByOrgId",
        {
          getAllFlag: "Y",
          orgId: this.temp_data.id,
          receiveNoticeType: this.select.type
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.has_select_user_list = res.data.sysUserList.map(res => {
            res.REAL_NAME = res.realName;
            res.ORG_ID = res.sysOrgUserX.orgId;
            res.ID = res.sysOrgUserX.id;
            res.USER_ID = res.sysOrgUserX.userId;
            return res;
          });
        })
        .catch(res => {});
    },
    //删除接收权限的人
    del_reve_sys(userId) {
      this.$post(
        "gwt/notice/tbNoticeRecePermission/del",
        {
          userId,
          receiveOrg: this.temp_data.id,
          receiveNoticeType: this.select.type
        },
        "json"
      )
        .then(res => {
          if (action_fail(res)) return;
          this.init(this.pageSize, this.pageNo);
        })
        .catch(res => {
          console.log(res);
        });
    },
    //删除发布权限
    del_send_sys(userId) {
      var url = "gwt/notice/tbNoticeQueryPermission/del";
      if (this.current === 1) {
        url = "gwt/notice/tbNoticeSendPermission/del";
      }
      this.$post(
        url,
        {
          userId
        },
        "json"
      )
        .then(res => {
          if (action_fail(res)) return;
          this.init(this.pageSize, this.pageNo);
        })
        .catch(res => {
          console.log(res);
        });
    },
    //增加发布权限
    add_send_sys(userId) {
      var url = "gwt/notice/tbNoticeQueryPermission/save";
      if (this.current === 1) {
        url = "gwt/notice/tbNoticeSendPermission/save";
      }
      this.$post(
        url,
        {
          userId
        },
        "json"
      )
        .then(res => {
          if (action_fail(res)) return;
          this.init(this.pageSize, this.pageNo);
        })
        .catch(res => {
          console.log(res);
        });
    },
    condition() {
      this.pageNo = 1;
      this.init(this.pageSize, 1);
    },
    handleSizeChange(e) {
      localStorage.setItem("user-manager/field/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("user-manager/field/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
    },
    init(pageSize, currentPage) {
      var orgId = this.temp_data.id;
      if (this.current === 1) {
        this.$post(
          `gwt/notice/tbNoticeSendPermission/getUserPowerByOrgId?${qs.stringify(
            {
              pageSize,
              currentPage
            }
          )}`,
          {
            orgId,
            searchParam: this.searchParam,
            selectedUsers: "",
            receiveNoticeType: "0"
          },
          "json"
        )
          .then(res => {
            if (res.result !== "0000") {
              return;
            }
            this.tableData = res.data.sysUserPageBean.datas;
            this.total = res.data.sysUserPageBean.totalCount - 0;
          })
          .catch(res => {
            console.log(res);
          });
      } else if (this.current === 2) {
        this.$post(
          `gwt/notice/tbNoticeRecePermission/getAllReceByOrgId?${qs.stringify({
            pageSize,
            currentPage
          })}`,
          {
            selectedUsers: "+",
            // getAllFlag: "N",
            orgId: orgId,
            receiveNoticeType: this.select.type
          },
          "json"
        )
          .then(res => {
            if (res.result !== "0000") {
              return;
            }
            this.tableData = res.data.sysUserPageBean.datas;
            this.total = res.data.sysUserPageBean.totalCount - 0;
            this.search_all_sys();
          })
          .catch(res => {
            console.log(res);
          });
      } else {
        this.$post(
          `gwt/notice/tbNoticeQueryPermission/getUserReadByOrgId?${qs.stringify(
            {
              pageSize,
              currentPage
            }
          )}`,
          {
            orgId,
            searchParam: this.searchParam,
            selectedUsers: "",
            receiveNoticeType: "0"
          },
          "json"
        )
          .then(res => {
            if (res.result !== "0000") {
              return;
            }
            this.tableData = res.data.sysUserPageBean.datas;
            this.total = res.data.sysUserPageBean.totalCount - 0;
          })
          .catch(res => {
            console.log(res);
          });
      }
    },
    get_tree_data() {
      this.$post("gwt/system/sysOrg/getOrgTreeData", {}, "json")
        .then(res => {
          this.tree_data = generate_tree(res.data.nodes);
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    check_role(index) {
      this.current = index;
      this.pageNo = 1;
      this.init(this.pageSize, 1);
    },
    handleNodeClick(data) {
      console.log(data);
      this.temp_data = data;
      this.init(this.pageSize, this.pageNo);
    },
    add_user() {
      this.$swal({
        title: "请输入常用联系人组名称",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showLoaderOnConfirm: true,
        preConfirm: function(email) {
          return new Promise(function(resolve, reject) {
            setTimeout(function() {
              if (email === "taken@example.com") {
                reject("该email已存在。");
              } else {
                resolve();
              }
            }, 2000);
          });
        },
        allowOutsideClick: false
      }).then(res => {
        if (res.dismiss === "cancel") {
          this.$swal({
            type: "error",
            title: "已取消"
          });
        } else {
          this.$swal({
            type: "success",
            title: "新增成功"
          });
        }
      });
    },
    add_group() {
      this.$swal({
        title: "请输入常用部门组名称",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showLoaderOnConfirm: true,
        preConfirm: function(email) {
          return new Promise(function(resolve, reject) {
            setTimeout(function() {
              if (email === "taken@example.com") {
                reject("该email已存在。");
              } else {
                resolve();
              }
            }, 2000);
          });
        },
        allowOutsideClick: false
      }).then(res => {
        if (res.dismiss === "cancel") {
          this.$swal({
            type: "error",
            title: "已取消"
          });
        } else {
          this.$swal({
            type: "success",
            title: "新增成功"
          });
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.ROLE-TABLE {
  overflow-y: auto;
  overflow-x: hidden;
}
.user-role {
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
.role-page-content {
  margin: 0 20px;
  height: 550px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 6px;
  border-radius: 4px;
  .main-input {
    margin-top: 2px;
    margin-bottom: 10px;
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
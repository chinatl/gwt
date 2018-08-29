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
                    <el-input size="small" v-model="keyword" placeholder="搜索部门名称"></el-input>
                </div>
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
        </div>
        <div slot="right">
            <t-title>{{ current === 1 ? '跨部门通知权限' : current === 2 ? ' 通知接收权限' : '跨部门阅读权限'}}</t-title>
            <div class="common-action">
                <div>
                    <el-input size="medium" placeholder="请输入姓名/手机号"  v-model="select.keyword"  style="width:200px"></el-input>
                    <el-button type="primary" icon="el-icon-search" size="medium"  style="margin-right:8px" v-wave>搜索</el-button>
                    <el-select size="medium" v-show="current === 2" v-model="select.type" style="width:120px">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="会议通知" value="1"></el-option>
                        <el-option label="通知" value="2"></el-option>
                        <el-option label="材料征集" value="3"></el-option>
                    </el-select>
                </div>
                <div v-if='current === 2'>
                    <el-button type="success" icon="el-icon-plus" size="medium"  style="margin-right:8px" @click="dialog = true" v-wave>新增接收人</el-button>
                </div>
            </div>
            <div class="common-table">
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column prop="name" align="center" label="姓名"></el-table-column>
                    <el-table-column prop="name" align="center" label="性别"></el-table-column>
                    <el-table-column prop="name" align="center" label="人员级别"></el-table-column>
                    <el-table-column prop="name" align="center" label="手机号码"></el-table-column>
                    <el-table-column prop="name" align="center" label="固定电话"></el-table-column>
                    <el-table-column
                    prop="name"
                    label="操作"
                    align="center"
                    width="120"
                    >
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="danger"
                        icon="el-icon-minus"
                        @click="handleDelete(scope.$index, scope.row)" v-if='Math.random() < .5' v-wave>删除</el-button>
                        <el-button
                        size="mini"
                        type="success"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.$index, scope.row)" v-else v-wave>添加</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
        </div> 
        <template slot="else">
            <add-user :show='dialog' @close='dialog = false'></add-user>
        </template>
    </t-layout>
</template>
<script>
import arrowButton from "@/components/Button/arrowButton";
import addUserButton from "@/components/Button/addUserButton";
import addUser from "@/components/AddUser";
export default {
  components: {
    arrowButton,
    addUserButton,
    addUser
  },
  data() {
    return {
      dialog: false,
      current: 1, // 1.发布权限 2.接收权限 3.阅读权限
      keyword: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      data: [
        {
          label: "运城市",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      tableData: [
        {
          name: "陕西测试部门1",
          type: "地市政府"
        },
        {
          name: "NB电子竞技俱乐部",
          type: "地市政府"
        }
      ],
      select: {
        type: "0"
      }
    };
  },
  methods: {
    check_role(index) {
      this.current = index;
    },
    handleNodeClick(data) {
      console.log(data);
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
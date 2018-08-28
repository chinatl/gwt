<template>
    <t-layout>
        <div slot="left">
            <div class="mail-list">
                <el-button icon="el-icon-plus" size="small" type="success" @click="add_user">新增人员组</el-button>
                <el-button icon="el-icon-plus" size="small" type="primary" @click="add_group">新增部门组</el-button>
            </div>
            <div class="mail-content common-temp">
                <div class="main-input">
                    <el-input size="small" v-model="keyword"></el-input>
                </div>
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
        </div>
        <div slot="right">
           <t-title title="通讯录">
               <div class="main-title">
                   <el-input size="small" placeholder="请输入姓名/手机号/部门名称"></el-input>
                   <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
               </div>
           </t-title>
           <div class="desc-group">
              <i class="el-icon-caret-right"></i>
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>卫生局</el-breadcrumb-item>
                <el-breadcrumb-item>卫生局</el-breadcrumb-item>
              </el-breadcrumb>
              <span class="rename">
                <i class="el-icon-edit-outline"></i>重命名 
              </span>
              <span class="delete">
                <i class="el-icon-close"></i>删除
              </span>
            </div>
            <div class="common-action">
                <arrow-button></arrow-button>
                <div>
                  <el-button type="success" size="small">新增部门</el-button>
                </div>
            </div>
            <div class="common-table">
                <el-table
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
                    label="部门名称">
                    </el-table-column>
                    <el-table-column
                    prop="type"
                    align="center"
                    label="部门">
                    </el-table-column>
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
                        icon="el-icon-delete"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <template slot="else"></template>
    </t-layout>
</template>
<script>
import arrowButton from "@/components/Button/arrowButton";
export default {
  components: {
    arrowButton
  },
  data() {
    return {
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
      ]
    };
  },
  methods: {
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
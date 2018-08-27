<template>
    <div>
        <div class="field-desc">
            <div class="common-title">{{field_manager_data.title}}
                <el-button size='medium' type='success' icon="el-icon-edit-outline" @click="edit_role">编辑域</el-button>
            </div>
            <div class="field-con">
                <h3>已授权应用</h3>
                <ul>
                    <li>
                        <img :src="require('@/assets/imgs/yingyong.png')" alt="">
                        <p>网站信息</p>
                    </li>
                    <li>
                        <img :src="require('@/assets/imgs/yingyong.png')" alt="">
                        <p>公务通知</p>
                    </li>
                    <li @click="go_field_auth">
                        <img :src="require('@/assets/imgs/add-1.png')" alt="">
                        <p>授权应用</p>
                    </li>
                </ul>
            </div>
        </div>
        <t-layout>
          <div slot="left">
            <div class="desc-action">
              <el-button type="success" icon="el-icon-plus" style="width:100%" @click="add_group">新增分组</el-button>
            </div>
            <div class="desc-action-content">
              <ul class="common-table-bar">
                <li>根目录</li>
                <li class="current">卫生局</li>
                <li>工商局</li>
                <li>省政府办公厅</li>
                <li>教育局</li>
                <li>司法局</li>
              </ul>
            </div>
          </div>
          <div slot="right">
            <div class="desc-group">
              <i class="el-icon-caret-right"></i>
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>卫生局</el-breadcrumb-item>
                <el-breadcrumb-item>卫生局</el-breadcrumb-item>
              </el-breadcrumb>
              <span class="rename" @click="update_grounp">
                <i class="el-icon-edit-outline"></i>重命名 
              </span>
              <span class="delete">
                <i class="el-icon-close"></i>删除
              </span>
            </div>
            <div class="common-action">
                <div>
                    <el-input v-model="input" placeholder="请输入部门名称" style="width:200px" size='medium'></el-input>
                    <el-button type="primary" icon="el-icon-search" size='medium'>搜索</el-button>
                </div>
                <div>
                    排序：
                    <span class="btn">
                        <svg-icon icon-class='置顶'></svg-icon>
                    </span>
                    <span class="btn">
                        <svg-icon icon-class='上箭头'></svg-icon>
                    </span>
                    <span class="btn">
                        <svg-icon icon-class='下箭头'></svg-icon>
                    </span>
                    <span class="btn">
                        <svg-icon icon-class='置底'></svg-icon>
                    </span>
                    <el-button type="success" icon="el-icon-plus" size='medium' @click="add_part">添加部门</el-button>
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
                    label="部门类型">
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
            <div class="common-page">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNo"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                background
                :total="40">
                </el-pagination>
            </div>
          </div>
        </t-layout>
        <!-- 域编辑 -->
        <el-dialog
            title="编辑域"
            class="common-dialog padding0"
            :visible.sync="role_visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules"  class="demo-ruleForm">
                <el-form-item label="域名称" prop='title'>
                    <el-input v-model="form.title" size="small"></el-input>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
        </el-dialog>
        <!-- 分组编辑 -->
        <el-dialog
            :title="group_type === 'add' ? '新增域分组' :'编辑域分组'"
            class="common-dialog padding0"
            :visible.sync="group_visible">
            <el-form ref="form" :model="form" label-width="120px" :rules="rules"  class="demo-ruleForm">
                <el-form-item label="域分组名称" prop='title'>
                    <el-input v-model="form.title" size="small" placeholder="请输入域分组名称"></el-input>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
        </el-dialog>
        <!-- 添加部门 -->
        <add-part :show='part_visible' @close='part_visible = false'></add-part>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import formButton from "@/components/Button/formButton";
import AddPart from "@/components/AddPart";
export default {
  components: {
    formButton,
    AddPart
  },
  data() {
    return {
      input: "",
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
      rules: {
        title: [{ required: true, message: "请输入域名城", trigger: "blur" }]
      },
      role_visible: false,
      group_visible: false,
      group_type: "add",
      part_visible: false,
      pageNo: 1,
      pageSize: 5,
      form: {
        title: ""
      }
    };
  },
  computed: {
    ...mapGetters(["field_manager_data"])
  },
  methods: {
    add_part() {
      this.part_visible = true;
    },
    //新增域分组
    add_group() {
      this.group_type = "add";
      this.group_visible = true;
    },
    update_grounp() {
      this.group_type = "update";
      this.group_visible = true;
    },
    onSubmit() {
      this.role_visible = false;
    },
    //
    onCancel() {
      this.role_visible = false;
    },
    edit_role() {
      this.role_visible = true;
      this.form.title = this.field_manager_data.title;
    },
    go_field_auth() {
      this.$router.push({
        path: "/user-manager/field-auth"
      });
    },
    handleDelete(index, item) {},
    handleSizeChange() {},
    handleCurrentChange() {}
  }
};
</script>


<style rel="stylesheet/scss" lang="scss" >
.field-desc {
  background-color: #fff;
  border-radius: 6px;
  padding-bottom: 10px;
  margin-bottom: 20px;
  &.mt {
    margin-top: 24px;
  }
  .field-con {
    padding: 20px 20px 10px 20px;
    h3 {
      letter-spacing: 1px;
      font-size: 16px;
      padding-left: 5px;
      color: #676a6c;
      font-weight: normal;
    }
    ul {
      margin-top: 15px;
      overflow: hidden;
      li {
        border: solid 1px #c9daee;
        width: 95px;
        height: 95px;
        border-radius: 10px;
        text-align: center;
        padding-top: 10px;
        display: inline-block;
        margin-right: 15px;
        margin-bottom: 10px;
        float: left;
        img {
          height: 50px;
        }
        p {
          font-size: 12px;
          margin-top: 8px;
        }
      }
    }
  }
  overflow: hidden;
  .field-desc-left {
    float: left;
    width: 22%;
  }
}
.desc-action {
  margin: 12px 20px;
  font-size: 16px;
}
.desc-action-content {
  margin: 0 20px;
  height: 550px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 6px;
  border-radius: 4px;
  border-radius: 5px;
  color: #4d637b;
  ul {
    li {
      font-weight: 600;
      font-size: 15px;
    }
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
.btn {
  background-color: #23c6c8;
  color: #fff;
  padding: 6px;
  font-size: 16px;
  border-radius: 4px;
  margin-left: 6px;
  &:hover {
    cursor: pointer;
    background-color: rgba(35, 198, 200, 0.8);
  }
  &:active {
    cursor: pointer;
    background-color: rgba(35, 198, 200, 1);
  }
}
</style>

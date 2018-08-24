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
        <div class="field-desc mt">
            <div class="common-action">
                <div>
                    <el-input v-model="input" placeholder="请输入部门名称" style="width:200px" size='medium'></el-input>
                    <el-button type="primary" icon="el-icon-search" size='medium'>搜索</el-button>
                </div>
                <div>
                    <el-button type="success" icon="el-icon-plus" size='medium'>添加部门</el-button>
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
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import formButton from "@/components/Button/formButton";
export default {
  components: {
    formButton
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
}
</style>

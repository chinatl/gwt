<template>
    <div class="common">
        <t-title title="域管理"></t-title>
        <div class="common-action">
            <div>
                <el-input v-model="input" placeholder="请输入域名称" style="width:200px" size='medium'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium'>搜索</el-button>
            </div>
            <div>
                <el-button type="success" icon="el-icon-plus" size='medium' @click="add_role">新增域</el-button>
            </div>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                prop="title"
                align="center"
                label="域名城">
                </el-table-column>
                <el-table-column
                prop="name"
                label="操作"
                align="center"
                >
                 <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type='success'
                    icon="el-icon-edit-outline"
                    @click="handleEdit(scope.$index, scope.row)">编辑详情</el-button>
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
        <el-dialog
            title="新增域"
            class="common-dialog padding0"
            :visible.sync="role_visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules"  class="demo-ruleForm">
                <el-form-item label="域名称" prop='name'>
                    <el-input v-model="form.name" size="small"></el-input>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import formButton from "@/components/Button/formButton";
export default {
  components: {
    formButton
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 5,
      input: "",
      tableData: [
        {
          title: "公务通域"
        },
        {
          title: "延安圈1"
        },
        {
          title: "85"
        },
        {
          title: "7"
        },
        {
          title: "17"
        }
      ],
      rules: {
        name: [{ required: true, message: "请输入域名城", trigger: "blur" }]
      },
      role_visible: false,
      form: {
        name: ""
      }
    };
  },
  methods: {
    onSubmit() {
      this.role_visible = false;
    },
    //
    onCancel() {
      this.role_visible = false;
    },
    //新增域
    add_role() {
      this.role_visible = true;
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    handleEdit(index, item) {
      this.$store.commit("SET_FIELD_MANAGER_DATA", item);
      this.$router.push({
        path: "/user-manager/field-desc"
      });
    },
    handleDelete() {}
  }
};
</script>

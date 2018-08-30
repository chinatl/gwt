<template>
    <div class="common">
        <t-title title="课程类别管理">
            <el-button icon="el-icon-plus" type="success" size="medium" @click="group_visible = true">添加课程类别</el-button>
        </t-title>
        <div class="common-action"></div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                prop="title"
                align="center"
                label="课程类别名称">
                </el-table-column>
                <el-table-column
                prop="title"
                align="center"
                label="创建人">
                </el-table-column>
                <el-table-column
                prop="title"
                align="center"
                label="创建时间">
                </el-table-column>
                <el-table-column
                prop="name"
                label="操作"
                align="center"
                >
                 <template slot-scope="scope">
                    <!-- <el-button
                    size="mini"
                    type='success'
                    icon="el-icon-edit-outline"
                    @click="edit_role(scope.$index, scope.row)" v-wave>编辑</el-button> -->
                    <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.$index, scope.row)" v-wave>删除</el-button>
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
        <!-- 弹窗 -->
        <el-dialog
            :title="group_type === 'add' ? '添加课程类别' :'修改课程类别'"
            class="common-dialog"
            :visible.sync="group_visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules"  class="demo-ruleForm">
                <el-form-item label="类别名称" prop='title'>
                    <el-input v-model="form.title" size="small" placeholder=""></el-input>
                </el-form-item>
                <form-button @cancel='onCancel_resource' @submit="onSubmit_resource"></form-button>
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
      pageSize: 10,
      select: {},
      tableData: [],
      group_type: "add",
      group_visible: false,
      form: {},
      rules: {
        title: [
          {
            required: true,
            tigger: "blur",
            message: "请输入课程类别名称"
          }
        ]
      }
    };
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    onCancel_resource() {
      this.group_visible = false;
    },
    onSubmit_resource() {
      this.group_visible = false;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.edu-train-select {
  padding: 0 20px;
  margin-bottom: 10px;
  display: flex;
  width: 800px;
  .el-select {
    margin-right: 12px;
  }
  .el-input--medium {
    margin-right: 12px;
  }
}
</style>


<template>
    <div class="common">
        <t-title>题库列表</t-title>
        <div class="common-action">
            <div>
                <el-input v-model="input" placeholder="请输入角色名称" style="width:200px" size='medium'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave>查询</el-button>
            </div>
            <div>
                <el-button type="success" icon="el-icon-plus" size='medium' @click="add_role" v-wave>创建题库</el-button>
            </div>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column  prop="title" align="center"  label="题库名称"></el-table-column>
                <el-table-column  prop="title" align="center"  label="试题数量"></el-table-column>
                <el-table-column  prop="title" align="center"  label="题库状态"></el-table-column>
                <el-table-column  prop="title" align="center"  label="说明"></el-table-column>
                <el-table-column  prop="title" align="center"  label="创建信息"></el-table-column>
                <el-table-column  prop="title" align="center"  label="最后修改"></el-table-column>
                <el-table-column
                prop="name"
                label="操作"
                align="center"
                width="160"
                >
                 <template slot-scope="scope">
                     <little-button name='编辑' @click="edit_role(scope.$index, scope.row)"></little-button>
                     <little-button name='删除' @click="handleDelete(scope.$index, scope.row)"></little-button>
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
        <!-- 角色新增弹出框 -->
            <el-dialog
            :title="role_type === 'add' ? '创建题库':'修改题库'"
            class="common-dialog"
            v-drag
            :visible.sync="role_visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules"  class="demo-ruleForm">
                <el-form-item label="题库名称" prop='name'>
                    <el-input v-model="form.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="题库状态" prop='name'>
                    <el-select v-model="form.name" size="small" style="width：100%">
                        <el-option label='公开' value="1"></el-option>
                        <el-option label='内部' value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明">
                        <el-input type="textarea" v-model="form.desc" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import formButton from "@/components/Button/formButton";
import littleButton from "@/components/Button/littleButton";
export default {
  components: {
    formButton,
    littleButton
  },
  data() {
    return {
      role_type: "add",
      pageNo: 1,
      pageSize: 5,
      input: "",
      role_visible: false,
      form: {
        name
      },
      tableData: [
        {
          title: "测试角色11111"
        },
        {
          title: "测试角色2"
        },
        {
          title: "测试角色3"
        },
        {
          title: "LOL分部"
        },
        {
          title: "公告角色edit"
        },
        {
          title: "是的撒"
        },
        {
          title: "系统创建角色1"
        },
        {
          title: "头柔旨凤嘉替叶低码洞"
        }
      ],
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入角色描述", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    handleDelete() {},
    onSubmit() {},
    onCancel() {},
    add_role() {
      this.role_type = "add";
      this.role_visible = true;
    },
    edit_role() {
      this.role_type = "update";
      this.role_visible = true;
    }
  }
};
</script>

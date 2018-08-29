<template>
    <div class="common">
        <t-title>角色管理</t-title>
        <div class="common-action">
            <div>
                <el-input v-model="input" placeholder="请输入角色名称" style="width:200px" size='medium'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave>搜索</el-button>
            </div>
            <div>
                <el-button type="success" icon="el-icon-plus" size='medium' @click="add_role" v-wave>新增角色</el-button>
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
                label="角色名称">
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
                    @click="edit_role(scope.$index, scope.row)" v-wave>编辑</el-button>
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
        <!-- 角色新增弹出框 -->
            <el-dialog
            :title="role_type === 'add' ? '新增角色':'编辑角色'"
            class="common-dialog padding0"
            v-drag
            :visible.sync="role_visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules"  class="demo-ruleForm">
                <el-form-item label="角色名称" prop='name'>
                    <el-input v-model="form.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="公务通知">
                    <el-checkbox-group v-model="form.type">
                        <el-checkbox label="材料征集" name="type"></el-checkbox>
                        <el-checkbox label="创建通知" name="type1"></el-checkbox>
                        <el-checkbox label="通知维护" name="type2"></el-checkbox>
                        <el-checkbox label="权限维护" name="type3"></el-checkbox>
                        <el-checkbox label="草稿箱" name="type4"></el-checkbox>
                        <el-checkbox label="已发通知" name="type5"></el-checkbox>
                        <el-checkbox label="通知签收" name="type6"></el-checkbox>
                        <el-checkbox label="创建会议" name="type7"></el-checkbox>
                        <el-checkbox label="已转发通知" name="type8"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="网站信息">
                    <el-checkbox-group v-model="form.web">
                        <el-checkbox label="通知签收" name="type"></el-checkbox>
                        <el-checkbox label="已发通知" name="type"></el-checkbox>
                        <el-checkbox label="已转发通知" name="type"></el-checkbox>
                        <el-checkbox label="权限维护" name="type"></el-checkbox>
                        <el-checkbox label="草稿箱" name="type"></el-checkbox>
                        <el-checkbox label="创建通知" name="type"></el-checkbox>
                        <el-checkbox label="通知维护" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="顶级">
                    <el-checkbox-group v-model="form.web">
                        <el-checkbox label="文件转换" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="一门式2.0">
                    <el-checkbox-group v-model="form.web">
                        <el-checkbox label="业务帮助信息" name="type"></el-checkbox>
                        <el-checkbox label="我的经办" name="type"></el-checkbox>
                        <el-checkbox label="教育资助统计" name="type"></el-checkbox>
                        <el-checkbox label="临时救助统计" name="type"></el-checkbox>
                        <el-checkbox label="我的待办" name="type"></el-checkbox>
                        <el-checkbox label="创建角色" name="type"></el-checkbox>
                        <el-checkbox label="流程分配" name="type"></el-checkbox>
                        <el-checkbox label="流程上传" name="type"></el-checkbox>
                        <el-checkbox label="系统管理" name="type"></el-checkbox>
                        <el-checkbox label="业务办理" name="type"></el-checkbox>
                        <el-checkbox label="一门式字典" name="type"></el-checkbox>
                        <el-checkbox label="通业务信息维护知维护" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="教育培训">
                    <el-checkbox-group v-model="form.web">
                        <el-checkbox label="课程类别" name="type"></el-checkbox>
                        <el-checkbox label="课程列表" name="type"></el-checkbox>
                        <el-checkbox label="我的课程" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="在线考试">
                    <el-checkbox-group v-model="form.web">
                        <el-checkbox label="历史考试" name="type"></el-checkbox>
                        <el-checkbox label="我的考试" name="type"></el-checkbox>
                        <el-checkbox label="试卷管理" name="type"></el-checkbox>
                        <el-checkbox label="题库列表" name="type"></el-checkbox>
                        <el-checkbox label="在线考试" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                        <el-input type="textarea" v-model="form.desc" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
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

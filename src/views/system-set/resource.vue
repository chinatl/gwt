<template>
    <div>
        <div class="common">
            <t-title title=" 本地资源"></t-title>
            <div class="padding20 resource-title">
                应用名称：<span class="resource-name">公务通</span>
                <span class="add-title" @click="add_resource"><el-button type="success" size='small' icon="el-icon-plus" v-wave>添加</el-button></span>
            </div>
            <div class="common-table">
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="title"
                    align="center"
                    label="功能名称">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="功能描述"
                    align="center"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="操作"
                    align="center"
                    >
                      <template slot-scope="scope">
                        <el-button type="primary" size='mini' @click.native="edit_resource" v-wave>修改</el-button>
                        <el-button type="danger" size='mini' v-wave>删除</el-button>
                      </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- <div class="common sourece-page">
          <t-title title="功能获取"></t-title>
            <div class="page-form">
              <el-form label-width="120px" >
                <el-form-item label="功能获取地址：" prop='name'>
                    <div class="flex">
                        <el-input v-model="url" size="small" readonly></el-input>
                        <el-button size="small" icon="el-icon-edit-outline" type="primary" @click="get_function" v-wave>获取功能</el-button>
                    </div>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
          </div>
        </div> -->
        <el-dialog
            :title="group_type === 'add' ? '新增资源' :'编辑资源'"
            class="common-dialog"
            :visible.sync="group_visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules"  class="demo-ruleForm">
                <el-form-item label="功能名称" prop='title'>
                    <el-input v-model="form.title" size="small" placeholder="请输入功能名称"></el-input>
                </el-form-item>
                <el-form-item label="功能描述">
                    <el-input v-model="form.title" size="small" placeholder="请输入功能描述"></el-input>
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
      group_type: "",
      group_visible: false,
      url: "http://192.168.31.47:8888/sysres",
      tableData: [
        {
          title: "公务通资源名称5",
          name: "公务通资源备注5"
        },
        {
          title: "公务通资源名称4",
          name: "公务通资源备注4"
        },
        {
          title: "公务通资源名称3",
          name: "公务通资源备注3"
        },
        {
          title: "公务通资源名称2",
          name: "公务通资源备注2"
        },
        {
          title: "公务通资源名称1",
          name: "公务通资源备注1"
        }
      ],
      form: {
        name: ""
      },
      rules: {
        title: [{ required: true, message: "请输入域名城", trigger: "blur" }]
      }
    };
  },
  methods: {
    add_resource() {
      this.group_visible = true;
      this.group_type = "add";
    },
    edit_resource() {
      this.group_visible = true;
      this.group_type = "update";
    },
    onCancel_resource() {
      this.group_visible = false;
    },
    onSubmit_resource() {
      this.group_visible = false;
    },
    get_function() {
      this.$swal({
        title: "获取应用功能失败",
        text:
          "调用接口 http://192.168.31.47:8888/sysres异常,错误详情:No route to host",
        type: "error",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定"
      });
    },
    onSubmit() {
      this.$swal({
        title: "提示信息",
        text: "应用资源的操作状态未指定",
        type: "error",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定"
      });
    },
    //
    onCancel() {
      this.$router.push({ path: "/system-set/app" });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.resource-title {
  font-size: 16px;
  font-weight: 600;
  color: rgb(103, 106, 108);
  margin-bottom: 10px;
  .resource-name {
    color: #3ba4f5;
  }
  .add-title {
    float: right;
  }
}
.sourece-page {
  margin-top: 20px;
}
</style>


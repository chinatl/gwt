<template>
    <div>
        <div class="common">
            <t-title title=" 本地资源"></t-title>
            <div class="padding20 resource-title">
                应用名称：<span class="resource-name">{{data.appName}}</span>
                <span class="add-title" @click="add_resource"><el-button type="success" size='small' icon="el-icon-plus" v-wave>添加</el-button></span>
            </div>
            <div class="common-table">
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="resName"
                    align="center"
                    label="功能名称">
                    </el-table-column>
                    <el-table-column
                    prop="remark"
                    label="功能描述"
                    align="center"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="resUrl"
                    label="路由地址"
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
        <el-dialog :close-on-click-modal='false'
            :title="group_type === 'add' ? '新增资源' :'编辑资源'"
            class="common-dialog"
            :visible.sync="group_visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules"  class="demo-ruleForm">
                <el-form-item label="功能名称" prop='title'>
                    <el-input v-model="form.resName" size="small" placeholder="请输入功能名称"></el-input>
                </el-form-item>
                <el-form-item label="功能描述">
                    <el-input v-model="form.remark" size="small" placeholder="请输入功能描述"></el-input>
                </el-form-item>
                <el-form-item label="功能地址">
                    <el-input v-model="form.resUrl" size="small" placeholder="请输入功能路径"></el-input>
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
      tableData: [],
      form: {
        name: ""
      },
      rules: {
        title: [{ required: true, message: "请输入域名城", trigger: "blur" }]
      },
      data: {}
    };
  },
  beforeDestroy() {
    this.$store.commit("DEL_VIEW_BY_NAME", "资源管理");
  },
  created() {
    this.data = JSON.parse(sessionStorage.getItem("appId"));
    this.init();
  },
  methods: {
    init() {
      this.$post(
        "gwt/system/sysResource/getByAppId",
        {
          appId: this.data.appId
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.tableData = res.data.hashMap;
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
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


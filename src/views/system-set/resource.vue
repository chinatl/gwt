<template>
    <div>
        <div class="common">
            <t-title title=" 本地资源"></t-title>
            <div class="padding20 resource-title">
                应用名称：<span class="resource-name">公务通</span>
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
                </el-table>
            </div>
        </div>
        <div class="common sourece-page">
            <t-title title="功能获取"></t-title>
            <div class="page-form">
              <el-form label-width="120px" >
                <el-form-item label="功能获取地址：" prop='name'>
                    <div class="flex">
                        <el-input v-model="url" size="small" readonly></el-input>
                        <el-button size="small" icon="el-icon-edit-outline" type="primary" @click="get_function">获取功能</el-button>
                    </div>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
        </div>
        </div>
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
      }
    };
  },
  methods: {
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
      this.$router.push({path:'/system-set/app'})
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.resource-title {
  font-size: 16px;
  font-weight: 600;
  color: rgb(103, 106, 108);
  .resource-name {
    color: #3ba4f5;
  }
}
.sourece-page {
  margin-top: 20px;
}
</style>


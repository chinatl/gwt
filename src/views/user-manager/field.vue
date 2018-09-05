<template>
    <div class="common">
        <t-title title="域管理"></t-title>
        <div class="common-action">
            <div>
                <el-input v-model="Q_name_SL" placeholder="请输入域名称" style="width:200px" size='medium' @keyup.native.enter='condition'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="condition">搜索</el-button>
            </div>
            <div>
                <el-button type="success" icon="el-icon-plus" size='medium' @click="add_role" v-wave>新增域</el-button>
            </div>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                v-loading ='loading'
                style="width: 100%">
                <el-table-column
                prop="name"
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
                    @click="handleEdit(scope.row)" v-wave>编辑详情</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row.domainId)" v-wave>删除</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="common-page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNo"
            :page-sizes="$store.getters.page_list"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="total">
            </el-pagination>
        </div>
        <el-dialog
            title="新增域"
            class="common-dialog padding0"
            v-drag
            :visible.sync="role_visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules"  class="demo-ruleForm" v-loading='form_loading' @submit.native.prevent>
                <el-form-item label="域名称" prop='name'>
                    <el-input v-model="form.name" size="small" @keyup.native.enter='onSubmit'></el-input>
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
      Q_name_SL: "",
      tableData: [],
      rules: {
        name: [{ required: true, message: "请输入域名城", trigger: "blur" }]
      },
      role_visible: false,
      form: {
        name: ""
      },
      loading: false,
      form_loading: false,
      pageNo: 1,
      pageSize: 5,
      total: 0
    };
  },
  created() {
    var total = sessionStorage.getItem("user-manager/field/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("user-manager/field/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    //页数存到localstorage里面
    var pageSize = localStorage.getItem("user-manager/field/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 5;
    this.init(this.pageSize, this.pageNo);
  },
  methods: {
    condition() {
      this.pageNo = 1;
      this.init(this.pageSize, 1);
    },
    handleSizeChange(e) {
      localStorage.setItem("user-manager/field/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("user-manager/field/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
    },
    init(pageSize, pageNo) {
      this.loading = true;
      this.$get("gwt/system/sysDomain/list", {
        Q_name_SL: this.Q_name_SL,
        currentPage: pageNo,
        pageSize: pageSize
      })
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            this.tableData = [];
            return;
          }
          this.tableData = res.data.sysDomainPageBean.datas;
          this.total = res.data.sysDomainPageBean.totalCount - 0;
          sessionStorage.setItem(
            "user-manager/field/total",
            res.data.sysDomainPageBean.totalCount
          );
        })
        .catch(res => {
          this.loading = false;
        });
    },
    onSubmit() {
      this.$refs.form.validate(res => {
        if (!res) return;
        this.form_loading = true;
        this.$post("gwt/system/sysDomain/save", {
          name: this.form.name,
          domainId: ""
        })
          .then(res => {
            this.form_loading = false;
            if (res.result !== "0000") {
              this.$swal({
                title: "操作失败！",
                text: res.msg,
                type: "error",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                showConfirmButton: true
              });
              return;
            }
            this.$message({
              type: "success",
              message: res.msg
            });
            this.role_visible = false;
            this.init(this.pageSize, this.pageNo);
          })
          .catch(res => {
            this.form_loading = false;
          });
      });
    },
    //
    onCancel() {
      this.role_visible = false;
    },
    //新增域
    add_role() {
      this.form.name = "";
      this.role_visible = true;
      this.$nextTick(res => {
        this.$refs.form.resetFields();
      });
    },

    handleEdit(item) {
      this.$store.commit("SET_FIELD_MANAGER_DATA", item);
      this.$router.push({
        path: "/user-manager/field-desc"
      });
    },
    handleDelete(domainId) {
      this.$swal({
        title: "您确定要删除的信息吗？",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn btn-success"
      }).then(res => {
        if (!res.value) {
          return;
        }
        this.$post("gwt/system/sysDomain/del", {
          domainId
        })
          .then(res => {
            if (res.result !== "0000") {
              this.$swal({
                title: "操作失败！",
                text: res.msg,
                type: "error",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                showConfirmButton: true
              });
              return;
            }
            this.init(this.pageSize, this.pageNo);
          })
          .catch(res => {
            console.log(res);
          });
      });
    }
  }
};
</script>

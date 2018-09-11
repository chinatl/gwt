<template>
    <div class="common">
        <t-title title="课程类别管理">
            <el-button icon="el-icon-plus" type="success" size="medium" @click="add_category">添加课程类别</el-button>
        </t-title>
        <div class="common-action"></div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                v-loading ='table_loading'
                style="width: 100%">
                <el-table-column
                prop="typeName"
                align="center"
                label="课程类别名称">
                </el-table-column>
                <el-table-column
                prop="ceateUser"
                align="center"
                label="创建人">
                </el-table-column>
                <el-table-column
                prop="ceateTime"
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
                    @click="del_category(scope.row.ctypeId)" v-wave>删除</el-button>
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
        <!-- 弹窗 -->
        <el-dialog
          :close-on-click-modal='false'
            :title="group_type === 'add' ? '添加课程类别' :'修改课程类别'"
            class="common-dialog"
            :visible.sync="group_visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules" v-loading = 'loading'>
                <el-form-item label="类别名称" prop='typeName'>
                    <el-input v-model="form.typeName" size="small" placeholder=""></el-input>
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
      pageSize: 5,
      total: 0,
      select: {},
      tableData: [],
      group_type: "add",
      group_visible: false,
      form: {
        typeName: ""
      },
      rules: {
        typeName: [
          {
            required: true,
            tigger: "blur",
            message: "请输入课程类别名称"
          }
        ]
      },
      table_loading: false,
      loading: false
    };
  },
  created() {
    this.init(this.pageSize, this.pageNo);
  },
  computed: {
    token() {
      return this.$store.getters.token;
    }
  },
  methods: {
    add_category() {
      this.form.typeName = "";
      this.group_visible = true;
      this.$nextTick(res => {
        this.$refs.form.resetFields();
      });
    },
    init(pageSize, pageNo) {
      this.table_loading = true;
      this.$post("api/course/type/queryCourseType.do", {
        sEcho: 1,
        iColumns: 4,
        sColumns: ",,,",
        iDisplayStart: (pageNo - 1) * pageSize,
        iDisplayLength: pageSize,
        mDataProp_0: "typeName",
        mDataProp_1: "ceateUser",
        mDataProp_2: "ceateTime",
        mDataProp_3: "function",
        iSortCol_0: 0,
        sSortDir_0: "asc",
        typeName: ""
      })
        .then(res => {
          this.table_loading = false;
          this.total = res.recordsTotal;
          if (!res.data) {
            this.tableData = [];
            return;
          }
          this.tableData = res.data;
        })
        .catch(res => {
          this.table_loading = false;
        });
    },
    del_category(ctypeId) {
      this.$swal({
        title: "您确定要删除这条信息吗？",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn btn-success"
      }).then(res => {
        if (res.value) {
          this.$post(`api/course/type/delCourseType.do/${ctypeId}`)
            .then(res => {
              this.$store.commit("del_one_class_list", ctypeId);
              if (this.tableData.length === 1) {
                this.pageNo -= 1;
              }
              this.init(this.pageSize, this.pageNo);
              this.$swal({
                title: "操作成功！",
                text: "当前操作您已设置成功。",
                type: "success",
                timer: 1500,
                showConfirmButton: false
              });
            })
            .catch(res => {
              console.log(res);
            });
        }
      });
    },
    handleSizeChange(e) {
      this.pageNo = 1;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      this.init(this.pageSize, e);
    },
    onCancel_resource() {
      this.group_visible = false;
    },
    onSubmit_resource() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$post("api/course/type/add.do", {
            typeName: this.form.typeName,
            token: this.token
          })
            .then(res => {
              this.loading = false;
              this.$message({
                type: "success",
                message: "添加课程类别成功"
              });
              this.init(this.pageSize, this.pageNo);
              this.group_visible = false;
              this.$store.dispatch("get_class_list");
            })
            .catch(res => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
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


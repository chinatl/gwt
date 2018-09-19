<template>
    <div>
        <div class="field-desc">
            <div class="common-title">{{field_manager_data.name}}
                <el-button size='medium' type='success' icon="el-icon-edit-outline" @click="edit_role">编辑域</el-button>
            </div>
            <div class="field-con">
                <h3>已授权应用</h3>
                <ul>
                    <li v-for="(item,index) in app_list" :key="index">
                        <img :src="require('@/assets/imgs/yingyong.png')" alt="">
                        <p>{{item.appName}}</p>
                    </li>
                    <li @click="go_field_auth">
                        <img :src="require('@/assets/imgs/add-1.png')" alt="">
                        <p>授权应用</p>
                    </li>
                </ul>
            </div>
        </div>
        <t-layout>
          <div slot="left">
            <div class="desc-action">
              <el-button type="success" icon="el-icon-plus" style="width:100%" @click="add_group">新增分组</el-button>
            </div>
            <div class="desc-action-content">
              <ul class="common-table-bar">
                <li  @click="change_group(-1)" :class="current == -1 ? 'current':''">默认分组</li>
                <li v-for="(item,index) in category"
                  @click="change_group(index)"
                 :key="index" :class="current == index ? 'current':''">{{item.name}}</li>
              </ul>
            </div>
          </div>
          <div slot="right">
            <div class="desc-group">
              <i class="el-icon-caret-right"></i>
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>{{select_name}}</el-breadcrumb-item>
              </el-breadcrumb>
              <span class="rename" @click="update_grounp">
                <i class="el-icon-edit-outline"></i>重命名
              </span>
              <span class="delete" @click="delete_group">
                <i class="el-icon-close"></i>删除
              </span>
            </div>
            <div class="common-action">
                <div>
                    <el-input v-model="input" placeholder="请输入部门名称" style="width:200px" size='small'></el-input>
                    <el-button type="primary" icon="el-icon-search" size='small'>搜索</el-button>
                </div>
                <div>
                    <arrow-button></arrow-button>
                    <el-button type="success" icon="el-icon-plus" size='small' @click="add_part" style="margin-left:10px">添加部门</el-button>
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
                    width="80"
                    label="选择">
                       <template slot-scope="scope">
                          <el-checkbox v-model="scope.row.checked"></el-checkbox>
                       </template>
                    </el-table-column>
                    <el-table-column
                    prop="orgName"
                    align="center"
                    label="部门名称">
                    </el-table-column>
                    <el-table-column
                    prop="orgTypeName"
                    align="center"
                    label="部门类型">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="操作"
                    align="center"
                    width="120"
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
                :page-sizes="$store.getters.page_list"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                background
                :total="total">
                </el-pagination>
            </div>
          </div>
        </t-layout>
        <!-- 域编辑 -->
        <el-dialog :close-on-click-modal='false'
            title="编辑域"
            class="common-dialog padding0"
            :visible.sync="role_visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules" @submit.native.prevent v-loading='role_loading'>
                <el-form-item label="域名称" prop='name'>
                    <el-input v-model="form.name" size="small" @keyup.native.enter='onSubmit_yield'></el-input>
                </el-form-item>
                <form-button @cancel='onCancel_yidld' @submit="onSubmit_yield"></form-button>
            </el-form>
        </el-dialog>
        <!-- 分组编辑 -->
        <el-dialog :close-on-click-modal='false'
            :title="group_type === 'add' ? '新增域分组' :'编辑域分组'"
            class="common-dialog padding0"
            :visible.sync="group_visible">
            <el-form ref="group_form" :model="group_form" label-width="120px" :rules="group_rules"  @submit.native.prevent v-loading='group_loading'>
                <el-form-item label="域分组名称" prop='name'>
                    <el-input v-model="group_form.name" size="small" placeholder="请输入域分组名称" @keyup.native.enter='onSubmit'></el-input>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
        </el-dialog>
        <!-- 添加部门 -->
        <add-part :show='part_visible' 
        @close='part_visible = false' @submit="submit_part" :loading='loading'></add-part>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import formButton from "@/components/Button/formButton";
import arrowButton from "@/components/Button/arrowButton";
import AddPart from "@/components/AddPart";
import { SET_TREE_DATE } from "@/store/mutations";
export default {
  components: {
    formButton,
    AddPart,
    arrowButton
  },
  data() {
    return {
      loading: false,
      input: "",
      tableData: [],
      role_loading: false,
      rules: {
        name: [{ required: true, message: "请输入域名城", trigger: "blur" }]
      },
      group_rules: {
        name: [{ required: true, message: "请输入域分组名称", trigger: "blur" }]
      },
      group_loading: false,
      group_form: {
        name: ""
      },
      role_visible: false,
      group_visible: false,
      group_type: "add",
      part_visible: false,
      pageNo: 1,
      pageSize: 5,
      total: 0,
      form: {
        name: ""
      },
      category: [], //目录
      current: -1
    };
  },
  computed: {
    ...mapGetters(["field_manager_data", "field_app_list"]),
    app_list() {
      return this.field_app_list.filter(res => {
        return res.isShow === "1";
      });
    },
    select_name() {
      if (this.current === -1) {
        return "默认分组";
      }
      return this.category[this.current].name;
    }
  },
  created() {
    this.$store.dispatch("readSession", SET_TREE_DATE);
    var pageSize = localStorage.getItem("user-manager/field-desc/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 5;
    this.$store.dispatch("get_all_app_list", this.field_manager_data.domainId);
    this.search_all_group();
    this.search_group_part(-1);
  },
  methods: {
    //查询所有分组
    search_all_group() {
      this.$post(
        "gwt/system/sysDomain/sysgroup/list",
        {
          domainId: this.field_manager_data.domainId
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.category = res.data.sysGroupPageBean.datas;
        })
        .catch(res => {
          console.log(res);
        });
    },
    add_part() {
      this.part_visible = true;
    },
    //打开新增域分组弹窗
    add_group() {
      this.group_type = "add";
      this.group_visible = true;
      this.group_form.name = "";
      this.$nextTick(res => {
        this.$refs.group_form.resetFields();
      });
    },

    update_grounp() {
      if (!this.category.length) {
        return;
      }
      this.group_type = "update";
      this.group_visible = true;
      this.group_form.name = this.category[this.current].name;
    },
    edit_role() {
      this.form.name = this.field_manager_data.name;
      this.role_visible = true;
      this.$nextTick(res => {
        this.$refs.form.resetFields();
      });
    },
    //关闭域
    onCancel_yidld() {
      this.role_visible = false;
    },
    //提交域
    onSubmit_yield() {
      this.$refs.form.validate(res => {
        if (!res) return;
        this.form_loading = true;
        this.$post("gwt/system/sysDomain/save", {
          name: this.form.name,
          domainId: this.field_manager_data.domainId
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
            this.$store.commit("SET_FIELD_MANAGER_DATA_VALUE", this.form.name);
            this.$message({
              type: "success",
              message: "编辑域操作成功"
            });
            this.role_visible = false;
            this.init(this.pageSize, this.pageNo);
          })
          .catch(res => {
            console.log(res);
            this.form_loading = false;
          });
      });
    },
    change_group(index) {
      this.current = index;
      if (index === -1) {
        this.search_group_part(-1);
      } else {
        this.search_group_part(this.category[index].id);
      }
    },
    handleSizeChange(e) {
      localStorage.setItem("user-manager/field-desc/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      if (this.current === -1) {
        this.search_group_part(-1);
      } else {
        this.search_group_part(this.category[this.current].id);
      }
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("user-manager/field-desc/pageNo", e);
      this.pageNo = e;
      if (this.current === -1) {
        this.search_group_part(-1);
      } else {
        this.search_group_part(this.category[this.current].id);
      }
    },
    //查询分组所带的部门
    search_group_part(groupId) {
      this.$post(
        "gwt/system/sysDomain/getOrgByDomainIdPage",
        {
          domainId: this.field_manager_data.domainId,
          groupId,
          Q_orgName_SL: this.Q_orgName_SL,
          currentPage: this.pageNo,
          pageSize: this.pageSize
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            this.tableData = [];
            return;
          }
          this.tableData = res.data.sysOrgPageBean.datas;
          this.total = res.data.sysOrgPageBean.totalCount - 0;
        })
        .catch(res => {});
    },
    //删除添加分组
    delete_group() {
      this.$swal({
        title: "您确定要删除这条分组吗？",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn btn-success"
      }).then(res => {
        if (res.value) {
          this.$post(
            `gwt/system/sysDomain/sysgroup/del`,
            {
              id: this.category[this.current].id
            },
            "json"
          )
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
              this.search_all_group();
              this.$message({
                type: "success",
                message: "删除分组成功"
              });
            })
            .catch(res => {
              console.log(res);
            });
        }
      });
    },
    //提交添加分组
    onSubmit() {
      this.$refs.group_form.validate(res => {
        if (!res) return;
        this.group_loading = true;
        var id;
        var message = "添加分组成功";
        if (this.group_type === "update") {
          id = this.category[this.current].id;
          message = "修改分组名称成功";
        }
        this.$post(
          "gwt/system/sysDomain/sysgroup/save",
          {
            name: this.group_form.name,
            domainId: this.field_manager_data.domainId,
            pid: 0,
            id
          },
          "json"
        )
          .then(res => {
            this.group_loading = false;
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
              message
            });
            this.search_all_group();
            this.group_visible = false;
          })
          .catch(res => {
            console.log(res);
            this.group_loading = false;
          });
      });
    },
    //
    go_field_auth() {
      this.$router.push({
        path: "/field-manager-auth/index"
      });
    },
    onCancel() {
      this.group_visible = false;
    },
    //提交 添加部门
    submit_part(checkedKeys) {
      this.loading = true;
      var url = "gwt/system/sysDomain/addOrg";
      var groupId = "";
      if (this.current === -1) {
      } else {
        url = "gwt/system/sysDomain/sysgroup/addDomain";
        groupId = this.category[this.current].id;
      }
      this.$post(
        url,
        {
          ids: checkedKeys
            .filter(res => {
              return res.includes("region") === false;
            })
            .join(","),
          domainId: this.field_manager_data.domainId,
          groupId
        },
        "json"
      )
        .then(res => {
          this.loading = false;
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
            message: "添加部门成功"
          });
          if (this.current === -1) {
            this.search_group_part(-1);
          } else {
            this.search_group_part(this.category[this.current].id);
          }
          this.part_visible = false;
        })
        .catch(res => {
          this.loading = false;
        });
    },
    handleDelete(index, item) {}
  }
};
</script>


<style rel="stylesheet/scss" lang="scss">
.field-desc {
  background-color: #fff;
  border-radius: 6px;
  padding-bottom: 10px;
  margin-bottom: 20px;
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
  overflow: hidden;
  .field-desc-left {
    float: left;
    width: 22%;
  }
}
.desc-action {
  margin: 12px 20px;
  font-size: 16px;
}
.desc-action-content {
  margin: 0 20px;
  height: 550px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 6px;
  border-radius: 4px;
  border-radius: 5px;
  color: #4d637b;
  ul {
    li {
      font-weight: 600;
      font-size: 15px;
    }
  }
}
.desc-group {
  margin: 20px 20px 10px 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  .el-icon-caret-right {
    color: #57c7d5;
    font-size: 16px;
  }
  .rename {
    color: #f8ac5a;
    margin: 0 12px;
    margin-left: 20px;
    cursor: pointer;
    .svg-icon {
      margin-right: 4px;
    }
  }
  .delete {
    color: #ed5666;
    margin: 0 12px;
    cursor: pointer;
    .svg-icon {
      margin-right: 4px;
    }
  }
}
</style>

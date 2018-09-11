<template>
    <div class="common">
        <t-title>角色管理</t-title>
        <div class="common-action">
            <div>
                <el-input v-model="Q_name_SL" placeholder="请输入角色名称" style="width:200px" size='medium'  @keyup.native.enter='condition'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave  @click="condition">搜索</el-button>
            </div>
            <div>
                <el-button type="success" icon="el-icon-plus" size='medium' @click="add_role" v-wave>新增角色</el-button>
            </div>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                v-loading='loading'
                style="width: 100%">
                <el-table-column
                prop="roleName"
                align="center"
                label="角色名称">
                    <template slot-scope="scope">
                        <span v-for="(item,index) in $get_color_number(scope.row.roleName,Q_name_SL)" 
                        :class="item.name"
                        :key="index">{{item.value}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="remark"
                align="center"
                show-overflow-tooltip
                label="角色描述">
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
                    @click="edit_role(scope.row)" v-wave>编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row.roleId)" v-wave>删除</el-button>
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
        <!-- 角色新增弹出框 -->
            <el-dialog :close-on-click-modal='false'
            :title="role_type === 'add' ? '新增角色':'编辑角色'"
            class="common-dialog padding0"
            v-drag
            :visible.sync="role_visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules"  v-loading='form_loading'>
                <el-form-item label="角色名称" prop='roleName' maxlength='10'>
                    <el-input v-model="form.roleName" size="small"></el-input>
                </el-form-item>
                <el-form-item :label="item.appName" v-for="(item,index) in checked_list" :key="index +'00'">
                    <el-checkbox-group v-model="item.checked">
                        <el-checkbox :label="item_check.resId" :name="item_check.appId" v-for="(item_check,index_check) in item.children" :key="index_check">{{item_check.resName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="角色描述" prop="remark">
                        <el-input type="textarea" v-model="form.remark" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import formButton from "@/components/Button/formButton";
import qs from "qs";
export default {
  components: {
    formButton
  },
  data() {
    return {
      role_type: "add",
      pageNo: 1,
      pageSize: 5,
      total: 0,
      Q_name_SL: "",
      input: "",
      role_visible: false,
      form: {
        roleName: "",
        remark: ""
      },
      tableData: [],
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        remark: [{ required: true, message: "请输入角色描述", trigger: "blur" }]
      },
      checked_list: [],
      form_loading: false
    };
  },
  created() {
    //页数存到localstorage里面
    var total = sessionStorage.getItem("user-manager/role/total");
    console.log(total);
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("user-manager/role/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    var pageSize = localStorage.getItem("user-manager/role/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 5;
    this.init(this.pageSize, this.pageNo);
    this.get_all_resource();
  },
  beforeDestroy(e) {
    sessionStorage.removeItem("user-manager/role/pageNo");
    sessionStorage.removeItem("user-manager/role/total");
  },
  methods: {
    get_all_resource() {
      this.$post("gwt/system/sysRoleRes/getRoleResList")
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          var arr = res.data.sysRoleResPageBean;
          var newArr = [];
          for (var i = 0; i < arr.length; i++) {
            if (!newArr.map(res => res.appName).includes(arr[i].appName)) {
              newArr.push({
                appName: arr[i].appName,
                appId: arr[i].appId,
                checked: []
              });
            }
          }
          for (var i = 0; i < newArr.length; i++) {
            newArr[i].children = [];
            for (var j = 0; j < arr.length; j++) {
              if (arr[j].appName === newArr[i].appName) {
                newArr[i].children.push(arr[j]);
              }
            }
          }
          this.checked_list = newArr;
        })
        .catch(res => {
          console.log(res);
        });
    },
    //查询所有的资源
    init(pageSize, pageNo) {
      this.loading = true;
      this.$post(
        `gwt/system/sysRole/list?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          Q_roleName_SL: this.Q_name_SL,

          normal: true
          // orderField: "role_id",
          // orderSeq: "2"
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            this.tableData = [];
            return;
          }
          this.tableData = res.data.sysRolePageBean.datas;
          this.total = res.data.sysRolePageBean.totalCount - 0;
          sessionStorage.setItem(
            "user-manager/role/total",
            res.data.sysRolePageBean.totalCount
          );
        })
        .catch(res => {
          this.loading = false;
        });
    },
    condition() {
      this.pageNo = 1;
      this.init(this.pageSize, 1);
    },
    handleSizeChange(e) {
      localStorage.setItem("user-manager/role/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("user-manager/role/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
    },
    handleDelete(roleId) {
      this.$swal({
        title: "确定要删除该角色吗？",
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
        this.$post(
          "gwt/system/sysRole/del",
          {
            roleId
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
            this.$message({
              type: "success",
              message: res.msg
            });
            this.init(this.pageSize, this.pageNo);
          })
          .catch(res => {
            console.log(res);
          });
      });
    },
    onSubmit() {
      var arr = this.checked_list.map(res => {
        return res.checked.join(",");
      });
      if (arr.length === 0) {
        this.$swal({
          title: "提示信息！",
          text: "请至少选择一条记录！",
          type: "warning",
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          showConfirmButton: true
        });
        return;
      }
      this.$refs.form.validate(res => {
        if (!res) return;
        this.form_loading = true;
        var roleId = "";
        var message = "增加角色成功";
        if (this.role_type === "update") {
          roleId = this.form.roleId;
          message = "修改角色成功";
        }

        this.$post(
          "gwt/system/sysRole/save",
          {
            roleName: this.form.roleName,
            remark: this.form.remark,
            roleId,
            belongDept: "",
            resId: arr
              .filter(res => {
                return res;
              })
              .join(",")
          },
          "json"
        )
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
              message
            });
            this.role_visible = false;
            this.init(this.pageSize, this.pageNo);
          })
          .catch(res => {
            this.form_loading = false;
          });
      });
    },
    onCancel() {
      this.role_visible = false;
    },
    add_role() {
      this.role_type = "add";
      this.role_visible = true;
      this.$nextTick(res => {
        this.$refs.form.resetFields();
        this.form.roleName = "";
        this.form.remark = "";
      });
    },
    edit_role(item) {
      this.role_type = "update";
      this.role_visible = true;
      this.form.roleName = item.roleName;
      this.form.remark = item.remark;
      this.form.roleId = item.roleId;
      this.$post(
        "gwt/system/sysRole/editResRole",
        {
          roleId: item.roleId
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.checked_list.forEach(res => {
            res.checked = [];
          });

          for (var i = 0; i < res.data.sysRoleResList.length; i++) {
            for (var j = 0; j < this.checked_list.length; j++) {
              if (
                res.data.sysRoleResList[i].appId + "" ===
                this.checked_list[j].appId + ""
              ) {
                this.checked_list[j].checked.push(
                  res.data.sysRoleResList[i].resId
                );
              }
            }
          }
        })
        .catch(res => {
          console.log(res);
        });
    }
  }
};
</script>

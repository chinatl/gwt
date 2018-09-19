<template>
  <t-layout>
    <div slot="left">
        <div class="padding20">
            <el-input v-model="filterText" size="small" placeholder="请选择部门名称">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
        </div>
        <div class="part-content common-temp scrollbar">
            <el-tree
                :data="tree_data"
                node-key="id"
                :filter-node-method="filterNode"
                ref="tree"
                 @node-click="handleNodeClick"
                :highlight-current= 'true'
                :props="defaultProps">
              </el-tree>
        </div>
    </div>
    <div slot="right" style="background-color:#f3f3f4">
        <div class="part-top">
            <t-title>用户管理</t-title>
            <div class="user-desc-info">
                <h3>{{orgInfo.orgAllName}}</h3>
                <p>
                    <span class="span1">部门类型：</span>
                    <span class="blod"> {{orgInfo.orgTypeName}}</span>
                </p>
                <p>
                    <span class="span1">部门管理员：</span>
                    <span class="blod">{{userAndOrgList.map(res=>{
                      return  res.REAL_NAME
                      }).join(',')}}</span>
                </p>
                <p>
                    <span class="span1">部门地址：</span>
                    <span class="blod">{{orgInfo.orgAddr}}</span>
                </p>
            </div>
        </div>
        <div class="part-bottom">
            <div class="part-action">
                <div class="part-action-left">
                    <el-input v-model="searchParam" placeholder="请输入姓名/手机号" style="width:160px" size='medium' @keyup.native.enter='condition_search'></el-input>
                    <el-button type="primary" icon="el-icon-search" size='medium' style="margin:0 8px" v-wave @click="condition_search">搜索</el-button>
                </div>
                <div class="part-action-right">
                      <arrow-button 
                        @setTop='setTop'
                        @top='goTop'
                        @bottom='goBottom'
                        @setBottom='setBottom'
                      ></arrow-button>
                      <el-button type="success" icon="el-icon-plus" size='medium' style="margin-left: 18px" @click="add_user" v-wave>新增用户</el-button>
                </div>
            </div>
            <div class="common-action" style="padding:0 20px 12px 20px">
              <div class="common-table-bar">
                <span v-for="(item,index) in select_arr" :key='index' 
                @click='check_user_use(index)'
                :class="current == index ? 'current':''">{{item}}</span>
              </div>
            </div>
            <div class="common-table">
              <div v-show="current === 0">
                <el-table
                    :data="tableData"
                    border
                    v-loading='table_loading'
                    style="width: 100%">
                    <el-table-column
                    prop="name"
                    align="center"
                    width="60"
                    label="选择">
                        <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checked"
                         @change="change_table_checked($event,scope.$index)"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="realName"
                    align="center"
                    label="姓名">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    width="60"
                    label="性别">
                    <template slot-scope='scope'>
                        {{scope.row.sex === '1' ? "男":"女"}}
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="人员级别">
                     <template slot-scope='scope'>
                        {{scope.row.sysOrgUserX.userLevelName}}
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="职务">
                      <template slot-scope='scope'>
                        {{scope.row.sysOrgUserX.duty}}
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="type3"
                    align="center"
                    show-overflow-tooltip
                    label="角色">
                    <template slot-scope='scope'>
                      {{scope.row.sysUserRoleOrgList.map(res=>{
                        return res.sysRole.roleName
                      }).join(',')}}
                      <span v-for="(item,index) in scope.row.sysUserRoleOrgList" :key="index">
                        {{item.item}}
                      </span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="mobilePhone"
                    align="center"
                    width="120"
                    label="手机号">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="固定电话">
                      <template slot-scope='scope'>
                        {{scope.row.sysOrgUserX.phone}}
                      </template>
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    align="center"
                    width="320"
                    >
                    <template slot-scope="scope">
                      <little-button name='编辑' @click.native="edit_user(scope.row)"></little-button>
                      <little-button name='转出' @click.native="edit_user(scope.row)"></little-button>
                      <little-button name='停用' @click.native="stop_user(scope.row)"></little-button>
                      <little-button name='删除' @click.native="handle_delete(scope.row)"></little-button>
                    </template>
                    </el-table-column>
                </el-table>
                </div>
                <div v-show='current === 1'>
                <el-table
                    :data="tableData1"
                    border
                    v-loading='table_loading'
                    style="width: 100%">
                    <el-table-column
                    prop="realName"
                    align="center"
                    label="姓名">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    width="60"
                    label="性别">
                    <template slot-scope='scope'>
                        {{scope.row.sex === '1' ? "男":"女"}}
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="人员级别">
                     <template slot-scope='scope'>
                        {{scope.row.sysOrgUserX.userLevelName}}
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="mobilePhone"
                    align="center"
                    label="职务">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="固定电话">
                      <template slot-scope='scope'>
                        {{scope.row.sysOrgUserX.phone}}
                      </template>
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    align="center"
                    width="160"
                    >
                    <template slot-scope="scope">
                      <little-button name='启用' @click.native="start_user(scope.row)"></little-button>
                      <little-button name='删除' @click.native="handle_delete(scope.row)"></little-button>
                    </template>
                    </el-table-column>
                </el-table>
                </div>
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
    </div>
    <!-- 弹窗 -->
    <el-dialog :close-on-click-modal='false'
        slot="else"
        :title="user_type ==='add' ?'添加用户':'编辑用户'"
        class="common-dialog"
        v-drag
        :visible.sync="user_visible">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules" v-loading='dialog_loading'>
            <el-form-item label="用户名">
                <el-input v-model="form.userName" size="small" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop='mobilePhone'>
                <el-input v-model="form.mobilePhone" size="small"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop='realName'>
                <el-input v-model="form.realName" size="small"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" placeholder="请选择性别" size="small" style="width:100%">
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属部门" prop="name">
                <el-input v-model="form.part" size="small" disabled></el-input>
            </el-form-item>
            <el-form-item label="人员级别" prop="userLevel">
                <el-select v-model="form.userLevel" placeholder="请选择" size="small" style="width:100%">
                  <el-option v-for='(item,index) in user_level_list' :key="index" :label="item.itemName" :value="item.itemValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="form.roleIds" placeholder="请选择"  multiple size="small" style="width:100%">
                  <el-option v-for='(item,index) in role_list' :key="index + '0000'" :label="item.roleName" :value="item.roleId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职务">
                <el-input v-model="form.duty" size="small"></el-input>
            </el-form-item>
            <el-form-item label="固定电话">
                <el-input v-model="form.phone" size="small"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="form.remark" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
            </el-form-item>
                <el-form-item align='right'>
                <el-button size="small" v-wave @click="user_visible = false">取消</el-button>
                <el-button type="primary" @click="onSubmit" size="small" v-wave>确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
  </t-layout>
</template>
<script>
import littleButton from "@/components/Button/littleButton";
import arrowButton from "@/components/Button/arrowButton";
import qs from "qs";
import { validatePhone } from "@/utils/validate";
import { generate_tree } from "@/utils";
export default {
  components: {
    littleButton,
    arrowButton
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号"));
      } else if (!validatePhone(value)) {
        callback(new Error("手机格式不合法"));
      } else {
        callback();
      }
    };
    return {
      pageNo: 1,
      pageSize: 5,
      total: 0,
      searchParam: "",
      tree_data: [],
      tree_loading: false,
      tableData: [],
      tableData1: [],
      table_loading: false,
      form: {
        sex: "",
        roleIds: [],
        realName: "",
        mobilePhone: "",
        userLevel: "",
        duty: "",
        phone: "",
        remark: ""
      },
      user_visible: false,
      dialog_loading: false,
      status: "1", //是否启用
      user_type: "add",
      inputs: "",
      input: "",
      rules: {
        mobilePhone: [
          {
            required: true,
            trigger: "blur",
            validator: validatePass
          }
        ],
        realName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        part: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        userLevel: [
          { required: true, message: "请选择人员级别", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }]
      },
      defaultProps: {
        children: "childrens",
        label: "name"
      },
      filterText: "",
      temp_data: {},
      user_level_list: [],
      role_list: [],
      orgInfo: {
        orgAllName: "系统管理员",
        orgTypeName: "",
        orgAddr: ""
      },
      userAndOrgList: [],
      select_arr: ["用户管理", "停用用户"],
      current: 0
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    //查询所有人员级别
    this.get_user_level();
    this.$post("gwt/system/sysOrg/getOrgTreeData", {}, "json")
      .then(res => {
        this.tree_data = generate_tree(res.data.nodes);
      })
      .catch(res => {
        console.log(res);
      });
    // this.get_user_tree();
    var pageSize = localStorage.getItem("user-manager/user/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 5;
  },
  methods: {
    //条件搜索
    condition_search() {
      this.pageNo = 1;
      this.search_user_list(this.pageSize, 1);
    },
    //查询用户管理部门配置
    get_user_tree() {
      this.$post(
        "gwt/system/sysOrg/getAreaOrgTreeData",
        {
          showAllOrgFlag: "Y"
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.tree_data = res.data.nodes;
        })
        .catch(res => {
          console.log(res);
        });
    },
    //查询该人员可以选的角色
    get_now_part_role(orgId) {
      this.$post(
        "gwt/system/sysRole/getAllRoleList",
        {
          orgId
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.role_list = res.data.sysRoleList;
        })
        .catch(res => {
          console.log(res);
        });
    },
    //查询所有人员级别
    get_user_level() {
      this.$post(
        "gwt/system/sysUser/getUserLevel",
        {
          parents: ""
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.user_level_list = res.data.getUserLevel;
        })
        .catch(res => {
          console.log(res);
        });
    },
    //过滤节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //点击左边部门
    handleNodeClick(data) {
      if (data.id.includes("region")) {
        this.orgInfo.orgAllName = "系统管理员";
        this.orgInfo.orgTypeName = "";
        this.orgInfo.orgAddr = "";
        this.userAndOrgList = [];
        return;
      }
      this.current = 0;
      this.temp_data = data;
      this.$post(
        "gwt/system/sysUser/getOrgInfo",
        {
          orgId: data.id
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.orgInfo = res.data.orgInfo;
          this.userAndOrgList = res.data.userAndOrgList;
        })
        .catch(res => {
          console.log(res);
        });
      this.get_now_part_role(data.id);
      this.pageNo = 1;
      this.search_user_list(this.pageSize, 1);
    },
    check_user_use(index) {
      console.log(index);
      if (this.current === index) {
        return;
      }
      this.pageNo = 1;
      this.current = index;
      this.search_user_list(this.pageSize, 1);
    },
    search_user_list(pageSize, pageNo) {
      if (!this.temp_data.id) {
        return;
      }
      this.table_loading = true;
      var url = "gwt/system/sysUser/list";
      if (this.current === 1) {
        url = "gwt/system/sysUser/disableUserList";
      }
      this.$post(
        url +
          "?" +
          qs.stringify({
            currentPage: pageNo,
            pageSize: pageSize
          }),
        {
          orgId: this.temp_data.id,
          searchParam: this.searchParam
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            this.tableData = [];
            return;
          }
          this.table_loading = false;
          if (this.current === 0) {
            this.tableData = res.data.sysUserPageBean.datas.map((res, i) => {
              res.checked = false;
              return res;
            });
            this.total = res.data.sysUserPageBean.totalCount - 0;
          } else {
            this.tableData1 = res.data.disableUserBean.datas;
            this.total = res.data.disableUserBean.totalCount - 0;
          }
        })
        .catch(res => {
          this.table_loading = false;
          console.log(res);
        });
    },
    start_user() {
      var _this = this;
      this.$swal({
        title: "启用原因",
        input: "text",
        showCancelButton: true,
        confirmButtonColor: "rgb(48, 133, 214)",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn btn-success",
        allowOutsideClick: false,
        inputValidator: function(value) {
          return new Promise(function(resolve, reject) {
            if (value) {
              resolve();
            } else {
              reject("请输入启用原因");
            }
          });
        },
        showLoaderOnConfirm: true,
        preConfirm: function(value) {
          return new Promise(function(resolve, reject) {
            _this
              .$post(
                "gwt/system/sysUser/editDisableUser",
                {
                  userId: item.userId,
                  disableCause: value,
                  isDisable: 0,
                  outFlag: 0
                },
                "json"
              )
              .then(res => {
                resolve(res);
              })
              .catch(res => {
                _this.$swal({
                  title: "操作失败！",
                  text: res.msg,
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  showConfirmButton: true
                });
              });
          });
        }
      })
        .then(function(res) {
          if (res.dismiss === "cancel") {
            return;
          }
          _this.$message({
            message: "启用用用户成功！",
            type: "success"
          });
          _this.search_user_list(_this.pageSize, _this.pageNo);
        })
        .catch(res => {
          _this.$message({
            message: "未输入启用原因",
            type: "warning"
          });
          console.log(res);
        });
    },
    stop_user(item) {
      var _this = this;
      this.$swal({
        title: "停用原因",
        input: "text",
        showCancelButton: true,
        confirmButtonColor: "rgb(48, 133, 214)",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn btn-success",
        allowOutsideClick: false,
        inputValidator: function(value) {
          return new Promise(function(resolve, reject) {
            if (value) {
              resolve();
            } else {
              reject("请输入停用原因");
            }
          });
        },
        showLoaderOnConfirm: true,
        preConfirm: function(value) {
          return new Promise(function(resolve, reject) {
            _this
              .$post(
                "gwt/system/sysUser/editDisableUser",
                {
                  userId: item.userId,
                  disableCause: value,
                  isDisable: 1
                },
                "json"
              )
              .then(res => {
                resolve(res);
              })
              .catch(res => {
                _this.$swal({
                  title: "操作失败！",
                  text: res.msg,
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  showConfirmButton: true
                });
              });
          });
        }
      })
        .then(function(res) {
          if (res.dismiss === "cancel") {
            return;
          }
          console.log(res);
          _this.$message({
            message: "停用用户成功！",
            type: "success"
          });
          _this.search_user_list(_this.pageSize, _this.pageNo);
        })
        .catch(res => {
          _this.$message({
            message: "未输入停用原因",
            type: "warning"
          });
          console.log(res);
        });
    },
    handle_delete(item) {
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
        this.$post(
          "gwt/system/sysUser/del",
          {
            xId: item.sysOrgUserX.id,
            userId: item.userId,
            orgId: item.sysOrgUserX.orgId
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
              message: "删除成功！",
              type: "success"
            });
            this.search_user_list(this.pageSize, this.pageNo);
          })
          .catch(res => {
            console.log(res);
          });
      });
    },
    handleSizeChange(e) {
      localStorage.setItem("user-manager/role/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.search_user_list(e, 1);
    },
    handleCurrentChange(e) {
      this.pageNo = e;
      this.search_user_list(this.pageSize, e);
    },
    edit_user(item) {
      this.user_visible = true;
      this.user_type = "update";
      this.form.userName = item.userName;
      this.form.mobilePhone = item.mobilePhone;
      this.form.realName = item.realName;
      this.form.sex = item.sex;
      this.form.realName = item.realName;
      this.form.remark = item.sysOrgUserX.remark;
      this.form.phone = item.sysOrgUserX.phone;
      this.form.duty = item.sysOrgUserX.duty;
      this.form.userLevel = item.sysOrgUserX.userLevel + "";
      this.form.part = this.orgInfo.orgAllName;
      this.form.roleIds = item.sysUserRoleOrgList.map(
        res => res.sysRole.roleId
      );
      this.form.orgUserxId = item.sysOrgUserX.id;
      this.form.userId = item.sysOrgUserX.userId;
      this.form.orgId = item.sysOrgUserX.orgId;
      this.form.id = item.sysOrgUserX.id;
    },
    add_user() {
      if (
        this.orgInfo.orgAllName === "" ||
        this.orgInfo.orgAllName === "系统管理员"
      ) {
        this.$message({
          type: "warning",
          message: "请选择一个部门"
        });
        return;
      }
      this.user_visible = true;
      this.form.part = this.orgInfo.orgAllName;
      this.$nextTick(res => {
        this.$refs.form.resetFields();
        this.user_type = "add";
        this.form.userName = "";
        this.form.mobilePhone = "";
        this.form.realName = "";
        this.form.sex = "";
        this.form.realName = "";
        this.form.remark = "";
        this.form.phone = "";
        this.form.duty = "";
        this.form.userLevel = "";
        this.form.roleIds = [];
        this.form.orgUserxId = "";
        this.form.userId = "";
        this.form.orgId = "";
        this.form.id = "";
      });
    },
    onSubmit() {
      this.$refs.form.validate(res => {
        if (!res) return;
        var addFlag = "Y";
        var orgUserxId = "";
        var userId = "";
        var id = "";
        var message = "创建新用户成功！";
        if (this.user_type === "update") {
          addFlag = "";
          orgUserxId = this.form.orgUserxId;
          userId = this.form.userId;
          id = this.form.id;
          message = "更新用户成功!";
        }
        this.dialog_loading = true;
        this.$post(
          "gwt/system/sysUser/save",
          {
            orgUserxId,
            addFlag,
            userId,
            mobilePhone: this.form.mobilePhone,
            realName: this.form.realName,
            sex: this.form.sex,
            "sysOrgUserX.orgId": this.form.orgId,
            "sysOrgUserX.id": id,
            "sysOrgUserX.userLevel": this.form.userLevel,
            roleIds: this.form.roleIds.join(","),
            "sysOrgUserX.duty": this.form.duty,
            "sysOrgUserX.phone": this.form.phone,
            "sysOrgUserX.remark": this.form.remark
          },
          "json"
        )
          .then(res => {
            this.dialog_loading = false;
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
              message,
              type: "success"
            });
            this.user_visible = false;
            this.search_user_list(this.pageSize, this.pageNo);
          })
          .catch(res => {
            this.dialog_loading = false;
          });
      });
    },

    setTop() {
      this.sort_fn("top");
    },
    goTop() {
      this.sort_fn("previous");
    },
    goBottom() {
      this.sort_fn("next");
    },
    setBottom() {
      this.sort_fn("bottom");
    },
    sort_fn(sortType) {
      var data = {};
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].checked) {
          data = this.tableData[i];
        }
      }
      if (!data.userId) {
        this.$message({
          message: "请选择一条记录进行排序！",
          type: "warning"
        });
        return;
      }
      this.$post(
        "gwt/system/sysUser/sort",
        {
          pk: "userId",
          orgIdX: data.sysOrgUserX.orgId,
          sortType,
          userId: data.sysOrgUserX.userId
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
            message: "操作成功！",
            type: "success"
          });
          this.search_user_list(this.pageSize, this.pageNo);
        })
        .catch(res => {});
    },
    change_table_checked(event, index) {
      if (event) {
        this.tableData = this.tableData.map((res, i) => {
          if (i === index) {
            res.checked = true;
          } else {
            res.checked = false;
          }
          return res;
        });
        this.$set(this.tableData, index, this.tableData[index]);
      } else {
        this.$set(this.tableData, index, this.tableData[index]);
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" >
.part-content {
  margin: 0 20px;
  height: 550px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  padding: 4px;
  border-radius: 4px;
  overflow: auto;
}

.part-top {
  background-color: #fff;
  border-radius: 6px;
  .user-desc-info {
    color: rgb(103, 106, 108);
    padding: 10px 20px;
    line-height: 30px;
    h3 {
      font-size: 16px;
      font-weight: 600;
    }
    p {
      font-size: 13px;
      font-weight: 400;
      .span1 {
        display: inline-block;
        width: 100px;
      }
      .blod {
        font-weight: 800;
      }
    }
  }
}
.part-bottom {
  margin-top: 20px;
  padding-bottom: 10px;
  border-radius: 6px;
  background-color: #fff;
  .part-action {
    padding: 16px 20px;
    color: rgb(103, 106, 108);
    overflow: hidden;
    .part-action-left {
      float: left;
      font-size: 14px;
      font-weight: 600;
    }
    .part-action-right {
      float: right;
      font-size: 13px;
      .btn {
        background-color: #23c6c8;
        color: #fff;
        padding: 6px;
        font-size: 16px;
        border-radius: 4px;
        margin-left: 6px;
        &:hover {
          cursor: pointer;
          background-color: rgba(35, 198, 200, 0.8);
        }
        &:active {
          cursor: pointer;
          background-color: rgba(35, 198, 200, 1);
        }
      }
    }
  }
}
</style>

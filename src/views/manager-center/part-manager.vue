<template>
<t-layout>
    <div slot="left">
        <div class="common-action">
          <div>
            <el-input v-model="filterText" size="medium" placeholder="请输入部门名称">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button type="success" icon="el-icon-plus" size='medium' @click="add_part" style="padding:10px 0px;overflow:hidden;width:180px" v-wave>新增部门</el-button>
          </div>
        </div>
        <div class="part-content common-temp scrollbar" style="overflow: auto" v-loading='tree_loading'>
            <el-tree 
            :expand-on-click-node='false'
            :data="tree_data" :props="defaultProps"
            node-key="id"
            :filter-node-method="filterNode"
            :default-expanded-keys="expand_arr"            
            @node-click="handleNodeClick" 
            :highlight-current= 'true' ref="tree"></el-tree>
        </div>
    </div>
    <div slot="right">
        <t-title>部门管理</t-title>
            <div class="part-action between">
                <div class="part-action-left">
                    当前位置：{{temp_data.allName}}
                </div>
                <arrow-button 
                  @setTop='setTop'
                  @top='goTop'
                  @bottom='goBottom'
                  @setBottom='setBottom'
                ></arrow-button>
            </div>
          <div class="common-table">
              <el-table
                  :data="tableData"
                  border
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
                  prop="orgName"
                  align="center"
                  label="部门名称">
                  </el-table-column>
                  <el-table-column
                  prop="orgAllName"
                  align="center"
                  label="部门全称">
                  </el-table-column>
                  <el-table-column
                  prop="orgAddr"
                  align="center"
                  label="部门地址">
                  </el-table-column>
                  <el-table-column
                  prop="name"
                  label="操作"
                  align="center"
                  width="186"
                  >
                  <template slot-scope="scope">
                      <el-button
                      size="mini"
                      type="success"
                      icon="el-icon-edit-outline"
                      @click="handle_edit(scope.row)" v-wave>编辑</el-button>
                      <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="handle_delete(scope.row.orgId)" v-wave>删除</el-button>
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
        <!-- 弹窗 -->
<div class="common-dialog" slot="else">
<el-dialog :close-on-click-modal='false'
:title="part_type ==='add' ?'新增部门':'编辑部门'" v-drag
:visible.sync="edit_visible">
<el-form ref="form" :model="form" label-width="80px" :rules="rules"  v-loading='form_loading'>
<el-form-item label="所属区域" prop='city' v-show='temp_data.nodeType === "REGION"'>
    <div class="flex">
      <el-select v-model="form.city" placeholder="" size="small" style="width:100%;margin-right:20px" @change="change_option1">
        <el-option v-for="(item,index) in option1" :key="index" :label="item.itemName" :value="item.dicId"></el-option>
      </el-select>
      <el-select v-model="option_value2" placeholder="" size="small" style="width:100%"  @change="change_option2">
        <el-option v-for="(item,index) in option2" :key="index" :label="item.itemName" :value="item.dicId"></el-option>
      </el-select>
      <el-select v-model="option_value3" placeholder="" size="small" style="width:100%;margin-left:20px">
        <el-option v-for="(item,index) in option3" :key="index" :label="item.itemName" :value="item.dicId"></el-option>
      </el-select>
    </div>
</el-form-item>
<el-form-item label="上级部门" v-show='temp_data.nodeType === "ORG"'>
    <el-input v-model="temp_data.allName" size="small" readonly></el-input>
</el-form-item>
<el-form-item label="部门名称" prop='orgName'>
    <el-input v-model="form.orgName" size="small" maxlength="20" @blur="add_part_all_name"></el-input>
</el-form-item>
<el-form-item label="部门全称" prop="orgAllName">
    <el-input v-model="form.orgAllName" size="small" readonly></el-input>
</el-form-item>
<el-form-item label="部门类型" prop="deptType" v-if='temp_data.nodeType === "REGION"'>
    <el-select v-model="form.deptType" placeholder="" size="small" style="width:100%;">
        <el-option v-for="(item,index) in all_part_type" :key="index" :label="item.itemName" :value="item.dicId"></el-option>
    </el-select>
</el-form-item>
<el-form-item label="部门地址">
    <el-input v-model="form.orgAddr" size="small"></el-input>
</el-form-item>
<el-form-item label="备注">
        <el-input type="textarea" v-model="form.orgDesc" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
</el-form-item>
  <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
</el-form>
</el-dialog>
</div>
</t-layout>
    
</template>
<script>
import formButton from "@/components/Button/formButton";
import arrowButton from "@/components/Button/arrowButton";
import qs from "qs";
import { generate_tree } from "@/utils";
import { mapGetters } from "vuex";
export default {
  components: {
    formButton,
    arrowButton
  },
  data() {
    return {
      tree_loading: false,
      form: {
        orgAddr: "",
        deptType: "",
        orgAllName: "",
        orgName: "",
        city: ""
      },
      filterText: "",
      form_loading: false,
      part_type: "add",
      edit_visible: false,
      pageNo: 1,
      pageSize: 5,
      total: 0,
      input: "",
      rules: {
        orgName: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ],
        orgAllName: [
          { required: true, message: "请输入部门全称", trigger: "blur" }
        ],
        deptType: [
          { required: true, message: "请选择部门类型", trigger: "change" }
        ],
        city: [
          { required: true, message: "请至少选一个地区", trigger: "change" }
        ]
      },
      table_loading: false,
      tableData: [],
      defaultProps: {
        children: "childrens",
        label: "name"
      },
      tree_data: [],
      temp_data: {
        name: "----",
        nodeType: "REGION"
      },
      all_part_type: [],
      option1: [],
      option2: [],
      option3: [],
      option_value2: "",
      option_value3: "",
      expand_arr: []
    };
  },
  computed: {
    ...mapGetters(["is_admin", "group_list", "user_info", "org_role_list"])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  beforeDestroy(e) {
    sessionStorage.removeItem("user-manager/part/pageNo");
    sessionStorage.removeItem("user-manager/part/total");
  },
  created() {
    var expand_arr = sessionStorage.getItem("user-manager/part/data");
    if (expand_arr) {
      this.temp_data = JSON.parse(expand_arr);
      this.expand_arr = [this.temp_data.id];
    }
    var total = sessionStorage.getItem("user-manager/part/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("user-manager/part/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    var pageSize = localStorage.getItem("user-manager/part/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 5;
    this.get_user_tree();
    //获取所有的部门类型
    this.get_all_part_type();
    //地区
    this.select_region();
  },
  methods: {
    add_part_all_name() {
      if (this.temp_data.nodeType === "ORG") {
        this.form.orgAllName = this.temp_data.allName + this.form.orgName;
      } else {
        this.form.orgAllName = this.form.orgName;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      if (data.allName) {
        return data.allName.indexOf(value) !== -1;
      } else {
        return data.name.indexOf(value) !== -1;
      }
    },
    change_option1(e) {
      this.option_value2 = "";
      this.option_value3 = "";
      this.$post(
        "gwt/system/sysOrg/getAreaByParent",
        {
          parents: e
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.option2 = res.data.areaParentList;
          this.option2.unshift({
            itemName: "请选择",
            dicId: "-1"
          });
        })
        .catch(res => {
          console.log(res);
        });
    },
    change_option2(e) {
      this.option_value3 = "";
      this.$post(
        "gwt/system/sysOrg/getAreaByParent",
        {
          parents: e
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.option3 = res.data.areaParentList;
          this.option3.unshift({
            itemName: "请选择",
            dicId: "-1"
          });
        })
        .catch(res => {
          console.log(res);
        });
    },
    //获取所有的部门类型
    get_all_part_type() {
      this.$post("gwt/system/sysOrg/getDeptType", {}, "json")
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.all_part_type = res.data.getDeptType;
        })
        .catch(res => {
          console.log(res);
        });
    },
    // 地区选择
    select_region() {
      this.$post("gwt/system/sysOrg/getAreaByParent", {}, "json")
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.option1 = res.data.areaParentList;
        })
        .catch(res => {
          console.log(res);
        });
    },
    //根据部门id查子部门
    search_child_part(pageSize, pageNo) {
      this.table_loading = true;
      var areaId = this.temp_data.areaId;
      var orgParentId = this.temp_data.id;
      if (this.temp_data.nodeType === "ORG") {
        orgParentId = orgParentId && orgParentId.replace(/\D/g, "");
        areaId = "";
      } else {
        orgParentId = "";
      }
      this.$post(
        `gwt/system/sysOrg/list?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          orgParentId,
          areaId
        },
        "json"
      )
        .then(res => {
          this.table_loading = false;
          this.loading = false;
          if (res.result !== "0000") {
            this.tableData = [];
            this.total = 0;
            return;
          }
          this.tableData = res.data.sysOrgPageBean.datas.map((res, i) => {
            res.checked = false;
            return res;
          });
          this.total = res.data.sysOrgPageBean.totalCount - 0;
          sessionStorage.setItem(
            "user-manager/part/total",
            res.data.sysOrgPageBean.totalCount
          );
        })
        .catch(res => {
          this.table_loading = false;
        });
    },
    //查询用户管理部门配置
    get_user_tree() {
      this.tree_loading = true;
      var url = "gwt/system/sysOrg/getAreaOrgTreeData";
      if (!this.is_admin) {
        url = "gwt/system/sysOrg/getOrgTreeData";
      }
      this.$post(
        url,
        {
          showAllOrgFlag: "Y"
        },
        "json"
      )
        .then(res => {
          this.tree_loading = false;
          if (res.result !== "0000") {
            return;
          }
          if (this.is_admin) {
            this.tree_data = res.data.nodes;
          } else {
            this.tree_data = generate_tree(res.data.nodes);
            this.expand_arr = [this.user_info.sysOrgUserX.orgId];
            this.temp_data = JSON.parse(
              JSON.stringify(this.user_info.sysOrgUserX)
            );
            this.temp_data.id = this.temp_data.orgId;
            this.temp_data.allName = this.temp_data.orgAllName;
            this.temp_data.nodeType = "ORG";
            this.search_child_part(this.pageSize, this.pageNo);
          }
        })
        .catch(res => {
          this.tree_loading = false;
          console.log(res);
        });
    },
    add_part() {
      this.edit_visible = true;
      this.part_type = "add";
      this.form.city = "";
      this.$nextTick(res => {
        this.$refs.form.resetFields();
        this.form.city = "";
        this.option_value2 = "";
        this.option_value3 = "";
        this.form.orgDesc = "";
        this.form.orgName = "";
        this.form.orgAddr = "";
        this.form.deptType = "";
        this.form.orgAllName = "";
      });
    },
    handleNodeClick(data) {
      console.log(this.org_role_list)
      if (!this.is_admin && !this.org_role_list.includes(data.id)) {
        this.$message({
          message: "您没有操作权限！",
          type: "warning",
          showClose: true
        });
        return;
      }
      this.temp_data = data;
      this.pageNo = 1;
      this.search_child_part(this.pageSize, 1);
      sessionStorage.setItem("user-manager/part/data", JSON.stringify(data));
    },
    handle_edit(data) {
      this.edit_visible = true;
      this.part_type = "update";
      this.$nextTick(res => {
        this.$refs.form.resetFields();
        this.form.orgId = data.orgId;
        this.form.orgName = data.orgName;
        this.form.orgAllName = data.orgAllName;
        this.form.deptType = data.deptType;
        this.form.orgAddr = data.orgAddr;
        this.form.orgDesc = data.orgDesc;
        this.form.orgParentId = data.orgParentId;
      });
      if (this.temp_data.nodeType === "REGION") {
        this.$post(
          "gwt/system/sysOrg/edit",
          {
            orgId: data.orgId
          },
          "json"
        ).then(res => {
          var region = res.data.region;
          if (region[0]) {
            this.form.city = region[0].dicId + "";
            this.change_option1(region[0].dicId + "");
          }
          if (region[1]) {
            this.option_value2 = region[1].dicId + "";
            this.change_option2(region[1].dicId + "");
          }
          if (region[2]) {
            this.option_value3 = region[2].dicId + "";
          }
        });
      }
    },
    handle_delete(orgId) {
      this.$swal({
        title: "您确定要删除信息吗？",
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
          "gwt/system/sysOrg/del",
          {
            orgId
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
            this.search_child_part(this.pageSize, this.pageNo);
            this.get_user_tree();
          })
          .catch(res => {
            console.log(res);
          });
      });
    },
    handleSizeChange(e) {
      localStorage.setItem("user-manager/part/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.search_child_part(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("user-manager/part/pageNo", e);
      this.pageNo = e;
      this.search_child_part(this.pageSize, e);
    },
    onSubmit() {
      if (this.temp_data.nodeType === "ORG") {
        this.form.city = "true";
      }
      var account = "";
      if (this.form.city !== -1) {
        account = this.form.city;
      }
      account = this.form.city;
      if (this.option_value2 !== "-1" && this.option_value2) {
        account = this.option_value2;
      }
      if (this.option_value3 !== "-1" && this.option_value3) {
        account = this.option_value3;
      }
      this.$refs.form.validate(res => {
        if (!res) return;
        var orgId = "";
        var orgParentId = "";
        var deptType = this.form.deptType;
        if (this.part_type === "update") {
          orgId = this.form.orgId;
          orgParentId = this.form.orgParentId;
        }
        if (this.temp_data.nodeType === "ORG") {
          orgParentId = this.temp_data.id;
          account = undefined;
          deptType = undefined;
        }
        this.form_loading = true;
        this.$post(
          "gwt/system/sysOrg/save",
          {
            orgId,
            orgParentId,
            areaId: account,
            // account,
            orgName: this.form.orgName,
            orgAllName: this.form.orgAllName,
            deptType,
            orgAddr: this.form.orgAddr,
            orgDesc: this.form.orgDesc
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
              message: res.msg
            });
            this.get_user_tree();
            this.search_child_part(this.pageSize, this.pageNo);
            this.$store.dispatch("get_org_role_list");
            this.edit_visible = false;
          })
          .catch(res => {
            console.log(res);
            this.form_loading = false;
          });
      });
    },
    onCancel() {
      this.edit_visible = false;
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
      if (!data.orgId) {
        this.$message({
          message: "请选择一条记录进行排序！",
          type: "warning"
        });
        return;
      }
      this.$post(
        "gwt/system/sysOrg/sort",
        {
          pk: "orgId",
          sortType,
          orgId: data.orgId
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
          this.get_user_tree();
          this.search_child_part(this.pageSize, this.pageNo);
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
}

.part-action {
  padding: 16px 20px;
  color: rgb(103, 106, 108);
  overflow: hidden;
  .part-action-left {
    float: left;
    font-size: 14px;
    font-weight: 600;
  }
}
</style>

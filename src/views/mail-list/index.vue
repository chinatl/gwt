<template>
    <t-layout>
        <div slot="left">
            <div class="mail-list">
                <el-button icon="el-icon-plus" size="small" type="success" @click="add_user">新增人员组</el-button>
                <el-button icon="el-icon-plus" size="small" type="primary" @click="add_group">新增部门组</el-button>
            </div>
            <div class="mail-content common-temp" >
                <div class="main-input">
                    <el-input size="small" v-model="filterText"></el-input>
                </div>
                <div style="overflow:auto" class="tree_data scrollbar" v-loading='tree_loading'>
                  <el-tree 
                  :expand-on-click-node='false'
                  :filter-node-method="filterNode"
                  :data="data" :props="defaultProps" @node-click="handleNodeClick"  
                  :highlight-current = 'true'
                  ref='tree'
                  @node-expand='node_expand'
                  @node-collapse='node_collapse'
                  :default-expanded-keys='expanded_keys' node-key="id"></el-tree>
                </div>
            </div>
        </div>
        <div slot="right">
           <t-title title="通讯录">
               <div class="main-title">
                   <el-input size="small" placeholder="请输入姓名/手机号/部门名称" v-model="key_word" @keyup.native.enter="condition"></el-input>
                   <el-button size="mini" type="primary" icon="el-icon-search" @click="condition">搜索</el-button>
               </div>
           </t-title>
           <div v-if="is_search">
              <div class="common-table" style="margin-top:20px">
                <p style="font-size:16px;color:rgb(103, 106, 108);;margin-bottom:10px">搜索结果：为您找到相关信息 <span style="color:#ca4440;padding:2px 4pxbackground-color: #F9F2F4">{{total}}</span> 条</p>                
                  <el-table
                      :key="4"
                      :data="user_table"
                      border
                      @row-click='row_click_user'
                      style="width: 100%">
                      <el-table-column
                      align="center"
                      width="100"
                      label="头像">
                        <template slot-scope="scope">
                          <img :src="require('@/assets/imgs/a9.jpg')" style="width:40px;height:40px" v-if="!scope.row.HEAD_PORTRAIT || scope.row.HEAD_PORTRAIT ==='/'">
                          <img :src="scope.row.HEAD_PORTRAIT" style="width:40px;height:40px" v-else class="radius">
                        </template>
                      </el-table-column>
                      <el-table-column
                      prop="realName"
                      align="center"
                      width="160"
                      label="姓名">
                      </el-table-column>
                       <el-table-column
                      prop="orgAllName"
                      align="center"
                      label="部门">
                      </el-table-column>
                      <el-table-column
                      prop="mobilePhone"
                      align="center"
                      width="120"
                      label="手机号码">
                      </el-table-column>
                      <el-table-column
                      prop="fixedPhone"
                      align="center"
                      width="120"
                      label="固定电话">
                      </el-table-column>
                      <el-table-column
                      prop="name"
                      label="操作"
                      align="center"
                      width="120"
                      >
                      <template slot-scope="scope">
                        <little-button name='设为常用'  @click="set_usually_person(scope.row)"></little-button>
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
           <div v-else>
            <div class="desc-group" v-if='temp_data.nodeType === "USER_GROUP_CHILD" || temp_data.nodeType === "ORG_GROUP_CHILD"  '>
                <i class="el-icon-caret-right"></i>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item v-if="temp_data.nodeType === 'USER_GROUP_CHILD'">常用联系人</el-breadcrumb-item>
                  <el-breadcrumb-item v-if="temp_data.nodeType === 'ORG_GROUP_CHILD'">常用联系部门</el-breadcrumb-item>
                  <el-breadcrumb-item v-if="temp_data.nodeType === 'USER_GROUP_CHILD'">{{temp_data.name}}</el-breadcrumb-item>
                  <el-breadcrumb-item v-if="temp_data.nodeType === 'ORG_GROUP_CHILD'">{{temp_data.name}}</el-breadcrumb-item>
                </el-breadcrumb>
                <span class="rename" @click="rename"
                v-if="(temp_data.nodeType === 'USER_GROUP_CHILD' ||
                temp_data.nodeType === 'ORG_GROUP_CHILD') &&
                temp_data.name !== '<默认>'
                ">
                  <i class="el-icon-edit-outline"></i>重命名 
                </span>
                <span class="delete"
                @click='del_address_user'
                v-if="(temp_data.nodeType === 'USER_GROUP_CHILD' ||
                temp_data.nodeType === 'ORG_GROUP_CHILD') &&
                temp_data.name !== '<默认>'
                ">
                  <i class="el-icon-close"></i>删除
                </span>
              </div>
              <div class="action-part-info" v-if="temp_data.nodeType === 'ORG'">
                <div class="h3">
                  {{temp_data.allName}}
                  <span class="set-us" v-if="temp_data.pId.includes('DOMAIN_GROUP')">
                    <little-button name='设为常用' @click="set_usually_part"></little-button>
                  </span>
                </div>
                <p>部门类型：<span>{{temp_data.orgTypeName}}</span></p>
                <p>部门地址：<span>{{temp_data.orgAddr}}</span></p>
            
              </div>
              <div class="common-action" v-if="temp_data.nodeType === 'USER_GROUP_CHILD' ||
                temp_data.nodeType === 'ORG_GROUP_CHILD'">
                  <arrow-button 
                      @setTop='setTop'
                      @top='goTop'
                      @bottom='goBottom'
                      @setBottom='setBottom'>
                    </arrow-button>
                  <div>
                    <el-button type="success" size="small" 
                    v-if='temp_data.nodeType === "USER_GROUP_CHILD"'
                    @click="add_user_usually" icon="el-icon-plus">新增人员</el-button>
                    <el-button type="success" size="small" 
                    v-if='temp_data.nodeType === "ORG_GROUP_CHILD"'
                    @click="add_part_usually"
                    icon="el-icon-plus">新增部门</el-button>
                  </div>
              </div>
              <div class="common-table" style="margin-top:20px">
                  <el-table
                      :key="1"
                      v-if='temp_data.nodeType === "USER_GROUP_CHILD" || temp_data.nodeType === "ORG"'
                      :data="tableData"
                      border
                      @row-click='row_click_user'
                      style="width: 100%">
                     <el-table-column
                      v-if='temp_data.nodeType === "USER_GROUP_CHILD"'
                      prop="name"
                      align="center"
                      width="80"
                      label="选择">
                        <template slot-scope="scope">
                          <el-checkbox v-model="scope.row.checked"
                            @change="change_table_checked($event,scope.$index)"></el-checkbox>
                        </template>
                      </el-table-column>
                      <el-table-column
                      align="center"
                      width="120"
                      label="头像">
                        <template slot-scope="scope">
                          <i class="el-icon-info" style="color:#f8ac5a;position:absolute;top:20px;left:12px" v-if="scope.row.changeFlag === 'Y' || scope.row.isDisable"></i>
                          <img :src="require('@/assets/imgs/a9.jpg')" style="width:40px;height:40px;" v-if=" !scope.row.HEADIMGPATH || scope.row.HEADIMGPATH ==='/'">
                          <img :src="scope.row.HEADIMGPATH" style="width:40px;height:40px" v-else class="radius">
                        </template>
                      </el-table-column>
                      <el-table-column
                      prop="realName"
                      align="center"
                      label="姓名">
                      </el-table-column>
                      <el-table-column
                      prop="mobilePhone"
                      align="center"
                      label="手机号码">
                      </el-table-column>
                      <el-table-column
                      prop="fixedPhone"
                      align="center"
                      label="固定电话">
                      </el-table-column>
                      <el-table-column
                      prop="name"
                      label="操作"
                      align="center"
                      width="120"
                      >
                      <template slot-scope="scope">
                        <little-button name='设为常用' v-if="temp_data.nodeType === 'ORG'" @click="set_usually_person(scope.row)"></little-button>
                        <little-button name='移除' @click="remove_usually_user(scope.row.userxId)" v-else></little-button>
                      </template>
                      </el-table-column>
                  </el-table>
                  <el-table   
                  :key="2"
                  :data="part_tableData"
                  border
                  v-if='temp_data.nodeType === "ORG_GROUP_CHILD" || temp_data.nodeType === "DOMAIN_GROUP"'
                  style="width: 100%">
                    <el-table-column
                      v-if='temp_data.nodeType === "ORG_GROUP_CHILD"'
                      prop="name"
                      align="center"
                      width="80"
                      label="选择">
                        <template slot-scope="scope">
                          <el-checkbox v-model="scope.row.checked"
                            @change="change_part_checked($event,scope.$index)"></el-checkbox>
                        </template>
                      </el-table-column>
                      <el-table-column
                      prop="name"
                      align="center"
                      width="100"
                      label="图标">
                      <template slot-scope="scope">
                          <img :src="require('@/assets/imgs/part.png')" style="width:40px;height:40px" class="radius">
                        </template>
                      </el-table-column>
                      <el-table-column
                      prop="orgAllName"
                      align="center"
                      label="部门">
                      </el-table-column>
                      <el-table-column
                      label="操作"
                      align="center"
                      width="120"
                      >
                      <template slot-scope="scope">
                        <little-button name='设为常用' v-if="temp_data.nodeType === 'DOMAIN_GROUP'" @click="set_usually_part(scope.row)"></little-button>
                        <little-button name='移除' @click="remove_usually_part(scope.row)" v-else></little-button>
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
        </div>
        <template slot="else">
          <add-user 
          :show='add_dialog' 
          @close='add_dialog = false' 
          :loading='dialog_loading' 
          @submit="submit_add_user"
          :user-list='table_user_list'
          :address='true'
          ></add-user>
          <select-part 
          :user-list='hasSelectPart'
          :show="add_part_dialog"
           :loading='add_part_loading'
           @submit='submit_part'
           @close='add_part_dialog = false' ></select-part>
      <el-dialog 
        :close-on-click-modal='false'
        title="用户信息"
        class="common-dialog"
        v-drag
        :visible.sync="transfer_dialog">
      <div>
        <div class="user_info_dialog" v-loading='transfer_loading'>
            <div class="user_photo" style="width:221px">
              <img :src="require('@/assets/imgs/a9.jpg')" alt="" v-if="temp_user_data.HEADIMG === '/'">
              <img :src="temp_user_data.HEADIMG" alt="" v-else style="width:160px;height:160px" class="radius">
            </div>
            <div class="user_info">
              <div class="outName">{{temp_user_data.realName}}</div>
              <div class="outPhone">{{temp_user_data.mobilePhone}}</div>
              <p>职务: <span>{{temp_user_data.duty || '--'}}</span></p>
              <p>部门: <span>{{temp_user_data.orgAllName|| '--'}}</span></p>
              <p>级别: <span>{{temp_user_data.level || '--'}}</span></p>
              <p>固话：<span>{{temp_user_data.fixPhone || '--'}}</span></p>
              <div class="warning" v-if="temp_user_data.isDisable"><i class="el-icon-warning"></i> 该用户已停用！</div>
              <div class="warning" v-if="temp_user_data.changeFlag === 'Y'"><i class="el-icon-warning"></i> 该用户信息有改动！</div>
            </div>
        </div>
        <div style="text-align:right;padding-bottom:12px">
            <el-button size="small" @click="transfer_dialog = false">取消</el-button>
        </div>
      </div>  
    </el-dialog>
        </template>
    </t-layout>
</template>
<script>
import arrowButton from "@/components/Button/arrowButton";
import { delete_item, action_fail } from "@/utils/user";
import { generate_tree } from "@/utils";
import littleButton from "@/components/Button/littleButton";
import qs from "qs";
import AddUser from "@/components/AddUser";
import SelectPart from "@/components/SelectPart";
import tree_data from "@/utils/text.json";
export default {
  components: {
    arrowButton,
    AddUser,
    littleButton,
    SelectPart
  },
  data() {
    return {
      transfer_loading: false,
      transfer_dialog: false,
      tree_loading: false,
      add_dialog: false,
      dialog_loading: false,
      add_part_dialog: false,
      add_part_loading: false,
      keyword: "",
      defaultProps: {
        children: "childrens",
        label: "name"
      },
      temp_user_data: {},
      data: [],
      tableData: [],
      part_tableData: [],
      expanded_keys: [],
      temp_data: {
        nodeType: "USER_GROUP_CHILD",
        name: "<默认>",
        id: "",
        groupId: ""
      },
      pageSize: 5,
      pageNo: 1,
      total: 0,
      table_user_list: [],
      hasSelectPart: [],
      is_search: false,
      user_table: [],
      key_word: "",
      filterText: ""
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    var expanded_keys = sessionStorage.getItem("mail-list-expand");
    if (expanded_keys) {
      this.expanded_keys = JSON.parse(expanded_keys);
    } else {
      this.expanded_keys = [];
    }
    this.get_group_tree();
    this.init();
  },
  beforeDestroy(e) {
    sessionStorage.removeItem("mail-list-expand");
  },
  methods: {
    row_click_user(node, event) {
      if (
        event.target.className === "el-checkbox__original" ||
        event.target.className === "el-checkbox__inner"
      ) {
        return;
      }
      this.temp_user_data.isDisable = node.isDisable;
      this.temp_user_data.changeFlag = node.changeFlag;
      this.transfer_dialog = true;
      if (!this.is_search) {
        this.$post(
          "gwt/system/sysAddressBookUser/updateStatusForUser",
          {
            userDetailId: node.userDetailId || node.userxId,
            isCommonUser: true
          },
          "json"
        )
          .then(res => {
            if (res.result !== "0000") {
              return;
            }
            this.init(this.pageSize, this.pageNo);
          })
          .catch(res => {
            console.log(res);
          });
        if (this.temp_data.nodeType === "USER_GROUP_CHILD") {
          this.transfer_loading = true;
          this.$post(
            "gwt/system/sysAddressBookUser/getUserInfoByUserXId",
            {
              userDetailId: node.userDetailId,
              isCommonUser: true,
              groupId:
                this.temp_data.id.replace(/.*\D/, "") === "0"
                  ? ""
                  : this.temp_data.id.replace(/.*\D/, ""),
              isSelect: false
            },
            "json"
          )
            .then(res => {
              this.transfer_loading = false;
              if (res.result !== "0000") {
                return;
              }
              this.temp_user_data.HEADIMG = res.data.userInfo.HEADIMG;
              this.temp_user_data.mobilePhone = res.data.userInfo.mobilePhone;
              this.temp_user_data.duty = res.data.userInfo.duty;
              this.temp_user_data.orgAllName = res.data.userInfo.orgAllName;
              this.temp_user_data.fixPhone = res.data.userInfo.fixPhone;
              this.temp_user_data.level = res.data.userInfo.level;
            })
            .catch(res => {
              this.transfer_loading = false;
              console.log(res);
            });
        } else {
          this.$post(
            "gwt/system/sysAddressBookUser/getUserInfoByUserXId",
            {
              userId: node.userxId,
              isCommonUser: false,
              groupId:
                this.temp_data.id.replace(/.*\D/, "") === "0"
                  ? ""
                  : this.temp_data.id.replace(/.*\D/, ""),
              isSelect: false
            },
            "json"
          )
            .then(res => {
              this.transfer_loading = false;
              if (res.result !== "0000") {
                return;
              }
              this.temp_user_data = res.data.userInfo;
            })
            .catch(res => {
              this.transfer_loading = false;

              console.log(res);
            });
        }
      } else {
        this.$post(
          "gwt/system/sysAddressBookUser/getUserInfoByUserXId",
          {
            userId: node.userxId,
            isCommonUser: false,
            groupId:
              this.temp_data.id.replace(/.*\D/, "") === "0"
                ? ""
                : this.temp_data.id.replace(/.*\D/, ""),
            isSelect: true
          },
          "json"
        )
          .then(res => {
            this.transfer_loading = false;
            if (res.result !== "0000") {
              return;
            }
            this.temp_user_data = res.data.userInfo;
          })
          .catch(res => {
            this.transfer_loading = false;

            console.log(res);
          });
      }
    },
    node_collapse(node) {
      for (var i = 0; i < this.expanded_keys.length; i++) {
        if (node.id == this.expanded_keys[i]) {
          this.expanded_keys.splice(i, 1);
        }
      }
      sessionStorage.setItem(
        "mail-list-expand",
        JSON.stringify(this.expanded_keys)
      );
    },
    node_expand(node) {
      this.expanded_keys.push(node.id);
      sessionStorage.setItem(
        "mail-list-expand",
        JSON.stringify(this.expanded_keys)
      );
    },
    del_address_user() {
      delete_item({
        title: "您确定要删除这个组吗？",
        text: "删除后将无法恢复，请谨慎操作！",
        url: "gwt/system/sysAddressBookUser/delBookUserGroup",
        data: {
          groupId:
            this.temp_data.id.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.id.replace(/.*\D/, ""),
          groupType: this.temp_data.nodeType === "USER_GROUP_CHILD" ? 1 : 2
        },
        success: res => {
          if (action_fail(res)) return;
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.get_group_tree();
        }
      });
    },
    //
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
    },
    change_part_checked(event, index) {
      if (event) {
        this.part_tableData = this.part_tableData.map((res, i) => {
          if (i === index) {
            res.checked = true;
          } else {
            res.checked = false;
          }
          return res;
        });
        this.$set(this.part_tableData, index, this.part_tableData[index]);
      } else {
        this.$set(this.part_tableData, index, this.part_tableData[index]);
      }
    },
    sort_fn(sortType) {
      if (this.temp_data.nodeType === "USER_GROUP_CHILD") {
        var data = {};
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].checked) {
            data = this.tableData[i];
          }
        }
        if (!data.userDetailId) {
          this.$message({
            message: "请选择一条记录进行排序！",
            type: "warning"
          });
          return;
        }
        this.$post(
          "gwt/system/sysAddressBookUser/sortUserForGroup",
          {
            pk: "userDetailId",
            sortType: sortType,
            userDetailId: data.userDetailId
          },
          "json"
        )
          .then(res => {
            if (res.result !== "0000") {
              return;
            }
            this.init(this.pageSize, this.pageNo);
          })
          .catch(res => {
            console.log(res);
          });
      } else {
        var data = {};
        for (var i = 0; i < this.part_tableData.length; i++) {
          if (this.part_tableData[i].checked) {
            data = this.part_tableData[i];
          }
        }
        if (!data.orgDetailId) {
          this.$message({
            message: "请选择一条记录进行排序！",
            type: "warning"
          });
          return;
        }
        this.$post(
          "gwt/system/sysAddressBookOrg/sortOrgForGroup",
          {
            pk: "orgDetailId",
            sortType: sortType,
            orgDetailId: data.orgDetailId
          },
          "json"
        )
          .then(res => {
            if (res.result !== "0000") {
              return;
            }
            this.init(this.pageSize, this.pageNo);
          })
          .catch(res => {
            console.log(res);
          });
      }
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
    filterNode(value, data) {
      if (!value) return true;
      if (data.allName) {
        return data.allName.indexOf(value) !== -1;
      } else {
        return data.name.indexOf(value) !== -1;
      }
    },
    condition() {
      this.is_search = true;
      this.pageNo = 1;
      this.key_word_search(this.pageSize, 1);
    },
    key_word_search(pageSize, currentPage) {
      this.$post(
        `gwt/system/sysAddressBookUser/getBySelect?${qs.stringify({
          currentPage,
          pageSize
        })}`,
        {
          realName: this.key_word
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.user_table = res.data.sysAddressBookPersonItemPageBean.datas;
          this.total = res.data.sysAddressBookPersonItemPageBean.totalCount - 0;
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    //查询接口
    //1 根据部门id查当前部门人员
    select_user_by_part_id(pageSize, currentPage) {
      this.$post(
        `gwt/system/sysAddressBookUser/getUserByOrgId?${qs.stringify({
          currentPage,
          pageSize
        })}`,
        {
          groupId:
            this.temp_data.id.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.id.replace(/.*\D/, ""),
          orgId: "",
          realName: "",
          orgArray: ""
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.tableData = res.data.userListPageBean.datas.map(res => {
            res.checked = false;
            return res;
          });
          this.total = res.data.userListPageBean.totalCount - 0;
        })
        .catch(res => {
          console.log(res);
        });
    },
    //2 根据常用联系人分组id查询当前分组所有联系人
    select_user_by_user_group_id(pageSize, currentPage) {
      //分页查询
      this.$post(
        `gwt/system/sysAddressBookUser/getPersoByGroupId?${qs.stringify({
          pageSize,
          currentPage
        })}`,
        {
          groupId:
            this.temp_data.id.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.id.replace(/.*\D/, "")
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            this.tableData = [];
            return;
          }
          this.tableData = res.data.sysAddressBookPersonItemPageBean.datas.map(
            res => {
              res.checked = false;
              return res;
            }
          );
          this.total = res.data.sysAddressBookPersonItemPageBean.totalCount - 0;
          sessionStorage.setItem(
            "mail-list/index/total",
            res.data.sysAddressBookPersonItemPageBean.totalCount
          );
        })
        .catch(res => {
          console.log(res);
        });
      //全查
      this.$post(
        "gwt/system/sysAddressBookUser/getAllUserGroup",
        {
          groupId:
            this.temp_data.id.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.id.replace(/.*\D/, "")
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.table_user_list = res.data.groupUserList.map(res => {
            res.ORG_NAME = res.orgAllName;
            res.ID = res.userxId;
            res.REAL_NAME = res.realName;
            return res;
          });
        })
        .catch(res => {
          console.log(res);
        });
    },
    //3 根据常用部门分组id查询当前分组所有部门
    select_part_by_group_id(pageSize, currentPage) {
      //分页查
      this.$post(
        `gwt/system/sysAddressBookOrg/getOrgbyGroupId?${qs.stringify({
          currentPage,
          pageSize
        })}`,
        {
          groupId:
            this.temp_data.id.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.id.replace(/.*\D/, "")
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.part_tableData = res.data.sysAddressBookOrgItemPageBean.datas.map(
            res => {
              res.checked = false;
              return res;
            }
          );
          this.total = res.data.sysAddressBookOrgItemPageBean.totalCount - 0;
        }, "json")
        .catch(res => {
          console.log(res);
        });
      //全查
      this.$post(
        "gwt/system/sysAddressBookOrg/getAllOrgGroup",
        {
          groupId:
            this.temp_data.id.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.id.replace(/.*\D/, "")
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.hasSelectPart = res.data.groupOrgList.map(res => {
            res.name = res.orgAllName;
            res.originId = res.orgId;
            return res;
          });
        })
        .catch(res => {
          console.log(res);
        });
    },
    //4 根据域分组查域下所有的部门
    select_part_by_field_id(pageSize, pageNo) {
      var url = "";
      var all_Url = "";
      if (this.temp_data.id.replace(/.*\D/, "") - 0) {
        url = "gwt/system/sysDomain/sysgroup/getOrgByGroupIdPage";
        all_Url = "gwt/system/sysDomain/sysgroup/getOrgByGroupId";
      } else {
        url = "gwt/system/sysDomain/getOrgByDomainIdPage";
        all_Url = "gwt/system/sysDomain/getOrgByDomainId";
      }
      this.$post(
        url,
        {
          domainId:
            this.temp_data.pId.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.pId.replace(/.*\D/, ""),
          groupId:
            this.temp_data.id.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.id.replace(/.*\D/, "")
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.part_tableData = res.data.sysOrgPageBean.datas.map(res => {
            res.checked = false;
            return res;
          });
          this.total = res.data.sysOrgPageBean.totalCount - 0;
        })
        .catch(res => {
          console.log(res);
        });
      // this.$post(
      //   all_Url,
      //   {
      //     domainId:
      //       this.temp_data.pId.replace(/.*\D/, "") === "0"
      //         ? ""
      //         : this.temp_data.pId.replace(/.*\D/, ""),
      //     groupId:
      //       this.temp_data.id.replace(/.*\D/, "") === "0"
      //         ? ""
      //         : this.temp_data.id.replace(/.*\D/, "")
      //   },
      //   "json"
      // )
      //   .then(res => {
      //     this.hasSelectPart = res.data.groupOrgList.map(res => {
      //       res.name = res.orgAllName;
      //       res.originId = res.orgId;
      //       return res;
      //     });
      //     console.log(res);
      //   })
      //   .catch(res => {});
    },
    init(pageSize, currentPage) {
      if (this.temp_data.nodeType === "ORG") {
        this.select_user_by_part_id(pageSize, currentPage);
      } else if (this.temp_data.nodeType === "USER_GROUP_CHILD") {
        this.select_user_by_user_group_id(pageSize, currentPage);
      } else if (this.temp_data.nodeType === "ORG_GROUP_CHILD") {
        this.select_part_by_group_id(pageSize, currentPage);
      } else if (this.temp_data.nodeType === "DOMAIN_GROUP") {
        this.select_part_by_field_id(pageSize, currentPage);
      }
    },
    //移除常用部门
    remove_usually_part(data) {
      delete_item({
        title: "您确定要移除吗？",
        text: "移除后将无法恢复，请谨慎操作！",
        url: "gwt/system/sysAddressBookOrg/aloneDelBookOrgGroup",
        data: {
          orgId: data.orgId,
          groupId:
            this.temp_data.id.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.id.replace(/.*\D/, "")
        },
        success: res => {
          if (res.result !== "0000") {
            return;
          }
          this.get_group_tree();
          this.init(this.pageSize, this.pageNo);
        }
      });
    },
    //设为常用部门
    set_usually_part(item) {
      this.$post(
        "gwt/system/sysAddressBookGroup/getSysAddressBookGroup",
        {
          groupType: 2
        },
        "json"
      ).then(res => {
        if (res.result !== "0000") {
          return;
        }
        var obj = {};
        for (var i = 0; i < res.data.sysAddressBookGroupPageBean.length; i++) {
          obj["groupId_" + res.data.sysAddressBookGroupPageBean[i].groupId] =
            res.data.sysAddressBookGroupPageBean[i].groupName;
        }
        this.$swal({
          title: "选择常用联系部门",
          input: "select",
          inputOptions: obj,
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValidator: function(value) {
            return !value && "组名不能為空！";
          }
        }).then(result => {
          if (result.value) {
            var orgIds;
            if (item) {
              orgIds = item.orgId;
            } else {
              orgIds = this.temp_data.originId;
            }
            this.$post(
              "gwt/system/sysAddressBookOrg/addBookOrgGroup",
              {
                orgIds,
                groupId: result.value.replace(/.*\D/g, "")
              },
              "json"
            ).then(res => {
              if (action_fail(res)) return;
              this.get_group_tree();
            });
          }
          console.log(result);
        });
      });
    },
    // 设为常用联系人
    set_usually_person(item) {
      this.$post(
        "gwt/system/sysAddressBookGroup/getSysAddressBookGroup",
        {
          groupType: 1
        },
        "json"
      ).then(res => {
        if (res.result !== "0000") {
          return;
        }
        var obj = {};
        for (var i = 0; i < res.data.sysAddressBookGroupPageBean.length; i++) {
          obj["groupId_" + res.data.sysAddressBookGroupPageBean[i].groupId] =
            res.data.sysAddressBookGroupPageBean[i].groupName;
        }
        this.$swal({
          title: "选择常用联系人组",
          input: "select",
          inputOptions: obj,
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValidator: function(value) {
            return !value && "组名不能為空！";
          }
        }).then(result => {
          if (result.value) {
            this.$post(
              "gwt/system/sysAddressBookUser/addUser",
              {
                groupId: result.value.replace(/.*\D/g, ""),
                userIds: item.userxId
              },
              "json"
            )
              .then(res => {
                if (action_fail(res)) return;
              })
              .catch(res => {
                console.log(res);
              });
          }
          console.log(result);
        });
      });
    },
    handleCurrentChange(e) {
      this.pageNo = e;
      if (this.is_search) {
        this.key_word_search(this.pageSize, e);
      } else {
        this.init(this.pageSize, e);
      }
    },
    //
    handleSizeChange(e) {
      this.pageNo = 1;
      this.pageSize = e;
      if (this.is_search) {
        this.key_word_search(e, 1);
      } else {
        this.init(e, 1);
      }
    },
    //
    search_user_by_part(pageSize, pageNo) {
      this.$post(
        `gwt/system/sysAddressBookUser/getUserByOrgId?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          groupId:
            this.temp_data.id.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.id.replace(/.*\D/, ""),
          orgId: "",
          realName: "",
          orgArray: ""
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.tableData = res.data.userListPageBean.datas;
          this.total = res.data.userListPageBean.totalCount - 0;
        })
        .catch(res => {
          console.log(res);
        });
    },
    //点击常用分组 查下面的组
    search_group_part(pageSize, pageNo) {
      this.$post(
        `gwt/system/sysAddressBookOrg/getOrgbyGroupId?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          groupId:
            this.temp_data.id.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.id.replace(/.*\D/, "")
        },
        "json"
      )
        .then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.part_tableData = res.data.sysAddressBookOrgItemPageBean.datas;
          this.total = res.data.sysAddressBookOrgItemPageBean.totalCount - 0;
        })
        .catch(res => {
          console.log(res);
        });
    },
    //点常用联系人分组查联系人
    search_message_user(pageSize, pageNo) {
      this.$post(
        `gwt/system/sysAddressBookUser/getPersoByGroupId?${qs.stringify({
          pageSize: pageSize,
          currentPage: pageNo
        })}`,
        {
          groupId:
            this.temp_data.id.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.id.replace(/.*\D/, "")
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            this.tableData = [];
            return;
          }
          this.tableData = res.data.sysAddressBookPersonItemPageBean.datas;
          this.total = res.data.sysAddressBookPersonItemPageBean.totalCount - 0;
          sessionStorage.setItem(
            "mail-list/index/total",
            res.data.sysAddressBookPersonItemPageBean.totalCount
          );
        })
        .catch(res => {
          console.log(res);
        });
    },
    //弹窗确定修改人员
    submit_add_user(data) {
      this.dialog_loading = true;
      this.$post(
        "gwt/system/sysAddressBookUser/batchAddUsersForGroup",
        {
          userIds: data.map(res => res.ID).join(","),
          groupId:
            this.temp_data.id.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.id.replace(/.*\D/, "")
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
          this.add_dialog = false;
          this.$message({
            message: "人员操作成功",
            type: "success"
          });
          this.init(this.pageSize, this.pageNo);
        })
        .catch(res => {
          console.log(res);
          this.dialog_loading = false;
        });
    },
    //新增常用人员
    add_user_usually() {
      this.add_dialog = true;
    },

    //确定提交
    submit_part(arr) {
      this.add_part_loading = true;
      this.$post(
        "gwt/system/sysAddressBookOrg/batchAddOrgsForGroup",
        {
          orgIds: arr
            .map(res => (res.originId + "").replace(/.*\D/, ""))
            .join(","),
          groupId:
            this.temp_data.id.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.id.replace(/.*\D/, "")
        },
        "json"
      )
        .then(res => {
          this.add_part_loading = false;
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
          this.add_part_dialog = false;
          this.$message({
            message: "部门操作成功",
            type: "success"
          });
          this.get_group_tree();
          this.init(this.pageSize, this.pageNo);
        })
        .catch(res => {
          this.add_part_loading = false;
        });
    },
    add_part_usually() {
      this.add_part_dialog = true;
    },
    // 移除常用联系人
    remove_usually_user(userId) {
      delete_item({
        url: "gwt/system/sysAddressBookUser/delUser",
        data: {
          groupId:
            this.temp_data.id.replace(/.*\D/, "") === "0"
              ? ""
              : this.temp_data.id.replace(/.*\D/, ""),
          userId
        },
        title: "您确定要移除吗？",
        text: "移除后将无法恢复，请谨慎操作！",
        success: res => {
          if (action_fail(res)) return;
          this.init(this.pageSize, this.pageNo);
        }
      });
    },
    //设为常用联系人

    get_group_tree() {
      this.tree_loading = true;
      this.$post("gwt/system/sysAddressBookGroup/getGroupTree", {}, "json")
        .then(res => {
          this.tree_loading = false;
          if (res.result !== "0000") {
            return;
          }
          this.data = generate_tree(res.data.nodes);
        })
        .catch(res => {
          this.tree_loading = false;
        });
    },

    handleNodeClick(data) {
      if (data.nodeType === "USER_GROUP" || data.nodeType === "ORG_GROUP") {
        this.expanded_keys[0] = data.id;
        return;
      }

      if (
        data.nodeType !== "ORG" &&
        data.nodeType !== "USER_GROUP_CHILD" &&
        data.nodeType !== "ORG_GROUP_CHILD" &&
        data.nodeType !== "DOMAIN_GROUP"
      ) {
        return;
      }
      if (data.nodeType === "ORG") {
        this.$post(
          "gwt/system/sysOrg/get",
          {
            orgId: data.originId
          },
          "json"
        )
          .then(res => {
            if (res.result !== "0000") {
              return;
            }
            this.temp_data.orgTypeName = res.data.loadOrg.orgTypeName;
            this.temp_data.orgAddr = res.data.loadOrg.orgAddr;
          })
          .catch(res => {
            console.log(res);
          });
      }
      this.pageNo = 1;
      this.is_search = false;
      this.temp_data = data;
      this.pageNo = 1;
      this.init(this.pageSize, 1);
    },
    add_user() {
      this.$swal({
        confirmButtonText: "确定",
        showCancelButton: true,
        cancelButtonText: "取消",
        title: "请输入常用联系人组名称",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          return !value && "組名不能為空！";
        }
      }).then(res => {
        if (res.value) {
          this.$post(
            "gwt/system/sysAddressBookGroup/addGroup",
            {
              groupName: res.value,
              groupType: 1
            },
            "json"
          )
            .then(res => {
              if (res.result !== "0000") {
                vue.swal({
                  title: "操作失败！",
                  text: res.msg,
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  showConfirmButton: true
                });
                return;
              }
              this.get_group_tree();
              this.$message({
                message: "新增人员分組成功！",
                type: "success"
              });
            })
            .catch(res => {});
        }
      });
    },
    add_group() {
      this.$swal({
        confirmButtonText: "确定",
        showCancelButton: true,
        cancelButtonText: "取消",
        title: "请输入常用部门组名称",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          return !value && "組名不能為空！";
        }
      }).then(res => {
        if (res.value) {
          this.$post(
            "gwt/system/sysAddressBookGroup/addGroup",
            {
              groupName: res.value,
              groupType: 2
            },
            "json"
          )
            .then(res => {
              if (res.result !== "0000") {
                vue.swal({
                  title: "操作失败！",
                  text: res.msg,
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  showConfirmButton: true
                });
                return;
              }
              this.get_group_tree();
              this.$message({
                message: "新增部门分組成功！",
                type: "success"
              });
            })
            .catch(res => {
              console.log(res);
            });
        }
      });
    },
    del_group() {},
    rename() {
      var title = "请输入新的部门分组名称";
      var groupType = 2;
      if (this.temp_data.nodeType === "USER_GROUP_CHILD") {
        title = "请输入新的联系人分组名称";
        groupType = 1;
      }
      this.$swal({
        confirmButtonText: "确定",
        showCancelButton: true,
        cancelButtonText: "取消",
        title,
        input: "text",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          return !value && "組名不能為空！";
        }
      }).then(Response => {
        if (Response.value) {
          this.$post(
            "gwt/system/sysAddressBookGroup/addGroup",
            {
              groupName: Response.value,
              groupType,
              groupId:
                this.temp_data.id.replace(/.*\D/, "") === "0"
                  ? ""
                  : this.temp_data.id.replace(/.*\D/, "")
            },
            "json"
          )
            .then(res => {
              if (res.result !== "0000") {
                vue.swal({
                  title: "操作失败！",
                  text: res.msg,
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  showConfirmButton: true
                });
                return;
              }
              this.get_group_tree();
              this.$message({
                message: "新增部门分組成功！",
                type: "success"
              });
              this.temp_data.name = Response.value;
            })
            .catch(res => {
              console.log(res);
            });
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.radius {
  border-radius: 50%;
}
.user_info_dialog {
  padding: 10px 40px;
  overflow: hidden;
  display: flex;
  .user_photo {
    padding: 0 30px;
  }
  .user_info {
    padding: 0 30px;
    .warning {
      margin-top: 12px;
      line-height: 24px;
      color: rgb(220, 20, 60);
      .el-icon-warning {
        font-size: 18px;
        vertical-align: sub;
      }
    }
    .outName {
      color: rgb(59, 164, 245);
      font-size: 24px;
      font-weight: 500;
    }
    .outPhone {
      margin-top: 10px;
      color: rgb(59, 164, 245);
      font-size: 16px;
      font-weight: 500;
    }
    p {
      color: rgb(103, 106, 108);
      font-size: 13px;
      font-weight: 700;
      margin-top: 10px;
      span {
        font-weight: normal;
      }
    }
  }
}
.action-part-info {
  background-color: #fff;
  color: inherit;
  padding: 15px 40px 0px;
  color: rgb(103, 106, 108);
  .h3 {
    font-weight: 600;
    margin-bottom: 12px;
    .set-us {
      float: right;
    }
  }
  p {
    font-size: 14px;
    span {
      font-weight: 600;
      line-height: 30px;
    }
  }
}
.mail-list {
  margin: 12px 20px;
  display: flex;
  button {
    flex: 1;
    font-size: 14px;
    &.el-button--small {
      padding: 9px 0;
    }
  }
}
.mail-content {
  margin: 0 20px;
  height: 550px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 6px;
  border-radius: 4px;
  .main-input {
    margin-bottom: 6px;
  }
  .tree_data {
    height: 498px;
  }
}
.main-title {
  float: right;
  width: 60%;
  display: flex;
  .el-button {
    margin-left: 5px;
    height: 32px;
    margin-top: 0;
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
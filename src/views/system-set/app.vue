<template>
    <div class="common field">
        <t-title>应用管理</t-title>
        <div class="common-action">
            <div class="common-table-bar">
                <span v-for="(item,index) in select_arr" :key='index' 
                @click='select_nav(item.Q_isActive_L,index)'
                :class="current == index ? 'current':''">{{item.name}}</span>
            </div>
            <div>
                <el-input v-model="Q_appName_SL" placeholder="请输入应用名称" style="width:200px" size='medium'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="condition">搜索</el-button>
                <el-button type="success" icon="el-icon-plus" size='medium' @click="add_role">新增应用</el-button>
            </div>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                v-loading ='loading'
                style="width: 100%">
                <el-table-column
                prop="title"
                align="center"
                width="160"
                label="应用logo">
                  <template slot-scope="scope">
                    <div style="text-align:center">
                      <img :src="require('@/assets/imgs/yingyong.png')" alt="" v-if="!scope.row.logo" class="radius" style="width:40px;height:40px;display:block;margin:0 auto">
                      <img :src="scope.row.logo" alt="" v-else style="width:40px;height:40px;display:block;margin:0 auto" class="radius">
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                prop="appName"
                align="center"
                label="应用名称">
                </el-table-column>
                <el-table-column
                align="center"
                width="140"
                label="应用状态">
                    <template slot-scope="scope">
                        <little-button :name='scope.row.isActive === "2" ? "已下架" : "已上架"'></little-button>
                    </template>
                </el-table-column>
                <el-table-column
                prop="title"
                align="center"
                width="140"
                label="资源管理">
                    <template slot-scope="scope">
                        <little-button name='资源管理' @click.native='resource_manager(scope.row)'></little-button>
                    </template>
                </el-table-column>
                <el-table-column
                prop="name"
                label="操作"
                align="center"
                width="240"
                >
                 <template slot-scope="scope">
                    <little-button :name='scope.row.status ? "下架" : "上架"' @click.native="swal_app(scope.row.status)"></little-button>
                    <little-button name='编辑' @click.native="edit_role(scope.row)"></little-button>
                    <little-button name='删除' @click.native="handleDelete(scope.row.appId)"></little-button>
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
            :title="role_type === 'add' ? '新增应用':'编辑应用'"
            class="common-dialog"
            v-drag
            :visible.sync="role_visible">
            <el-form ref="form" :model="form" label-width="120px" :rules="rules"  v-loading='form_loading'>
                <el-form-item label="应用图标">
                    <el-upload
                        ref="upload"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-change="upload_img"
                        :file-list="fileList"
                        :show-file-list="false"
                        :auto-upload="false"
                        v-if="!img_data_url"
                        >
                        <el-button size='small' type="primary" icon="el-icon-edit-outline">
                            上传图片
                        </el-button>
                    </el-upload>
                    <div v-else class="dialog-img-container">
                        <img :src="img_data_url">
                        <i class="el-icon-close" @click="del_upload_img"></i>
                    </div>
                    <p class="form-tips"><i class="el-icon-warning"></i> 注：上传尺寸为40px * 40px、格式PNG、JPG、GIF均可。</p>
                </el-form-item>
                <el-form-item label="名称" prop='appName'>
                    <el-input v-model="form.appName" size="small" placeholder="应用中文名称,系统中唯一"></el-input>
                </el-form-item>
                <el-form-item label="首页地址">
                    <el-input v-model="form.homePage" size="small" placeholder=" 应用首页地址"></el-input>
                </el-form-item>
                <el-form-item label="功能简介">
                        <el-input type="textarea" v-model="form.remark" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import littleButton from "@/components/Button/littleButton";
import formButton from "@/components/Button/formButton";
import { action_fail, delete_item } from "@/utils/user";
import qs from "qs";
export default {
  components: {
    littleButton,
    formButton
  },
  data() {
    return {
      role_type: "add",
      pageNo: 1,
      pageSize: 5,
      input: "",
      role_visible: false,
      form: {
        appName: "",
        homePage: "",
        isLocal: 1,
        defaultUrl: "",
        remark: "",
        logo: "",
        appId: ""
      },
      form_loading: false,
      tableData: [],
      rules: {
        logo: [
          { required: true, message: "请选择应用图标", trigger: "change" }
        ],
        appName: [
          { required: true, message: "请输入应用名称", trigger: "blur" }
        ],
        homePage: [
          { required: true, message: "请输入首页地址名称", trigger: "blur" }
        ],
        defaultUrl: [
          { required: true, message: "请输入功能获取地址名称", trigger: "blur" }
        ]
      },
      select_arr: [
        {
          name: "全部应用",
          Q_isActive_L: "all"
        },
        {
          name: "已上架",
          Q_isActive_L: "1"
        },
        {
          name: "已下架",
          Q_isActive_L: "2"
        },
        {
          name: "开发中",
          Q_isActive_L: "3"
        }
      ],
      current: 1,
      fileList: [],
      img_data: {},
      Q_appName_SL: "",
      loading: false,
      img_data_url: "",
      img_info: {}
    };
  },
  created() {
    var total = sessionStorage.getItem("system-set/app/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("system-set/app/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;

    var current = sessionStorage.getItem("system-set/app/current");
    this.current = current ? current - 0 : 0;
    //页数存到localstorage里面
    var pageSize = localStorage.getItem("system-set/app/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 10;
    this.init(this.pageSize, this.pageNo);
  },
  methods: {
    select_nav(status, index) {
      sessionStorage.setItem("system-set/app/current", index);
      this.Q_appName_SL = status;
      this.current = index;
    },
    handleSizeChange(e) {
      localStorage.setItem("system-set/app/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    condition() {
      this.pageNo = 1;
      this.init(this.pageSize, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("system-set/app/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
    },
    init(pageSize, pageNo) {
      this.$post(
        `gwt/system/sysApp/list?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          Q_appName_SL: this.Q_appName_SL,
          Q_isActive_L: "all",
          sourece: "yygl"
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            this.tableData = [];
            return;
          }
          this.tableData = res.data.sysAppPageBean.datas;
          this.total = res.data.sysAppPageBean.totalCount - 0;
          sessionStorage.setItem(
            "system-set/app/total",
            res.data.sysAppPageBean.totalCount
          );
        })
        .catch(res => {
          this.loading = false;
        });
    },
    //上架或者下架app
    swal_app(status) {
      if (status) {
        this.$swal({
          title: "确定下架应用公告管理吗？",
          text: "请确保该应用功能可以正常使用！",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          confirmButtonClass: "btn btn-success"
        })
          .then(res => {
            console.log(res);
            this.$swal({
              title: "提示！",
              text: "应用操作成功。",
              type: "success",
              timer: 1000,
              showConfirmButton: false
            });
          })
          .catch(res => {
            this.$swal({
              title: "提示！",
              text: "已取消操作。",
              timer: 1000,
              showConfirmButton: false
            });
          });
      } else {
        this.$swal({
          title: "确定上架应用公告管理吗？",
          text: "请确保该应用功能可以正常使用！",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          confirmButtonClass: "btn btn-success"
        })
          .then(res => {
            this.$swal({
              title: "提示！",
              text: "应用操作成功。",
              type: "success",
              timer: 1000,
              showConfirmButton: false
            });
          })
          .catch(res => {
            this.$swal({
              title: "提示！",
              text: "已取消操作。",
              timer: 1000,
              showConfirmButton: false
            });
          });
      }
    },
    resource_manager(item) {
      sessionStorage.setItem("appId", JSON.stringify(item));
      this.$router.push({
        path: "/resoure-manager/index"
      });
    },
    handleDelete(appId) {
      delete_item({
        url: "gwt/system/sysApp/del",
        data: {
          appId
        },
        success: res => {
          if (action_fail(res)) return;
          this.init(this.pageSize, this.pageNo);
        }
      });
    },
    onSubmit() {
      var appId;
      if (this.role_type === "add") {
        appId = "";
      } else {
        appId = this.form.appId;
      }
      this.$refs.form.validate(res => {
        if (!res) return;
        this.form_loading = true;
        this.$post(
          "gwt/system/sysApp/save",
          {
            appId,
            logo: this.img_data_url,
            appName: this.form.appName,
            homePage: this.form.homePage,
            remark: this.form.remark
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
              message: "操作成功！"
            });
            this.init(this.pageSize, this.pageNo);
            this.role_visible = false;
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
        this.form.appName = "";
        this.form.homePage = "";
        this.form.remark = "";
        this.img_data.url = "";
      });
    },
    edit_role(item) {
      this.form = JSON.parse(JSON.stringify(item));
      this.role_type = "update";
      this.role_visible = true;
      this.img_data_url = item.logo;
    },
    upload_img(file) {
      if (
        file.raw.type !== "image/jpeg" &&
        file.raw.type !== "image/png" &&
        file.raw.type !== "image/gif"
      ) {
        this.$message({
          message: "请上传PNG、JPG、GIF格式的图片",
          type: "error"
        });
        return;
      }
      this.loading = true;
      var formData = new FormData();
      formData.append("ownerSystem", "gwt-platform");
      formData.append("ownerModule", "app");
      formData.append("ownerAperation", "e.raw");
      formData.append("userId", "1");
      formData.append("uploadOpt", "add");
      formData.append("editFileId", "");
      formData.append("selectFile", file.raw);
      this.$post("gwt/uploadFile/upload", formData, "form")
        .then(res => {
          this.loading = false;
          if (action_fail(res, "上传成功！", "上传失败！")) return;
          this.$message({
            type: "success",
            message: "上传成功"
          });
          this.img_data_url =
            res.data.attachment.attaPath +
            "/" +
            res.data.attachment.smallImgName;
        })
        .catch(res => {
          this.loading = false;
        });
    },
    del_upload_img() {
      this.img_data_url = "";
    }
  }
};
</script>

<template>
    <div class="common field">
        <t-title>应用管理</t-title>
        <div class="common-action">
            <div class="common-table-bar">
                <span v-for="(item,index) in select_arr" :key='index' 
                @click='current = index'
                :class="current == index ? 'current':''">{{item}}</span>
            </div>
            <div>
                <el-input v-model="input" placeholder="请输入应用名称" style="width:200px" size='medium'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium'>搜索</el-button>
                <el-button type="success" icon="el-icon-plus" size='medium' @click="add_role">新增应用</el-button>
            </div>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                prop="title"
                align="center"
                label="应用logo">
                </el-table-column>
                <el-table-column
                prop="name"
                align="center"
                label="应用名称">
                </el-table-column>
                <el-table-column
                prop="key"
                align="center"
                show-overflow-tooltip
                label="key">
                </el-table-column>
                <el-table-column
                prop="title"
                align="center"
                width="140"
                label="应用状态">
                    <template slot-scope="scope">
                        <little-button :name='scope.row.status ? "已下架" : "已上架"'></little-button>
                    </template>
                </el-table-column>
                <el-table-column
                prop="title"
                align="center"
                width="140"
                label="资源管理">
                    <template slot-scope="scope">
                        <little-button name='资源管理' @click.native='resource_manager'></little-button>
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
                    <little-button name='编辑' @click.native="edit_role(scope.$index, scope.row)"></little-button>
                    <little-button name='删除' @click.native="handleDelete(scope.$index, scope.row)"></little-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="common-page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="40">
            </el-pagination>
        </div>
        <!-- 角色新增弹出框 -->
            <el-dialog
            :title="role_type === 'add' ? '新增应用':'编辑应用'"
            class="common-dialog"
            :visible.sync="role_visible">
            <el-form ref="form" :model="form" label-width="120px" :rules="rules"  class="demo-ruleForm">
                <el-form-item label="应用图标">
                    <el-upload
                        ref="upload"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-change="upload_img"
                        :file-list="fileList"
                        :show-file-list="false"
                        :auto-upload="false"
                        v-if="!img_data.url"
                        >
                        <el-button size='small' type="primary" icon="el-icon-edit-outline">
                            上传图片
                        </el-button>
                    </el-upload>
                    <div v-else class="dialog-img-container">
                        <img :src="img_data.url">
                        <i class="el-icon-close" @click="del_upload_img"></i>
                    </div>
                    <p class="form-tips"><i class="el-icon-warning"></i> 注：上传尺寸为40px * 40px、格式PNG、JPG、GIF均可。</p>
                </el-form-item>
                <el-form-item label="名称" prop='name'>
                    <el-input v-model="form.name" size="small" placeholder="应用中文名称,系统中唯一"></el-input>
                </el-form-item>
                <el-form-item label="首页地址" prop='name'>
                    <el-input v-model="form.name" size="small" placeholder=" 应用首页地址"></el-input>
                </el-form-item>
                <el-form-item label="是否第三方应用" prop="type">
                    <el-checkbox-group v-model="form.type">
                        <el-checkbox label="本地" name="type"></el-checkbox>
                        <el-checkbox label="非本地" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="功能获取地址" prop='name'>
                    <el-input v-model="form.name" size="small" placeholder="必填资源管理需要应用"></el-input>
                </el-form-item>
                <el-form-item label="功能简介">
                        <el-input type="textarea" v-model="form.desc" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import littleButton from "@/components/Button/littleButton";
import formButton from "@/components/Button/formButton";
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
        name: "",
        type: ""
      },
      tableData: [
        {
          title: "测试角色11111",
          name: "公务通",
          key: "c2a112a4-8a70-4ff2-acc0-3d7c07082076",
          status: false
        },
        {
          title: "公告管理",
          name: "公务通",
          key: "announcement",
          status: true
        },
        {
          title: "测试角色11111",
          name: "公务通",
          key: "c2a112a4-8a70-4ff2-acc0-3d7c07082076",
          status: false
        },
        {
          title: "测试角色11111",
          name: "公务通",
          key: "c2a112a4-8a70-4ff2-acc0-3d7c07082076",
          status: false
        }
      ],
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        type: [
          { required: true, message: "请选择是否为第三方应用", trigger: "blur" }
        ]
      },
      select_arr: ["全部应用", "已上架", "已下架", "开发中"],
      current: 1,
      fileList: [],
      img_data: {}
    };
  },
  afterEach() {
  },
  created() {
  },
  methods: {
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
    resource_manager() {
      this.$router.push({
        path: "/system-set/resource"
      });
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    handleDelete() {},
    onSubmit() {
      this.role_visible = false;
    },
    onCancel() {
      this.role_visible = false;
    },
    add_role() {
      this.role_type = "add";
      this.role_visible = true;
    },
    edit_role() {
      console.log(1);
      this.role_type = "update";
      this.role_visible = true;
    },
    upload_img(file) {
      this.img_data = file;
    },
    del_upload_img() {
      this.img_data.url = "";
    }
  }
};
</script>

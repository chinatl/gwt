<template>
    <div class="field">
        <t-title title="个人云盘"></t-title>
        <div class="common-action">
            <div class="disk-cloud">
                <upload-button icon="el-icon-upload2" @on-change="upload_img" size='medium' type="success" >上传</upload-button>
                <el-button type="success" icon="el-icon-plus" size='medium' v-wave @click="dialogFolderVisible = true">新建文件夹</el-button>
                <el-button type="primary" icon="el-icon-download" size='medium' v-wave @click="download_file">下载</el-button>
                <el-button type="danger" icon="el-icon-close" size='medium' v-wave @click="delete_btn">删除</el-button>
            </div>
            <div>
                <el-input v-model="input" placeholder="请输入文件名" style="width:240px" size='medium' @keyup.native.enter='condition'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="condition">搜索</el-button>
            </div>
        </div>
        <div class="disk-cloud-router">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item @click.native="show_all_file">全部文件</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in file_nav" :key="index" @click.native="go_child_file(index)">{{item.originalName}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                @selection-change="handleSelectionChange"   
                v-loading='loading'          
                style="width: 100%">
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column prop="originalName"  :label="file_name"  align="left"  show-overflow-tooltip> 
                    <template slot-scope="scope">
                      <div class="disk-icon" @click="file_click(scope.row)">
                          <svg-icon :icon-class='get_svg_name(scope.row.suffix)'></svg-icon>
                          <span>{{scope.row.originalName}}</span>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column prop="attaSize"  label="大小" align="center"  width="100">
                  <template slot-scope="scope">
                    {{scope.row.attaSize | fileSize}}
                  </template>
                </el-table-column>
                <el-table-column prop="updateTime"  label="修改日期" align="center" width="200"></el-table-column>
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
            :total="totalCount">
            </el-pagination>
        </div>
        <!-- 新建文件夹弹窗 -->
        <el-dialog title="请输入新建文件夹名称" :visible.sync="dialogFolderVisible" center class="folder" width="30%" @submit.native.prevent>
          <el-form :model="folderform" :rules="folderrules" ref="folderform">
            <el-form-item prop="foldername">
              <el-input v-model="folderform.foldername"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFolderVisible = false">取 消</el-button>
            <el-button type="primary" @click="add_older('folderform')">确 定</el-button>
          </div>
        </el-dialog>
    </div>
    
</template>
<script>
import uploadButton from "@/components/Button/uploadButton";
import qs from "qs";
import { fileType } from "@/utils";
import { Base64 } from "js-base64";
import md5 from "js-md5";
export default {
  components: {
    uploadButton
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      input: "",
      checked: false,
      doc_reg: /\.(docx?)$/,
      png_reg: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      ppt_reg: /\.(pptx?)$/,
      excel_reg: /\.(csv|xlsx?)$/,
      pdf_reg: /\.(pdf)$/,
      select_list: [],
      tableData: [],
      file_nav: [], //文件导航
      dialogFolderVisible: false,
      folderform: {
        foldername: "",
        updateTime: "",
        userId: "",
        orgId: "",
        originalName: ""
      },
      folderrules: {
        foldername: [
          { required: true, message: "文件名不能为空", trigger: "blur" }
        ]
      },
      type: "",
      dirId: "",
      fileId: "",
      dirIds: [],
      fileIds: [],
      parentId: "",
      loading: false,
      sigle_fileid:""
    };
  },
  computed: {
    file_name() {
      if (this.select_list.length) {
        // console.log(this.select_list)
        return `已选中${this.select_list.length}个文件/文件夹`;
      } else {
        return "文件名";
      }
    }
  },
  created() {
    this.getUserInfo();
    this.init_usercloudisk(this.pageSize, this.pageNo);
  },
  methods: {
    condition() {
      this.pageNo = 1;
      this.init_usercloudisk(this.pageSize, 1);
    },
    //获取用户基本信息
    getUserInfo() {
      this.$post(`gwt/system/sysUserZone/getUserInfo`).then(res => {
        if (res.result !== "0000") {
          // console.log(res.data.user.userId)
          return;
        }
        this.folderform.userId = res.data.user.userId;
        this.folderform.orgId = res.data.user.orgId;
      });
    },
    //初始化文件表格
    init_usercloudisk(pageSize, pageNo) {
      this.loading = true;
      this.$post(
        `gwt/cloudisk/cloudiskAttaUserRelation/userCloudiskPage?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          originalName: this.input,
          searchFlag: this.input ? "Y" : "N",
          parentId: this.parentId
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
          this.tableData = res.data.userCloudiskPageBean.datas;
          this.totalCount = res.data.userCloudiskPageBean.totalCount - 0;
          // console.log(this.totalCount)
        })
        .catch(res => {
          this.loading = false;
        });
    },
    //新建文件夹
    add_older(formName) {
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$post(
            `gwt/cloudisk/cloudiskAttaDir/addFolder`,
            {
              type: "user",
              orgId: this.folderform.orgId,
              name: this.folderform.foldername,
              parentId: this.parentId === "" ? "" : this.dirId
            },
            "json"
          ).then(res => {
            // console.log(res)
            if (res.result === "0000") {
              this.dialogFolderVisible = false;
              this.init_usercloudisk();
              this.$message({
                type: "success",
                message: "新建成功"
              });
              this.folderform = {};
            } else {
              this.$message.error(res.msg);
            }
            // console.log(this.tableData.type)
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除
    delete_btn() {
      if (this.fileIds.length == 0 && this.dirIds.length == 0) {
        this.$swal({
          title: "提示信息！",
          text: "请选择要删除的文件或文件夹",
          type: "warning",
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          showConfirmButton: true
        });
        return;
      }
      this.$swal({
        title: "确定要删除吗？",
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
          `gwt/cloudisk/cloudiskAttaUserRelation/userDelete`,
          {
            fileIds: this.fileIds,
            dirIds: this.dirIds
          },
          "json"
        )
          .then(res => {
            console.log(res);
            if (res.result === "0000") {
              this.init_usercloudisk();
              this.$message({
                type: "success",
                message: "删除成功"
              });
            }
          })
          .catch(res => {
            console.log(res);
          });
      });
    },
    //下载
    download_file() {
      if (this.fileIds.length == 0 && this.dirIds.length == 0) {
        this.$swal({
          title: "提示信息！",
          text: "请选择要下载的文件",
          type: "warning",
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          showConfirmButton: true
        });
        return;
      }
      var data = {
        fileIds: this.fileIds.map(res => res + "").join(","),
        dirIds: this.dirIds.map(res => res + "").join(","),
        orgId: this.folderform.orgId
      };
      var sigle_data = {
        jh:parseInt(this.sigle_fileid)
      }
      if(this.fileIds.length === 1 && this.dirIds.length === 0){
        // alert("dan")
        //   console.log(parseInt(this.sigle_fileid))
          var object = Base64.encode(JSON.stringify(sigle_data));
          var sign = md5(object + this.$store.getters.sign);
          this.$post(
            `gwt/cloudisk/cloudiskAttachment/sigleFileDownload?${qs.stringify({
              object,
              sign,
              token: this.$store.getters.token
            })}`
          );
      }else{
        // alert("duo")
          var object = Base64.encode(JSON.stringify(data));
          var sign = md5(object + this.$store.getters.sign);
          window.open(
            `gwt/cloudisk/cloudiskAttachment/BatchDownload?${qs.stringify({
              object,
              sign,
              token: this.$store.getters.token
            })}`
          );
      }
      
    },
    //递归取数
    go_child_file(index) {
      this.input = "";
      if (index === this.file_nav.length) {
        return;
      }
      var arr = [];
      console.log(index);
      for (var i = 0; i < this.file_nav.length; i++) {
        arr.push(this.file_nav[i].id);
      }
      console.log(arr);
      this.file_nav = this.file_nav.slice(0, index + 1);
      this.$post(
        `gwt/cloudisk/cloudiskAttaUserRelation/userCloudiskPage?${qs.stringify({
          currentPage: this.pageNo,
          pageSize: this.pageSize
        })}`,
        {
          originalName: this.input,
          searchFlag: this.input ? "Y" : "N",
          parentId: arr.slice(index - 1, index)[0]
        },
        "json"
      ).then(res => {
        console.log(res);
        if (res.result === "0000") {
          this.tableData = res.data.userCloudiskPageBean.datas;
          // this.totalCount = parseInt(res.data.userCloudiskPageBean.totalCount);
          // console.log(this.totalCount)
        }
      });
    },
    //
    show_all_file() {
      // this.tableData = this.pageData;
      this.file_nav = [];
      this.parentId = "";
      this.pageNo = 1;
      this.init_usercloudisk(this.pageSize, 1);
    },
    file_click(row) {
      console.log(row);
      this.dirId = row.dirId;
      this.folderform.originalName = row.originalName;
      if (row.type === "folder") {
          this.file_nav.push({
            row,
            originalName: row.originalName,
            id: row.dirId
        });
        this.parentId = row.dirId;
        this.pageNo = 1;
        this.init_usercloudisk(this.pageSize, 1);
      }
      var img_src = row.originalName.substring(
        row.originalName.lastIndexOf("."),
        row.originalName.length
      );
      console.log("img_src");
      if (
        img_src != ".bmp" &&
        img_src != ".png" &&
        img_src != ".gif" &&
        img_src != ".jpg" &&
        img_src != ".jpeg"
      ) {
          var sigle_data = {
            jh:parseInt(this.sigle_fileid)
          }
          var object = Base64.encode(JSON.stringify(sigle_data));
          var sign = md5(object + this.$store.getters.sign);
          this.$post(
            `gwt/cloudisk/cloudiskAttachment/sigleFileDownload?${qs.stringify({
              object,
              sign,
              token: this.$store.getters.token
            })}`
          );
          return
      }
      window.open(
        `http://192.168.31.7/#/part-cloud-disk/index/${row.attaPath}/${
          row.originalName
        }`
      );
    },
    //row-click
    get_svg_name(name) {
      return fileType(name);
    },
    handleSelectionChange(e) {
      console.log(e);
      this.select_list = e;
      this.fileIds = [];
      this.dirIds = [];
      for (var i = 0; i < e.length; i++) {
        if (e[i].type === "file") {
          this.fileIds.push(e[i].fileId);
          console.log(e[i].fileId);
          this.sigle_fileid = e[i].fileId
        } else {
          this.dirIds.push(e[i].dirId);
          // console.log(e[i].type)
        }
      }
      // console.log(this.fileIds)
      //  console.log(e[i].fileId)
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init_usercloudisk(this.pageSize, this.pageNo);
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      //  console.log(val)
      this.init_usercloudisk(this.pageSize, this.pageNo);
    },
    //上传
    upload_img(e) {
      console.log(e);
      var formData = new FormData();
      formData.append("ownerSystem", "gwt-platform");
      formData.append("ownerModule", "cloudisk");
      formData.append("userId", this.folderform.userId);
      formData.append("orgId", this.folderform.orgId);
      formData.append("uploadOpt", "add");
      formData.append("cloudiskType", 1);
      formData.append("dirId", this.dirId === "" ? "" : this.dirId);
      formData.append("cloudiskType", "user");
      formData.append("file", e.raw);
      console.log(this.dirId);
      // console.log(this.folderform.userId)
      this.$post("gwt/uploadFile/uploadCloudisk", formData, "form")
        .then(res => {
          console.log(res);
          if (res.result === "0000") {
            this.init_usercloudisk();
            this.$message({
              type: "success",
              message: "上传成功"
            });
          }
        })
        .catch(res => {});
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" >
.field {
  background-color: #fff;
  border-radius: 6px;
  padding-bottom: 10px;
  .common-action > div:nth-of-type(1) .el-button {
    margin-left: 0px;
  }
  .disk-cloud {
    .el-button {
      margin-left: 0;
      margin-right: 10px;
    }
  }
}
.disk-cloud-router {
  overflow: hidden;
  margin: 0px 20px;
  padding-top: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #efefef;
  .el-breadcrumb__inner {
    cursor: pointer;
    color: #37aeeb;
    &:hover {
      color: #337ab7;
    }
  }
}
.disk-icon {
  text-align: left;
  cursor: pointer;
  .svg-icon {
    font-size: 20px;
    margin-right: 8px;
  }
}
.el-dialog__title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
</style>

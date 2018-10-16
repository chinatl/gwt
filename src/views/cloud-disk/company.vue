<template>
<t-layout>
  <div slot="left">
      <div class="part-content common-temp">
          <ul class="data-ul-list scrollbar" style="height:540px;overflow: auto">
              <li :class="left_nav_data_current === index ? 'current' : '' "
              @click="change_left_nav(item,index)"
                v-for='(item,index) in left_nav_data' :key='index'>{{item.orgAllName}}</li>
          </ul>
      </div>
  </div>
  <div slot="right">
      <div class="common field">
          <t-title title="部门云盘"></t-title>
          <div v-loading='uploading'>
          <div class="common-action">
              <div class="disk-cloud">
                  <upload-button icon="el-icon-upload2"
                  :pan='true'
                  @on-change="upload_img" size='medium' type="success" v-wave>上传</upload-button>
                  <el-button type="success" icon="el-icon-plus" size='medium' v-wave @click="add_older">新建文件夹</el-button>
                  <el-button type="primary" icon="el-icon-download" size='medium' v-wave @click="download_file">下载</el-button>
                  <el-button type="danger" icon="el-icon-close" size='medium' v-wave @click="delete_btn">删除</el-button>
                  <el-button type="warning" icon="el-icon-close" size='medium' v-wave @click="report">举报</el-button>
              </div>
              <div>
                  <el-input v-model="input" placeholder="请输入文件名" style="width:120px" size='medium' @keyup.native.enter='condition'></el-input>
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
                  ref='multipleTable'
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
                  <el-table-column prop="updateTime"  label="修改日期" align="center" width="180"></el-table-column>
                  <el-table-column prop="userName"  label="上传者" align="center" width="120"></el-table-column>
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
              :total="totalCount">
              </el-pagination>
          </div>
          </div>

          <!-- 举报弹框 -->
          <el-dialog
            title="举报信息"
            :visible.sync="reportDialogVisible"
            class="common-dialog edu"
            width="40%" v-loading='loading'>
            <el-form ref="reportform" :model="reportform" :rules="reportrules">
              <el-form-item prop="type">
                <el-checkbox-group v-model="reportform.type">
                  <el-checkbox label="信息涉密" name="type"></el-checkbox>
                  <el-checkbox label="非法内容" name="type"></el-checkbox>
                  <el-checkbox label="其它" name="type"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item prop="desc">
                <el-input
                  type="textarea"
                  :rows="10"
                  class="textarea"
                  placeholder="请输入内容"
                  v-model="reportform.desc">
                </el-input>
              </el-form-item>
              <!-- <form-button  @submit="submit_report('reportform')"></form-button> -->
              <el-form-item class="footer_btn">
                <el-button @click="reportDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit_report('reportform')">确 定</el-button>
              </el-form-item>
            </el-form>

          </el-dialog>
      </div>              
    </div>
</t-layout>
</template>
<script>
import uploadButton from "@/components/Button/uploadButton";
import qs from "qs";
import { fileType } from "@/utils";
import { Base64 } from "js-base64";
import md5 from "js-md5";
import { delete_item, action_fail } from "@/utils/user";
import { mapGetters } from "vuex";
export default {
  components: {
    uploadButton
  },
  data() {
    return {
      uploading: false,
      loading: false,
      checkList: [],
      reportform: {
        desc: "",
        type: []
      },
      reportrules: {
        type: [
          {
            type: "array",
            required: true,
            message: "请选择举报类型",
            trigger: "change"
          }
        ],
        desc: [{ required: true, message: "请输入举报原因", trigger: "blur" }]
      },
      left_nav_data_current: 0,
      pageNo: 1,
      pageSize: 5,
      totalCount: 0,
      input: "",
      checked: false,
      left_nav_data: [],
      doc_reg: /\.(docx?)$/,
      png_reg: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      ppt_reg: /\.(pptx?)$/,
      excel_reg: /\.(csv|xlsx?)$/,
      pdf_reg: /\.(pdf)$/,
      select_list: [],
      tableData: [],
      file_nav: [], //文件导航,
      dialogFolderVisible: false,

      current_user: {
        id: "",
        userId: "",
        orgId: "",
        originalName: ""
      },
      folderform: {
        foldername: "",
        updateTime: "",
        userId: "",
        orgId: "",
        originalName: "",
        userName: ""
      },
      type: "",
      dirId: "",
      fileId: "",
      dirIds: [],
      fileIds: [],
      parentId: "",
      manage_org: [], //部门
      temp_data: {},
      reportDialogVisible: false,
      originalName: "",
      input: "",
      attaPath: "",
      createId: [],
      sigle_fileid: ""
    };
  },
  computed: {
    ...mapGetters(["user_info"]),
    file_name() {
      if (this.select_list.length) {
        return `已选中${this.select_list.length}个文件/文件夹`;
      } else {
        return "文件名";
      }
    }
  },
  created() {
    // this.tableData = this.pageData;
    this.get_CurrentOrgUser();
    this.init_getManagerOrg();
  },
  methods: {
    condition() {
      this.pageNo = 1;
      this.get_deptCloudisk(this.pageSize, 1);
    },
    //获取当前登陆用户
    get_CurrentOrgUser() {
      this.$post(`gwt/getCurrentOrgUser`, {}, "json").then(res => {
        console.log(res);
        if (res.result !== "0000") {
          this.$message.error(res.msg);
        }
        this.current_user = res.data.hashMap;
        this.current_user.id = res.data.hashMap.id;
        this.current_user.userId = res.data.hashMap.userId;
        this.current_user.orgId = res.data.hashMap.orgId;
      });
    },
    //部门
    init_getManagerOrg() {
      this.$post(`gwt/system/sysOrg/getManagerOrgByToken`, {}, "json")
        .then(res => {
          this.left_nav_data = res.data.sysOrgs;
          if (!this.left_nav_data.length) return;
          this.temp_data = this.left_nav_data[0];
          this.get_deptCloudisk(this.pageSize, this.pageNo);
        })
        .catch(res => {});
    },
    //获取部门云盘
    get_deptCloudisk(pageSize, pageNo) {
      // console.log(this.temp_data[0].orgId)
      this.loading = true;
      this.$post(
        `gwt/cloudisk/cloudiskAttaOrgRelation/deptCloudiskPage?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          originalName: this.input,
          orgId: this.temp_data.orgId,
          userxId: this.current_user.id,
          searchFlag: this.input ? "Y" : "N",
          parentId: this.parentId
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          console.log(res);
          if (res.result !== "0000") {
            return;
          }
          this.tableData = res.data.deptCloudiskPageBean.datas;
          this.totalCount = parseInt(res.data.deptCloudiskPageBean.totalCount);
        })
        .catch(res => {
          this.loading = false;
        });
    },
    //上传
    upload_img(e) {
      // console.log(e);
      this.uploading = true;
      var formData = new FormData();
      formData.append("ownerSystem", "gwt-platform");
      formData.append("ownerModule", "cloudisk");
      formData.append("userId", this.current_user.userId);
      formData.append("orgId", this.temp_data.orgId);
      formData.append("uploadOpt", "add");
      formData.append("cloudiskType", 2);
      formData.append("dirId", this.parentId === "" ? "" : this.parentId);
      formData.append("cloudiskType", "org");
      formData.append("file", e.raw);
      console.log(this.temp_data.orgId);
      this.$post("gwt/uploadFile/uploadCloudisk", formData, "form")
        .then(res => {
          this.uploading = false;
          this.attaPath = res.data.attachmentList[0].attaPath;
          // console.log(res.data.attachmentList[0].attaPath)
          if (res.result === "0000") {
            this.get_deptCloudisk(this.pageSize, 1);

            this.$message({
              type: "success",
              message: "上传成功"
            });
          }
        })
        .catch(res => {
          this.uploading = false;
        });
    },
    //新建文件夹
    add_older(formName) {
      this.$swal({
        confirmButtonText: "确定",
        showCancelButton: true,
        cancelButtonText: "取消",
        title: "请输入新建文件夹名称",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          return !value && "文件夹名不能為空！";
        }
      }).then(res => {
        if (res.value) {
          this.$post(
            `gwt/cloudisk/cloudiskAttaDir/addFolder`,
            {
              type: "org",
              orgId: this.temp_data.orgId,
              name: res.value,
              parentId: this.parentId
            },
            "json"
          ).then(res => {
            console.log(res);
            if (res.result === "0000") {
              this.dialogFolderVisible = false;
              this.get_deptCloudisk(this.pageSize, this.pageNo);
              this.$message({
                type: "success",
                message: "新建成功"
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    //下载
    download_file() {
      if (this.select_list.length === 0) {
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
        orgId: this.temp_data.orgId
      };
      var sigle_data = {
        fileId: parseInt(this.sigle_fileid),
        orgId: this.temp_data.orgId
      };
      if (this.fileIds.length === 1 && this.dirIds.length === 0) {
        // console.log(this.sigle_fileid)
        //   console.log(parseInt(this.sigle_fileid))
        var object = Base64.encode(JSON.stringify(sigle_data));
        var sign = md5(object + this.$store.getters.sign);
        window.open(
          `/gwt/cloudisk/cloudiskAttachment/sigleFileDownload?${qs.stringify({
            object,
            sign,
            token: this.$store.getters.token
          })}`
        );
      } else {
        var object = Base64.encode(JSON.stringify(data));
        var sign = md5(object + this.$store.getters.sign);
        window.open(
          `/gwt/cloudisk/cloudiskAttachment/BatchDownload?${qs.stringify({
            object,
            sign,
            token: this.$store.getters.token
          })}`
        );
      }
    },
    //删除
    delete_btn() {
      var list = this.select_list.filter(res => {
        return res.createUser == this.user_info.sysOrgUserX.id;
      });
      if (list.length !== this.select_list.length) {
        this.$swal({
          title: "操作失败！",
          text: "非本人文件不能删除",
          type: "warning",
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          showConfirmButton: true
        });
        return;
      }
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
          `gwt/cloudisk/cloudiskAttaOrgRelation/orgDelete`,
          {
            dirIds: this.dirIds.map(res => res + "").join(","),
            fileIds: this.fileIds.map(res => res + "").join(","),
            orgId: this.temp_data.orgId
          },
          "json"
        )
          .then(res => {
            if (action_fail(res, "删除成功")) return;
            this.get_deptCloudisk(this.pageSize, this.pageNo);
          })
          .catch(res => {
            console.log(res);
          });
      });
    },
    //举报
    report() {
      if (this.fileIds.length == 0 && this.dirIds.length == 0) {
        this.$swal({
          title: "提示信息！",
          text: "请选择要举报的文件或文件夹",
          type: "warning",
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "确定",
          showConfirmButton: true
        });
        return;
      }
      this.reportDialogVisible = true;
    },
    //举报信息提交
    submit_report(formName) {
      var file_list = this.select_list
        .filter(res => res.type === "file")
        .map(res => res.fileId)
        .join(",");
      var folder_list = this.select_list
        .filter(res => res.type === "folder")
        .map(res => res.dirId)
        .join(",");
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$post(
            "gwt/system/sysReport/report",
            {
              appId: "1",
              arrayContentType: this.reportform.type.join(","),
              cause: this.reportform.desc,
              contentId: file_list + "_" + folder_list,
              reportored: this.select_list.map(res => res.createUser).join(","),
              reportoredOrg: this.temp_data.orgId,
              title: ` 标题为“${this.select_list
                .map(res => res.originalName)
                .join("、")}”的文件被举报，点击查看详情`,
              smsTitle: ` 标题为“${this.select_list
                .map(res => res.originalName)
                .join("、")}”的文件被举报，点击查看详情`,
              smsAppName: "文件"
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
              this.reportDialogVisible = false;
              this.$message({
                message: "举报成功",
                type: "success"
              });
              this.$refs.multipleTable.clearSelection();
            })
            .catch(res => {
              this.form_loading = false;
            });
        } else {
          return false;
        }
      });
    },
    change_left_nav(item, index) {
      this.left_nav_data_current = index;
      this.temp_data = item;
      console.log(item);
      this.file_nav = [];
      this.parentId = "";
      this.get_deptCloudisk(this.pageSize, 1);
    },
    //递归取数
    go_child_file(index) {
      this.input = "";
      if (index === this.file_nav.length) {
        return;
      }
      var arr = [];
      console.log(this.file_nav);
      for (var i = 0; i < this.file_nav.length; i++) {
        arr.push(this.file_nav[i].id);
      }
      this.file_nav = this.file_nav.slice(0, index + 1);
      this.$post(
        `gwt/cloudisk/cloudiskAttaOrgRelation/deptCloudiskPage?${qs.stringify({
          currentPage: this.pageNo,
          pageSize: this.pageSize
        })}`,
        {
          originalName: this.input,
          orgId: this.temp_data.orgId,
          searchFlag: this.input ? "Y" : "N",
          parentId: arr.slice(index)[0]
        },
        "json"
      ).then(res => {
        if (res.result === "0000") {
          this.tableData = res.data.deptCloudiskPageBean.datas;
          // this.totalCount = parseInt(res.data.deptCloudiskPageBean.totalCount);
        }
      });
    },
    //
    show_all_file() {
      this.file_nav = [];
      this.parentId = "";
      this.pageNo = 1;
      this.input = "";
      this.get_deptCloudisk(this.pageSize, 1);
    },
    file_click(index) {
      this.parentId = index.dirId;
      if (index.type === "folder") {
        this.file_nav.push({
          index,
          originalName: index.originalName,
          id: index.dirId
        });
        this.parentId = index.dirId;
        this.pageNo = 1;
        this.get_deptCloudisk(this.pageSize, 1);
        return;
      }
      var img_src = index.originalName.substring(
        index.originalName.lastIndexOf("."),
        index.originalName.length
      );
      if (
        img_src != ".bmp" &&
        img_src != ".png" &&
        img_src != ".gif" &&
        img_src != ".jpg" &&
        img_src != ".jpeg" &&
        img_src != ".pdf"
      ) {
        var sigle_data = {
          fileId: index.fileId
        };
        var object = Base64.encode(JSON.stringify(sigle_data));
        var sign = md5(object + this.$store.getters.sign);
        window.open(
          `/gwt/cloudisk/cloudiskAttachment/sigleFileDownload?${qs.stringify({
            object,
            sign,
            token: this.$store.getters.token
          })}`
        );
      } else {
        this.$post(
          "gwt/cloudisk/cloudiskAttachment/getAttachment",
          {
            fileId: index.fileId
          },
          "json"
        ).then(res => {
          if (action_fail(res)) return;
          window.open(
            res.data.cloudiskAttachment.attaPath +
              "/" +
              res.data.cloudiskAttachment.storeName
          );
        });
      }
    },
    //row-click
    get_svg_name(name) {
      return fileType(name);
    },
    handleSelectionChange(e) {
      this.select_list = e;
      this.fileIds = [];
      this.dirIds = [];
      this.createId = [];
      for (var i = 0; i < e.length; i++) {
        if (e[i].type === "file") {
          this.fileIds.push(e[i].fileId);
          this.originalName = e[i].originalName;
          this.createId.push(e[i].createUser);
          this.sigle_fileid = e[i].fileId;
        } else {
          this.dirIds.push(e[i].dirId);
        }
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.get_deptCloudisk(this.pageSize, this.pageNo);
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.get_deptCloudisk(this.pageSize, this.pageNo);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.part-content {
  margin: 20px 20px;
  height: 550px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  padding: 6px;
  border-radius: 4px;
  .data-ul-list {
    padding: 10px;
    li {
      background-color: rgb(227, 234, 244);
      border-radius: 5px;
      font-weight: 600;
      margin-bottom: 6px;
      padding: 8px 12px;
      font-size: 15px;
      color: rgb(77, 99, 123);
      cursor: pointer;
      &.current {
        background-color: rgb(59, 164, 245);
        color: #fff;
        cursor: default;
      }
      &:hover {
        background-color: rgb(59, 164, 245);
        color: #fff;
      }
    }
  }
}
.part-flex {
  padding: 0 20px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-around;
  button {
    flex: 1;
  }
  .el-button--small {
    padding-left: 0;
    padding-right: 0;
  }
}
.part-left {
  width: 22%;
  float: left;
  background-color: #fff;
}
.part-right {
  width: 77%;
  float: right;
  background-color: #fff;
}
.field {
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
  &:hover {
    color: #409eff;
  }
  .svg-icon {
    font-size: 20px;
    margin-right: 8px;
  }
}
.el-checkbox {
  width: 25%;
}
.textarea {
  margin-top: 20px;
}
.footer_btn {
  margin-left: 30%;
}
</style>

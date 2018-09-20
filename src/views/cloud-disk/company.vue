<template>
<t-layout>
  <div slot="left">
      <div class="part-content common-temp">
          <ul class="data-ul-list">
              <li :class="left_nav_data_current === index ? 'current' : '' "
              @click="change_left_nav(item,index)"
                v-for='(item,index) in left_nav_data' :key='index'>{{item.orgAllName}}</li>
          </ul>
      </div>
  </div>
  <div slot="right">
      <div class="common field">
          <t-title title="部门云盘"></t-title>
          <div class="common-action">
              <div class="disk-cloud">
                  <upload-button icon="el-icon-upload2" @on-change="upload_img" size='medium' type="success" v-wave>上传</upload-button>
                  <el-button type="success" icon="el-icon-plus" size='medium' v-wave @click="dialogFolderVisible = true">新建文件夹</el-button>
                  <el-button type="primary" icon="el-icon-download" size='medium' v-wave>下载</el-button>
                  <el-button type="danger" icon="el-icon-close" size='medium' v-wave>删除</el-button>
                  <el-button type="warning" icon="el-icon-close" size='medium' v-wave>举报</el-button>
              </div>
              <div>
                  <el-input v-model="input" placeholder="请输入文件名" style="width:120px" size='medium'></el-input>
                  <el-button type="primary" icon="el-icon-search" size='medium' v-wave>搜索</el-button>
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
                  style="width: 100%">
                  <el-table-column type="selection" width="60" align="center"></el-table-column>
                  <el-table-column prop="originalName"  :label="file_name"  align="left"  show-overflow-tooltip> 
                      <template slot-scope="scope">
                        <div class="disk-icon" @click="file_click(scope.row)">
                            <svg-icon :icon-class='get_svg_name(scope.row.name)'></svg-icon>
                            <span>{{scope.row.originalName}}</span>
                        </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="attaSize"  label="大小" align="center"  width="100"></el-table-column>
                  <el-table-column prop="updateTime"  label="修改日期" align="center" width="180"></el-table-column>
                  <el-table-column prop="userName"  label="上传者" align="center" width="120"></el-table-column>
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
          <el-dialog title="请输入新建文件夹名称" :visible.sync="dialogFolderVisible" center class="folder" width="30%">
            <el-form :model="folderform" :rules="folderrules" ref="folderform">
              <el-form-item prop="foldername">
                <el-input v-model="folderform.foldername" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFolderVisible = false">取 消</el-button>
              <el-button type="primary" @click="add_older('folderform')">确 定</el-button>
            </div>
          </el-dialog>
      </div>              
    </div>
</t-layout>
</template>
<script>
import uploadButton from "@/components/Button/uploadButton";
import qs from "qs";
export default {
  components: {
    uploadButton
  },
  data() {
    return {
      left_nav_data_current: 0,
      pageNo: 1,
      pageSize: 10,
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
      manage_org: [], //部门
      temp_data: {}
    };
  },
  computed: {
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
    //获取当前登陆用户
    get_CurrentOrgUser() {
      this.$post(`gwt/getCurrentOrgUser`, {}, "json").then(res => {
        console.log(res);
        if (res.result !== "0000") {
          this.$message.error(res.msg);
        }
        this.current_user = res.data.hashMap;
        this.current_user.userId = res.data.hashMap.userId;
        this.current_user.orgId = res.data.hashMap.orgId;
      });
    },
    //部门
    init_getManagerOrg() {
      this.$post(`gwt/system/sysOrg/getManagerOrgByToken`, {
        
      }, "json")
        .then(res => {
          this.left_nav_data = res.data.sysOrgs;
        })
        .catch(res => {});
    },
    //获取部门云盘
    get_deptCloudisk(pageSize, pageNo) {
      // console.log(this.temp_data[0].orgId)
      this.$post(
        `gwt/cloudisk/cloudiskAttaOrgRelation/deptCloudiskPage?${qs.stringify({
          currentPage: 1,
          pageSize: 5
        })}`,
        {
          orgId: this.temp_data.orgId,
          searchFlag: "N",
          parentId: this.parentId
        },
        "json"
      ).then(res => {
        console.log(res);
        if (res.result === "0000") {
          this.tableData = res.data.deptCloudiskPageBean.datas;
          this.totalCount = parseInt(res.data.deptCloudiskPageBean.totalCount);
        }
      });
    },
    //上传
    upload_img(e) {
      console.log(e);
      var formData = new FormData();
      formData.append("ownerSystem", "gwt-platform");
      formData.append("ownerModule", "cloudisk");
      formData.append("userId", this.current_user.userId);
      formData.append("orgId", this.temp_data.orgId);
      formData.append("uploadOpt", "add");
      // formData.append("cloudiskType", 2);
      formData.append("dirId", "");
      formData.append("cloudiskType", "org");
      formData.append("file", e.raw);
      console.log(this.temp_data.orgId)
      this.$post("gwt/uploadFile/uploadCloudisk", formData, "form")
      .then(res => {
        console.log(res);
        // if (res.result === "0000") {
        //   this.get_deptCloudisk(this.pageNo,this.pageSize);
        //   this.$message({
        //     type: "success",
        //     message: "上传成功"
        //   });
        // }
      })
      .catch(res => {});
    },
    //新建文件夹
    add_older(formName) {
      // alert(this.folderform.foldername)
      console.log(this.folderform)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$post(
            `gwt/cloudisk/cloudiskAttaDir/addFolder`,
            {
              type: "org",
              orgId: this.temp_data.orgId,
              name: this.folderform.foldername,
              parentId: ""
            },
            "json"
          ).then(res => {
            console.log(res)
            if (res.result === "0000") {
              this.dialogFolderVisible = false;
              this.get_deptCloudisk();
              this.$message({
                type: "success",
                message: "新建成功"
              });
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
    change_left_nav(item, index) {
      this.left_nav_data_current = index;
      // if(this.left_nav_data_current){
      //     this.get_deptCloudisk()
      // }
      this.temp_data = item;
      console.log(item)
      this.get_deptCloudisk()
    },
    //递归取数
    go_child_file(index) {
      if (index === this.file_nav.length) {
        return;
      }
      var arr = [];
      console.log(index)
      for (var i = 0; i < this.file_nav.length; i++) {
        arr.push(this.file_nav[i].id)        
      }
      // console.log(arr.indexof(this.dirId,index-1))
      this.file_nav = this.file_nav.slice(0, index + 1);
      this.$post(
        `gwt/cloudisk/cloudiskAttaUserRelation/userCloudiskPage?${qs.stringify({
          currentPage: this.pageNo,
          pageSize: this.pageSize
        })}`,
        {
          orgId: this.temp_data.orgId,
          searchFlag: "N",
          
          parentId: arr.slice((index-1),index)[0]
        },
        "json"
      ).then(res => {
        console.log(res)
        if (res.result === "0000") {
          this.tableData = res.data.userCloudiskPageBean.datas;
          // this.totalCount = parseInt(res.data.userCloudiskPageBean.totalCount);
          // console.log(this.totalCount)
        }
      });
    },
    //
    show_all_file() {
      this.tableData = this.pageData;
      this.file_nav = [];
    },
    file_click(index) {
      console.log(index)
      this.parentId = index.dirId;
      if (index.type === "folder") {
        this.file_nav.push({
          index,
          originalName: index.originalName,
          id:index.dirId
        });
        this.parentId = index.dirId;
        this.pageNo = 1;
        this.get_deptCloudisk(this.pageSize, 1);
      }
      

    },
    //row-click
    get_svg_name(name) {
      if (this.doc_reg.test(name)) {
        return "doc";
      }
      if (this.png_reg.test(name)) {
        return "png";
      }
      if (this.ppt_reg.test(name)) {
        return "ppt";
      }
      if (this.excel_reg.test(name)) {
        return "excel";
      }
      if (this.pdf_reg.test(name)) {
        return "pdf";
      }
      return "文件夹";
    },
    handleSelectionChange(e) {
      this.select_list = e;
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
</style>

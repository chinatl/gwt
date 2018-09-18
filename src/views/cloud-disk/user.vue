<template>
    <div class="field">
        <t-title title="个人云盘"></t-title>
        <div class="common-action">
            <div class="disk-cloud">
                <upload-button icon="el-icon-upload2" @on-change="upload_img" size='medium' type="success" >上传</upload-button>
                <el-button type="success" icon="el-icon-plus" size='medium' v-wave @click="dialogFolderVisible = true">新建文件夹</el-button>
                <el-button type="primary" icon="el-icon-download" size='medium' v-wave>下载</el-button>
                <el-button type="danger" icon="el-icon-close" size='medium' v-wave>删除</el-button>
            </div>
            <div>
                <el-input v-model="input" placeholder="请输入文件名" style="width:240px" size='medium'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave>搜索</el-button>
            </div>
        </div>
        <div class="disk-cloud-router">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item @click.native="show_all_file">全部文件</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in file_nav" :key="index" @click.native="go_child_file(index)">{{item.name}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                @selection-change="handleSelectionChange"             
                style="width: 100%">
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column prop="originalName"  :label="file_name"  align="left"  show-overflow-tooltip> 
                    <!-- <template slot-scope="scope">
                      <div class="disk-icon" @click="file_click(scope.$index)">
                          <svg-icon :icon-class='get_svg_name(scope.row.name)'></svg-icon>
                          <span>{{scope.row.name}}</span>
                      </div>
                    </template> -->
                </el-table-column>
                <el-table-column prop="size"  label="大小" align="center"  width="200"></el-table-column>
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
            :total="50">
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
      pageNo: 1,
      pageSize: 50,
      input: "",
      checked: false,
      pageData: [
        {
          name: "合计采购员合计采购员合计采购员",
          size: "",
          time: "2018-05-18 10:39:47",
          children: [
            {
              name: "合计采购员合计采购员合计采购员",
              size: "",
              time: "2018-05-18 10:39:47",
              children: [
                {
                  name: "合计采购员合计采购员合计采购员.doc",
                  size: "",
                  time: "2018-05-18 10:39:47"
                },
                {
                  name: "合计采购员合计采购员合计采购员.doc",
                  size: "",
                  time: "2018-05-18 10:39:47"
                },
                {
                  name: "合计采购员合计采购员合计采购员.doc",
                  size: "",
                  time: "2018-05-18 10:39:47"
                }
              ]
            },
            {
              name: "合计采购员合计采购员合计采购员.doc",
              size: "",
              time: "2018-05-18 10:39:47"
            },
            {
              name: "合计采购员合计采购员合计采购员.pdf",
              size: "",
              time: "2018-05-18 10:39:47"
            }
          ]
        },
        {
          name: "快快快我哦啊看了几十次",
          size: "",
          time: "2018-05-18 10:39:47",
          children: [
            {
              name: "合计采购员合计采购员合计采购员.jpg",
              size: "",
              time: "2018-05-18 10:39:47"
            },
            {
              name: "合计采购员合计采购员合计采购员.doc",
              size: "",
              time: "2018-05-18 10:39:47"
            },
            {
              name: "合计采购员合计采购员合计采购员.pdf",
              size: "",
              time: "2018-05-18 10:39:47"
            }
          ]
        },
        {
          name: "合计采购员合计采购员合计采购员.jpg",
          size: "",
          time: "2018-05-18 10:39:47"
        },
        {
          name: "合计采购员合计采购员合计采购员.doc",
          size: "",
          time: "2018-05-18 10:39:47"
        },
        {
          name: "合计采购员合计采购员合计采购员.pdf",
          size: "",
          time: "2018-05-18 10:39:47"
        }
      ],
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
        foldername: ""
      },
      folderrules: {
        foldername: [
          { required: true, message: "文件名不能为空", trigger: "blur" }
        ]
      },
      type:""
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
    this.init_usercloudisk(this.pageSize, this.pageNo);
  },
  methods: {
    //初始化文件表格
    init_usercloudisk(pageSize,pageNo) {
      this.$post(
        `gwt/cloudisk/cloudiskAttaUserRelation/userCloudiskPage?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          searchFlag: "Y"
        },'json'
      )
        .then(res => {
          if(res.result === "0000"){
            this.tableData = res.data.userCloudiskPageBean.datas;
            // console.log(this.tableData)
            // this.type = res.data.userCloudiskPageBean.datas.type
          }
        })
       
    },
    //新建文件夹
    add_older(formName) {
      // alert(this.folderform.foldername)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$post(`gwt/cloudisk/cloudiskAttaDir/addFolder`,
          {
            type:"org",
            orgId:"",
            name:this.folderform.foldername,
            parentId:""
          },
          "json"
          ).then(res=>{
            console.log(res)
            if(res.result === "0000"){
              this.dialogFolderVisible = false;
              this.init_usercloudisk()
            }
            // console.log(this.tableData.type)
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //递归取数
    go_child_file(index) {
      if (index === this.file_nav.length) {
        return;
      }
      var arr = JSON.parse(JSON.stringify(this.pageData));
      for (var i = 0; i < this.file_nav.length; i++) {
        arr = arr[this.file_nav[i].index].children;
        if (i === index) {
          break;
        }
      }
      this.tableData = arr;
      this.file_nav = this.file_nav.slice(0, index + 1);
    },
    //
    show_all_file() {
      this.tableData = this.pageData;
      this.file_nav = [];
    },
    file_click(index) {
      if (this.get_svg_name(this.tableData[index].name) === "文件夹") {
        this.file_nav.push({
          index,
          name: this.tableData[index].name
        });
        this.tableData = this.tableData[index].children;
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
    handleSizeChange() {},
    handleCurrentChange() {},
    upload_img(e) {
      console.log(e);
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
  font-size: 30px;
  font-weight: bold;
  color: #333;
}
</style>

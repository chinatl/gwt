<template>
    <div class="field">
        <t-title title="举报详情"></t-title>
        <div class="common-action">
            <div>
              <span style="color:rgb(103, 106, 108);font-weight:600;font-size:16px">{{ this.report_data.orgAllName}}</span>
            </div>
            <div>
                <el-button type="primary" icon="el-icon-download" size='medium' v-wave @click="download_file">下载</el-button>
                <el-button type="danger" icon="el-icon-close" size='medium' v-wave @click="delete_btn">删除</el-button>
            </div>
        </div>
        <!-- <div class="disk-cloud-router">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item @click.native="show_all_file">全部文件</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in file_nav" :key="index" @click.native="go_child_file(index)">{{item.name}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div> -->
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
                        <div class="disk-icon">
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
</template>
<script>
import uploadButton from "@/components/Button/uploadButton";
import { SET_REPORT_DATA } from "@/store/mutations";
import { mapGetters } from "vuex";
import { delete_item, action_fail } from "@/utils/user";
import { Base64 } from "js-base64";
import md5 from "js-md5";
import qs from "qs";
export default {
  components: {
    uploadButton
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 5,
      totalCount: 0,
      pageData: [],
      loading: false,
      doc_reg: /\.(docx?)$/,
      png_reg: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      ppt_reg: /\.(pptx?)$/,
      excel_reg: /\.(csv|xlsx?)$/,
      pdf_reg: /\.(pdf)$/,
      select_list: [],
      tableData: [],
      file_nav: [], //文件导航
      dirIds: [],
      fileIds: []
    };
  },
  beforeDestroy() {
    this.$store.commit("DEL_VIEW_BY_NAME", "文件举报详情");
  },
  computed: {
    file_name() {
      if (this.select_list.length) {
        return `已选中${this.select_list.length}个文件/文件夹`;
      } else {
        return "文件名";
      }
    },
    ...mapGetters(["report_data"])
  },
  created() {
    this.$store.dispatch("readSession", SET_REPORT_DATA);
    this.init(this.pageSize, this.pageNo);
  },
  methods: {
    handleSelectionChange(e) {
      this.select_list = e;
    },
    delete_btn() {
      if (this.select_list.length == 0) {
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
      var file_list = this.select_list
        .filter(res => res.type === "file")
        .map(res => res.fileId)
        .join(",");
      var folder_list = this.select_list
        .filter(res => res.type === "folder")
        .map(res => res.dirId)
        .join(",");
      this.$swal({
        confirmButtonText: "确定",
        showCancelButton: true,
        cancelButtonText: "取消",
        title: "请输入删除原因！",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          return !value && "请输入删除原因，此为必填项！";
        }
      }).then(responese => {
        if (responese.value) {
          this.$post(
            `gwt/cloudisk/cloudiskAttaOrgRelation/orgDelete`,
            {
              dirIds: folder_list,
              fileIds: file_list,
              orgId: this.report_data.reportoredOrg,
              msgId: this.report_data.msgId,
              cause: responese.value
            },
            "json"
          )
            .then(res => {
              if (action_fail(res, "删除成功")) return;
              this.init(this.pageSize, this.pageNo);
            })
            .catch(res => {
              console.log(res);
            });
        }
      });
    },
    //
    init(pageSize, currentPage) {
      this.loading = true;
      var dirIds = this.report_data.contentId.split("_")[1];
      var fileIds = this.report_data.contentId.split("_")[0];
      this.$post(
        "gwt/cloudisk/cloudiskAttaOrgRelation/reportCloudiskInfo",
        {
          dirIds,
          orgId: this.report_data.reportoredOrg,
          fileIds,
          currentPage,
          pageSize
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
          this.tableData = res.data.reportCloudiskPageBean.datas;
          this.totalCount = parseInt(
            res.data.reportCloudiskPageBean.totalCount
          );
        })
        .catch(res => {
          this.loading = false;
        });
    },
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
      var file_list = this.select_list
        .filter(res => res.type === "file")
        .map(res => res.fileId)
        .join(",");
      var folder_list = this.select_list
        .filter(res => res.type === "folder")
        .map(res => res.dirId)
        .join(",");
      var data = {
        fileIds: file_list,
        dirIds: folder_list,
        orgId: this.report_data.reportoredOrg
      };
      var sigle_data = {
        fileId: file_list,
        orgId: this.report_data.reportoredOrg
      };
      if (
        this.select_list.length === 1 &&
        this.select_list[0].type === "file"
      ) {
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
</style>

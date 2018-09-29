<template>
    <div class="field">
        <t-title title="举报详情"></t-title>
        <div class="common-action">
            <div>
              <span style="color:rgb(103, 106, 108);font-weight:600;font-size:16px">神航2部</span>
            </div>
            <div>
                <el-button type="primary" icon="el-icon-download" size='medium' v-wave>下载</el-button>
                <el-button type="danger" icon="el-icon-close" size='medium' v-wave>删除</el-button>
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
                <el-table-column prop="name"  :label="file_name"  align="left"  show-overflow-tooltip> 
                    <template slot-scope="scope">
                      <div class="disk-icon" @click="file_click(scope.$index)">
                          <svg-icon :icon-class='get_svg_name(scope.row.name)'></svg-icon>
                          <span>{{scope.row.name}}</span>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column prop="size"  label="大小" align="center"  width="200"></el-table-column>
                <el-table-column prop="time"  label="修改日期" align="center" width="200"></el-table-column>
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
    </div>
</template>
<script>
import uploadButton from "@/components/Button/uploadButton";
export default {
  components: {
    uploadButton
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 5,
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
      file_nav: [] //文件导航
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
    }
  },
  created() {
    this.tableData = this.pageData;
  },
  methods: {
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

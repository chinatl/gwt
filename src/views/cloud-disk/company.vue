<template>
<t-layout>
  <div slot="left">
      <div class="part-content common-temp">
          <ul class="data-ul-list">
              <li :class="left_nav_data_current === index ? 'current':''"
              @click="change_left_nav(index)"
                v-for='(item,index) in left_nav_data' :key='index'>{{item}}</li>
          </ul>
      </div>
  </div>
  <div slot="right">
      <div class="common field">
          <t-title title="部门云盘"></t-title>
          <div class="common-action">
              <div class="disk-cloud">
                  <upload-button icon="el-icon-upload2" @on-change="upload_img" size='medium' type="success" v-wave>上传</upload-button>
                  <el-button type="success" icon="el-icon-plus" size='medium' v-wave>新建文件夹</el-button>
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
                  <el-table-column prop="size"  label="大小" align="center"  width="100"></el-table-column>
                  <el-table-column prop="time"  label="修改日期" align="center" width="180"></el-table-column>
                  <el-table-column prop="user"  label="上传者" align="center" width="120"></el-table-column>
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
    </div>
</t-layout>
</template>
<script>
import uploadButton from "@/components/Button/uploadButton";
export default {
  components: {
    uploadButton
  },
  data() {
    return {
      left_nav_data_current: 1,
      pageNo: 1,
      pageSize: 5,
      input: "",
      checked: false,
      left_nav_data: [],
      pageData: [
        {
          name: "合计采购员合计采购员合计采购员",
          size: "",
          time: "2018-05-18 10:39:47",
          user: "allan",
          children: [
            {
              name: "合计采购员合计采购员合计采购员",
              size: "",
              time: "2018-05-18 10:39:47",
              children: [
                {
                  name: "合计采购员合计采购员合计采购员.doc",
                  size: "",
                  time: "2018-05-18 10:39:47",
                  user: "allan"
                },
                {
                  name: "合计采购员合计采购员合计采购员.doc",
                  size: "",
                  time: "2018-05-18 10:39:47",
                  user: "allan"
                },
                {
                  name: "合计采购员合计采购员合计采购员.doc",
                  size: "",
                  time: "2018-05-18 10:39:47",
                  user: "allan"
                }
              ]
            },
            {
              name: "合计采购员合计采购员合计采购员.doc",
              size: "",
              time: "2018-05-18 10:39:47",
              user: "allan"
            },
            {
              name: "合计采购员合计采购员合计采购员.pdf",
              size: "",
              time: "2018-05-18 10:39:47",
              user: "allan"
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
              time: "2018-05-18 10:39:47",
              user: "allan"
            },
            {
              name: "合计采购员合计采购员合计采购员.doc",
              size: "",
              time: "2018-05-18 10:39:47",
              user: "allan"
            },
            {
              name: "合计采购员合计采购员合计采购员.pdf",
              size: "",
              time: "2018-05-18 10:39:47",
              user: "allan"
            }
          ]
        },
        {
          name: "合计采购员合计采购员合计采购员.jpg",
          size: "",
          time: "2018-05-18 10:39:47",
          user: "allan"
        },
        {
          name: "合计采购员合计采购员合计采购员.doc",
          size: "",
          time: "2018-05-18 10:39:47",
          user: "allan"
        },
        {
          name: "合计采购员合计采购员合计采购员.pdf",
          size: "",
          time: "2018-05-18 10:39:47",
          user: "allan"
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
    this.init_getManagerOrg();
    this.init_isCurrentOrgManager()
  },
  methods: {
    init_isCurrentOrgManager(){
      this.$post(`gwt/isCurrentOrgManager`)
      .then(res=>{
        console.log(res)
      })
    },
    //初始化部门
    init_getManagerOrg(){
      this.$post(`gwt/system/sysOrg/getManagerOrgByToken`)
      .then(res=>{
        console.log(res)
      })
    },
    upload_img(e) {
      console.log(e);
    },
    change_left_nav(index) {
      this.left_nav_data_current = index;
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
    handleCurrentChange() {}
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

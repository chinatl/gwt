<template>
    <div>
        <div class="common">
            <t-title title="课程章节"></t-title>
            <div class="padding20 resource-title">
                当前课程:<span class="resource-name">{{edu_list_data.courseTitle}}</span>
                <span class="add-title" @click="add_resource"><el-button type="success" size='small' icon="el-icon-plus" v-wave>添加章节</el-button></span>
            </div>
            <div class="common-table">
                <el-table
                    :data="tableData"
                    border
                    v-loading='table_loading'
                    style="width: 100%">
                    <el-table-column
                    prop="chapterTitle"
                    align="center"
                    label="章节名称">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="操作"
                    align="center"
                    width="200"
                    >
                      <template slot-scope="scope">
                        <el-button type="primary" size='mini' @click.native="edit_resource(scope.row)" v-wave>编辑</el-button>
                        <el-button type="danger" size='mini' v-wave @click="del_chartep(scope.row.chapterId)">删除</el-button>
                      </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="common-page">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNo"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                background
                :total="total">
                </el-pagination>
            </div>
        </div>
        <!-- <div class="common sourece-page">
          <t-title title="功能获取"></t-title>
            <div class="page-form">
              <el-form label-width="120px" >
                <el-form-item label="功能获取地址：" prop='name'>
                    <div class="flex">
                        <el-input v-model="url" size="small" readonly></el-input>
                        <el-button size="small" icon="el-icon-edit-outline" type="primary" @click="get_function" v-wave>获取功能</el-button>
                    </div>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
          </div>
        </div> -->
        <el-dialog
          :close-on-click-modal='false'
            :title="group_type === 'add' ? '添加章节' :'编辑章节'"
            class="common-dialog edu"
            :visible.sync="group_visible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules"  class="demo-ruleForm">
                <el-form-item label="章节标题" prop='chapterTitle'>
                    <el-input v-model="form.chapterTitle" size="small" placeholder="请输入章节标题"></el-input>
                </el-form-item>
                <el-form-item label="章节内容" prop='chapterContent'>
                    <el-input v-model="form.chapterContent" size="small" placeholder="章节内容"></el-input>
                </el-form-item>
                <el-form-item label="音频视频">
                    <upload-button @on-change='upload_video'>添加视频/音频</upload-button>
                </el-form-item>
                <el-form-item label="章节附件">
                    <upload-button @on-change='upload_file'>添加文档</upload-button>
                </el-form-item>
                <el-form-item label="附件列表">
                    <file-list :list='file_list' @delete='delete_file'></file-list>
                </el-form-item>
                <form-button @cancel='onCancel_resource' @submit="onSubmit_resource"></form-button>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import formButton from "@/components/Button/formButton";
import uploadButton from "@/components/Button/uploadButton";
import fileList from "@/components/FileList";
import { mapGetters } from "vuex";
export default {
  components: {
    formButton,
    uploadButton,
    fileList
  },
  data() {
    return {
      group_type: "",
      group_visible: false,
      url: "http://192.168.31.47:8888/sysres",
      tableData: [],
      table_loading: false,
      form: {},
      rules: {
        chapterTitle: [
          { required: true, message: "请输入章节标题", trigger: "blur" }
        ],
        chapterContent: [
          { required: true, message: "请输入章节内容", trigger: "blur" }
        ]
      },
      pageSize: 5,
      pageNo: 1,
      total: 0,
      file_list: [],
      file_name_list: []
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["edu_list_data"])
  },
  methods: {
    delete_file() {
      this.file_list.slice(index, 1);
      this.file_name_list.slice(index, 1);
    },
    //添加章节附件
    upload_file(e) {
      this.file_list.push(e);
      var formData = new FormData();
      formData.append("file", e.raw);
      this.$post("api/course/chapter/fileUpload.do", formData, "form")
        .then(res => {
          this.file_name_list.push(res.filePath);
          this.$message({
            type: "success",
            message: "上传成功"
          });
        })
        .catch(res => {});
    },
    //添加视频
    upload_video(e) {
      this.file_list.push(e);
      var formData = new FormData();
      formData.append("file", e.raw);
      this.$post("api/course/chapter/videoUpload.do", formData, "form")
        .then(res => {
          this.file_name_list.push(res.videoPath);
          this.$message({
            type: "success",
            message: "上传成功"
          });
        })
        .catch(res => {});
    },
    //删除某一章节
    del_chartep(chapterId) {
      this.$swal({
        title: "您确定要删除这一章节吗？",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn btn-success"
      }).then(res => {
        if (res.value) {
          this.$post("api/course/chapter/delChapter.do", {
            chapterId
          })
            .then(res => {
              this.init();
              this.$swal({
                title: "提示！",
                text: res.msg,
                type: "info",
                timer: 1000,
                showConfirmButton: false
              });
            })
            .catch(res => {});
        }
      });
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    init() {
      this.$post("api/course/chapter/queryChapter.do", {
        sEcho: "1",
        iColumns: "2",
        sColumns: ",",
        iDisplayStart: 0,
        iDisplayLength: 10,
        mDataProp_0: "chapterTitle",
        mDataProp_1: "function",
        iSortCol_0: 0,
        sSortDir_0: "asc",
        courseId: this.edu_list_data.courseId
      })
        .then(res => {
          this.table_loading = false;
          this.total = res.recordsTotal;
          if (!res.data) {
            this.tableData = [];
            return;
          }
          this.tableData = res.data;
        })
        .catch(res => {
          this.table_loading = false;
        });
    },
    add_resource() {
      this.group_visible = true;
      this.group_type = "add";
    },
    edit_resource(data) {
      this.group_visible = true;
      this.group_type = "update";
      this.form.chapterTitle = data.chapterTitle;
      this.form.chapterContent = data.chapterTitle;
      this.form.courseId = this.edu_list_data.courseId;
      this.form.chapterId = data.chapterId;
      this.$post("api/course/chapter/queryAttach.do", {
        sEcho: 1,
        iColumns: 3,
        sColumns: ",,",
        iDisplayStart: 0,
        iDisplayLength: 10,
        mDataProp_0: "fileId",
        mDataProp_1: "function",
        mDataProp_2: "function",
        iSortCol_0: 0,
        sSortDir_0: "asc",
        courseId: this.edu_list_data.courseId,
        chapterId: data.chapterId
      })
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    onCancel_resource() {
      this.group_visible = false;
    },
    //提交
    onSubmit_resource() {
      if (this.group_type === "add") {
        var files = this.file_name_list.join(",");
        this.$post("api/course/chapter/addChapter.do", {
          files,
          chapterContent: this.form.chapterContent,
          chapterTitle: this.form.chapterTitle,
          courseId: this.edu_list_data.courseId,
          chapterId: ""
        }).then(res => {
          this.$message({
            type: "success",
            message: "创建新章节成功！"
          });
          this.init();
          this.group_visible = false;
        });
      } else {
        this.$post("api/course/chapter/addChapter.do", {
          files: "",
          chapterContent: this.form.chapterContent,
          chapterTitle: this.form.chapterTitle,
          courseId: this.edu_list_data.courseId,
          chapterId: this.edu_list_data.courseId
        }).then(res => {
          this.$message({
            type: "success",
            message: "创建新章节成功！"
          });
          this.init();
          this.group_visible = false;
        });
      }
    },
    get_function() {
      this.$swal({
        title: "获取应用功能失败",
        text:
          "调用接口 http://192.168.31.47:8888/sysres异常,错误详情:No route to host",
        type: "error",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定"
      });
    },
    onSubmit() {
      this.$swal({
        title: "提示信息",
        text: "应用资源的操作状态未指定",
        type: "error",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定"
      });
    },
    //
    onCancel() {
      this.$router.push({ path: "/system-set/app" });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.resource-title {
  font-size: 16px;
  font-weight: 600;
  color: rgb(103, 106, 108);
  margin-bottom: 10px;
  .resource-name {
    color: #3ba4f5;
  }
  .add-title {
    float: right;
  }
}
.sourece-page {
  margin-top: 20px;
}
</style>


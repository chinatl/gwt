<template>
    <div>
        <div class="common">
            <t-title title=" 基本信息">
                <el-button style="float:right" size='small' type="success">编辑</el-button>
            </t-title>
            <div class="page-form" style="width:700px">
                <el-form label-width="120px">
                    <el-form-item label="标 题：" class="page-form-item">
                        <span>超级管理员</span>
                    </el-form-item>
                    <el-form-item label="性 別：" class="page-form-item">
                        <span>男</span>
                    </el-form-item>
                    <el-form-item label="部 门：" class="page-form-item">
                        <span>系统管理员</span>
                    </el-form-item>
                    <el-form-item label="人员级别：" class="page-form-item">
                        <span>系统管理员</span>
                    </el-form-item>
                    <el-form-item label="职 务：" prop='name' class="page-form-item">
                        <el-input v-model="form.name" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="固定电话:" prop='name' class="page-form-item">
                        <el-input v-model="form.name" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="备 注:" prop='name' class="page-form-item">
                        <el-input type="textarea" v-model="form.desc" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                    </el-form-item>
                </el-form>
                <div class="user-img" @click="upload_img">
                    <pan-thumb width="120px" height="120px"
                    image="https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191"
                    >
                    </pan-thumb>
                    <p>点击图片更换头像</p>
                </div>
            </div>
        </div>
        <div class="common person-center-page">
        </div>
        <el-dialog :visible.sync="upload_img_dialog" title="上传图片" class="upload-img-dialog">
            <div class="preview-action">
                <div class="show-transparent">
                    <vueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :info="true"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :fixedBox="option.fixedBox"
                    :original="option.original"
                    ></vueCropper>
                </div>
                <div class="preview-block"></div>
            </div>
            <div class="preview-button">
                <div>
                     <el-button type="primary">向左旋转</el-button>
                     <el-button type="primary">向右旋转</el-button>
                </div>
                <div>

                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import panThumb from "@/components/PanThumb";
import vueCropper from "vue-cropper";
export default {
  components: {
    panThumb,
    vueCropper
  },
  data() {
    return {
      form: {},
      upload_img_dialog: true,
      //
      crap: false,
      previews: {},
      lists: [
        {
          img: "https://fengyuanchen.github.io/cropper/images/picture.jpg"
        },
        {
          img: "http://ofyaji162.bkt.clouddn.com/touxiang.jpg"
        }
      ],
      option: {
        img: "",
        size: 1,
        full: false,
        outputType: "png",
        canMove: true,
        fixedBox: false,
        original: false,
        canMoveBox: false
      },
      downImg: "#"
    };
  },
  methods: {
    upload_img() {
      console.log(1);
      this.upload_img_dialog = true;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.person-center-page {
  margin-top: 20px;
}
.page-form-item {
  margin-bottom: 0px;
}
.page-form {
  position: relative;
  .user-img {
    position: absolute;
    right: 70px;
    top: 40px;
    cursor: pointer;
    p {
      color: #3ba4f5;
      font-size: 13px;
      margin-top: 8px;
      text-align: center;
    }
  }
}
.upload-img-dialog {
  .el-dialog {
    width: 900px;
    .el-dialog__body {
      padding-top: 0;
      .preview-action {
        height: 500px;
        padding: 10px;
        .show-transparent {
          width: 70%;
          height: 100%;
        }
        .preview-block {
          width: 30%;
          height: 100%;
        }
      }
      .preview-button {
        display: flex;
        padding: 6px 10px;
      }
    }
  }
}
</style>
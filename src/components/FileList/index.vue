<template>
<div class="cnclosure-area" v-if="list.length">
    <div class="cnclosure-list" v-for='(item,index) in list' :key="index">
        <div class="file-logo">
            <svg-icon :icon-class='get_svg_name(item.name)'></svg-icon>
        </div>
        <div class="file-name">{{item.name}}</div>
        <div class="cnclosure-mask">
            <div class="cnclosure-mask-title">{{item.name}}</div>
            <div class="cnclosure-mask-action">
                <div class="file-action">
                    <i class="el-icon-delete" @click="delete_file(index)"></i>
                    <svg-icon icon-class='眼睛' @click="download_file(item.url)"
                     v-if="get_svg_name(item.name) === 'pdf' || get_svg_name(item.name) === 'png'"></svg-icon>
                    <i class="el-icon-download" @click="download_file(item.url)" v-else></i>
                </div>
                <div class="file-size">{{item.size | fileSize}}</div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import { getFileType } from "@/utils";
export default {
  data() {
    return {};
  },
  props: {
    list: {
      default: [],
      required: true
    }
  },
  methods: {
    //删除文件
    delete_file(index) {
      this.$emit("delete", index);
    },
    //点击下载
    download_file(url) {
      window.open(url);
    },
    //  获取文件类型
    get_svg_name(name) {
      return getFileType(name)
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.cnclosure-area {
  border: 1px solid #e7eaec;
  padding: 20px;
  font-size: 12px;
  border-radius: 3px;
  width: 100%;
  overflow: hidden;
  margin-top: 6px;
  .cnclosure-list {
    border: 1px solid #e7eaec;
    float: left;
    height: 140px;
    width: 200px;
    position: relative;
    margin-right: 16px;
    margin-top: 12px;
    &:hover {
      .cnclosure-mask {
        display: block;
      }
    }
    .cnclosure-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: none;
      .cnclosure-mask-title {
        height: 108px;
        background-color: rgba(224, 224, 224, 0.5);
        color: #000;
        padding-left: 12px;
        font-size: 12px;
      }
      .cnclosure-mask-action {
        height: 32px;
        background-color: rgb(59, 164, 245);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 10px;
        padding-right: 10px;
        .file-action {
          cursor: pointer;
          i {
            font-size: 16px;
            margin-right: 6px;
            color: #cfcfcf;
            &:hover {
              color: #fff;
            }
          }
          .svg-icon {
            font-size: 18px;
            color: #fff;
          }
        }
        .file-size {
          color: #fff;
        }
      }
    }
    .file-logo {
      height: 100px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      .svg-icon {
        font-size: 60px;
      }
    }
    .file-name {
      font-weight: bold;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      padding-right: 10px;
      border: none !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background-color: rgba(224, 224, 224, 0.4);
      color: rgb(103, 106, 108);
    }
  }
}
</style>

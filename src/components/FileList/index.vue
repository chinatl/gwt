<template>
<div class="cnclosure-area" v-if="list.length">
    <div class="cnclosure-list" v-for='(item,index) in list' :key="index">
        <div class="file-logo">
            <img :src="item.url || item.fullAttaPath" v-if="get_svg_name(item.suffix) === 'photo'">
            <svg-icon :icon-class='get_svg_name(item.suffix)' v-else></svg-icon>
        </div>
        <div class="file-name">{{item.originalName}}</div>
        <div class="cnclosure-mask">
            <div class="cnclosure-mask-title">{{item.originalName}}</div>
            <div class="cnclosure-mask-action">
                <div class="file-action">
                    <i class="el-icon-delete" @click="delete_file(index)" v-if="!remove"></i>
                    <svg-icon icon-class='眼睛' @click.native="preview(item)"
                     v-if="get_svg_name(item.suffix) === 'pdf' || get_svg_name(item.suffix) === 'photo'"></svg-icon>
                    <i class="el-icon-download" @click="download_file(item)"></i>
                </div>
                <div class="file-size">{{item.attaSize | fileSize}}</div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import { fileType, download } from "@/utils";
import config from "@/config";
import { Base64 } from "js-base64";
import md5 from "js-md5";
import qs from "qs";
export default {
  data() {
    return {};
  },
  props: {
    list: {
      default: [],
      required: true
    },
    remove: {
      default: false
    }
  },
  methods: {
    preview(item) {
      this.$axios({
        methods: "post",
        url: config + item.attaPath + "/" + item.storeName,
        headers: {
          Authorization: this.$store.getters.token,
          userAgent:'PC'
        },
        responseType: "blob"
      })
        .then(res => {
          if (res.data.size === 36 && res.data.type === "application/json") {
            this.$confirm(
              "用户身份已过期（导致附件无法预览），是否重新登录?",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                this.$store.dispatch("LogOut").then(() => {
                  this.$router.push({
                    path: "/login"
                  });
                  this.$store.commit("DEL_ALL_VIEWS");
                  this.$store.dispatch("reset_slider_list");
                  sessionStorage.clear();
                  // location.reload(); // 为了重新实例化vue-router对象 避免bug
                });
              })
              .catch(() => {});
            return;
          }
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(res.data, item.originalName);
          } else {
            var a = document.createElement("a");
            // console.log(encodeURI(res.data))
            var href = window.URL.createObjectURL(res.data);
            a.href = href;
            a.target = "_blank";
            a.click();
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    //删除文件
    delete_file(index) {
      this.$swal({
        title: "您确定要删除附件吗",
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
        this.$emit("delete", index);
      });
    },
    //点击下载
    download_file(item) {
      var data = {
        id: item.id
      };
      var object = Base64.encode(JSON.stringify(data));
      var sign = md5(object + this.$store.getters.sign);
      window.open(
        `gwt/uploadFile/download?${qs.stringify({
          object,
          sign,
          token: this.$store.getters.token
        })}`
      );
      return;
    },
    //  获取文件类型
    get_svg_name(name) {
      return fileType(name);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.cnclosure-area {
  border: 1px solid #e7eaec;
  padding: 20px 20px 20px 36px;
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
        padding-top: 12px;
        height: 108px;
        background-color: rgba(224, 224, 224, 0.5);
        color: #000;
        padding-left: 12px;
        font-size: 12px;
        text-overflow: ellipsis;
        overflow: hidden;
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
      img {
        max-width: 90%;
        max-height: 90%;
        display: block;
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

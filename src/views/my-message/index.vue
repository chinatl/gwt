<template>
    <div class="my-message">
        <t-title>我的消息</t-title>
        <ul class="message-list">
            <li v-for="(item,index) in [1,2,3]" :key="index" @click="$router.push({path:'desc'})">
                <div class="message-area">
                    <img :src="require('@/assets/imgs/report-s.png')">
                    <i class="el-icon-close" @click.stop="del_one_list"></i>
                </div>
                <div class="message-info">
                    <div class="h3">标题为“bcbcn”的通知被举报，点击查看详情</div>
                    <div class="caozuo">
                        <span class="reportColor">举报</span>
                        <span class="info-detail">text01</span>
                        <span class="info-detail">神航2部</span>
                        <span class="info-time"> 2018-08-07 23:49:34</span>
                    </div>
                </div>
            </li>
        </ul>
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
//import * as Driver from "driver.js"; // import driver.js
//import "driver.js/dist/driver.min.css"; // import driver.js css
//import steps from "./defineSteps";
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 5,
      driver: null
    };
  },
  methods: {
    handleSizeChange(e) {},
    handleCurrentChange(e) {},
    del_one_list(index) {
      this.$swal({
        title: "您确定要删除的信息吗？",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn btn-success"
      })
        .then(function() {
          Swal("删除！", "你的文件已经被删除。", "success");
        })
        .catch(res => {
          console.log(1);
        });
    },
    handleClose(e) {
      console.log(e);
    },
    agree() {
      this.del_dialog = false;
      this.$message({
        message: "删除成功",
        type: "success"
      });
    },
    cancel() {
      this.$message({
        message: "已取消删除",
        type: "info"
      });
      this.del_dialog = false;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.my-message {
  background-color: #fff;
  border-radius: 6px;
  padding-bottom: 20px;
  .message-block {
    text-align: right;
  }

  .message-list {
    padding: 0 20px;
    padding-bottom: 10px;
    li {
      list-style: none;
      overflow: hidden;
      &:hover {
        background-color: rgb(250, 250, 250);
        cursor: pointer;
        .message-info {
          .h3 {
            color: rgb(87, 144, 195);
          }
        }
        .message-area {
          .el-icon-close {
            display: block;
          }
        }
      }
      .message-area {
        padding: 20px 0;
        width: 120px;
        float: left;
        text-align: center;
        position: absolute;
        .el-icon-close {
          position: absolute;
          top: 10px;
          left: 10px;
          display: none;
          &:hover {
            color: #54cfde;
          }
        }
      }
      .message-info {
        padding: 20px 0;
        margin-left: 120px;
        border-bottom: 1px solid #ccc;
        .h3 {
          font-size: 15px;
          letter-spacing: 0.5px;
          margin-bottom: 22px;
          color: #666;
        }
        .caozuo {
          .reportColor {
            background-color: #f47447;
            font-weight: 100;
            vertical-align: baseline;
            padding: 4px 6px;
            border-radius: 5px;
            margin-right: 15px;
            font-size: 11px;
            color: #fff;
          }
          .info-detail {
            letter-spacing: 0.5px;
            color: #54cfde;
            margin-right: 15px;
            display: inline-block;
            font-size: 14px;
          }
          .info-time {
            position: relative;
            font-size: 14px;
            color: #989898;
            display: inline-block;
            float: right;
          }
        }
      }
    }
  }
}
</style>


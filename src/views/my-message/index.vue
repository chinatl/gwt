<template>
    <div class="my-message">
        <t-title>我的消息</t-title>
        <!-- <el-button @click.prevent.stop="dasdsad">adasdada</el-button> -->
        <ul class="message-list" v-loading='loading'>
            <li v-for="(item,index) in tableData" :key="index" @click="go_desc(item)">
                <div class="message-area">
                    <img :src="require('@/assets/imgs/report-s.png')" v-if='item.TYPE_ID === 5'>
                    <img :src="require('@/assets/imgs/message.png')" v-else>
                    <i class="el-icon-close" @click.stop="del_one_list"></i>
                </div>
                <div class="message-info">
                    <div class="h3">{{item.TITLE}}</div>
                    <div class="caozuo">
                        <little-button :name='item.TYPE_DESC'></little-button>
                        <span class="info-detail">{{item.CREATE_USER_NAME}}</span>
                        <span class="info-detail">{{item.DEPT}}</span>
                        <span class="info-time"> {{item.UPDATE_TIME}}</span>
                    </div>
                </div>
            </li>
        </ul>
        <div class="common-page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="$store.getters.page_list"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import littleButton from "@/components/Button/littleButton";
export default {
  components: {
    littleButton
  },
  data() {
    return {
      pageNo: 1,
      loading: false,
      pageSize: 10,
      total: 0,
      tableData: []
    };
  },

  created() {
    var total = sessionStorage.getItem("message/index/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("message/index/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    var pageSize = localStorage.getItem("message/index/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 10;
    this.init(this.pageSize, this.pageNo);
    //初始化查询
    this.$store.dispatch("get_meeting_type_list");
  },
  methods: {
    handleSizeChange(e) {
      localStorage.setItem("message/index/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("message/index/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
    },
    init(pageSize, pageNo) {
      this.loading = true;
      this.$post("gwt/business/msgRecvUser/list", {
        currentPage: pageNo,
        pageSize: pageSize
      },'json')
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
          this.tableData = res.data.messagePageBean.datas;
          this.total = res.data.messagePageBean.totalCount - 0;
          sessionStorage.setItem(
            "message/index/total",
            res.data.messagePageBean.totalCount
          );
        })
        .catch(res => {
          this.loading = false;
        });
    },
    go_desc(item) {
      console.log(JSON.stringify(item, {}, 6));
    },
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
        .then(function() {})
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


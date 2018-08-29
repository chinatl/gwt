<template>
    <div class="my-active">
        <t-title title="已发通知"></t-title>
        <div class="common-action">
            <div>
                <el-select v-model="type" size="medium" style="margin-right:8px;">
                    <el-option value='0' label='全部类型'></el-option>
                    <el-option value='1' label='会议通知'></el-option>
                    <el-option value='2' label='通知'></el-option>
                    <el-option value='3' label='材料征集'></el-option>
                </el-select>
                <el-date-picker
                    v-model="date"
                    type="daterange"
                    align="right"
                    size="medium"
                    unlink-panels
                     style="margin-right:8px;"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                </el-date-picker>
                <el-input v-model="input" placeholder="请输入域名称" style="width:200px" size='medium'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave>搜索</el-button>
            </div>
        </div>
        <ul class="message-list">
            <li v-for="(item,index) in [1,2,3]" :key="index">
              <div class="message-area">
                  <img :src="require('@/assets/imgs/message.png')">
              </div>
              <div class="message-info">
                  <div class="h3">
                    标题为“bcbcn”的通知被举报，点击查看详情
                    <div class="message-action">
                      <little-button name='撤销'></little-button>
                      <little-button name='变更'></little-button>
                    </div>
                  </div>
                  <div class="caozuo">
                      <span class="reportColor">会议通知</span>
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
        <!-- 删除弹窗 -->
        <el-dialog
        :visible.sync="del_dialog"
        width="40%"
        v-drag
        :before-close="handleClose">
            <div class="dialog-content">
                <h3>您确定要删除的信息吗?</h3>
                <p>删除后将无法恢复，请谨慎操作！</p>
                <div class="foot-dialog">
                    <el-button type="danger" @click="agree">确定</el-button>
                    <el-button type="info" @click="cancel">取消</el-button>
                </div>
            </div>
        </el-dialog>
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
      pageSize: 5,
      del_dialog: false,
      type: "",
      daterange: "",
      input: "",
      date: ""
    };
  },
  methods: {
    handleSizeChange(e) {},
    handleCurrentChange(e) {},
    del_one_list(index) {
      this.del_dialog = true;
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
    },
    pickerOptions() {}
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-content {
  width: 80%;
  margin: 0 auto;
  text-align: center;
  h3 {
    font-weight: 600;
    font-size: 30px;
    color: rgb(87, 87, 87);
  }
  p {
    font-size: 18px;
    font-weight: 300;
    margin-top: 20px;
    .el-icon-warning {
      font-size: 30px;
      color: rgb(248, 187, 148);
    }
  }
  .foot-dialog {
    padding-top: 20px;
  }
}
.my-active {
  background-color: #fff;
  border-radius: 6px;
  padding-bottom: 20px;
  .message-block {
    text-align: right;
  }

  .message-list {
    padding: 0 20px;
    padding-bottom: 10px;
    border-top: 1px solid #ccc;
    margin: 0 20px;
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
          .message-action {
            float: right;
            .common-tabel-svg {
              margin-left: 8px;
              padding: 6px 9px;
              .svg-icon {
                margin-right: 4px;
                font-size: 14px;
              }
            }
          }
        }
        .caozuo {
          .reportColor {
            background-color: #55cfde;
            font-weight: 100;
            vertical-align: baseline;
            padding: 4px 6px;
            border-radius: 5px;
            margin-right: 15px;
            font-size: 11px;
            color: #fff;
            &.current {
              background-color: #fab858;
            }
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


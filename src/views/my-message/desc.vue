<template>
    <div class="messgae-desc-list">
        <h3>举报详情</h3>
        <div class="desc-con">
            <p>
                <span class="span1">举报人：</span>
                <span class="span2">yhj   运城扶贫办</span>
            </p>
            <p>
                <span class="span1">举报时间：</span>
                <span class="span2">2018-08-06 17:03</span>
            </p>
            <p>
                <span class="span1">举报类型：</span>
                <span class="span2">非法内容</span>
            </p>
            <p>
                <span class="span1">举报说明：</span>
                <span class="span2">非法</span>
            </p>
            <p>
                <el-button type="primary" size="medium" @click="report_desc">查看详情</el-button>
            </p>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    report_desc() {
      this.$router.push({
        path: "/message/report-desc"
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.messgae-desc-list {
  width: 80%;
  margin: 0 auto;
  background-color: #fff;
  padding: 40px;
  padding-top: 0;
  border-radius: 6px;
  h3 {
    color: rgb(103, 106, 108);
    text-align: center;
    font-size: 24px;
    font-weight: normal;
    border-bottom: 1px solid #ccc;
    padding: 20px;
  }
  .desc-con {
    margin-left: 50px;
    font-size: 13px;
    line-height: 20px;
    margin-top: 20px;
    p {
      padding: 10px;
      color: rgb(103, 106, 108);
      .span1 {
        font-weight: 700;
        width: 70px;
        display: inline-block;
      }
    }
  }
}
</style>


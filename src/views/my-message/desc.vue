<template>
    <div class="messgae-desc-list">
        <h3>举报详情</h3>
        <div class="desc-con">
            <p>
                <span class="span1">举报人：</span>
                <span class="span2">
                  {{report_data.realName}}
                  {{report_data.orgAllName}}
                </span>
            </p>
            <p>
                <span class="span1">举报时间：</span>
                <span class="span2">{{report_data.reportTime}}</span>
            </p>
            <p>
                <span class="span1">举报类型：</span>
                <span class="span2">{{report_data.contentType}}</span>
            </p>
            <p>
                <span class="span1">举报说明：</span>
                <span class="span2">{{report_data.cause}}</span>
            </p>
            <p>
                <el-button @click="retrun_message" size="medium">返回</el-button>
                <el-button type="primary" size="medium" @click="report_desc" v-wave>查看详情</el-button>
            </p>
        </div>
    </div>
</template>
<script>
import { SET_REPORT_DATA, SET_MESSAGE_DATA } from "@/store/mutations";
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["report_data"])
  },
  created() {
    this.$store.dispatch("readSession", SET_REPORT_DATA);
  },
  beforeDestroy() {
    this.$store.commit("DEL_VIEW_BY_NAME", "举报详情");
  },
  methods: {
    retrun_message() {
      this.$router.push({
        path: "/user-message/index"
      });
    },
    report_desc() {
      if (this.report_data.status === "2") {
        this.$message({
          message: "该信息已被管理员删除",
          type: "error"
        });
        return;
      }
      if (this.report_data.appId === "1") {
        this.$router.push({
          path: "/file-desc/index"
        });
      } else if (this.report_data.appId === "37") {
        var data = JSON.parse(JSON.stringify(this.report_data));
        data.id = data.contentId;
        this.$store.commit(SET_MESSAGE_DATA, data);
        this.$router.push({
          path: "/anno-desc/index"
        });
      } else {
        this.$router.push({
          path: "/report-desc/index"
        });
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.messgae-desc-list {
  width: 80%;
  margin: 40px auto;
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
    padding: 40px;
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


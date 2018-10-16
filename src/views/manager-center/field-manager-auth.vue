<template>
    <div class="common">
        <div class="common-title">
            应用授权
        </div>
        <div class="common-action">
            <div>
                <el-input v-model="keyword" placeholder="请输入应用名称" style="width:200px" size='medium' @keyup.native='keyword_search'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="keyword_search">搜索</el-button>
            </div>
        </div>
        <div class="common-table has-img">
            <el-table
                :data="tableData"
                border
                v-loading = 'loading'
                style="width: 100%">
                <el-table-column
                prop="appName"
                align="center"
                label="应用名称">
                </el-table-column>
                <el-table-column
                prop="title"
                align="center"
                label="应用图标">
                    <template slot-scope="scope">
                        <img :src="require('@/assets/imgs/yingyong.png')" class="table-img">
                    </template>
                </el-table-column>
                <el-table-column
                prop="name"
                label="应用状态"
                align="center"
                >
                 <template slot-scope="scope">
                      <el-switch v-model="scope.row.checked" @change="change_status($event,scope.row.appId,scope.$index)"></el-switch>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- <div class="common-page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="$store.getters.page_list"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="40">
            </el-pagination>
        </div> -->
    </div>
</template>
<script>
import { SET_FIELD_APP_LIST, SET_FIELD_MANAGER_DATA } from "@/store/mutations";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      input: "",
      pageNo: 1,
      pageSize: 5,
      tableData: [],
      loading: false,
      keyword: ""
    };
  },
  created() {
    this.$store.dispatch("readSession", SET_FIELD_MANAGER_DATA);
    this.$store.dispatch("readSession", SET_FIELD_APP_LIST);
    this.tableData = this.field_app_list.map(res => {
      res.checked = res.isShow === "1";
      return res;
    });
  },
  beforeDestroy() {
    this.$store.commit("DEL_VIEW_BY_NAME", "授权管理");
  },
  computed: {
    ...mapGetters(["field_app_list", "field_manager_data"])
  },
  methods: {
    keyword_search() {
      this.tableData = JSON.parse(
        JSON.stringify(
          this.field_app_list.filter(res => {
            return res.appName.includes(this.keyword);
          })
        )
      ).map(res => {
        res.checked = res.isShow === "1";
        return res;
      });
    },
    change_status(e, id, index) {
      this.tableData[index].checked = !e;
      var title = !e ? "您确定要取消此应用吗？" : "您确定要添加此应用吗？";
      var text = !e
        ? "取消授权应用，请谨慎操作！"
        : "添加授权应用，请谨慎操作！";
      var message = !e ? "取消授权成功" : "添加授权成功";
      var isShow = e ? "1" : "2";
      var url = e
        ? "gwt/system/sysDomain/addAuthority"
        : "gwt/system/sysDomain/delAuthority";
      this.$swal({
        title,
        text,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn btn-success"
      }).then(res => {
        if (res.value) {
          this.$post(
            url,
            {
              id,
              domainId: this.field_manager_data.domainId
            },
            "json"
          )
            .then(res => {
              if (res.result !== "0000") {
                this.$swal({
                  title: "操作失败！",
                  text: res.msg,
                  type: "error",
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "确定",
                  showConfirmButton: true
                });
                return;
              }
              this.tableData[index].checked = e;
              this.$set(this.tableData, index, this.tableData[index]);
              var app_index;
              for (var i = 0; i < this.field_app_list.length; i++) {
                if (
                  this.tableData[index].appId === this.field_app_list[i].appId
                ) {
                  app_index = i;
                }
              }
              this.$store.commit("set_field_appList", {
                index: app_index,
                isShow
              });
              this.$message({
                message,
                type: "success"
              });
            })
            .catch(res => {
              console.log(res);
            });
        } else {
          this.$message({
            message: "已取消操作",
            type: "info"
          });
        }
      });
    },
    init(pageSize, pageNo) {
      this.loading = true;
      this.$post("gwt/system/sysDomain/getAllApp", {})
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
        })
        .catch(res => {
          console.log(res);
        });
    }
  }
};
</script>
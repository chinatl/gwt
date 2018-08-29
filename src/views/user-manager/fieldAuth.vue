<template>
    <div class="field">
        <div class="common-title">
            应用授权
        </div>
        <div class="common-action">
            <div>
                <el-input v-model="input" placeholder="请输入应用名称" style="width:200px" size='medium'></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave>搜索</el-button>
            </div>
            <div></div>
        </div>
        <div class="common-table has-img">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                prop="title"
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
                      <el-switch v-model="scope.row.status"></el-switch>
                </template>
                </el-table-column>
            </el-table>
        </div>
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
export default {
  data() {
    return {
      input: "",
      pageNo: 1,
      pageSize: 5,
      tableData: [
        {
          title: "网站信息"
        },
        {
          title: "公务通知"
        },
        {
          title: "顶级"
        },
        {
          title: "一门式2.0"
        },
        {
          title: "教育培训"
        }
      ]
    };
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    handleEdit(index, item) {
      this.$store.commit("SET_FIELD_MANAGER_DATA", item);
      this.$router.push({
        path: "/user-manager/field-desc"
      });
    },
    handleDelete() {}
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" >
.field {
  background-color: #fff;
  border-radius: 6px;
  padding-bottom: 10px;
}
</style>

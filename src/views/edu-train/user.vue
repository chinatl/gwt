<template>
    <div class="common">
        <t-title>我的课程</t-title>
        <div class="common-action between">
            <div class="common-table-bar">
                <span v-for='(item,index) in navbar' :key='index'
                    @click="current = index"
                    :class="current === index ? 'current' :''">{{item.name}}</span>
            </div>
        </div>
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                prop="title"
                align="center"
                label="课程标题">
                </el-table-column>
                <el-table-column
                prop="title"
                align="center"
                label="课程类型">
                </el-table-column>
                <el-table-column
                prop="title"
                align="center"
                label="创建时间">
                </el-table-column>
                <el-table-column
                prop="name"
                label="操作"
                align="center"
                >
                 <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type='success'
                    icon="el-icon-edit-outline"
                    @click="edit_role(scope.$index, scope.row)" v-wave>编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.$index, scope.row)" v-wave>删除</el-button>
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
      navbar: [
        {
          name: "全部"
        },
        {
          name: "课程类别一"
        },
        {
          name: "课程类别二"
        },
        {
          name: "课程类别三"
        }
      ],
      pageNo: 1,
      pageSize: 10,
      select: {},
      tableData: [],
      current: 1
    };
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {}
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.edu-train-select {
  padding: 0 20px;
  margin-bottom: 10px;
  display: flex;
  width: 800px;
  .el-select {
    margin-right: 12px;
  }
  .el-input--medium {
    margin-right: 12px;
  }
}
</style>


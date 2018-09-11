<template>
    <div class="common">
        <t-title title="通知签收"></t-title>
        <div class="common-action">
            <div>
                <el-select v-model="type" size="medium" style="margin-right:8px;">
                    <el-option v-for="(item,index) in meeting_type_list" :key='index' :label="item.itemName" :value="item.itemKey"></el-option>
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
        <div class="common-table">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                align="center"
                label="通知类型">
                    <template slot-scope="scope">
                        <span class="href">{{scope.row.type}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="content"
                align="center"
                label="通知标题">
                </el-table-column>
                <el-table-column
                align="center"
                label="保存时间">
                     <template slot-scope="scope">
                        <span class="href">{{scope.row.time}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="name"
                label="操作"
                align="center"
                width='120'
                >
                 <template slot-scope="scope">
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
import { SET_MEETING_TYPE_LIST } from "@/store/mutations";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 5,
      input: "",
      type: "",
      date: "0",
      tableData: []
    };
  },
  created() {
    this.$store.dispatch("readSession", SET_MEETING_TYPE_LIST);
  },
  computed: {
    ...mapGetters(["meeting_type_list"])
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    handleEdit(index, item) {},
    handleDelete() {},
    pickerOptions(e) {
      console.log(e);
    }
  }
};
</script>

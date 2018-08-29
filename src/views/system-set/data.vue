<template>
<t-layout>
  <div slot='left'>
      <div class="padding20">
          <el-input v-model="input" placeholder="请输入查询条件"  size='medium' style="width:100%"></el-input>
      </div>
      <div class="part-flex">
          <el-button type="success" size="small"  icon="el-icon-plus" v-wave>新增</el-button>
          <el-button type="warning" size="small"  icon="el-icon-edit-outline" v-wave>编辑</el-button>
          <el-button type="danger" size="small"  icon="el-icon-delete" v-wave>删除</el-button>
      </div>
      <div class="part-content common-temp">
          <ul class="data-ul-list">
              <li :class="left_nav_data_current === index ? 'current':''"
              @click="change_left_nav(index)"
                v-for='(item,index) in left_nav_data' :key='index'>{{item}}</li>
          </ul>
      </div>
  </div>
  <div slot="right">
      <t-title>区域</t-title>
      <div class="data-left">
            <div class="padding20">
          <el-input v-model="input" placeholder="请输入查询条件"  size='medium' style="width:100%"></el-input>
          </div>
          <div class="part-flex">
              <el-button type="success" size="small"  icon="el-icon-plus" v-wave>新增</el-button>
              <el-button type="warning" size="small"  icon="el-icon-edit-outline" v-wave>编辑</el-button>
              <el-button type="danger" size="small"  icon="el-icon-delete" v-wave>删除</el-button>
          </div>
          <div class="part-content common-temp" style="height:490px">
              <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </div>
      </div>               
      <div class="data-right">
          <div class="data-right-content">
              <div class="father-area"> 父节点： <span class="name">通知</span></div>
              <div class="data-form">
              <el-form ref="form" :model="form" label-width="120px" :rules="rules"  class="demo-ruleForm">
                  <el-form-item label="名称">
                      <el-input v-model="form.name" size="small"></el-input>
                  </el-form-item>
                  <el-form-item label="字典值" prop='name'>
                      <el-input v-model="form.name" size="small"></el-input>
                  </el-form-item>
                  <el-form-item label="自定义Key" prop='name'>
                      <el-input v-model="form.name" size="small"></el-input>
                  </el-form-item>
                  <el-form-item label="序号" prop='name'>
                      <el-input v-model="form.name" size="small"></el-input>
                  </el-form-item>
                  <el-form-item align='right'>
                      <el-button type="primary" @click="onSubmit" size="small" v-wave>确定</el-button>
                  </el-form-item>
              </el-form>
          </div>
          </div>
      </div>               
  </div>
</t-layout>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: "",
        name1: "",
        type: "",
        city: [],
        jiaose: ""
      },
      user_visible: false,
      status: "1", //是否启用
      user_type: "add",
      inputs: "",
      pageNo: 1,
      pageSize: 5,
      input: "",
      rules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        name1: [{ required: true, message: "请输入部门全称", trigger: "blur" }],
        city: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择部门类型", trigger: "blur" }]
      },
      tableData: [
        {
          type1: "运城扶贫办",
          type2: "运城扶贫办",
          type3: "运城市"
        },
        {
          type1: "运城测试部",
          type2: "运城扶贫办",
          type3: "运城市"
        },
        {
          type1: "运城扶贫办2",
          type2: "运城扶贫办2",
          type3: "研祥"
        },
        {
          type1: "运城扶贫办",
          type2: "运城扶贫办",
          type3: "运城市"
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },

      left_nav_data: [
        "域",
        "部门类型",
        "用户级别",
        "通知类型",
        "通知是否需报名",
        "通知是否需上传附件",
        "网站信息类型"
      ],
      left_nav_data_current: 0,
      data: [
        {
          label: "运城市"
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    edit_user() {
      this.user_visible = true;
      this.user_type = "update";
    },
    add_user() {
      this.user_visible = true;
      this.user_type = "add";
    },
    handleNodeClick(data) {
      console.log(data);
    },
    handle_edit() {
      this.edit_visible = true;
      this.part_type = "edit";
    },
    handle_delete() {},
    handleSizeChange() {},
    handleCurrentChange() {},
    onSubmit() {
      this.edit_visible = false;
    },
    change_left_nav(index) {
      this.left_nav_data_current = index;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" >
.part-content {
  margin: 0 20px;
  height: 550px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  padding: 6px;
  border-radius: 4px;
  .data-ul-list {
    padding: 10px;
    li {
      background-color: rgb(227, 234, 244);
      border-radius: 5px;
      font-weight: 600;
      margin-bottom: 3px;
      padding: 8px 42px;
      font-size: 15px;
      color: rgb(77, 99, 123);
      cursor: pointer;
      &.current {
        background-color: rgb(59, 164, 245);
        color: #fff;
        cursor: default;
      }
      &:hover {
        background-color: rgb(59, 164, 245);
        color: #fff;
      }
    }
  }
}
.part-flex {
  padding: 0 20px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-around;
  button {
    flex: 1;
  }
  .el-button--small {
    padding-left: 0;
    padding-right: 0;
  }
}
.data-left {
  float: left;
  width: 33%;
}
.data-right {
  float: right;
  width: 66%;
  .data-right-content {
    margin-top: 20px;
    margin-right: 20px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    height: 584px;
    .father-area {
      border-bottom: solid 1px #dcdfe6;
      padding: 20px 40px;
      font-size: 13px;
      .name {
        font-size: 16px;
        font-weight: 600;
        color: rgb(103, 106, 108);
      }
    }
    .data-form {
      padding-top: 60px;
      padding-left: 30px;
      padding-right: 60px;
    }
  }
}
</style>

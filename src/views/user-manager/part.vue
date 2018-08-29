<template>
<t-layout>
    <div slot="left">
      <div class="common-action">
          <div>
              <el-input v-model="input" placeholder="请输入部门名称"  size='medium' style="width:100%"></el-input>
              <el-button type="success" icon="el-icon-plus" size='medium' @click="add_part" style="padding:10px 10px" v-wave>新增部门</el-button>
          </div>
        </div>
        <div class="part-content common-temp">
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
    </div>
    <div slot="right">
        <t-title>部门管理</t-title>
            <div class="part-action between">
                <div class="part-action-left">
                    当前位置：运城市
                </div>
                <arrow-button></arrow-button>
            </div>
          <div class="common-table">
              <el-table
                  :data="tableData"
                  border
                  style="width: 100%">
                  <el-table-column
                  prop="name"
                  align="center"
                  width="60"
                  label="选择">
                      <template slot-scope="scope">
                          <el-checkbox v-model="scope.row.checked"></el-checkbox>
                      </template>
                  </el-table-column>
                  <el-table-column
                  prop="type1"
                  align="center"
                  label="部门名称">
                  </el-table-column>
                  <el-table-column
                  prop="type2"
                  align="center"
                  label="部门全程">
                  </el-table-column>
                  <el-table-column
                  prop="type3"
                  align="center"
                  label="部门地址">
                  </el-table-column>
                  <el-table-column
                  prop="name"
                  label="操作"
                  align="center"
                  width="186"
                  >
                  <template slot-scope="scope">
                      <el-button
                      size="mini"
                      type="success"
                      icon="el-icon-edit-outline"
                      @click="handle_edit(scope.$index, scope.row)" v-wave>编辑</el-button>
                      <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="handle_delete(scope.$index, scope.row)" v-wave>删除</el-button>
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
        <!-- 弹窗 -->
<div class="common-dialog" slot="else">
<el-dialog
:title="part_type ==='add' ?'新增部门':'编辑部门'" v-drag
:visible.sync="edit_visible">
<el-form ref="form" :model="form" label-width="80px" :rules="rules"  class="demo-ruleForm">
<el-form-item label="所属区域" prop='city'>
      <el-cascader
        :options="options"
        size="small"
        filterable
        v-model="form.city"
        style="width:100%"
        change-on-select
    ></el-cascader>
</el-form-item>
<el-form-item label="部门名称" prop='name'>
    <el-input v-model="form.name" size="small"></el-input>
</el-form-item>
<el-form-item label="部门全称" prop="name1">
    <el-input v-model="form.name1" size="small"></el-input>
</el-form-item>
<el-form-item label="部门类型" prop="type">
    <el-select v-model="form.type" placeholder="请选择活动区域" size="small" style="width:100%">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
</el-form-item>
<el-form-item label="部门地址">
    <el-input v-model="form.address" size="small"></el-input>
</el-form-item>
<el-form-item label="备注">
        <el-input type="textarea" v-model="form.desc" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
</el-form-item>
  <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
</el-form>
</el-dialog>
</div>
</t-layout>
    
</template>
<script>
import formButton from "@/components/Button/formButton";
import arrowButton from "@/components/Button/arrowButton";
export default {
  components: {
    formButton,
    arrowButton
  },
  data() {
    return {
      form: {
        name: "",
        name1: "",
        type: "",
        city: []
      },
      part_type: "add",
      edit_visible: false,
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
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致"
                },
                {
                  value: "fankui",
                  label: "反馈"
                },
                {
                  value: "xiaolv",
                  label: "效率"
                },
                {
                  value: "kekong",
                  label: "可控"
                }
              ]
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航"
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航"
                }
              ]
            }
          ]
        },
        {
          value: "zujian",
          label: "组件",
          children: [
            {
              value: "basic",
              label: "Basic",
              children: [
                {
                  value: "layout",
                  label: "Layout 布局"
                },
                {
                  value: "color",
                  label: "Color 色彩"
                },
                {
                  value: "typography",
                  label: "Typography 字体"
                },
                {
                  value: "icon",
                  label: "Icon 图标"
                },
                {
                  value: "button",
                  label: "Button 按钮"
                }
              ]
            },
            {
              value: "form",
              label: "Form",
              children: [
                {
                  value: "radio",
                  label: "Radio 单选框"
                },
                {
                  value: "checkbox",
                  label: "Checkbox 多选框"
                },
                {
                  value: "input",
                  label: "Input 输入框"
                },
                {
                  value: "input-number",
                  label: "InputNumber 计数器"
                },
                {
                  value: "select",
                  label: "Select 选择器"
                },
                {
                  value: "cascader",
                  label: "Cascader 级联选择器"
                },
                {
                  value: "switch",
                  label: "Switch 开关"
                },
                {
                  value: "slider",
                  label: "Slider 滑块"
                },
                {
                  value: "time-picker",
                  label: "TimePicker 时间选择器"
                },
                {
                  value: "date-picker",
                  label: "DatePicker 日期选择器"
                },
                {
                  value: "datetime-picker",
                  label: "DateTimePicker 日期时间选择器"
                },
                {
                  value: "upload",
                  label: "Upload 上传"
                },
                {
                  value: "rate",
                  label: "Rate 评分"
                },
                {
                  value: "form",
                  label: "Form 表单"
                }
              ]
            },
            {
              value: "data",
              label: "Data",
              children: [
                {
                  value: "table",
                  label: "Table 表格"
                },
                {
                  value: "tag",
                  label: "Tag 标签"
                },
                {
                  value: "progress",
                  label: "Progress 进度条"
                },
                {
                  value: "tree",
                  label: "Tree 树形控件"
                },
                {
                  value: "pagination",
                  label: "Pagination 分页"
                },
                {
                  value: "badge",
                  label: "Badge 标记"
                }
              ]
            },
            {
              value: "notice",
              label: "Notice",
              children: [
                {
                  value: "alert",
                  label: "Alert 警告"
                },
                {
                  value: "loading",
                  label: "Loading 加载"
                },
                {
                  value: "message",
                  label: "Message 消息提示"
                },
                {
                  value: "message-box",
                  label: "MessageBox 弹框"
                },
                {
                  value: "notification",
                  label: "Notification 通知"
                }
              ]
            },
            {
              value: "navigation",
              label: "Navigation",
              children: [
                {
                  value: "menu",
                  label: "NavMenu 导航菜单"
                },
                {
                  value: "tabs",
                  label: "Tabs 标签页"
                },
                {
                  value: "breadcrumb",
                  label: "Breadcrumb 面包屑"
                },
                {
                  value: "dropdown",
                  label: "Dropdown 下拉菜单"
                },
                {
                  value: "steps",
                  label: "Steps 步骤条"
                }
              ]
            },
            {
              value: "others",
              label: "Others",
              children: [
                {
                  value: "dialog",
                  label: "Dialog 对话框"
                },
                {
                  value: "tooltip",
                  label: "Tooltip 文字提示"
                },
                {
                  value: "popover",
                  label: "Popover 弹出框"
                },
                {
                  value: "card",
                  label: "Card 卡片"
                },
                {
                  value: "carousel",
                  label: "Carousel 走马灯"
                },
                {
                  value: "collapse",
                  label: "Collapse 折叠面板"
                }
              ]
            }
          ]
        },
        {
          value: "ziyuan",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components"
            },
            {
              value: "sketch",
              label: "Sketch Templates"
            },
            {
              value: "jiaohu",
              label: "组件交互文档"
            }
          ]
        }
      ],
      data: [
        {
          label: "运城市",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
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
    add_part() {
      this.edit_visible = true;
      this.part_type = "add";
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
    onCancel() {
      this.edit_visible = false;
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
  padding: 4px;
  border-radius: 4px;
}

.part-action {
  padding: 16px 20px;
  color: rgb(103, 106, 108);
  overflow: hidden;
  .part-action-left {
    float: left;
    font-size: 14px;
    font-weight: 600;
  }
}
</style>

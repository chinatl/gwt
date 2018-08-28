<template>
  <t-layout>
    <div slot="left">
        <div class="padding20">
            <el-input v-model="input" placeholder="请输入部门名称"  size='medium' style="width:100%"></el-input>
        </div>
        <div class="part-content common-temp">
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
    </div>
    <div slot="right" style="background-color:#f3f3f4">
        <div class="part-top">
            <t-title>用户管理</t-title>
            <div class="user-desc-info">
                <h3>运城扶贫办</h3>
                <p>
                    <span class="span1">部门类型：</span>
                    <span class="blod">部门类型：</span>
                </p>
                <p>
                    <span class="span1">部门管理员：</span>
                    <span class="blod">sunlight test yhj</span>
                </p>
                <p>
                    <span class="span1">部门地址：</span>
                    <span class="blod">运城市</span>
                </p>
            </div>
        </div>
        <div class="part-bottom">
            <div class="part-action">
                <div class="part-action-left">
                    <el-input v-model="inputs" placeholder="请输入姓名/手机号" style="width:160px" size='medium'></el-input>
                    <el-button type="primary" icon="el-icon-search" size='medium' style="margin:0 8px">搜索</el-button>
                    <el-select v-model="status" size="medium" style="width:80px">
                        <el-option label="全部" value="1"></el-option>
                        <el-option label="启用" value="3"></el-option>
                        <el-option label="停用" value="2"></el-option>
                    </el-select>
                </div>
                <div class="part-action-right">
                      <arrow-button></arrow-button>
                      <el-button type="success" icon="el-icon-plus" size='medium' style="margin-left: 18px" @click="add_user">新增用户</el-button>
                </div>
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
                    label="姓名">
                    </el-table-column>
                    <el-table-column
                    prop="type1"
                    align="center"
                    label="性别">
                    </el-table-column>
                    <el-table-column
                    prop="type2"
                    align="center"
                    label="人员级别">
                    </el-table-column>
                    <el-table-column
                    prop="type3"
                    align="center"
                    label="职务">
                    </el-table-column>
                    <el-table-column
                    prop="type3"
                    align="center"
                    label="角色">
                    </el-table-column>
                    <el-table-column
                    prop="type3"
                    align="center"
                    label="手机号">
                    </el-table-column>
                    <el-table-column
                    prop="type3"
                    align="center"
                    label="固定电话">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="操作"
                    align="center"
                    width="160"
                    >
                    <template slot-scope="scope">
                      <little-button name='编辑' @click.native="edit_user(scope.$index, scope.row)"></little-button>
                      <little-button name='删除' @click.native="handle_delete(scope.$index, scope.row)"></little-button>
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
    </div>
    <!-- 弹窗 -->
    <el-dialog
        slot="else"
        :title="user_type ==='add' ?'添加用户':'编辑用户'"
        class="common-dialog"
        :visible.sync="user_visible">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules"  class="demo-ruleForm">
            <el-form-item label="用户名">
                <el-input v-model="form.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop='name'>
                <el-input v-model="form.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop='name'>
                <el-input v-model="form.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="form.type" placeholder="请选择性别" size="small" style="width:100%">
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属部门" prop="name">
                <el-input v-model="form.name1" size="small" disabled></el-input>
            </el-form-item>
            <el-form-item label="人员级别" prop="type">
                <el-select v-model="form.type" placeholder="请选择" size="small" style="width:100%">
                    <el-option label="副厅级" value="1"></el-option>
                    <el-option label="副处级" value="2"></el-option>
                    <el-option label="正科级" value="3"></el-option>
                    <el-option label="科员" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色">
                  <el-select v-model="form.jiaose" placeholder="请选择"  multiple size="small" style="width:100%">
                    <el-option label="副厅级" value="1"></el-option>
                    <el-option label="副处级" value="2"></el-option>
                    <el-option label="正科级" value="3"></el-option>
                    <el-option label="科员" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职务">
                <el-input v-model="form.address" size="small"></el-input>
            </el-form-item>
            <el-form-item label="固定电话">
                <el-input v-model="form.address" size="small"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="form.desc" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
            </el-form-item>
                <el-form-item align='right'>
                <el-button size="small">取消</el-button>
                <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
  </t-layout>
</template>
<script>
import littleButton from "@/components/Button/littleButton";
import arrowButton from "@/components/Button/arrowButton";
export default {
  components: {
    littleButton,
    arrowButton
  },
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

.part-top {
  background-color: #fff;
  border-radius: 6px;
  .user-desc-info {
    color: rgb(103, 106, 108);
    padding: 10px 20px;
    line-height: 30px;
    h3 {
      font-size: 16px;
      font-weight: 600;
    }
    p {
      font-size: 13px;
      font-weight: 400;
      .span1 {
        display: inline-block;
        width: 100px;
      }
      .blod {
        font-weight: 800;
      }
    }
  }
}
.part-bottom {
  margin-top: 20px;
  padding-bottom: 10px;
  border-radius: 6px;
  background-color: #fff;
  .part-action {
    padding: 16px 20px;
    color: rgb(103, 106, 108);
    overflow: hidden;
    .part-action-left {
      float: left;
      font-size: 14px;
      font-weight: 600;
    }
    .part-action-right {
      float: right;
      font-size: 13px;
      .btn {
        background-color: #23c6c8;
        color: #fff;
        padding: 6px;
        font-size: 16px;
        border-radius: 4px;
        margin-left: 6px;
        &:hover {
          cursor: pointer;
          background-color: rgba(35, 198, 200, 0.8);
        }
        &:active {
          cursor: pointer;
          background-color: rgba(35, 198, 200, 1);
        }
      }
    }
  }
}
</style>

<template>
<el-dialog :visible.sync="dialog" title='添加联系人' class="select-user-dialog">
    <div class="select-user-container">
        <div class="select-left">
            <div class="select-part-top">
                <el-select v-model="part" size="small" style="width:100px">
                    <el-option value="1" label="部门"></el-option>
                    <el-option value="2" label="姓名"></el-option>
                </el-select>
                <el-input v-model="input" size="small">
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <div class="select-part-bottom">
                <div class="select-part-tree common-temp">
                    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                </div>
                <div class="select-part-checkbox">
                    <div class="all-checked">
                        <el-checkbox v-model="checked">全选</el-checkbox>
                    </div>
                    <div class="one-checked">
                        <ul>
                            <li v-for='(item,index) in [12,3,4,5]' :key='index'>
                                <el-checkbox v-model="checked">单选</el-checkbox>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
        <div class="select-right">
            <div class="has-selected">
                <span>已选2人</span>
                <el-button size="mini"><span class="span">清空</span></el-button>
            </div>
            <div class="has-user-list">
                <ul>
                    <li>
                        <div>
                            <svg-icon icon-class='user'></svg-icon>
                            <span class="user-name">test04</span>
                        </div>
                        <div>
                            <span class="part-name">渭南扶贫办扶贫</span>
                            <i class="el-icon-close"></i>
                        </div>
                    </li>
                    <li>
                        <div>
                            <svg-icon icon-class='user'></svg-icon>
                            <span class="user-name">test04</span>
                        </div>
                        <div>
                            <span class="part-name">渭南扶贫办扶扶扶扶扶贫</span>
                            <i class="el-icon-close"></i>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="select-action-button">
        <el-button size="small" @click="save_message">取消</el-button>
        <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
    </div>
</el-dialog>
</template>
<script>
export default {
  data() {
    return {
      part: "1",
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
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      checked: false,
      input: ""
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  computed: {
    dialog: {
      get() {
        return this.show;
      },
      set(res) {
        this.$emit("close");
      }
    }
  },
  methods: {
    handleNodeClick() {},
    onSubmit() {
      this.$emit("ok");
    },
    save_message() {}
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.select-user-dialog {
  .el-dialog {
    width: 720px;
    .el-dialog__header {
      border-bottom: 1px solid #e5e5e5;
      .el-dialog__title {
        color: rgb(103, 106, 108);
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
  .el-dialog__body {
    padding: 20px 20px;
    padding-bottom: 16px;
    .select-user-container {
      overflow: hidden;
      .select-left {
        width: 400px;
        float: left;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #e7e7e7;
        .select-part-top {
          height: 40px;
          color: #3172b4;
          display: flex;
          padding: 2px 8px;
          background-color: #e7e7e7;
          align-items: center;
        }
        .select-part-bottom {
          padding: 10px 8px 10px 8px;
          background-color: #f8f9fb;
          overflow: hidden;
          .select-part-tree {
            width: 236px;
            float: left;
            border: 1px solid #e7eaec;
            padding: 6px;
            height: 375px;
            background-color: #fff;
          }
          .select-part-checkbox {
            height: 375px;
            background-color: #fff;
            float: right;
            width: 136px;
            padding-left: 18px;
            .all-checked {
              border-bottom: 1px solid #efefef;
              height: 40px;
              line-height: 40px;
              .el-checkbox__label {
                font-size: 15px;
                font-weight: 600;
                letter-spacing: 6px;
              }
            }
            .one-checked {
              ul {
                li {
                  height: 32px;
                  line-height: 32px;
                  .el-checkbox {
                    width: 100%;
                  }
                }
              }
            }
          }
        }
      }
      .select-right {
        width: 260px;
        float: right;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #e7e7e7;
        .has-selected {
          height: 40px;
          color: #3172b4;
          display: flex;
          padding: 2px 8px;
          background-color: #e7e7e7;
          align-items: center;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          font-weight: 600;
          font-size: 13px;
          .span {
            color: #3172b4;
            font-size: 14px;
          }
        }
        .has-user-list {
          height: 395px;
          background-color: #f8f9fb;
          overflow-y: auto;
          ul {
            padding: 10px 12px;
            li {
              display: flex;
              justify-content: space-between;
              line-height: 28px;
              .svg-icon {
                font-size: 20px;
                vertical-align: sub;
                color: #2e88e7;
              }
              .user-name {
                letter-spacing: 1px;
                font-size: 14px;
                color: #2e88e7;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                max-width: 80px;
              }
              .part-name {
                width: 110px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                display: inline-block;
                padding-right: 4px;
              }
              .el-icon-close {
                cursor: pointer;
                color: #2e88e7;
                float: right;
                margin-right: 4px;
                margin-top: 6px;
              }
            }
          }
        }
      }
    }
    .select-action-button {
      margin-top: 10px;
      text-align: right;
    }
  }
}
</style>

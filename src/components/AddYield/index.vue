<template>
<el-dialog :visible.sync="dialog" title='选择接收部门' class="select-user-dialog" v-drag :close-on-click-modal='false'>
    <div class="select-user-container">
        <div class="select-left">
            <div class="select-part-top">
                <el-input v-model="input" size="small" placeholder="请选择部门名称">
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <div class="select-part-bottom">
                <div class="select-part-yield">
                    <ul>
                        <li class="avtive">常用联系部门</li>
                        <li>本部门</li>
                        <li>省人大域</li>
                    </ul>
                </div>
                <div class="select-breadcrumb">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item>全部</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="select-yield">
                    <el-collapse v-model="activeNames" @change="handleChange" accordion>
                    <el-collapse-item  name="1">
                        <template slot="title">
                        <i class="el-icon-star-off"></i>  常用联系部门1 
                        </template>
                        <div class="yield-box"><el-checkbox v-model="checked">部门一</el-checkbox></div>
                        <div class="yield-box"><el-checkbox v-model="checked">部门二</el-checkbox></div>
                    </el-collapse-item>
                    <el-collapse-item  name="2">
                        <template slot="title">
                        <i class="el-icon-star-off"></i>  常用联系部门2 
                        </template>
                        <div class="yield-box"><el-checkbox v-model="checked">部门一</el-checkbox></div>
                        <div class="yield-box"><el-checkbox v-model="checked">部门二</el-checkbox></div>
                    </el-collapse-item>
                    <el-collapse-item name="3">
                        <template slot="title">
                        <i class="el-icon-star-off"></i>  常用联系部门3
                        </template>
                        <div class="yield-box"><el-checkbox v-model="checked">部门一</el-checkbox></div>
                        <div class="yield-box"><el-checkbox v-model="checked">部门二</el-checkbox></div>
                    </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
        </div>
        <div class="select-right">
            <div class="has-selected">
                <span>已选(2)</span>
                <el-button size="mini"><span class="span">清空</span></el-button>
            </div>
            <div class="has-yield-list">
                <ul>
                    <li>
                        <div>
                            <svg-icon icon-class='tree'></svg-icon>
                            <span class="user-name">省办公厅</span>
                        </div>
                        <div>
                            <i class="el-icon-close"></i>
                        </div>
                    </li>
                    <li>
                        <div>
                            <svg-icon icon-class='tree'></svg-icon>
                            <span class="user-name">西安神航星云科技有限公司</span>
                        </div>
                        <div>
                            <i class="el-icon-close"></i>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="select-action-button">
        <el-button size="small" @click="cancel" v-wave>取消</el-button>
        <el-button type="primary" @click="onSubmit" size="small" v-wave>确定</el-button>
    </div>
</el-dialog>
</template>
<script>
export default {
  data() {
    return {
      part: "1",
      checked: false,
      input: "",
      activeNames: ""
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
    cancel() {
        console.log(1)
      this.$emit("close");
    },
    save_message() {},
    handleChange() {}
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
        height: 437px;
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
          background-color: #fff;
          overflow: hidden;
          .el-icon-star-off {
            color: #ffa227;
            font-size: 18px;
            margin: 0 4px;
          }
          .select-part-yield {
            border-bottom: dashed 1px #ddd;
            padding: 8px 0px;
            ul {
              overflow: hidden;
              li {
                float: left;
                padding: 4px 6px;
                border-radius: 50px;
                margin: 4px 6px 4px 0;
                line-height: 1.5;
                color: #3ba4f5;
                border: solid 1px #3ba4f5;
                background-color: #fff;
                &:hover {
                  color: #fff;
                  border: solid 1px #3ba4f5;
                  background-color: #3ba4f5;
                  cursor: pointer;
                }
                &.avtive {
                  color: #fff;
                  border: solid 1px #ffa227;
                  background-color: #ffa227;
                }
              }
            }
          }
          .select-breadcrumb {
            margin-top: 12px;
          }
          .select-yield {
            margin-top: 16px;
            .el-collapse-item__content {
              padding-bottom: 0px;
            }
            .yield-box {
              padding-left: 10px;
              padding-bottom: 4px;
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
        .has-yield-list {
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
                font-size: 16px;
                vertical-align: sub;
              }
              .user-name {
                letter-spacing: 1px;
                font-size: 14px;
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

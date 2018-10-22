<template>
    <div class="common">
        <t-title>我的消息</t-title>
        <div class="common-action">
            <div>
                <el-select v-model="msgType" size="medium" style="margin-right:8px;" @change="condition">
                    <el-option label="全部类型" value=""></el-option>
                    <el-option label="公告" value="1"></el-option>
                    <el-option label="会议通知" value="2"></el-option>
                    <el-option label="通知" value="3"></el-option>
                    <el-option label="材料征集" value="4"></el-option>
                    <el-option label="举报" value="5"></el-option>
                    <el-option label="调岗" value="6"></el-option>
                    <el-option label="网站信息" value="7"></el-option>
                </el-select>
                <el-date-picker
                v-model="startTime"
                type="date"
                size='medium' 
                @change="condition"
                placeholder="开始日期">
              </el-date-picker>
                <el-input v-model="title" placeholder="请输入标题" style="width:200px" size='medium' @keyup.native.enter="condition"></el-input>
                <el-button type="primary" icon="el-icon-search" size='medium' v-wave @click="condition">搜索</el-button>
            </div>
        </div>
        <div class="message-list" v-loading='loading' style="min-height:500px;padding:0 20px">
            <message-item 
              v-for="(item,index) in tableData" 
              :data='item'
              :key='index'
              @click="go_desc(item)"
              @delete='del_one_list(item.RECV_ID)'
              ></message-item>
              <no-data v-if="!tableData.length"></no-data>
        </div>
        <div class="common-page" v-if="tableData.length">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="$store.getters.page_list"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            background
            :total="total">
            </el-pagination>
        </div>
       <el-dialog 
        :close-on-click-modal='false'
        title="用户接收"
        class="common-dialog"
        v-drag
        :visible.sync="transfer_dialog">
      <div v-loading='transfer_dialog_loading'>
        <div class="user_info_dialog">
            <div class="user_photo">
              <img :src="require('@/assets/imgs/a9.jpg')" alt="">
            </div>
            <div class="user_info">
              <div class="outName">{{temp_user_data.realName}}</div>
              <div class="outPhone">{{temp_user_data.mobilePhone}}</div>
              <p>部门: <span>{{temp_user_data.sysOrgUserX.orgAllName || '--'}}</span></p>
              <p>职务: <span>{{temp_user_data.sysOrgUserX.duty || '--'}}</span></p>
              <p>级别: <span>{{temp_user_data.sysOrgUserX.userLevelName || '--'}}</span></p>
              <p>角色: <span>{{temp_user_data.sysUserRoleOrgList.map(res=>res.sysRole.roleName).join('、') || '--'}}</span></p>
              <p>固话: <span>{{temp_user_data.sysOrgUserX.phone || '--'}}</span></p>
            </div>
        </div>
        <div style="padding:0 20px" class="button-message">
          <p>调离类型：<span>{{ remove_type == 0 ? '内部':'外部'}}</span></p>
          <p>接收部门：<span>{{reomve_org}}</span></p>
          <el-form>
          <form-button  
          submit_name='同意' cancel_name='拒绝'
          @submit=" save_message_transfer " @cancel='cancel_transfer' ></form-button>
        </el-form>
        </div>
      </div>  
    </el-dialog>
    </div>
</template>
<script>
import { SET_MESSAGE_DATA } from "@/store/mutations";
import MessageItem from "@/components/MessageItem";
import qs from "qs";
import { delete_item } from "@/utils/user";
import { parseTime } from "@/utils";
import formButton from "@/components/Button/formButton";

export default {
  components: {
    MessageItem,
    formButton
  },
  data() {
    return {
      transfer_dialog: false,
      transfer_dialog_loading: false,
      temp_user_data: {
        sysOrgUserX: {},
        sysUserRoleOrgList: []
      },
      pageNo: 1,
      loading: false,
      pageSize: 10,
      total: 0,
      tableData: [],
      meeting_type_list: [],
      title: "",
      startTime: "",
      msgType: "",
      remove_type: "",
      reomve_org: "",
      remove_data: {}
    };
  },
  created() {
    var total = sessionStorage.getItem("message/index/total");
    this.total = total ? total - 0 : 0;
    var pageNo = sessionStorage.getItem("message/index/pageNo");
    this.pageNo = pageNo ? pageNo - 0 : 1;
    var pageSize = localStorage.getItem("message/index/pageSize");
    this.pageSize = pageSize ? pageSize - 0 : 10;
    this.init(this.pageSize, this.pageNo);
    this.$store.dispatch("get_org_role_list");
    //初始化查询
  },
  methods: {
    save_message_transfer() {
      this.transfer_dialog_loading = true;
      this.$post(
        "gwt/system/sysUser/agreeUser",
        {
          userId: this.remove_data.userId,
          orgId: this.remove_data.rollOutOrgId,
          inOrgId: this.remove_data.rollInOrgId,
          positionId: this.remove_data.id
        },
        "json"
      )
        .then(res => {
          this.transfer_dialog_loading = false;
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
          this.transfer_dialog = false;
          this.$message({
            message: "用户转入成功！",
            type: "success"
          });
          this.init(this.pageSize, this.pageNo);
        })
        .catch(res => {
          this.transfer_dialog_loading = false;
          console.log(res);
        });
    },
    cancel_transfer() {
      this.transfer_dialog_loading = true;
      this.$post(
        "gwt/system/sysUser/refuseUser",
        {
          userId: this.remove_data.userId,
          orgId: this.remove_data.rollOutOrgId,
          positionId: this.remove_data.id
        },
        "json"
      )
        .then(res => {
          this.transfer_dialog_loading = false;
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
          this.transfer_dialog = false;
          this.$message({
            message: "用户转入被拒绝！",
            type: "success"
          });
          this.init(this.pageSize, this.pageNo);
        })
        .catch(res => {
          this.transfer_dialog_loading = false;
        });
    },
    //条件查询
    condition() {
      sessionStorage.setItem("message/index/pageNo", 1);
      this.pageNo = 1;
      this.init(this.pageSize, 1);
    },
    handleSizeChange(e) {
      localStorage.setItem("message/index/pageSize", e);
      this.pageNo = 1;
      this.pageSize = e;
      this.init(e, 1);
    },
    handleCurrentChange(e) {
      sessionStorage.setItem("message/index/pageNo", e);
      this.pageNo = e;
      this.init(this.pageSize, e);
    },
    init(pageSize, pageNo, temp) {
      if (!temp) {
        this.loading = true;
      }
      this.$post(
        `gwt/business/msgRecvUser/list?${qs.stringify({
          currentPage: pageNo,
          pageSize: pageSize
        })}`,
        {
          title: this.$filterText(this.title),
          startTime: this.startTime && parseTime(this.startTime, "{y}-{m}-{d}"),
          msgType: this.msgType,
          endTime: ""
        },
        "json"
      )
        .then(res => {
          this.loading = false;
          if (res.result !== "0000") {
            return;
          }
          var tableData = res.data.messagePageBean.datas;
          this.total = res.data.messagePageBean.totalCount - 0;
          sessionStorage.setItem(
            "message/index/total",
            res.data.messagePageBean.totalCount
          );
          var arr = tableData.map(res => {
            return { recvId: res.RECV_ID, msgId: res.MSG_ID };
          });
          this.$post(
            "gwt/business/msgRecvUser/getMsgStateByMsgId",
            { data: arr },
            "json"
          )
            .then(res => {
              if (res.result !== "0000") {
                return;
              }
              for (var i = 0; i < tableData.length; i++) {
                tableData[i].REC_STATUS = res.data.stateList[i].REC_STATUS;
                tableData[i].NOTICE_ID = res.data.stateList[i].NOTICE_ID;
                tableData[i].FROM_NOTICE_ID =
                  res.data.stateList[i].FROM_NOTICE_ID;
                tableData[i].FORWARD_ID = res.data.stateList[i].FORWARD_ID;
                tableData[i].TB_RECV_ID = res.data.stateList[i].TB_RECV_ID;
              }
              this.tableData = tableData;
            })
            .catch(res => {
              console.log(res);
            });
        })
        .catch(res => {
          this.loading = false;
        });
    },
    go_desc(item) {
      if (item.TYPE_DESC === "调岗") {
        this.$post(
          "gwt/business/msgRecvUser/update",
          {
            id: item.RECV_ID,
            state: "1"
          },
          "json"
        )
          .then(res => {
            this.init(this.pageSize, this.pageNo, true);
          })
          .catch(res => {
            console.log(res);
          });
        this.$post(
          "gwt/system/sysUser/getPositionStatus",
          {
            messageId: item.MSG_ID
          },
          "json"
        )
          .then(res => {
            if (res.result !== "0000") {
              return;
            }
            if (res.data.sysPositionMessageRelation.status != 0) {
              this.$message({
                message: "该消息已处理",
                type: "success"
              });
              return;
            }
            this.transfer_dialog = true;
            this.remove_data = res.data.sysPositionMessageRelation;
            this.remove_type =
              res.data.sysPositionMessageRelation.opreationType;
            this.$post(
              "gwt/system/sysOrg/get",
              {
                orgId: res.data.sysPositionMessageRelation.rollInOrgId
              },
              "json"
            )
              .then(res => {
                if (res.result !== "0000") {
                  return;
                }
                this.reomve_org = res.data.loadOrg.orgAllName;
              })
              .catch(res => {
                console.log(res);
              });
            this.$post(
              "gwt/system/sysUser/editUser",
              {
                orgId: res.data.sysPositionMessageRelation.rollOutOrgId,
                userId: res.data.sysPositionMessageRelation.userId
              },
              "json"
            )
              .then(res => {
                if (res.result !== "0000") {
                  return;
                }
                if (!res.data.sysUser.sysUserRoleOrgList) {
                  return;
                }
                this.temp_user_data = res.data.sysUser;
              })
              .catch(res => {
                console.log(res);
              });
            console.log(res);
          })
          .catch(res => {});
      }
      if (item.TYPE_DESC === "举报") {
        this.$post(
          "gwt/business/msgRecvUser/update",
          {
            id: item.RECV_ID,
            state: "1"
          },
          "json"
        )
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
        if (item.TITLE.includes("被管理员删除，请知悉")) {
          this.init(this.pageSize, this.pageNo, true);
          this.$message({
            message: "该消息已处理",
            type: "success"
          });
          return;
        }
        this.$store.dispatch("get_report_desc", item.MSG_ID);
        this.$router.push({
          path: "/report/index"
        });
      }
      if (item.TYPE_DESC === "网站信息") {
        this.$post(
          "gwt/website/tbWebsite/changStatus",
          {
            receId: item.TB_RECV_ID
          },
          "json"
        )
          .then(res => {})
          .catch(res => {
            console.log(res);
          });
        item.RECEIVE_ID = item.TB_RECV_ID;
        this.$store.commit(SET_MESSAGE_DATA, item);
        this.$router.push("/website-desc/index");
      }
      if (item.TYPE_DESC === "公告") {
        this.$post(
          "gwt/business/tbAnnoReceiveUser/updateStatus",
          {
            recvId: item.RECV_ID,
            annoId: item.NOTICE_ID
          },
          "json"
        )
          .then(res => {
            this.init(this.pageSize, this.pageNo, true);
          })
          .catch(res => {
            console.log(res);
          });
        if (item.FROM_NOTICE_ID === 1) {
          this.$post(
            "gwt/business/tbAnnoDeleteReason/getByAnnoId",
            {
              annoId: item.NOTICE_ID
            },
            "json"
          )
            .then(res => {
              if (res.result !== "0000") {
                return;
              }
              this.init(this.pageSize, this.pageNo, true);
              this.$swal({
                title: "删除原因！",
                text:
                  "由于“" +
                  res.data.tbAnnoDeleteReason.deleteReason +
                  "”，通知已被“" +
                  res.data.tbAnnoDeleteReason.deleteUserName +
                  "”删除",
                type: "warning",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                showConfirmButton: true
              });
            })
            .catch(res => {
              console.log(res);
            });
        } else {
          item.id = item.NOTICE_ID;
          item.title = item.TITLE;
          item.createUserName = item.CREATE_USER_NAME;
          item.createOrgName = item.DEPT;
          item.createTime = item.CREATE_TIME;
          this.$store.commit(SET_MESSAGE_DATA, item);
          this.$router.push({
            path: "/anno-desc/index"
          });
        }
      }
      if (
        item.TYPE_DESC === "材料征集" ||
        item.TYPE_DESC === "会议通知" ||
        item.TYPE_DESC === "通知"
      ) {
        this.$post(
          "gwt/notice/tbNotice/getNoticeInfoByMessageId",
          {
            messageId: item.MSG_ID,
            recvId: item.RECV_ID,
            receOrgId: item.ORG_ID,
            ORG_ID: item.ORG_ID
          },
          "json"
        ).then(res => {
          if (res.result !== "0000") {
            return;
          }
          this.$post(
            "gwt/notice/tbNotice/changStatus",
            {
              recvId: item.RECV_ID,
              messageId: res.data.tbNoticeMessage.messageId,
              receOrgId: res.data.tbNoticeReceive.receiveOrgId
            },
            "json"
          )
            .then(res => {
              console.log(res);
            })
            .catch(res => {
              console.log(res);
            });
          if (res.data.tbNotice.noticeStatus === "1002") {
            this.init(this.pageSize, this.pageNo, true);
            this.$swal({
              title: "删除原因！",
              text:
                "由于“" +
                res.data.tbNotice.deleteReason +
                "”，通知已被“" +
                res.data.tbNotice.updateUserName +
                "”被删除",
              type: "warning",
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "确定",
              showConfirmButton: true
            });
            return;
          }
          item.RECEIVE_ID = res.data.tbNoticeReceive.id;
          this.$store.commit(SET_MESSAGE_DATA, item);
          if (item.TYPE_DESC === "通知") {
            this.$router.push({
              path: "/notice-desc/index"
            });
            //通知
          } else if (item.TYPE_DESC === "材料征集") {
            this.$router.push({
              path: "/stuff-desc/index"
            });
            //材料征集
          } else if (item.TYPE_DESC === "会议通知") {
            this.$router.push({
              path: "/meeting-desc/index"
            });
            //会议通知
          }
        });
      }
    },
    del_one_list(id) {
      delete_item({
        url: "gwt/business/msgRecvUser/delete",
        data: {
          id
        },
        success: res => {
          this.init(this.pageSize, this.pageNo);
        }
      });
    },
    handleClose(e) {
      console.log(e);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.button-message {
  p {
    margin-top: 12px;
    font-weight: 600;
    span {
      font-weight: normal;
      margin-left: 12px;
    }
  }
}
.user_info_dialog {
  padding: 10px 40px;
  overflow: hidden;
  display: flex;
  .user_photo {
    padding: 0 30px;
  }
  .user_info {
    padding: 0 30px;
    .outName {
      color: rgb(59, 164, 245);
      font-size: 24px;
      font-weight: 500;
    }
    .outPhone {
      margin-top: 10px;
      color: rgb(59, 164, 245);
      font-size: 16px;
      font-weight: 500;
    }
    p {
      color: rgb(103, 106, 108);
      font-size: 13px;
      font-weight: 700;
      margin-top: 10px;
      span {
        font-weight: normal;
      }
    }
  }
}
</style>

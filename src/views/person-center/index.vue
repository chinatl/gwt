<template>
    <div>
        <div class="common">
            <t-title title="基本信息">
                <el-button style="float:right" size='small' type="success" v-wave @click="editUserInfo">编辑</el-button>
            </t-title>
            <div class="page-form" style="width:700px">
                <el-form label-width="120px" :model="userform" >
                    <el-form-item label="标 题：" class="page-form-item">
                        <span>{{userform.realName}}</span>
                    </el-form-item>
                    <el-form-item label="性 別：" class="page-form-item">
                        <span v-if="isHide">{{userform.radio == "0" ? "男" : "女"}}</span>
                        <template v-else prop="sex" >
                          <el-radio v-model="userform.radio" label="0">男</el-radio>
                          <el-radio v-model="userform.radio" label="1">女</el-radio>
                        </template>                      
                    </el-form-item>
                    <el-form-item label="部 门：" class="page-form-item">
                        <span>{{userform.orgName}}</span>
                    </el-form-item>
                    <el-form-item label="人员级别：" class="page-form-item">
                        <span>{{userform.userLevelName}}</span>
                    </el-form-item>
                    <el-form-item label="职 务：" prop='duty' class="page-form-item">
                        <span v-if="isHide" >{{userform.duty}}</span>
                        <el-input v-model="currentform.duty" size="mini" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="固定电话:" prop='phone' class="page-form-item">
                        <span v-if="isHide">{{userform.phone}}</span>
                        <el-input v-model="currentform.phone" size="mini" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="备 注:" prop='remark' class="page-form-item">
                        <span v-if="isHide">{{userform.remark}}</span>
                        <el-input type="textarea" v-model="currentform.remark" :autosize="{ minRows: 4, maxRows: 6}" v-else></el-input>
                    </el-form-item>
                    <el-form-item style="float:right" size='small' class="itemBtn" v-if="!isHide">
                      <el-button>取消</el-button>
                      <el-button type="primary" @click="oneditSubmit">提交</el-button>
                    </el-form-item>
                </el-form>
                <div class="user-img" @click="upload_img">
                    <pan-thumb width="120px" height="120px"
                    :image="user_img"
                    >
                    </pan-thumb>
                    <p>点击图片更换头像</p>
                </div>
            </div>
        </div>
        <div class="common person-center-page">
            <t-title title=" 账号信息"></t-title>
            <div class="page-form" style="width:700px">
                <el-form label-width="120px">
                    <el-form-item label="用户名：" class="page-form-item">
                        <span>{{userform.userName}}</span>
                    </el-form-item>
                    <el-form-item label="手机号：" class="page-form-item">
                        {{userform.mobilePhone}}
                        <el-button type="success" size="mini" icon="el-icon-edit-outline" @click="password_first_visible = true" v-wave>编辑</el-button>
                    </el-form-item>
                    <el-form-item label="密码：" class="page-form-item">
                        {{userform.password}}
                        <el-button type="success" size="mini" icon="el-icon-edit-outline" @click="role_visible = true" v-wave>编辑</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="common person-center-page">
          <t-title title="登录信息"></t-title>
           <div class="common-table">
            <el-table
                :data="tableData"
                border
                style="width: 100%;margin-top:20px">
                <el-table-column  prop="equipmentName" align="center" label="设备名称"></el-table-column>
                <el-table-column  prop="createTime" align="center" label="授权时间"></el-table-column>
                <el-table-column  prop="lastLoginTime" align="center" label="登录时间"></el-table-column>
                <el-table-column
                prop="name"
                label="操作"
                align="center"
                width="120"
                >
                 <template slot-scope="scope">
                    <little-button name='删除' @click.native="handleDelete(scope.$index, scope.row)"></little-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        </div>
        <!-- 修改手机号第一步 -->
        <el-dialog :close-on-click-modal='false'
            title="为了保证公务通账号的安全，请验证账号和密码"
            class="common-dialog"
            center v-drag
            :visible.sync="password_first_visible">
            <el-form ref="password_first_visible_form" :model="password_first_visible_form" :rules="password_first_visible_form_rules" label-width="80px" >
                <el-form-item label="密码" prop='password' >
                    <el-input v-model="password_first_visible_form.password" placeholder="请输入原密码" type="password"></el-input>
                </el-form-item>
                <form-button @cancel='onCancel_first' @submit="onSubmit_first" submit_name='下一步'></form-button>
            </el-form>
        </el-dialog>
        <!-- 修改手机号第二步 -->
        <el-dialog :close-on-click-modal='false'
            title="手机号绑定"
            class="common-dialog" v-drag
            @close="close_second_visible"
            center
            :visible.sync="password_second_visible">
            <el-form ref="phone_first_visible_form" :model="phone_first_visible_form" :rules="phone_first_visible_form_rules" label-width="80px" >
                <el-form-item label="新手机号" prop='phone'>
                    <el-input v-model="phone_first_visible_form.phone" placeholder="请输入新手机号" class="codeinput"></el-input>
                    <el-button type="primary" class="getcode" @click="getCode">
                      <span v-if="sendMsgDisabled">{{time+'秒后获取'}}</span>
                      <span v-if="!sendMsgDisabled">获取验证码</span>
                    </el-button>
                    
                </el-form-item>
                <el-form-item label="验证码" prop='code'>
                    <el-input v-model="phone_first_visible_form.code" placeholder="请输入验证码"></el-input>
                </el-form-item>
                <form-button @cancel='onCancel_second' @submit="onSubmit_second" submit_name='完成'></form-button>
            </el-form>
        </el-dialog>
        <!-- 上传图片弹框 -->
        <el-dialog :visible.sync="upload_img_dialog" title="头像修改" class="upload-img-dialog" v-drag>
            <upload-button  @on-change="select_img">上传图片</upload-button>
            <div class="preview-action">
                <div class="show-transparent">
                    <vueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :info="true"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :fixedBox="option.fixedBox"
                    :original="option.original"
                    :autoCropWidth="200"
		                :autoCropHeight="200"
                    :autoCrop = 'true'
                    @realTime="realTime"
                    ></vueCropper>
                </div>
                <div class="preview-block">
                  <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
					          <div :style="previews.div">
						          <img :src="previews.url" :style="previews.img">
					          </div>
				          </div>
                </div>
            </div>
            <div class="preview-button">
                <div>
                     <el-button type="primary" @click="left_rotate" size="small">向左旋转</el-button>
                     <el-button type="primary" @click="right_rotate" size="small">向右旋转</el-button>
                </div>
                <div>
                    <el-button type="primary" icon="el-icon-zoom-in" size="small" @click="zoom_in"></el-button>
                    <el-button type="primary" icon="el-icon-zoom-out" size="small" @click="zoom_out"></el-button>
                    <el-button type="primary" icon="el-icon-refresh" size="small" @click="rechange"></el-button>
                    <el-button type="primary" icon="el-icon-printer" size="small" @click="download">保存修改</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 修改密码 -->
        <el-dialog :close-on-click-modal='false'
            title="修改密码"
            class="common-dialog"
            :visible.sync="role_visible" v-drag>
            <el-form ref="form" :model="pwdform" label-width="80px" :rules="pwdformrules">
                <el-form-item label="原密码" prop='oldpwd'>
                    <el-input type="password" v-model="pwdform.oldpwd" size="small" placeholder="请输入原密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop='newpwd'>
                    <el-input type="password" v-model="pwdform.newpwd" size="small" placeholder="请输入8-20位，字母与数字组合的新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop='newpwd'>
                    <el-input type="password" v-model="pwdform.newpwd" size="small" placeholder="请再次输入密码"></el-input>
                </el-form-item>
                <form-button @cancel='onCancel' @submit="onSubmit"></form-button>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import panThumb from "@/components/PanThumb";
import vueCropper from "vue-cropper";
import uploadButton from "@/components/Button/uploadButton";
import formButton from "@/components/Button/formButton";
import littleButton from "@/components/Button/littleButton";
import { validatePhone } from "@/utils/validate";
import { mapGetters } from "vuex";
import { delete_item } from "@/utils/user";
//定义一个全局的变量
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!validatePhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};
export default {
  components: {
    panThumb,
    vueCropper,
    uploadButton,
    formButton,
    littleButton
  },
  data() {
    return {
      pwdform: {
        oldpwd:"",
        newpwd:""
      },
      pwdformrules: {
        oldpwd: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        newpwd: [{ required: true, message: "请输入新密码", trigger: "blur" }]
      },
      // loading:true,
      upload_img_dialog: false,
      role_visible: false,
      password_first_visible: false, //修改密码第一步
      password_second_visible: false, //修改密码第一步
      user_img: "",
      //
      crap: false,
      previews: {},
      option: {
        img: "",
        size: 1,
        full: true,
        outputType: "png",
        canMove: true,
        fixedBox: true,
        original: true,
        canMoveBox: true
      },
      downImg: "#",
      tableData: [],
      userform: {
        userId: "",
        realName: "",
        orgName: "", //部门
        duty: "",
        //性别
        radio: "",
        userLevelName: "",
        phone: "",
        remark: "",
        userName: "",
        mobilePhone: "",
        password: ""
      },

      //编辑信息
      currentform: {},
      isShow: false,
      isHide: true,
      //编辑验证
      editrules: {
        duty: [
          { required: true, message: "请输入职务", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        phone: [{ required: true, trigger: "blur", validator: validPhone }],
        remark: [
          { required: true, message: "请输入备注", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ]
      },
      userId: "",
      password_first_visible_form: {
        password: ""
      },
      password_first_visible_form_rules: {
        password: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      },
      phone_first_visible_form: {
        phone: "",
        code: ""
      },
      phone_first_visible_form_rules: {
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
            validator: validPhone
          }
        ]
      },
      //验证码
      time: 60, // 发送验证码倒计时
      sendMsgDisabled: false
    };
  },
  created() {
    this.getUserInfo();
    this.getloginTable();
  },
  computed: {
    ...mapGetters(["user_info"])
  },
  methods: {
    //获取用户基本信息
    getUserInfo() {
      this.$post(`gwt/system/sysUserZone/getUserInfo`).then(res => {
        if (res.result === "0000") {
          this.userform.id = res.data.user.userId;
          this.userform.realName = res.data.user.realName;
          this.userform.orgName = res.data.sysOrg.orgName;
          this.userform.radio = res.data.user.sex;
          this.userform.duty = res.data.user.sysOrgUserX.duty;
          this.userform.userLevelName = res.data.user.sysOrgUserX.userLevelName;
          this.userform.phone = res.data.user.sysOrgUserX.phone;
          this.userform.remark = res.data.user.sysOrgUserX.remark;
          this.userform.userName = res.data.user.userName;
          this.userform.mobilePhone = res.data.user.mobilePhone;
          this.userform.password = res.data.user.password.replace(/\w/g, "*");
          this.user_img = res.data.AttrHeadId;
          return;
        }
      });
    },
    //编辑用户信息
    editUserInfo() {
      // this.isHide = !this.isHide
      this.$post(`gwt/getCurrentOrgUser`).then(res => {
        if (res.result === "0000") {
          this.currentform = res.data.hashMap;
          this.userId = res.data.hashMap.userId;
          this.isShow = !this.isShow;
          this.isHide = !this.isHide;
        }
      });
    },
    //提交编辑用户信息
    oneditSubmit() {
      this.$post(
        `gwt/system/sysUserZone/updateUser`,
        {
          userId: this.userId,
          sex: this.userform.radio,
          sysOrgUserX: {
            id: this.currentform.id,
            phone: this.currentform.phone,
            remark: this.currentform.remark,
            duty: this.currentform.duty
          }
        },
        "json"
      ).then(res => {
        console.log(res);
        if (res.result === "0000") {
          this.isHide = !this.isHide;
          this.getUserInfo();
        }
      });
    },
    //获取登陆信息表格
    getloginTable() {
      // console.log(this.userId)
      this.$post(
        `gwt/system/sysEquipmentAuth/list`,
        {
          userId: this.userform.id
        },
        "json"
      ).then(res => {
        if (res.result === "0000") {
          this.tableData = res.data.sysEquipmentAuthList;
          console.log(this.tableData);
        }
      });
    },
    handleDelete(index) {
      this.$swal({
        title: "确定移除设备授权吗？",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn btn-success"
      });
      delete_item({
        url: "gwt/system/sysEquipmentAuth/del",
        data: {
          id: [index],
          removeFlag: "Y"
        },
        success: res => {
          console.log(res);
          this.getloginTable();
        }
      });
      // .then(function() {

      //   Swal("删除！", "你的文件已经被删除。", "success");
      //   })
      // .catch(res => {
      //   console.log(1);
      // });
    },
    onCancel() {
      this.role_visible = false;
    },
    onSubmit() {
      this.role_visible = false;
    },
    //取消修改密码
    onCancel_first() {
      this.password_first_visible = false;
    },
    close_second_visible() {
      this.password_first_visible = false;
    },
    //确定修改密码
    onSubmit_first() {
      this.$refs.password_first_visible_form.validate(res => {
        if (!res) return;
        this.$post(
          `gwt/system/sysUserZone/judgePhone`,
          {
            password: this.password_first_visible_form.password,
            userId: this.userform.id
          },
          "json"
        ).then(res => {
          console.log(res);
          if (res.result == "0000") {
            this.password_second_visible = true;
          } else {
            this.$message.error("原密码不能为空");
          }
        });
      });
      // this.password_second_visible = true;
    },

    //获取验证码
    getCode() {
      let me = this;
      me.sendMsgDisabled = true;
      let interval = window.setInterval(function() {
        if (me.time-- <= 0) {
          me.time = 60;
          me.sendMsgDisabled = false;
          window.clearInterval(interval);
        }
      }, 1000);
      this.$post(
        `gwt/getPhoneValidateCode`,
        {
          phone: this.userform.mobilePhone,
          newPhoneNum: this.phone_first_visible_form.phone,
          fromSource: "updatePhone"
        },
        "json"
      ).then(res => {
        console.log(res);
      });
    },
    onCancel_second() {
      this.password_second_visible = false;
    },
    onSubmit_second() {
      this.$post(
        `gwt/system/sysUserZone/changPhone`,
        {
          newPhoneNum: this.phone_first_visible_form.phone,
          oldPhone: this.userform.mobilePhone
        },
        "json"
      ).then(res => {
        console.log(res);
        if (res.result === "0000") {
          this.getUserInfo();
          this.$message({
            message: "电话号码修改成功",
            type: "success"
          });
          this.password_second_visible = false;
        }
      });
    },
    download(type) {
      // console.log(this.userform.id)
      this.$refs.cropper.getCropData(data => {
        console.log(data);
        this.$post(
          `gwt-web-cloudisk/uploadFile/uploadHead`,
          {
            selectHeadFile: data,
            ownerSystem: "gwt-platform",
            ownerModule: "user",
            ownerAperation: "",
            userId: this.userform.id
          },
          "json"
        ).then(res => {
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
          this.user_img = data;
          this.upload_img_dialog = false;
        });
        // test.location.href = data
      });
    },
    //放大图片
    zoom_in() {
      this.$refs.cropper.changeScale(1);
    },
    realTime(data) {
      this.previews = data;
    },
    zoom_out() {
      this.$refs.cropper.changeScale(-1);
    },
    //还原
    rechange() {
      this.$refs.cropper.refresh();
    },
    upload_img() {
      this.upload_img_dialog = true;
      this.option.img = this.user_img;
    },
    select_img(e) {
      this.option.img = e.url;
    },
    right_rotate() {
      this.$refs.cropper.rotateRight(); // 向右边旋转90度
    },
    left_rotate() {
      this.$refs.cropper.rotateLeft(); // 向左边旋转90度
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.person-center-page {
  margin-top: 20px;
}
.page-form-item {
  margin-bottom: 0px;
}
.page-form {
  position: relative;
  .user-img {
    position: absolute;
    right: 70px;
    top: 40px;
    cursor: pointer;
    p {
      color: #3ba4f5;
      font-size: 13px;
      margin-top: 8px;
      text-align: center;
    }
  }
}
.upload-img-dialog {
  .el-dialog {
    width: 900px;
    .el-dialog__body {
      padding-top: 0;
      .preview-action {
        height: 500px;
        padding: 10px;
        display: flex;
        .show-transparent {
          width: 70%;
          height: 100%;
        }
        .preview-block {
          width: 30%;
          height: 100%;
          overflow: hidden;
          padding-left: 20px;
          .show-preview {
            border-radius: 100px;
          }
        }
      }
      .preview-button {
        display: flex;
        padding: 6px 10px;
        justify-content: space-between;
      }
    }
  }
}
.itemBtn {
  float: right;
  margin: 10px 0;
}
.el-form-item__content .el-form-item__error {
  position: static;
  margin-bottom: 10px;
}
.codeinput {
  width: 300px;
}
.getcode {
  float: right;
}
</style>
<template>
  <div>
    <fixed-cancel-finish-header
      :finishMethod="this.changePassword"
      :canFinish="canFinish"
      cancelText="取消"
      finishText="完成"
      :title="hasPassword?'更改提款密码':'设置提款密码'"
    ></fixed-cancel-finish-header>
    <div class="body-content-without-footer" v-if="userType!=$static.TYPE_GUEST_PLAYER">
      <div class="weui-cells weui-cells_form">
        <div class="weui-cell weui-cell_active" v-show="hasPassword">
          <div class="weui-cell__hd" style="width: 30%;">旧密码</div>
          <div class="weui-cell__bd">
            <input type="password" v-model="oldPassword" class="weui-input" placeholder="请填写旧密码">
          </div>
          <div class="weui-cell__ft">
            <i class="weui-icon-clear" v-show="oldPassword" @click="oldPassword=''"></i>
          </div>
        </div>
        <div class="weui-cell weui-cell_active">
          <div class="weui-cell__hd" style="width: 30%;">新密码</div>
          <div class="weui-cell__bd">
            <input type="password" v-model="newPassword" class="weui-input" placeholder="请输入新的密码">
          </div>
          <div class="weui-cell__ft">
            <i class="weui-icon-clear" v-show="newPassword" @click="newPassword=''"></i>
          </div>
        </div>
        <div class="weui-cell weui-cell_active">
          <div class="weui-cell__hd" style="width: 30%;">确认密码</div>
          <div class="weui-cell__bd">
            <input type="password" v-model="confirmPassword" class="weui-input" placeholder="请再次输入新密码">
          </div>
          <div class="weui-cell__ft">
            <i class="weui-icon-clear" v-show="confirmPassword" @click="confirmPassword=''"></i>
          </div>
        </div>
      </div>
      <div class="weui-cells__tips">密码为6到20位的数字，字母，特殊字符组成，且不能仅为数字</div>
    </div>
    <div class="body-content-without-footer" v-else>
      <div class="weui-cells__tips">游客用户无法提款，请到 设置 --> 帐号与安全 绑定信息成为正式用户</div>
    </div>
    <error-msg
      :errorTitle="errorTitle"
      :errorMsg="errorMsg"
      @close-error-msg="errorTitle='';errorMsg=''"
    ></error-msg>
    <div style="opacity: 1;" v-show="changePasswordSuccess">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd">
          <strong class="weui-dialog__title">修改密码成功</strong>
        </div>
        <div class="weui-dialog__bd">新密码已经生效，请您牢记</div>
        <div class="weui-dialog__ft">
          <a
            href="javascript:;"
            class="weui-dialog__btn weui-dialog__btn_primary"
            @click="$router.go(-1)"
          >确定</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FixedCancelFinishHeader from "../../components/FixedCancelFinishHeader"
import ErrorMsg from "../../components/ErrorMsg"
import { mapState } from 'vuex'
export default {
  components: {
    FixedCancelFinishHeader,
    ErrorMsg
  },
  data() {
    return {
      hasPassword: this.$route.query.has_password,
      canFinish: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      errorTitle: '',
      errorMsg: '',
      changePasswordSuccess: false
    };
  },
  mounted(){
  },
  methods: {
    checkCanFinish(){
      if((!this.hasPassword||this.oldPassword.length>0)&&this.newPassword.length>0&&this.confirmPassword.length>0
      &&this.newPassword==this.confirmPassword){
        this.canFinish = true
      }else{
        this.canFinish = false
      }
    },
    async changePassword(){
      if(this.newPassword!=this.confirmPassword){
        this.errorMsg = "新密码与确认密码不一致"
      } else if (
        this.newPassword.length < 6 ||
        this.newPassword.length > 20 ||
        /^[0-9]+$/.test(this.newPassword)
      ) {
        this.errorMsg =
          "密码为6到20位的数字，字母，特殊字符组成，且不能仅为数字";
      }
      let changePasswordResult = await this.$api.postData('/api/user/change_withdraw_password',{
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
        }
      )
      if(changePasswordResult.code == 0){
        this.changePasswordSuccess = true
      }else{
        this.errorTitle = '修改密码失败'
        this.errorMsg = changePasswordResult.msg
      }
    }
  },
  watch:{
    oldPassword(){
      this.checkCanFinish()
    },
    newPassword(){
      this.checkCanFinish()
    },
    confirmPassword(){
      this.checkCanFinish()
    }
  },
  computed: mapState({ userType: "userType" })
}
</script>
<style lang="less" scoped>
@import url("../../assets/mixin.less");
</style>

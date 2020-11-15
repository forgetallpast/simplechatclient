<template>
  <div>
    <fixed-cancel-finish-header
      :finishMethod="this.guestBindTelephonePassword"
      cancelText="取消"
      title="游客绑定信息"
      finishText="绑定"
      :canFinish="canFinish"
    ></fixed-cancel-finish-header>
    <div class="body-content-without-footer">
      <div class="weui-cells">
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">手机号码</label>
          </div>
          <div class="weui-cell__bd">
            <input
              v-model="telephone"
              class="weui-input"
              type="text"
              placeholder="请填写手机号码"
              maxlength="16"
            >
          </div>
          <div class="weui-cell__ft">
            <i class="weui-icon-clear" v-show="telephone" @click="telephone=''"></i>
          </div>
        </div>
        <div class="weui-cell weui-cell_vcode">
          <div class="weui-cell__hd">
            <label class="weui-label">验证码</label>
          </div>
          <div class="weui-cell__bd">
            <input
              v-model="verifyCode"
              autofocus
              class="weui-input"
              type="text"
              pattern="[0-9]*"
              placeholder
              maxlength="6"
            >
          </div>
          <div class="weui-cell__ft">
            <a
              href="javascript:;"
              class="weui-btn__mini weui-vcode-btn"
              @click="sendMobileCode()"
            >获取验证码{{nextSmsSend>0?'('+nextSmsSend+'秒)':''}}</a>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">密码</label>
          </div>
          <div class="weui-cell__bd">
            <input
              v-model="password"
              class="weui-input"
              type="password"
              placeholder="至少6位，不能为纯数字"
              maxlength="16"
            >
          </div>
          <div class="weui-cell__ft"></div>
        </div>
      </div>
      <div class="weui-cells__tips">绑定后即成为正式用户，可以用手机号和密码登录哦</div>
    </div>
    <error-msg
      :errorTitle="errorTitle"
      :errorMsg="errorMsg"
      @close-error-msg="errorTitle='';errorMsg=''"
    ></error-msg>
  </div>
</template>
<script>
import FixedCancelFinishHeader from "../../components/FixedCancelFinishHeader";
import ErrorMsg from "../../components/ErrorMsg";
import md5 from "js-md5";
export default {
  components: {
    FixedCancelFinishHeader,
    ErrorMsg
  },
  data() {
    return {
      telephone: "",
      verifyCode: "",
      password: "",
      nextSmsSend: 0, //多久后可以发送下一次验证码
      errorTitle: "",
      errorMsg: "",
      canFinish: false
    };
  },
  methods: {
    guestBindTelephonePassword: async function() {
      console.log("bind now");
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.telephone)) {
        this.errorMsg = "请输入正确的电话号码";
        return;
      }
      if (this.verifyCode.length < 4 || this.verifyCode.length > 8) {
        this.errorMsg = "验证码不正确";
        return;
      }
      if (
        this.password.length < 8 ||
        this.password.length > 12 ||
        /^[0-9]+$/.test(this.password) ||
        /^[A-Za-z]+$/.test(this.password) ||
        !/^[A-Za-z0-9]+$/.test(this.password)
      ) {
        this.errorMsg =
          "密码为8到12位的数字，由数字与大小写字母组成，且不能仅为数字或字母";
        return;
      } 
      let bindResult = await this.$api.postData('/api/user/try_player_bind_telephone',{
        telephone: this.telephone,
        verifyCode: this.verifyCode,
        password: this.password
      })
      if(bindResult.code == 0){
        this.$store.commit('setToken', '')
        this.$router.go(-1)
      }else{
        this.errorTitle = '绑定失败'
        this.errorMsg = bindResult.msg
      }
    },
    async sendMobileCode() {
      if(this.nextSmsSend > 0){
        return false;
      }
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.telephone)) {
        this.errorTitle = "验证码获取失败";
        this.errorMsg = "请填写正确的手机号码";
        return false;
      }
      this.nextSmsSend = 60;
      let smsTimer = setInterval(() => {
        --this.nextSmsSend;
        if (this.nextSmsSend <= 0) {
          this.nextSmsSend = 0;
          clearInterval(smsTimer);
        }
      }, 1000);
      let r = Math.random().toString(36);
      let k = md5(md5(r + this.telephone + r) + r);
      let smsResult = await this.$api.postData("/api/guest/send_sms_code", {
        telephone: this.telephone,
        r: r,
        k: k
      });
      if (smsResult.code == 0) {
        this.errorTitle = "验证码发送成功";
        this.errorMsg = "验证码已成功发送，请查收";
      } else {
        this.errorTitle = "验证码发送失败";
        this.errorMsg = smsResult.msg;
      }
    },
    checkCanBindOrNot: function() {
      if (
        this.telephone.length > 0 &&
        this.verifyCode.length > 0 &&
        this.password.length > 0
      ) {
        this.canFinish = true;
      } else {
        this.canFinish = false;
      }
    }
  },
  watch: {
    telephone() {
      this.checkCanBindOrNot();
    },
    verifyCode() {
      this.checkCanBindOrNot();
    },
    password() {
      this.checkCanBindOrNot();
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/mixin.less");
</style>


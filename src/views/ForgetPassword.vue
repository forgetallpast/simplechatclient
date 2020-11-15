<template>
  <div>
    <fixed-header leftText="返回" title="修改密码"></fixed-header>
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
          />
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
          />
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
          <label class="weui-label">新密码</label>
        </div>
        <div class="weui-cell__bd">
          <input
            v-model="password"
            class="weui-input"
            type="password"
            placeholder="至少6位，不能为纯数字"
            maxlength="16"
          />
        </div>
        <div class="weui-cell__ft"></div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <label class="weui-label">确认新密码</label>
        </div>
        <div class="weui-cell__bd">
          <input
            v-model="repeatPassword"
            class="weui-input"
            type="password"
            placeholder="重复输入密码"
            maxlength="16"
          />
        </div>
        <div class="weui-cell__ft"></div>
      </div>
    <!--</div>-->
    <div style="height:32px;">&nbsp;</div>
    <div>
      <a
        v-if="enableModifyPassword"
        href="javascript:;"
        class="weui-btn weui-btn_primary"
        style="width:60%;"
        @click="modifyPassword()"
      >修改密码</a>
      <a v-else href="javascript:;" class="weui-btn weui-btn_primary weui-btn_disabled" style="width:60%;">修改密码</a>
    </div>
    <div style="opacity: 1;" v-show="errorMsg">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd">
          <strong class="weui-dialog__title">{{errorTitle}}</strong>
        </div>
        <div class="weui-dialog__bd">{{errorMsg}}</div>
        <div class="weui-dialog__ft">
          <a
            href="javascript:;"
            class="weui-dialog__btn weui-dialog__btn_primary"
            @click="errorMsg='';errorTitle='';"
          >确定</a>
        </div>
      </div>
    </div>
    <div style="opacity: 1;" v-show="modifySuccess">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd">
          <strong class="weui-dialog__title">修改密码成功</strong>
        </div>
        <div class="weui-dialog__bd">修改密码成功，点击确定将以{{telephone}}账号自动登录</div>
        <div class="weui-dialog__ft">
          <a
            href="javascript:;"
            class="weui-dialog__btn weui-dialog__btn_primary"
            @click="autoLogin()"
          >确定</a>
        </div>
      </div>
    </div>
    <div style="opacity: 1;" v-show="loading">
      <div class="weui-mask"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">正在修改密码...</p>
      </div>
    </div>
  </div>
</template>
<script>
import md5 from "js-md5";
import FixedHeader from '../components/FixedHeader'
export default {
  components:{
    FixedHeader
  },
  data() {
    return {
      telephone: "",
      verifyCode: "",
      password: "",
      repeatPassword: "",
      errorMsg: "",
      loading: false,
      modifySuccess: false,
      errorTitle: "",
      nextSmsSend: 0 //多久后可以发送下一次验证码
    };
  },
  methods: {
    async modifyPassword() {
      this.errorMsg = "";
      this.errorTitle = "修改失败";
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.telephone)) {
        this.errorMsg = "请输入正确的电话号码";
      } else if (this.verifyCode.length < 4 || this.verifyCode.length > 8) {
        this.errorMsg = "验证码不正确";
      } else if (
        this.password.length < 6 ||
        this.password.length > 20 ||
        /^[0-9]+$/.test(this.password)
      ) {
        this.errorMsg =
          "密码为6到20位的数字，字母，特殊字符组成，且不能仅为数字";
      } else if (this.repeatPassword != this.password) {
        this.errorMsg = "两次输入密码不一致";
      }
      if (this.errorMsg) {
        return false;
      }
      let params = {
        telephone: this.telephone,
        verifyCode: this.verifyCode,
        password: this.password
      };
      this.loading = true;
      let modifyPasswordResult = await this.$api.postData(
        "/api/guest/modify_password",
        params
      );
      this.loading = false;
      if (modifyPasswordResult.code != 0) {
        this.errorMsg = modifyPasswordResult.msg;
      } else {
        this.modifySuccess = true;
      }
    },
    autoLogin() {
      this.$router.push({
        name: "login",
        params: { telephone: this.telephone, password: this.password }
      });
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
      let smsResult = await this.$api.postData("/api/guest/send_modify_password_sms_code", {
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
    }
  },
  computed: {
    enableModifyPassword: function() {
      return (
        this.telephone.length &&
        this.verifyCode.length &&
        this.password.length &&
        this.repeatPassword.length
      );
    }
  }
};
</script>
<style scoped>
.sub-page {
  background-color: white;
}

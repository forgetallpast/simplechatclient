<template>
  <div>
    <fixed-header leftText="首页" title="用手机号注册"></fixed-header>
    <!--
    <div id="wx-header">
      <div class="center">
        <router-link to="/welcome" tag="div" class="iconfont icon-return-arrow">
          <span>首页</span>
        </router-link>
        <span>用手机号注册</span>
      </div>
    </div>
    -->
    <!--<div class="weui-cells">-->
      <!--
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <div class="weui-uploader">
            <div class="weui-uploader__hd">
              <p class="weui-uploader__title">上传头像</p>
              <div class="weui-uploader__info">{{profileUrl?1:0}}/1</div>
            </div>
            <div class="weui-uploader__bd">
              <img class="weui-uploader__file" v-show="profileUrl" :src="profileUrl" />
              <div class="weui-uploader__input-box">
                <input
                  id="uploaderInput"
                  class="weui-uploader__input"
                  type="file"
                  accept="image/*"
                  multiple
                  ref="myProfile"
                  @change="changeProfile()"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      -->
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <label class="weui-label">昵称</label>
        </div>
        <div class="weui-cell__bd">
          <input
            v-model="nickname"
            class="weui-input"
            type="text"
            placeholder="例如: 发哥"
            maxlength="16"
          />
        </div>
        <div class="weui-cell__ft">
          <i class="weui-icon-clear" v-show="nickname" @click="nickname=''"></i>
        </div>
      </div>
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
      <!--<div class="weui-cells__tips"><a href="javascript:;">收不到验证码</a></div>-->
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <label class="weui-label">用户名</label>
        </div>
        <div class="weui-cell__bd">
          <input
            v-model="username"
            class="weui-input"
            type="text"
            placeholder="必须含有字母，最少4位，最多16位"
            maxlength="16"
          />
        </div>
        <div class="weui-cell__ft">
          <i class="weui-icon-clear" v-show="username" @click="username=''"></i>
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
          />
        </div>
        <div class="weui-cell__ft"></div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <label class="weui-label">确认密码</label>
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
        v-if="enableRegister"
        href="javascript:;"
        class="weui-btn weui-btn_primary"
        style="width:60%;"
        @click="register()"
      >注册</a>
      <a v-else href="javascript:;" class="weui-btn weui-btn_primary weui-btn_disabled" style="width:60%;">注册</a>
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
    <div style="opacity: 1;" v-show="registerSuccess">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd">
          <strong class="weui-dialog__title">注册成功</strong>
        </div>
        <div class="weui-dialog__bd">注册成功，点击确定将以{{username}}账号自动登录</div>
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
        <p class="weui-toast__content">正在注册...</p>
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
      photoImage: "~@/assets/images/grid_camera.png",
      nickname: "",
      telephone: "",
      verifyCode: "",
      username: "",
      password: "",
      repeatPassword: "",
      errorMsg: "",
      loading: false,
      registerSuccess: false,
      errorTitle: "",
      nextSmsSend: 0, //多久后可以发送下一次验证码
      profileUrl: ""
    };
  },
  methods: {
    changeProfile() {
      console.log(this.$refs.myProfile.files);
      const files = this.$refs.myProfile.files;
      const file = files[0];
      this.profileUrl = URL.createObjectURL(file);
    },
    async register() {
      this.errorMsg = "";
      this.errorTitle = "注册失败";
      /*
      if (this.$refs.myProfile.files.length == 0) {
        this.errorMsg = "请上传头像";
      }
      */
      if (this.nickname.length < 2 || this.nickname.length > 16) {
        this.errorMsg = "昵称最少2个字，最多8个字";
      } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.telephone)) {
        this.errorMsg = "请输入正确的电话号码";
      } else if (this.verifyCode.length < 4 || this.verifyCode.length > 8) {
        this.errorMsg = "验证码不正确";
      } else if (
        /^[0-9]+$/.test(this.username) ||
        /^[A-Za-z]+$/.test(this.username) ||
        !/^[A-Za-z0-9]+$/.test(this.username) ||
        this.username.length < 6 ||
        this.username.length > 12
      ) {
        this.errorMsg =
          "用户名可由数字与大小写字母组成，且不能仅为数字或字母，最少6位，最多12位";
      } else if (
        this.password.length < 8 ||
        this.password.length > 12 ||
        /^[0-9]+$/.test(this.password) ||
        /^[A-Za-z]+$/.test(this.password) ||
        !/^[A-Za-z0-9]+$/.test(this.password)
      ) {
        this.errorMsg =
          "密码为8到12位的数字，由数字与大小写字母组成，且不能仅为数字或字母";
      } else if (this.repeatPassword != this.password) {
        this.errorMsg = "两次输入密码不一致";
      }
      if (this.errorMsg) {
        return false;
      }
      let agentRefCode = this.$storage.get('agentRefCode')
      if(!agentRefCode||agentRefCode=='null'||agentRefCode=='NULL'||agentRefCode==null){
        agentRefCode = ''
      }
      let params = {
        nickname: this.nickname,
        telephone: this.telephone,
        verifyCode: this.verifyCode,
        username: this.username,
        password: this.password,
        agentRefCode: agentRefCode
      };
      let formData = new FormData();
      for (var key in params) {
        formData.append(key, params[key]);
      }
      // formData.append("header", this.$refs.myProfile.files[0]);
      this.loading = true;
      let regResult = await this.$api.postData(
        "/api/guest/register",
        formData,
        {
          method: "post",
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      /*
      let regResult = await this.$api.postData("/api/guest/register", {
        nickname: this.nickname,
        telephone: this.telephone,
        verifyCode: this.verifyCode,
        username: this.username,
        password: this.password
      });
      */
      this.loading = false;
      if (regResult.code != 0) {
        this.errorMsg = regResult.msg;
      } else {
        this.registerSuccess = true;
      }
    },
    autoLogin() {
      this.$router.push({
        name: "login",
        params: { username: this.username, password: this.password }
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
    }
  },
  computed: {
    enableRegister: function() {
      return (
        this.nickname.length &&
        this.telephone.length &&
        this.verifyCode.length &&
        this.username.length &&
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

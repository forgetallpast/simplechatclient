<template>
  <div>
    <fixed-header leftText="首页" title="登录"></fixed-header>
    <!--
    <div id="wx-header">
      <div class="center">
        <router-link to="/register" tag="div" class="iconfont icon-return-arrow">
          <span>注册</span>
        </router-link>
        <span>登录</span>
      </div>
    </div>
    -->
      <div class="weui-cell weui-cell_select">
        <div class="weui-cell__bd">
          <select class="weui-select" name="loginMethod" v-model="loginMethod">
            <option :value="$static.USERNAME_LOGIN">用户名密码登录</option>
            <option :value="$static.MOBILE_LOGIN">手机号码密码登录</option>
          </select>
        </div>
      </div>
      <div class="weui-cell" v-show="loginMethod==$static.USERNAME_LOGIN">
        <div class="weui-cell__hd">
          <label class="weui-label">用户名</label>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="text" placeholder="用户名" v-model="username" />
        </div>
        <div class="weui-cell__ft">
          <i class="weui-icon-clear" v-show="username" @click="username=''"></i>
        </div>
      </div>
      <div class="weui-cell" v-show="loginMethod==$static.MOBILE_LOGIN">
        <div class="weui-cell__hd">
          <label class="weui-label">手机号码</label>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="text" placeholder="手机号码" v-model="telephone" />
        </div>
        <div class="weui-cell__ft">
          <i class="weui-icon-clear" v-show="telephone" @click="telephone=''"></i>
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <label class="weui-label">密码</label>
        </div>
        <div class="weui-cell__bd">
          <input
            class="weui-input"
            type="password"
            placeholder="密码"
            maxlength="16"
            v-model="password"
          />
        </div>
        <div class="weui-cell__ft"></div>
      </div>
    <div style="height:32px;">&nbsp;</div>
    <div>
      <a
        v-if="enableLogin"
        href="javascript:;"
        class="weui-btn weui-btn_primary"
        style="width:60%;"
        @click="login()"
      >登录</a>
      <a v-else href="javascript:;" class="weui-btn weui-btn_primary weui-btn_disabled" style="width:60%;">登录</a>
    </div>
    <div style="height:16px;">&nbsp;</div>
    <div class="weui-footer">
            <p class="weui-footer__links">
                <router-link class="weui-footer__link" :to="{name:'forget_password'}">忘记密码</router-link>
            </p>
        </div>
    <div style="opacity: 1;" v-show="errorMsg">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd">
          <strong class="weui-dialog__title">登录失败</strong>
        </div>
        <div class="weui-dialog__bd">{{errorMsg}}</div>
        <div class="weui-dialog__ft">
          <a
            href="javascript:;"
            class="weui-dialog__btn weui-dialog__btn_primary"
            @click="errorMsg=''"
          >确定</a>
        </div>
      </div>
    </div>
    <div style="opacity: 1;" v-show="loading">
      <div class="weui-mask"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">登录中</p>
      </div>
    </div>
  </div>
</template>
<script>
import FixedHeader from '../components/FixedHeader'
export default {
  components:{
    FixedHeader
  },
  data() {
    return {
      loginMethod: this.$static.USERNAME_LOGIN,
      username: "",
      telephone: "",
      password: "",
      errorMsg: "",
      loading: false
    };
  },
  mounted() {
    if (
      this.$route.params &&
      this.$route.params.username &&
      this.$route.params.password
    ) {
      this.username = this.$route.params.username;
      this.password = this.$route.params.password;
      this.login();
    } else if(
      this.$route.params &&
      this.$route.params.telephone &&
      this.$route.params.password
    ){
      this.loginMethod = this.$static.MOBILE_LOGIN;
      this.telephone = this.$route.params.telephone;
      this.password = this.$route.params.password;
    }
  },
  methods: {
    async login() {
      this.errorMsg = "";
      if (
        this.password.length < 6 ||
        this.password.length > 20 ||
        /^[0-9]+$/.test(this.password)
      ) {
        // this.errorMsg = '密码为6到20位的数字，字母，特殊字符组成，且不能仅为数字'
        this.errorMsg = "请输入正确的密码";
      } else if (this.loginMethod == this.$static.MOBILE_LOGIN) {
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.telephone)) {
          this.errorMsg = "请输入正确的电话号码";
        }
      } else if (this.loginMethod == this.$static.USERNAME_LOGIN) {
        if (
          /^[0-9]+$/.test(this.username) ||
          !/^[_A-Za-z0-9]+$/.test(this.username) ||
          this.username.length < 4 ||
          this.username.length > 16
        ) {
          // this.errorMsg = '用户名可由数字与大小写字母组成，且不能仅为数字，最少4位，最多16位'
          this.errorMsg = "请输入正确的用户名";
        }
      }
      if (this.errorMsg) {
        return false;
      }
      this.loading = true;
      let loginResult = await this.$api.postData("/api/guest/login", {
        loginMethod: this.loginMethod,
        username: this.username,
        telephone: this.telephone,
        password: this.password
      });
      this.loading = false;
      if (loginResult.code != 0) {
        this.errorMsg = loginResult.msg;
      } else {
        // 这里不给 vuex  token 使得路由拦截时去获取用户信息
        // this.$store.commit("setToken", loginResult.token);
        this.$storage.set('token', loginResult.token)
        this.$router.push({ name: 'contact' });
      }
    }
  },
  computed: {
    enableLogin: function() {
      return (
        this.password.length > 0 &&
        ((this.loginMethod == this.$static.MOBILE_LOGIN &&
          this.telephone.length > 0) ||
          (this.loginMethod == this.$static.USERNAME_LOGIN &&
            this.username.length > 0))
      );
    }
  }
};
</script>
<style scoped>
.sub-page {
  background-color: white;
}

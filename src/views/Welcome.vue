<template>
  <div class="welcome" :class="{hide:hide}">
    <img src="../assets/images/welcome.jpg" alt style="width:100%;height:auto;position:absolute;left:0;bottom:0;"/>
    <a href="javascript:;" @click="tryPlay()" class="weui-btn weui-btn_warn" style="position:absolute;left:60%;top:5%;width:30%;">游客</a>
    <div class="weui-flex" v-if="!$store.state.token" style="position:absolute;left:0;top:80%;width:100%">
      <div class="weui-flex__item">
          <a href="javascript:;" @click="gotoLogin()" class="weui-btn weui-btn_primary welcome-button" style="width:60%;">登录</a>
      </div>
      <div class="weui-flex__item">
          <a href="javascript:;" @click="gotoRegister()" class="weui-btn weui-btn_default welcome-button" style="width:60%;">注册</a>
      </div>
    </div>
    <div style="opacity: 1;" v-show="errorMsg">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd">
          <strong class="weui-dialog__title">游客登录失败</strong>
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
        <p class="weui-toast__content">游客登录中</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      hide: false,
      loading: false,
      errorMsg: ''
    };
  },
  mounted() {
    let agentRefCode = this.$route.query.agent_ref_code
    if(agentRefCode) {
      // 代理的推荐码
      this.$storage.set('agentRefCode', agentRefCode)
    }
    if(this.$route.path.indexOf('register')!==-1||this.$route.path.indexOf('login')!==-1){
      this.hide = true
    }
    if (this.$store.state.token) {
      setTimeout(() => {
        this.hide = true;
        this.$router.push({ name: 'contact' });
      }, 500);
    }
  },
  updated(){
    if (this.$store.state.token) {
      this.hide = true
    }
  },
  methods:{
    gotoLogin(){
      this.$router.push({name: 'login'})
    },
    gotoRegister(){
      this.$router.push({name: 'register'})
    },
    async tryPlay(){
      let agentRefCode = this.$storage.get('agentRefCode')
      if(!agentRefCode||agentRefCode=='null'||agentRefCode=='NULL'||agentRefCode==null){
        agentRefCode = ''
      }
      let tryPlayResult = await this.$api.postData("/api/guest/try_play", {
        agentRefCode: agentRefCode
      })
      if(tryPlayResult.code == 0){
        this.$storage.set('token', tryPlayResult.data.token)
        // console.log('socket id in welcome ' + this.$socket.client.id)
        this.$router.push({ name: 'contact' });
      }else{
        this.errorMsg = tryPlayResult.msg
      }
    }
  },
  computed: mapState({ username: "username", token: "token" })
};
</script>
<style>
/* 被注释掉的样式不适合部分安卓机 */
.welcome {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 6;
  background: #000b17;
  animation: welcome 0.5s;
  transition: 0.3s;
  -webkit-transition: 0.3s;
  /*    -webkit-animation: welcome 0.5s;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
    -webkit-animation-delay: 0.8s;
    animation-delay: 0.8s; */
}

.welcome img {
  width: 100%;
}
.welcome.hide {
  opacity: 0;
  visibility: hidden;
}
.welcome-button {
  width: 100%;
}
/*     
    @keyframes welcome {
        0% {
            opacity: 1.0;
            visibility: visible;
        }
        100% {
            opacity: 0.0;
            visibility: hidden;
        }
    }
    @-webkit-keyframes welcome {
        0% {
            opacity: 1.0;
            visibility: visible;
        }
        100% {
            opacity: 0.0;
            visibility: hidden;
        }
    }
    @-o-keyframes welcome {
        0% {
            opacity: 1.0;
            visibility: visible;
        }
        100% {
            opacity: 0.0;
            visibility: hidden;
        }
    }

    @-moz-keyframes welcome {
        0% {
            opacity: 1.0;
            visibility: visible;
        }
        100% {
            opacity: 0.0;
            visibility: hidden;
        }
    } */
</style>
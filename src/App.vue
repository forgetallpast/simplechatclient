<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import Vue from 'vue'
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'
export default {
  data(){
    return {
    }
  },
  sockets: {
    connect() {
      console.log('connect ' + this.$socket.client.id)
      this.$api.postData("/api/user/bind_socket", {
          socket_id: this.$socket.client.id
      });
    },
    async disconnect(){
      console.log('now disconnect!')
      this.$store.commit('setSocketId', '')
      await this.$api.postData("/api/user/bind_socket", {
          socket_id: ''
        });
    },
    ping(){
      console.log('ping')
    },
    pong(){
      console.log('pong')
    },
    customeEmit(json) {
      console.log("in chat emit " + json);
      let objMsg = JSON.parse(json);
      if (objMsg && objMsg.chatId) {
        // 增加未读消息
        this.$store.commit("pushUnreadMsg", objMsg);
      }
    }
  },
  mounted(){
    this.connectSocketIfNot()
  },
  updated(){
    this.connectSocketIfNot()
  },
  methods:{
    async connectSocketIfNot(){
      console.log('connect socket if not')
      console.log('socket= ' + process.env.VUE_APP_SOCKET)
      console.log(this.$store.state.socketId)
      console.log(this.$socket)
      console.log(this.$store.state.token)
      if((!this.$socket||!this.$socket.connected||!this.$store.state.socketId) && this.$store.state.token){
        console.log('connecting... ' + process.env.VUE_APP_SOCKET)
        const socket = io(process.env.VUE_APP_SOCKET)
        Vue.use(VueSocketIOExt, socket)
        console.log('after connected socket id ' + this.$socket.client.id)
        this.$store.commit('setSocketId', this.$socket.client.id)
        await this.$api.postData("/api/user/bind_socket", {
          socket_id: this.$socket.client.id
        });
      }
    }
  }
};
</script>
<style lang="less">
@import url("assets/pc.less");
@import url("assets/weui/weui.less");
@import url("assets/iconfont.less");
</style>

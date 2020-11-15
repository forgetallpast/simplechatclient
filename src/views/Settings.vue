<template>
  <div>
    <fixed-header leftText="我" title="设置"></fixed-header>
    <div class="sc-settings">
      <div class="weui-cells">
        <router-link :to="{name:'account_security'}" class="weui-cell weui-cell_access">
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">账号与安全</div>
          <div class="weui-cell__ft"></div>
        </router-link>
      </div>
      <div class="weui-cells">
        <div class="weui-cell" @click="logout">
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd sc-settings-logout" v-if="userType==$static.TYPE_GUEST_PLAYER">返回注册登录</div>
          <div class="weui-cell__bd sc-settings-logout" v-else>退出登录</div>
          <div class="weui-cell__ft"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FixedHeader from "../components/FixedHeader"
import { mapState } from 'vuex'
export default {
  components: {
    FixedHeader
  },
  methods:{
    logout(){
      this.$storage.del('token')
      this.$store.commit('clearToken')
      this.$store.commit('setSocketId', '')
      this.$router.push('/')
    }
  },
  computed: mapState({ userType: "userType" })
};
</script>
<style lang="less" scoped>
@import url("../assets/settings.less");
</style>


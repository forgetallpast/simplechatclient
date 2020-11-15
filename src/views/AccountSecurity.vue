<template>
  <div>
    <fixed-header leftText='设置' title='账号与安全'></fixed-header>
    <div class="body-content-without-footer">
      <div class="weui-cells">
        <div class="weui-cell">
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">微信号</div>
          <div class="weui-cell__ft">{{username}}</div>
        </div>
        <router-link :to="{name:'guest_bind'}" class="weui-cell weui-cell_access" v-if="userType==$static.TYPE_GUEST_PLAYER">
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">手机号</div>
          <div class="weui-cell__ft">去绑定手机号与密码</div>
        </router-link>
        <div class="weui-cell" v-else>
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">手机号</div>
          <div class="weui-cell__ft">{{telephone}}</div>
        </div>
      </div>
      <div class="weui-cells" v-if="userType!=$static.TYPE_GUEST_PLAYER">
        <router-link :to="{name:'change_password'}" class="weui-cell weui-cell_access">
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">微信密码</div>
          <div class="weui-cell__ft">已设置</div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import FixedHeader from '../components/FixedHeader'
import { mapState } from 'vuex'
export default {
  components:{
    FixedHeader
  },
  computed: mapState({ userId: "userId", username: "username", nickname: "nickname", header: "header",
  userType: "userType", telephone: "telephone" })
}
</script>
<style lang="less" scoped>
@import url('../assets/mixin.less');
</style>



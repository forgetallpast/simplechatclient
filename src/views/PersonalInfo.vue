<template>
  <div>
    <fixed-header leftText="我" title="个人信息"></fixed-header>
    <div class="sc-personal-info">
      <div class="weui-cells">
        <router-link :to="{name:'change_header'}" class="weui-cell weui-cell_access">
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">头像</div>
          <div class="weui-cell__ft"><img :src="header" class="sc-header"></div>
        </router-link>
        <router-link :to="{name:'change_nickname'}" class="weui-cell weui-cell_access" v-if="userType!=$static.TYPE_GUEST_PLAYER">
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">名字</div>
          <div class="weui-cell__ft">{{nickname}}</div>
        </router-link>
        <div class="weui-cell" v-else>
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">名字</div>
          <div class="weui-cell__ft">{{nickname}}</div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">微信号</div>
          <div class="weui-cell__ft">{{username}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FixedHeader from "../components/FixedHeader";
import { mapState } from 'vuex';
export default {
  components: {
    FixedHeader
  },
  computed: mapState({ userId: "userId", username: "username", nickname: "nickname", header: "header", userType: "userType" })
}
</script>
<style lang="less" scoped>
@import url("../assets/personal-info.less");
</style>
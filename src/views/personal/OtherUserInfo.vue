<template>
  <div>
    <fixed-header leftText="返回" title="用户信息"></fixed-header>
    <div class="sc-self-items" v-show="username">
      <div class="weui-cells">
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <img :src="header" class="sc-header">
          </div>
          <div class="weui-cell__bd sc-account-info">
            <div>
              {{userType==$static.TYPE_GUEST_PLAYER?'用户类型: 游客用户':''}}
              {{userType==$static.TYPE_REGISTER_PLAYER?'用户类型: 注册用户':''}}
            </div>
            <div class="sc-account-nickname">昵称: {{nickname}}</div>
            <div class="sc-account-username">微信号: {{username}}</div>
          </div>
          <div class="weui-cell__ft"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FixedHeader from '../../components/FixedHeader'
export default {
  components:{
    FixedHeader
  },
  data(){
    return {
      userType: '',
      username: '',
      nickname: '',
      header: '',
      chatId: this.$route.query.chatId
    }
  },
  async mounted(){
    let infoResult = await this.$api.postData('/api/user/other_user_info',{
      chatId: this.chatId
    })
    if(infoResult.code == 0){
      this.userType = infoResult.data.userType
      this.username = infoResult.data.username
      this.nickname = infoResult.data.nickname
      this.header = infoResult.data.header
    }
  }
}
</script>
<style lang="less" scoped>
@import url("../../assets/other-user-info.less");
</style>



<template>
  <div>
    <fixed-cancel-finish-header
      :finishMethod="this.changeNickname"
      :canFinish="canFinish"
      cancelText="取消"
      finishText="完成"
      title="设置名字"
    ></fixed-cancel-finish-header>
    <div class="body-content-without-footer">
      <div class="weui-cells weui-cells_form">
        <div class="weui-cell weui-cell_active">
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">
            <input v-model="nickname" class="weui-input" placeholder="填写本人昵称">
          </div>
          <div class="weui-cell__ft">
            <i class="weui-icon-clear" v-show="nickname" @click="nickname=''"></i>
          </div>
        </div>
      </div>
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
  </div>
</template>
<script>
import FixedCancelFinishHeader from "../../components/FixedCancelFinishHeader"
export default {
  components: {
    FixedCancelFinishHeader
  },
  data() {
    return {
      canFinish: false,
      nickname: '',
      origin: '',
      errorTitle: '',
      errorMsg: ''
    };
  },
  mounted(){
    this.origin = this.$store.state.nickname
    this.nickname = this.origin
  },
  methods: {
    changeNickname: async function(){
      let changeNicknameResult = await this.$api.postData('/api/user/change_nickname', {
        nickname: this.nickname
      })
      if(changeNicknameResult.code == 0){
        this.$store.commit('setNickname', this.nickname)
        this.$router.go(-1)
      }else{
        this.errorTitle = '设置名字失败'
        this.errorMsg = changeNicknameResult.msg
      }
    }
  },
  watch:{
    nickname: function(){
      if(this.nickname!=this.origin && this.nickname.length >= 2 && this.nickname.length <= 16){
        this.canFinish = true
      }else{
        this.canFinish = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url("../../assets/mixin.less");
</style>

<template>
  <div>
    <fixed-header title="我"></fixed-header>
    <div class="sc-self-items">
      <div class="weui-cells">
        <router-link :to="{name:'personal_info'}" class="weui-cell weui-cell_access">
          <div class="weui-cell__hd">
            <img :src="header" class="sc-header" />
          </div>
          <div class="weui-cell__bd sc-account-info">
            <div class="sc-account-nickname">{{nickname}}</div>
            <div class="sc-account-username">微信号: {{username}}</div>
          </div>
          <div class="weui-cell__ft"></div>
        </router-link>
      </div>
      <div class="weui-cells">
        <router-link :to="{name:'wechat_wallet'}" class="weui-cell weui-cell_access">
          <div class="weui-cell__hd">
            <img src="../assets/images/wechat-wallet.png" class="sc-self-icon" />
          </div>
          <div class="weui-cell__bd sc-self-title">&nbsp;&nbsp;钱包</div>
          <div class="weui-cell__ft"></div>
        </router-link>
      </div>
      <div class="weui-cells">
        <router-link :to="{name:'settings'}" class="weui-cell weui-cell_access">
          <div class="weui-cell__hd">
            <img src="../assets/images/settings.png" class="sc-self-icon" />
          </div>
          <div class="weui-cell__bd sc-self-title">&nbsp;&nbsp;设置</div>
          <div class="weui-cell__ft"></div>
        </router-link>
      </div>
    </div>
    <fixed-footer></fixed-footer>
  </div>
</template>
<script>
import FixedHeader from "../components/FixedHeader";
import FixedFooter from "../components/FixedFooter";
import { mapState } from "vuex";
export default {
  components: {
    FixedHeader,
    FixedFooter
  },
  methods: {
    async goWithdraw() {
      let withdrawInfoResult = await this.$api.postData(
        "/api/user/withdraw_info"
      );
      if (withdrawInfoResult.code == 0) {
        let hasWithdrawPassword = withdrawInfoResult.data.hasWithdrawPassword;
        if (!hasWithdrawPassword) {
          this.$router.push({
            name: "change_withdraw_password",
            params: { has_password: false }
          });
        } else {
          this.$router.push({
            name: "withdraw"
          });
          // this.bankcards = withdrawInfoResult.data.bankcards;
        }
      }
    }
  },
  computed: mapState({
    userId: "userId",
    username: "username",
    nickname: "nickname",
    header: "header",
    refCode: "refCode"
  })
};
</script>
<style lang="less" scoped>
@import url("../assets/self.less");
</style>
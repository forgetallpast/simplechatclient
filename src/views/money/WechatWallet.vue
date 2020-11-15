<template>
  <div>
    <fixed-wallet-header leftText=" " title="钱包"></fixed-wallet-header>
    <div class="sc-wechat-wallet">
      <div class="sc-wechat-wallet-icon-div">
        <img src="../../assets/images/balance.png" class="sc-wechat-wallet-icon" />
      </div>
      <div class="sc-wechat-wallet-mymoney">我的钱包</div>
      <div class="sc-wechat-wallet-money" v-if="fetched">￥ {{balance/100}}</div>
      <div class="sc-wechat-wallet-money" v-else>￥ --</div>
      <div class="sc-wechat-wallet-freeze" v-if="fetched">冻结 ￥ {{freezeBalance/100}}</div>
      <div class="sc-wechat-wallet-freeze" v-else>冻结 ￥ --</div>
      <div class="weui-btn weui-btn_primary sc-wechat-wallet-deposit" @click="goDeposit()">充值</div>
      <div class="weui-btn weui-btn_primary sc-wechat-wallet-withdraw" @click="goWithdraw()">提现</div>
      <!--<div class="weui-btn weui-btn_primary sc-wechat-bankcards" @click="goBankcards()">银行卡管理</div>-->
    </div>
  </div>
</template>
<script>
import FixedWalletHeader from "../../components/FixedWalletHeader";
export default {
  components: {
    FixedWalletHeader
  },
  data() {
    return {
      fetched: false,
      balance: 0,
      freezeBalance: 0
    };
  },
  async mounted() {
    let walletResult = await this.$api.postData("/api/user/wallet");
    if (walletResult.code == 0) {
      this.balance = walletResult.data.balance;
      this.freezeBalance = walletResult.data.freezeBalance;
      this.fetched = true;
    }
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
        }
      }
    },
    goBankcards() {
        this.$router.push({
            name: 'bankcards'
        })
    },
    goDeposit(){
      this.$router.push({
        name: 'deposit'
      })
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/wechat-wallet.less");
</style>
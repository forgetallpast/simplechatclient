<template>
  <div>
    <fixed-header leftText="我" title="钱包"></fixed-header>
    <div class="sc-wallet">
      <div class="sc-wallet-info">
        <div class="sc-wallet-div">
          <img src="../../assets/images/wallet.png" class="sc-wallet-icon">
          <div>钱包</div>
          <div v-if="fetched">{{balance/100}}元</div>
          <div v-else>--</div>
        </div>
        <div class="sc-wallet-div">
          <img src="../../assets/images/wallet.png" class="sc-wallec-icon">
          <div>暂时冻结</div>
          <div v-if="fetched">{{freezeBalance/100}}元</div>
          <div v-else>--</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FixedHeader from "../../components/FixedHeader";
export default {
  components: {
    FixedHeader
  },
  data(){
      return {
          fetched: false,
          balance: 0,
          freezeBalance: 0,
      }
  },
  async mounted(){
      let walletResult = await this.$api.postData('/api/user/wallet')
      if(walletResult.code == 0){
          this.balance = walletResult.data.balance
          this.freezeBalance = walletResult.data.freezeBalance
          this.fetched = true
      }
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/wallet.less");
</style>
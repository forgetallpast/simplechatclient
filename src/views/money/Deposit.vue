<template>
  <div>
    <fixed-wallet-header leftText=" " title="充值"></fixed-wallet-header>
    <div class="sc-deposit">
      <div class="weui-tabbar">
        <div
          :class="[fxpay=='zfbhb'?'weui-bar__item_on':'sc-item-no','weui-tabbar__item']"
          @click="fxpay='zfbhb'"
        >
          <img src="../../assets/images/dollar-sign.png" alt class="weui-tabbar__icon" />
          <p class="weui-tabbar__label">任意转卡</p>
        </div>
        <div
          :class="[fxpay=='wyzz'?'weui-bar__item_on':'sc-item-no','weui-tabbar__item']"
          @click="fxpay='wyzz'"
        >
          <img src="../../assets/images/union-pay.png" alt class="weui-tabbar__icon" />
          <p class="weui-tabbar__label">网银转账</p>
        </div>
        <!--
        <div
          :class="[fxpay=='wxsm'?'weui-bar__item_on':'sc-item-no','weui-tabbar__item']"
          @click="fxpay='wxsm'"
        >
          <img src="../../assets/images/wechat.png" alt class="weui-tabbar__icon" />
          <p class="weui-tabbar__label">微信扫码</p>
        </div>
        <div
          :class="[fxpay=='zfbsm'?'weui-bar__item_on':'sc-item-no','weui-tabbar__item']"
          @click="fxpay='zfbsm'"
        >
          <img src="../../assets/images/alipay.png" alt class="weui-tabbar__icon" />
          <p class="weui-tabbar__label">支付宝扫码</p>
        </div>
        <div
          :class="[fxpay=='wxwap'?'weui-bar__item_on':'sc-item-no','weui-tabbar__item']"
          @click="fxpay='wxwap'"
        >
          <img src="../../assets/images/wechat.png" alt class="weui-tabbar__icon" />
          <p class="weui-tabbar__label">微信wap</p>
        </div>
        <div
          :class="[fxpay=='wxgzh'?'weui-bar__item_on':'sc-item-no','weui-tabbar__item']"
          @click="fxpay='wxgzh'"
        >
          <img src="../../assets/images/wechat.png" alt class="weui-tabbar__icon" />
          <p class="weui-tabbar__label">微信公众号</p>
        </div>
        <div
          :class="[fxpay=='zfbhb'?'weui-bar__item_on':'sc-item-no','weui-tabbar__item']"
          @click="fxpay='zfbhb'"
        >
          <img src="../../assets/images/alipay.png" alt class="weui-tabbar__icon" />
          <p class="weui-tabbar__label">支付宝红包</p>
        </div>
        -->
      </div>
      <div class="weui-cells weui-cells_form">
        <div class="weui-cell weui-cell_active" id="js_cell">
          <div class="weui-cell__hd">
            <label class="weui-label">充值金额</label>
          </div>
          <div class="weui-cell__bd weui-flex">
            <input
              min="300"
              class="weui-input"
              autofocus
              type="number"
              pattern="[0-9]*"
              placeholder="请输入金额"
              v-model="amount"
            />
            <button class="weui-btn_reset weui-btn_icon weui-btn_input-clear" @click="amount=0">
              <i class="weui-icon-clear"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="weui-cells weui-cells_radio">
        <label
          class="weui-cell weui-cell_active weui-check__label"
          for="x11"
          v-for="(myAmount,index) in amountOptions"
          :key="index"
          @click="amount=myAmount"
        >
          <div class="weui-cell__bd">
            <p>{{myAmount}}元</p>
          </div>
          <div class="weui-cell__ft">
            <input
              type="radio"
              class="weui-check"
              :value="myAmount"
              :checked="myAmount==amount?'checked':''"
            />
            <span class="weui-icon-checked"></span>
          </div>
        </label>
      </div>
      <div class="weui-btn weui-btn_primary sc-deposit-pay" @click="deposit()">充值</div>
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
    <div v-show="loading">
        <div class="weui-mask"></div>
        <div class="weui-toast">
            <i class="weui-loading weui-icon_toast"></i>
            <p class="weui-toast__content">支付请求中</p>
        </div>
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
      fxpay: "zfbhb",
      amountOptions: [300, 500, 1000, 2000, 5000, 10000],
      amount: 5000,
      errorTitle: '',
      errorMsg: '',
      loading: false
    };
  },
  methods:{
      async deposit(){
          if(this.amount <= 0){
              this.errorTitle = '无法发起支付'
              this.errorMsg = '充值金额不对'
          }
          this.loading = true
          let depositUrlResult = await this.$api.postData('/api/user/get_deposit_url',{
              fxpay: this.fxpay,
              amount: parseInt(this.amount*100)
          })
          if(depositUrlResult.code == 0){
              window.location.href = depositUrlResult.data.payurl
          }else{
              this.loading = false
              this.errorTitle = '无法发起支付'
              this.errorMsg = depositUrlResult.msg
          }
      }
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/deposit.less");
</style>
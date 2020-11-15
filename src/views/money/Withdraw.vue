<template>
  <div>
    <fixed-header leftText="我" title="申请提款"></fixed-header>
    <div class="sc-withdraw">
      <div class="weui-cells">
        <div class="weui-cell weui-cell_active">
          <div class="weui-cell__hd" style="width: 30%;">当前可提余额</div>
          <div class="weui-cell__bd" style="display:flex;justify-content:center;">
            {{balance=='--'?'--':balance/100}} 元
          </div>
          <div class="weui-cell__ft">
          </div>
        </div>
        <div class="weui-cell weui-cell_active">
          <div class="weui-cell__hd" style="width: 30%;">提现金额</div>
          <div class="weui-cell__bd">
            <input type="number" v-model="amount" class="weui-input" placeholder="请填写金额">
          </div>
          <div class="weui-cell__ft">
            <i class="weui-icon-clear" v-show="amount" @click="amount=''"></i>
          </div>
        </div>
      </div>
      <div class="weui-cells__group weui-cells__group_form">
        <div class="weui-cells__title">
          提现到
        </div>
        <div class="weui-cells weui-cells_radio">
          <div class="weui-cell weui-cell_active weui-check__label"
          v-for="(item,index) in bankcards" :key="index" @click="bankcardId=item.id">
            <div class="weui-cell__bd">{{item.accountNumber}}({{item.bankName}})</div>
            <div class="weui-cell__ft">
              <input type="radio" class="weui-check" name="bankcard" :value="item.id" v-model="bankcardId">
              <span class="weui-icon-checked"></span>
            </div>
          </div>
          <div @click="addBankcard()" class="weui-cell weui-cell_active weui-cell_link">
            <div class="weui-cell__bd">添加银行卡</div>
          </div>
        </div>
      </div>
      <div class="sc-confirm-button">
        <div @click="confirmWithdraw()" class="weui-btn weui-btn_primary" href="javascript:" id="showTooltips">确认申请</div>
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
    <div style="opacity: 1;" v-show="loading">
      <div class="weui-mask"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">正在提交</p>
      </div>
    </div>

    <div style="opacity: 1;" v-show="applySuccess">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd">
          <strong class="weui-dialog__title">申请成功</strong>
        </div>
        <div class="weui-dialog__bd">审核通过后，款项会打到您指定的银行卡</div>
        <div class="weui-dialog__ft">
          <a
            href="javascript:;"
            class="weui-dialog__btn weui-dialog__btn_primary"
            @click="$router.go(-1)"
          >确定</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FixedHeader from "../../components/FixedHeader";
export default {
  components:{
    FixedHeader
  },
  data(){
    return {
      amount: 0,
      bankcards: [],
      balance: '--',
      bankcardId: 0,
      errorMsg: '',
      errorTitle: '',
      applySuccess: false,
      loading: false
    }
  },
  async mounted(){
    let withdrawInfoResult = await this.$api.postData('/api/user/withdraw_info')
    if(withdrawInfoResult.code == 0){
      let hasWithdrawPassword = withdrawInfoResult.data.hasWithdrawPassword
      if(!hasWithdrawPassword){
        this.$router.push({name: 'change_withdraw_password', params:{has_password:false}})
      }else{
        this.bankcards = withdrawInfoResult.data.bankcards
        if(this.bankcards.length>0){
          this.bankcardId = this.bankcards[0].id
        }
        this.balance = withdrawInfoResult.data.balance
      }
    }
  },
  methods:{
    addBankcard(){
      this.$router.push({name:'add_bankcard'})
    },
    async confirmWithdraw(){
      if(this.amount <= 0) {
        this.errorTitle = '错误提示'
        this.errorMsg = '提现金额必须大于0'
      }else if(this.amount*100>this.balance){
        this.errorTitle = '错误提示'
        this.errorMsg = '提现金额超过余额'
      }else if(!this.bankcardId){
        this.errorTitle = '错误提示'
        this.errorMsg = '请选择银行卡或者添加出款银行卡'
      }else{
        this.loading = true
        let applyRequest = await this.$api.postData('/api/user/apply_withdraw',{
          bankcardId: this.bankcardId,
          amount: this.amount
        })
        this.loading = false
        if(applyRequest.code == 0){
          this.applySuccess = true
        }else{
          this.errorTitle = '错误提示'
          this.errorMsg = applyRequest.msg
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../../assets/withdraw.less');
</style>



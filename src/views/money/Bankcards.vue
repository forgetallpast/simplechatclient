<template>
  <div>
    <fixed-header leftText="返回" title="银行卡管理"></fixed-header>
    <div class="sc-withdraw">
      <div class="weui-cells__group weui-cells__group_form">
        <div class="weui-cells__title"></div>
        <div class="weui-cells weui-cells_radio">
          <div
            class="weui-cell weui-cell_active weui-check__label"
            v-for="(item,index) in bankcards"
            :key="index"
            @click="bankcardId=item.id"
          >
            <div class="weui-cell__bd">{{item.accountNumber}}({{item.bankName}})</div>
            <div class="weui-cell__ft">
              <input
                type="radio"
                class="weui-check"
                name="bankcard"
                :value="item.id"
                v-model="bankcardId"
              />
              <span class="weui-icon-close" @click="confirmDeleteCard(bankcardId)"></span>
            </div>
          </div>
          <div @click="addBankcard()" class="weui-cell weui-cell_active weui-cell_link">
            <div class="weui-cell__bd">添加银行卡</div>
          </div>
        </div>
      </div>
      <!--
      <div class="sc-confirm-button">
        <div @click="confirmWithdraw()" class="weui-btn weui-btn_warn" href="javascript:" id="showTooltips">确认删除</div>
      </div>
      -->
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
    <div style="opacity: 1;" v-show="showDeleteConfirm">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd">
          <strong class="weui-dialog__title">确认删除</strong>
        </div>
        <div class="weui-dialog__bd">确定要删除这张银行卡({{deleteCardInfo}})吗？</div>
        <div class="weui-dialog__ft">
          <a href="javascript:" class="weui-dialog__btn weui-dialog__btn_default" @click="showDeleteConfirm=false">取消</a>
          <a href="javascript:" class="weui-dialog__btn weui-dialog__btn_primary" @click="deleteBankcard(bankcardId)">确认</a>
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
  data() {
    return {
      bankcards: [],
      bankcardId: 0,
      errorMsg: "",
      errorTitle: "",
      showDeleteConfirm: false,
      deleteCardInfo: ''
    };
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
      getBankInfoById(cardId){
          for(let index in this.bankcards){
              let item = this.bankcards[index]
              if(cardId == item.id){
                  return item.accountNumber + ' ' + item.bankName
              }
          }
          return ''
      },
    addBankcard() {
      this.$router.push({ name: "add_bankcard" });
    },
    async confirmDeleteCard(bankcardId){
        this.bankcardId = bankcardId
        this.deleteCardInfo = this.getBankInfoById(this.bankcardId)
        this.showDeleteConfirm = true
    },
    async deleteBankcard(bankcardId) {
        this.showDeleteConfirm = false
      let deleteCardResult = await this.$api.postData(
        "/api/user/delete_bankcard",
        {
          bankcardId: bankcardId
        }
      );
      if(deleteCardResult.code == 0){
          await this.fetchData()
      } else {
          this.errorTitle = '删除失败'
          this.errorMsg = deleteCardResult.msg
      }
    },
    async fetchData() {
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
          this.bankcards = withdrawInfoResult.data.bankcards;
          if (this.bankcards.length > 0) {
            this.bankcardId = this.bankcards[0].id;
          }
          this.balance = withdrawInfoResult.data.balance;
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/withdraw.less");
</style>



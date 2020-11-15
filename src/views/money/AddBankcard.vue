<template>
  <div>
    <fixed-header leftText="返回" title="添加银行卡"></fixed-header>
    <div v-show="showBanks">
      <div class="weui-mask" id="iosMask" style="opacity: 1;"></div>
      <div class="weui-actionsheet weui-actionsheet_toggle" id="iosActionsheet">
        <div class="weui-actionsheet__title">
          <p class="weui-actionsheet__title-text">选择银行</p>
        </div>
        <div class="weui-actionsheet__menu">
          <div
            class="weui-actionsheet__cell"
            v-for="(name,code) in banks"
            :key="code"
            @click="bankCode=code;showBanks=false"
          >{{name}}</div>
        </div>
        <div class="weui-actionsheet__action" @click="showBanks=false">
          <div class="weui-actionsheet__cell">取消</div>
        </div>
      </div>
    </div>
    <div class="weui-form">
      <div class="weui-form__control-area">
        <div class="weui-cells__group weui-cells__group_form">
          <div class="weui-cells__title">添加银行卡</div>
          <div class="weui-cells weui-cells_form">
            <div class="weui-cell weui-cell_active">
              <div class="weui-cell__hd">
                <label class="weui-label">持卡人姓名</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" placeholder="填写本人持卡人真实姓名" v-model="realName">
              </div>
            </div>
            <div class="weui-cell weui-cell_active">
              <div class="weui-cell__hd">
                <label class="weui-label">卡号</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" placeholder="请填写卡号" v-model="accountNumber">
              </div>
            </div>
            <div
              class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-after"
            >
              <div class="weui-cell__hd">
                <label class="weui-label">开户银行</label>
              </div>
              <div class="weui-cell__bd" @click="showBanks=true">{{banks[bankCode]}}</div>
            </div>
            <div class="weui-cell weui-cell_active">
              <div class="weui-cell__hd">
                <label class="weui-label">开户城市</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" placeholder="请填写开户城市" v-model="city">
              </div>
            </div>
            <div class="weui-cell weui-cell_active">
              <div class="weui-cell__hd">
                <label class="weui-label">支行名称</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" placeholder="请填写支行名称" v-model="branchName">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="weui-form__tips-area">
        <div class="weui-form__tips">请如实填写银行卡信息，避免提款不到账</div>
      </div>
      <div class="weui-form__opr-area">
        <div @click="addBankcard()" class="weui-btn weui-btn_primary">确定</div>
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
import FixedHeader from "../../components/FixedHeader";
export default {
  components: {
    FixedHeader
  },
  data() {
    return {
      showBanks: false,
      banks: {
        icbc: "中国工商银行",
        abc: "中国农业银行",
        boc: "中国银行",
        ccb: "中国建设银行",
        bcm: "中国交通银行"
      },
      realName: "",
      accountNumber: "",
      bankCode: "icbc",
      city: "",
      branchName: "",
      errorMsg: "",
      errorTitle: ""
    };
  },
  methods: {
    async addBankcard() {
      if (
        this.realName.length < 0 ||
        this.accountNumber.length < 0 ||
        this.bankCode.length < 0 ||
        this.city.length < 0 ||
        this.branchName.length < 0
      ) {
        this.errorTitle = "错误提示"
        this.errorMsg = "请填写全部数据"
      } else {
        let addResult = await this.$api.postData("/api/user/add_bankcard", {
          realName: this.realName,
          accountNumber: this.accountNumber,
          bankCode:this.bankCode,
          city: this.city,
          branchName: this.branchName
        });
        if(addResult.code == 0){
          this.$router.go(-1)
        }else{
          this.errorTitle = "错误提示"
          this.errorMsg = addResult.msg
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/add-bankcard.less");
</style>



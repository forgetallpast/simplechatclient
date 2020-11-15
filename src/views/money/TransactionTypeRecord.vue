<template>
  <div>
    <fixed-header leftText="返回" :title="typeText"></fixed-header>
    <div class="sc-transaction-record">
      <div class="weui-cells" style="margin-top:0;">
        <div class="weui-cell" v-for="(item,index) in dataList" :key="index">
          <div class="weui-cell__hd"></div>
          <div class="weui-cell__bd">
            <div class="sc-transaction-type">{{item.strType}}</div>
            <div class="sc-transaction-second-line">{{item.time}}</div>
          </div>
          <div class="weui-cell__ft">
            <div class="sc-add-money" v-if="item.amount>0">{{'+' + (item.amount/100).toFixed(2)}}</div>
            <div class="sc-sub-money" v-else>{{(item.amount/100).toFixed(2)}}</div>
            <div class="sc-transaction-second-line">余额 {{(item.balance/100).toFixed(2)}}</div>
          </div>
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
      type: this.$route.query.type,
      typeText: this.$route.query.typeText,
      dataList: [],
      offset: 0,
      limit: 10
    };
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      let transactionResult = await this.$api.postData(
        "/api/user/transaction_type_list",
        {
          offset: this.offset,
          limit: this.limit,
          type: this.type
        }
      );
      if (transactionResult.code == 0) {
        // let newDataList = this.dataList.concat(transactionResult.data)
        transactionResult.data.forEach((item)=>this.dataList.push(item))
        this.offset+=this.limit
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/transaction-record.less");
</style>



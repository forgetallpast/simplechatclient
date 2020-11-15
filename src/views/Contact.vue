<template>
  <div>
    <fixed-header title="通讯录"></fixed-header>
    <div class="body-content">
      <div class="weui-cells" style="margin-top:0;margin-bottom:8px;">
        <router-link
          :key="index"
          :to="{path:'/dialogue',query:{chatId:item.id, category: item.category, fromPage:'通讯录', chatName: item.nickname}}"
          class="weui-cell weui-cell_access"
          v-for="(item,index) in contacts"
          tag="div"
        >
          <div class="weui-cell__hd">
            <img :src="item.header" class="contact-header" />
          </div>
          <div class="weui-cell__bd sc-contact-nickname">{{item.nickname}}</div>
        </router-link>
      </div>
    </div>
    <fixed-footer></fixed-footer>
  </div>
</template>
<script>
import FixedHeader from "../components/FixedHeader";
import FixedFooter from "../components/FixedFooter";
export default {
  components: {
    FixedHeader,
    FixedFooter
  },
  async mounted() {
    await this.fetchData();
  },
  async updated() {
    // await this.fetchData();
  },
  methods: {
    async fetchData() {
      let contactsResult = await this.$api.postData("/api/user/contacts");
      if (contactsResult.code == 0) {
        this.$store.commit("setContacts", contactsResult.data);
        console.log(this.contacts);
      }
    }
  },
  computed: {
    contacts() {
      return this.$store.state.contacts;
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../assets/mixin.less");
.contact-header {
  width: 32px;
  height: 32px;
  display: block;
}
.sc-contact-nickname {
  margin-left: 10px;
}
</style>
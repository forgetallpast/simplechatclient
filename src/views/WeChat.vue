<template>
  <div>
    <fixed-wechat-header v-if="refCode" title="微信" rightText="+" :rightMethod="this.goCreateGroup"></fixed-wechat-header>
    <fixed-wechat-header v-else title="微信"></fixed-wechat-header>
    <div class="body-content">
      <div class="weui-cells sc-msg-list">
        <router-link
          tag="div"
          :to="{path:'/dialogue',query:{chatId:chat.id, category: chat.category, fromPage:'微信', chatName: chat.nickname}}"
          class="weui-cell sc-msg-list-item"
          v-for="(chat,index) in unreadMsg"
          :key="index"
        >
          <div class="weui-cell__hd sc-msg-header">
            <img :src="chat.header" class="sc-msg-profile">
            <span
              class="weui-badge sc-unread-count"
              v-show="chat.unreadCount>0"
            >{{chat.unreadCount}}</span>
          </div>
          <div class="weui-cell__bd sc-msg-body">
            <div class="weui-msg__desc sc-msg-name">{{chat.nickname}}</div>
            <div class="weui-msg__extra-area sc-msg-last">
              <template v-if="chat.lastMessageId==0">
                <br>
              </template>
              <template
                v-else-if="chat.category==$static.CATEGORY_PRIVATE"
              >{{chat.lastMessageType==$static.TYPE_TEXT?chat.lastMessageInfo:getMessageTypeText(chat.lastMessageType)}}</template>
              <template
                v-else
              >{{chat.unreadCount>0?'['+chat.unreadCount+'条] ':''}}{{chat.lastMessageSenderNickname+':'}}{{chat.lastMessageType==$static.TYPE_TEXT?chat.lastMessageInfo:getMessageTypeText(chat.lastMessageType)}}</template>
            </div>
          </div>
          <div class="weui-cell__ft">
            <div class="sc-msg-extra">{{chat.lastMessageTime}}</div>
            <div class="sc-msg-extra">
              <br>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <fixed-footer></fixed-footer>
  </div>
</template>
<script>
import FixedWechatHeader from "../components/FixedWechatHeader";
import FixedFooter from "../components/FixedFooter";
import { mapState } from "vuex";
export default {
  components: {
    FixedWechatHeader,
    FixedFooter
  },
  data() {
    return {};
  },
  async mounted() {
    await this.fetchData();
  },
  async updated() {
    // await this.fetchData();
    console.log("updated");
  },
  sockets: {
    customeEmit(json) {
      console.log("in chat emit " + json);
      let objMsg = JSON.parse(json);
      if (objMsg && objMsg.chatId) {
        // 增加未读消息
        this.$store.commit("pushUnreadMsg", objMsg);
      }
    }
  },
  methods: {
    async fetchData() {
      let lastMessageResult = await this.$api.postData(
        "/api/user/last_message",
        {}
      );
      if (lastMessageResult.code == 0) {
        this.$store.commit("setUnreadMsg", lastMessageResult.data);
      }
    },
    getMessageTypeText(messageType) {
      if (messageType == this.$static.TYPE_IMG) {
        return "[图片]";
      }
    },
    goCreateGroup() {
      this.$router.push({ name: "create_group" });
    }
  },
  computed: mapState({
    unreadMsg: "unreadMsg",
    refCode: "refCode"
  })
};
</script>
<style lang="less" scoped>
@import url("../assets/mixin.less");
.sc-msg-list {
  margin-top: 0;
  margin-bottom: 8px;
}
.sc-unread-count {
  position: absolute;
  top: -0.4em;
  right: -0.4em;
}
.sc-msg-header {
  position: relative;
}
.sc-msg-profile {
  border-radius: 5px;
  width: 48px;
  height: 48px;
  display: block;
}
.sc-msg-body {
  margin-left: 10px;
}
.sc-msg-name {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 14px;
  .ellipsisLn(1);
}
.sc-msg-last {
  margin-top: 0;
  margin-bottom: 0;
  .ellipsisLn(1);
}
.sc-msg-list-item {
  padding: 8px;
}
.sc-msg-extra {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 0;
  margin-bottom: 0;
  .ellipsisLn(1);
}
</style>
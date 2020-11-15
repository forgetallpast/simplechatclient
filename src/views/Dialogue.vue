<template>
  <div>
    <fixed-group-header v-if="category==$static.CATEGORY_PRIVATE&&userType==$static.TYPE_CUSTOMER_SERVICE" :leftText="fromPage" :title="chatName" :groupInfo="this.otherUserInfo"></fixed-group-header>
    <fixed-header v-else-if="groupOwnerId!=userId" :leftText="fromPage" :title="chatName"></fixed-header>
    <fixed-group-header v-else :leftText="fromPage" :title="chatName" :groupInfo="this.groupInfo"></fixed-group-header>
    <div
      :class="[disableTalk?'sc-disable-talk-fix-list-height':showMore? 'sc-fix-list-height' : 'sc-msg-list-height', 'sc-msg-list']"
      ref="chatMsgList"
      @click="showMore=false"
      @scroll="showMore=false"
    >
      <div
        v-for="(msgItem,index) in msgInfo"
        :key="index"
        :class="[msgItem.senderId==userId?'sc-msg-right':'sc-msg-left','sc-clear-fix']"
      >
        <img :src="msgItem.senderHeader" class="sc-header">
        <div class="sc-info-wrap">
          <span
            class="sc-nickname"
            v-if="category==$static.CATEGORY_GROUP"
          >{{msgItem.senderNickname}}</span>
          <span class="sc-info" v-if="msgItem.messageType==$static.TYPE_TEXT">{{msgItem.info}}</span>
          <span class="sc-info-image" v-else-if="msgItem.messageType==$static.TYPE_IMG">
            <img :src="msgItem.info" class="sc-image-img">
          </span>
        </div>
      </div>
    </div>
    <div class="sc-dialogue-footer">
      <div class="sc-input-line" v-show="!disableTalk">
        <div class="sc-msg-input-div">
          <input
            rows="1"
            v-model="message"
            @keyup.enter="sendMessage"
            class="sc-msg-input"
            ref="messageInput"
            @focus="showMore=false"
          >
        </div>
        <div class="sc-msg-more-div" @click="onMoreButton">
          <i class="iconfont icon-dialogue-jia sc-msg-more"></i>
        </div>
      </div>
      <div class="sc-more-input" v-show="showMore">
        <div class="sc-more-item" v-show="!disableTalk">
          <div>
            <img src="../assets/images/photo.png" class="sc-more-item-photo">
          </div>
          <div class="sc-more-text">照片</div>
          <input
            id="imageInput"
            class="sc-more-input"
            type="file"
            accept="image/*"
            ref="imageInput"
            @change="inputImage()"
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FixedHeader from "../components/FixedHeader";
import FixedGroupHeader from "../components/FixedGroupHeader"; // 群主专用的
import { mapState } from "vuex";
export default {
  components: {
    FixedHeader,
    FixedGroupHeader
  },
  data() {
    return {
      fromPage: this.$route.query.fromPage,
      chatId: this.$route.query.chatId,
      chatName: this.$route.query.chatName,
      category: this.$route.query.category,
      msgInfo: [],
      lastMessageId: 0,
      message: "",
      showMore: false,
      showRedInfo: false,
      redPackageMsg: null,
      hasSplitPackageLeft: false,
      afterGrab: false,
      grabErrorMsg: "",
      grabMoney: 0,
      groupOwnerId: 0,
      groupId: 0,
      groupType: 0,
      bulletin: '',
      memberCount: 0,
      disableTalk: false
    };
  },
  async mounted() {
    if(this.category == this.$static.CATEGORY_GROUP){
      let groupResult = await this.$api.postData('/api/user/chat_group_info',{
        chat_id: this.chatId
      })
      if(groupResult.code == 0){
        this.groupId = groupResult.data.groupId
        this.groupOwnerId = groupResult.data.ownerId
        this.bulletin = groupResult.data.bulletin
        this.groupType = groupResult.data.groupType
        this.disableTalk = !!parseInt(groupResult.data.disableTalk)
      }
      // 群主永不禁言
      if(this.userId == this.groupOwnerId){
        this.disableTalk = false
      }
    }
    this.$store.commit("enterChatId", this.chatId);
    this.$store.commit("clearUnreadMsgCount", this.chatId);
    await this.fetchData();
    await this.clearUnreadMsgCount();
    setTimeout(() => {
      this.$refs.chatMsgList.scrollTop =
        this.$refs.chatMsgList.scrollHeight -
        this.$refs.chatMsgList.clientHeight;
    }, 100);
  },
  async updated() {
    //this.$store.commit("enterChatId", this.chatId);
    //this.$store.commit("clearUnreadMsgCount", this.chatId)
    //await this.clearUnreadMsgCount()
  },
  async beforeRouteLeave(to, from, next) {
    this.$store.commit("clearUnreadMsgCount", this.chatId);
    this.$store.commit("leaveChatId");
    await this.clearUnreadMsgCount();
    next();
  },
  sockets: {
    customeEmit(json) {
      let objMsg = JSON.parse(json);
      console.log('compare chat id')
      console.log(objMsg.chatId)
      console.log(this.chatId)
      if (objMsg && objMsg.chatId && objMsg.chatId == this.chatId) {
        this.msgInfo.push({
          senderId: objMsg.senderId,
          senderHeader: objMsg.senderHeader,
          senderNickname: objMsg.senderNickname,
          info: objMsg.info,
          messageType: objMsg.messageType,
          sendTime: objMsg.sendTime,
          id: objMsg.id
        });
        this.$nextTick(() => {
          this.$refs.chatMsgList.scrollTop =
            this.$refs.chatMsgList.scrollHeight -
            this.$refs.chatMsgList.clientHeight;
        });
        setTimeout(() => {
          this.$refs.chatMsgList.scrollTop =
            this.$refs.chatMsgList.scrollHeight -
            this.$refs.chatMsgList.clientHeight;
        }, 100);
      }
      console.log("in chat emit " + json);
    }
  },
  methods: {
    async fetchData() {
      let historyMessageResult = await this.$api.postData(
        "/api/user/message_history",
        { chatId: this.chatId, minMessageId: this.lastMessageId }
      );
      if (historyMessageResult.code == 0) {
        let newMessageData = historyMessageResult.data;
        let nowMsgInfo = this.msgInfo;
        nowMsgInfo = nowMsgInfo.concat(newMessageData);
        if (nowMsgInfo.length > 0) {
          this.lastMessageId = nowMsgInfo[nowMsgInfo.length - 1].id;
        }
        this.msgInfo = nowMsgInfo;
        console.log(this.msgInfo);
      }
    },
    async clearUnreadMsgCount() {
      await this.$api.postData("/api/user/clear_unread_count", {
        chatId: this.chatId
      });
    },
    async sendMessage() {
      if (this.message.length <= 0) {
        // 不发空白消息
        return;
      }
      let sendMessageResult = await this.$api.postData(
        "/api/user/send_message",
        { chatId: this.chatId, info: this.message }
      );
      if (sendMessageResult.code == 0) {
        // 返回当前发送的消息
        // this.msgInfo.push(sendMessageResult.data);
      }
      this.message = "";
      this.$nextTick(() => {
        this.$refs.chatMsgList.scrollTop =
          this.$refs.chatMsgList.scrollHeight -
          this.$refs.chatMsgList.clientHeight;
      });
    },
    async inputImage() {
      this.showMore = false;
      let formData = new FormData();
      formData.append("chatId", this.chatId);
      formData.append("image", this.$refs.imageInput.files[0]);
      formData.append("token", this.$store.state.token);
      let sendImageResult = await this.$api.postData(
        "/api/user/send_image",
        formData,
        {
          method: "post",
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      console.log(sendImageResult);
      if (sendImageResult.code == 0) {
        // this.msgInfo.push(sendImageResult.data);
      }
      this.$nextTick(() => {
        console.log(this.$refs.chatMsgList.scrollHeight);
        console.log(this.$refs.chatMsgList.clientHeight);
        // this.$refs.chatMsgList.scrollIntoView()
        this.$refs.chatMsgList.scrollTop =
          this.$refs.chatMsgList.scrollHeight -
          this.$refs.chatMsgList.clientHeight;
      });
      setTimeout(() => {
        this.$refs.chatMsgList.scrollTop =
          this.$refs.chatMsgList.scrollHeight -
          this.$refs.chatMsgList.clientHeight;
      }, 100);
    },
    onMoreButton() {
      if (!this.showMore) {
        this.showMore = true;
      } else {
        this.$refs.messageInput.focus();
      }
    },
    sendPersonalPackage() {},
    clearRedInfo() {
      this.showRedInfo = false;
      this.afterGrab = false;
      this.grabMoney = 0;
      this.grabErrorMsg = "";
    },
    groupInfo(){
      // 群主专用的群信息设置
      this.$router.push({name: 'group_info', query: {
        groupId: this.groupId,
        bulletin: this.bulletin,
        groupOwnerId: this.groupOwnerId,
        groupType: this.groupType,
        chatId: this.chatId
      }})
    },
    otherUserInfo(){
      // 与我对话的用户的个人信息
      this.$router.push({
        name: 'other_user_info', query: {
          chatId: this.chatId 
        }
      })
    }
  },
  computed: mapState({ userId: "userId", userType: "userType" })
};
</script>
<style lang="less" scoped>
@import url("../assets/dialogue.less");
</style>
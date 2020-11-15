<template>
  <div>
    <fixed-header leftText="返回" title="群信息"></fixed-header>
    <div class="sc-group-info">
      <div class="weui-cells">
        <div class="weui-cell" style="flex-wrap: wrap;">
          <div class="sc-member" v-for="(item,index) in allMembers" :key="index">
            <img :src="item.header" class="sc-member-header" />
            <span class="sc-member-nickname">{{item.nickname}}</span>
          </div>
          <div class="sc-member">
            <div class="sc-member-header">
              <div class="sc-add-group-member" @click="goAddGroupMember()"></div>
            </div>
            <span class="sc-member-nickname">
              <br />
            </span>
          </div>
        </div>
      </div>
      <div class="weui-cells">
        <div class="weui-cell weui-cell_active weui-cell_switch">
          <div class="weui-cell__bd">禁言</div>
          <div class="weui-cell__ft">
            <input
              class="weui-switch"
              type="checkbox"
              :checked="disableTalk"
              @click="toggleDisableTalk()"
            />
          </div>
        </div>
      </div>
      <div class="weui-cells__title">群公告(加群自动私发)</div>
      <div class="weui-cells">
        <div class="weui-cell">
          <div class="weui-cell__bd">
            <textarea class="weui-textarea" v-model="bulletin"></textarea>
          </div>
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-btn weui-btn_primary" @click="changeBulletin()">更改公告</div>
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
      bulletin: this.$route.query.bulletin,
      groupId: this.$route.query.groupId,
      chatId: this.$route.query.chatId,
      allMembers: [],
      disableTalk: true,
      groupOwnerId: 0,
      groupType: 0
    };
  },
  async mounted() {
    let groupResult = await this.$api.postData("/api/user/chat_group_info", {
      chat_id: this.chatId
    });
    if (groupResult.code == 0) {
      this.groupId = groupResult.data.groupId;
      this.groupOwnerId = groupResult.data.ownerId;
      this.bulletin = groupResult.data.bulletin;
      this.groupType = groupResult.data.groupType;
      this.disableTalk = !!parseInt(groupResult.data.disableTalk);
    }
    console.log(this.disableTalk);
    let membersResult = await this.$api.postData("/api/user/group_members", {
      groupId: this.groupId
    });
    if (membersResult.code == 0) {
      this.allMembers = membersResult.data;
    }
  },
  methods: {
    goAddGroupMember() {
      this.$router.push({
        name: "add_group_member",
        query: { groupId: this.groupId }
      });
    },
    async changeBulletin() {
      let bulletinResult = await this.$api.postData(
        "/api/user/change_bulletin",
        {
          groupId: this.groupId,
          bulletin: this.bulletin,
          chatId: this.chatId
        }
      );
      if (bulletinResult.code == 0) {
        this.$router.go(-1);
      }
    },
    async toggleDisableTalk() {
      this.disableTalk = !this.disableTalk;
      let toggleTalkResult = await this.$api.postData(
        "/api/user/toggle_disable_talk",
        {
          groupId: this.groupId,
          disableTalk: this.disableTalk,
          chatId: this.chatId
        }
      );
      if (toggleTalkResult.code == 0) {
        this.$router.go(-1);
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/group-info.less");
</style>



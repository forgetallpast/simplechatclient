<template>
  <div>
    <fixed-cancel-finish-header
      cancelText="取消"
      title="增加群成员"
      finishText="完成"
      :finishMethod="this.addMembers"
      :canFinish="addUsers.length>0"
    ></fixed-cancel-finish-header>
    <div class="body-content-without-footer">
      <div class="weui-cells weui-cells_checkbox">
        <label class="weui-cell weui-check_label" v-for="(item,index) in allUsers" :key="index">
          <div class="weui-cell__hd">
            <input type="checkbox" class="weui-check" @click="toggle(item.id)">
            <i class="weui-icon-checked"></i>
          </div>
          <div class="weui-cell__bd">{{item.nickname}}</div>
        </label>
      </div>
    </div>
  </div>
</template>
<script>
import FixedCancelFinishHeader from "../../components/FixedCancelFinishHeader";
export default {
  components: {
    FixedCancelFinishHeader
  },
  data() {
    return {
      groupId: this.$route.query.groupId,
      allUsers: [],
      addUsers: []
    };
  },
  async mounted() {
    console.log(this.groupId)
    let usersResult = await this.$api.postData("/api/user/users_can_add", {
      groupId: this.groupId
    });
    if (usersResult.code == 0) {
      this.allUsers = usersResult.data;
    }
  },
  methods: {
    toggle(id){
      let index = this.addUsers.indexOf(id)
      if(index==-1){
        this.addUsers.push(id)
      }else{
        this.addUsers.splice(index,1)
      }
    },
    async addMembers() {
      let addResult = await this.$api.postData('/api/user/add_group_members',{
        groupId: this.groupId,
        userIds: this.addUsers
      })
      if(addResult.code == 0){
        this.$router.go(-1)
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/mixin.less");
</style>



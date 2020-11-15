<template>
  <div class>
    <fixed-header leftText="个人信息" title="点击头像更改"></fixed-header>
    <div class="sc-change-header">
      <div class="weui-gallery sc-gallery" v-show="header">
        <img :src="header" class="sc-header">
        <input
          id="uploaderInput"
          class="weui-uploader__input"
          type="file"
          accept="image/*"
          ref="myProfile"
          @change="changeProfile()"
        >
      </div>
    </div>
    <div style="opacity: 1;" v-show="loading">
      <div class="weui-mask"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">更新中</p>
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
      header: "",
      profileUrl: "",
      loading: false
    };
  },
  mounted() {
    this.header = this.$store.state.header;
  },
  methods:{
    async changeProfile() {
      this.loading = true
      console.log(this.$refs.myProfile.files);
      const files = this.$refs.myProfile.files;
      const file = files[0];
      this.profileUrl = URL.createObjectURL(file);
      let formData = new FormData();
      formData.append("header", this.$refs.myProfile.files[0])
      formData.append("token", this.$store.state.token)
      let changeHeaderResult = await this.$api.postData(
        "/api/user/change_header",
        formData,
        {
          method: "post",
          headers: { "Content-Type": "multipart/form-data" }
        }
      )
      if(changeHeaderResult.code == 0){
        this.$store.commit('setHeader', changeHeaderResult.data.header)
        this.loading = false
        this.$router.go(-1)
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/change-header.less");
</style>



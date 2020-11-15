<template>
  <div class="weui-tabbar sc-fixed-footer" style="position:absolute;">
    <router-link
      :to="{name: 'wechat', params: {sc_direction: 5}}"
      href="javascript:;"
      class="weui-tabbar__item"
      active-class="weui-bar__item_on"
    >
      <i class="weui-tabbar__icon iconfont icon-wechat"></i>
      <p class="weui-tabbar__label">聊天</p>
    </router-link>
    <router-link
      :to="{name: 'contact', params: {sc_direction: 5}}"
      href="javascript:;"
      class="weui-tabbar__item"
      active-class="weui-bar__item_on"
    >
      <i class="weui-tabbar__icon iconfont icon-contact"></i>
      <p class="weui-tabbar__label">通讯录</p>
    </router-link>
    <router-link
      :to="{name: 'find', params: {sc_direction: 5}}"
      href="javascript:;"
      class="weui-tabbar__item"
      active-class="weui-bar__item_on"
    >
      <i class="weui-tabbar__icon iconfont icon-find"></i>
      <p class="weui-tabbar__label">发现</p>
    </router-link>
    <router-link
      :to="{name: 'self', params: {sc_direction: 5}}"
      href="javascript:;"
      class="weui-tabbar__item"
      active-class="weui-bar__item_on"
    >
      <i class="weui-tabbar__icon iconfont icon-me"></i>
      <p class="weui-tabbar__label">我</p>
    </router-link>
  </div>
</template>
<style lang="less" scoped>
.sc-fixed-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #f9f9f9;
  .router_link_active {
    color: @weuiColorPrimary;
  }
}
.weui-tabbar__icon {
  color: @weuiColorPrimary;
}
</style>
<template>
    <div class="sc-fixed-wallet-header weui-flex">
        <div class="weui-flex__item">
            <span class="sc-left-item" v-if="leftText" @click="$router.go(-1)">
            <i class="iconfont icon-return-arrow sc-return-arrow"></i>
            <span class="sc-return-text">{{leftText}}</span>
            </span>
            </div>
        <div class="weui-flex__item sc-center-item"><span>{{title}}</span></div>
        <div class="weui-flex__item"><span class="sc-right-item">{{rightText}}</span></div>
    </div>
</template>
<script>
export default {
    props:[
        'leftText',
        'title',
        'rightText'
    ]
}
</script>
<style lang="less" scoped>
@import url("../assets/fixed-wallet-header.less");
</style>
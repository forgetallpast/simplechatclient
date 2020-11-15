<template>
    <div class="sc-fixed-header weui-flex">
        <div class="weui-flex__item">
            <span class="sc-left-item" v-if="leftText" @click="$router.go(-1)">
            <i class="iconfont icon-return-arrow sc-return-arrow"></i>
            <span class="sc-return-text">{{leftText}}</span>
            </span>
            </div>
        <div class="weui-flex__item sc-center-item"><span>{{title}}</span></div>
        <div class="weui-flex__item"><span class="sc-right-item" style="font-size:1.5rem;" @click="rightMethod()">{{rightText}}</span></div>
    </div>
</template>
<script>
export default {
    props:{
        'leftText': {type: String},
        'title': {type: String},
        'rightText': {type: String},
        'rightMethod': {type: Function}
    }
}
</script>
<style lang="less" scoped>
@import url("../assets/fixed-header.less");
</style>
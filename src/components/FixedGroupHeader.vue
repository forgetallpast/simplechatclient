<template>
    <div class="sc-fixed-header weui-flex">
        <div style="width:20%;">
            <span class="sc-left-item" v-if="leftText" @click="$router.go(-1)">
            <i class="iconfont icon-return-arrow sc-return-arrow"></i>
            <span class="sc-return-text">{{leftText}}</span>
            </span>
            </div>
        <div class="sc-center-item" style="margin-left:5%;margin-right:5%;width:50%;white-space: nowrap;text-overflow:ellipsis;overflow:hidden;"><span>{{title}}</span></div>
        <div style="width:20%;" @click="groupInfo()"><span class="sc-right-item"><i class="iconfont icon-contact" style="font-size:1.5rem;"></i></span></div>
    </div>
</template>
<script>
export default {
    props:{
        'leftText': {type: String},
        'title': {type: String},
        'rightText': {type: String},
        'groupInfo': {type: Function}
    }
}
</script>
<style lang="less" scoped>
@import url("../assets/fixed-header.less");
</style>
<template>
    <div class="sc-fixed-header weui-flex">
        <div class="weui-flex__item">
            <span class="sc-left-item" v-if="cancelText" @click="$router.go(-1)">
              <span class="sc-return-text">{{cancelText}}</span>
            </span>
        </div>
        <div class="weui-flex__item sc-center-item"><span>{{title}}</span></div>
        <div class="weui-flex__item">
          <span v-if="finishText" @click="finishMethod()" :class="['sc-right-item',canFinish?'sc-right-finish':'sc-right-process']">{{finishText}}</span>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        cancelText: {type: String},
        title: {type: String},
        finishText: {type: String},
        canFinish: {type: Boolean},
        finishMethod: { type: Function }
    }
}
</script>
<style lang="less" scoped>
@import url("../assets/fixed-cancel-finish-header.less");
</style>
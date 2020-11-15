<template>
  <div style="opacity: 1;" v-show="errorMsg">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd">
          <strong class="weui-dialog__title">{{errorTitle}}</strong>
        </div>
        <div class="weui-dialog__bd">{{errorMsg}}</div>
        <div class="weui-dialog__ft">
          <a
            href="javascript:;"
            class="weui-dialog__btn weui-dialog__btn_primary"
            @click="$emit('close-error-msg')"
          >确定</a>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  props:[
    'errorTitle',
    'errorMsg'
  ]
}
</script>


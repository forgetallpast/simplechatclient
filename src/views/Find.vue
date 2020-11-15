<template>
    <div>
        <fixed-header leftText="返回" title="发现"></fixed-header>
        <div class="sc-find">
            <div class="sc-find-header">
                <img class="sc-big-header" :src="header">
                <span class="sc-nickname">{{nickname}}</span>
                <img class="sc-small-header" :src="header">
            </div>
            <div class="sc-find-list">
                <div class="weui-cell sc-moment-list" v-for="(item,index) in promos" :key="index">
                    <div class="weui-cell__hd"><img class="sc-moment-header" :src="item.header"></div>
                    <div class="weui-cell__bd">
                        <div class="sc-moment-nickname">{{item.nickname}}</div>
                        <div class="sc-find-promo" v-html="item.html"></div>
                    </div>
                    <div class="weui-cell__ft"></div>
                </div>
            </div>
        </div>
        <!--<fixed-footer></fixed-footer>-->
    </div>
</template>
<script>
import FixedHeader from '../components/FixedHeader'
// import FixedFooter from '../components/FixedFooter'
import { mapState } from 'vuex'
export default {
    components: {
        FixedHeader,
        // FixedFooter
    },
    data(){
        return {
            promos: []
        }
    },
    async mounted(){
        let promoListResult = await this.$api.postData('/api/user/promo_list')
        if(promoListResult.code == 0){
            this.promos = promoListResult.data
        }
    },
    computed: mapState({header: "header", nickname: "nickname"})
}
</script>
<style lang="less" scoped>
@import url("../assets/find.less");
</style>
<style scoped>
div >>> img{
    max-width: 100%;
    height: auto;
}
</style>

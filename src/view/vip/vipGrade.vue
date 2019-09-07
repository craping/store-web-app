<!--
 会员等级页面
 -->
<template>
    <div class="vip-grade-page">
        <van-nav-bar title="会员等级" left-arrow @click-left="onClickLeft" />
        <div class="">
         钻石会员等级
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { NavBar, Icon ,Field} from 'vant';
import { format } from '@/utils/util'
import storeScroller from "@/components/store-scroller";

Vue.use(Field).use(NavBar).use(Icon);
export default {
    data(){
        return {
            loading: false,
            finished: false
        }
    },
    components: {
        storeScroller
    },
    methods:{
        
        
    }
}
</script>
<style lang="scss" scoped>

</style>
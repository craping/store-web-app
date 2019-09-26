<!--
 提现页面
 -->
<template>
    <div class="withdraw-log-page">
        <van-nav-bar title="提现记录" left-arrow @click-left="onClickLeft" />
        <store-scroller class="scoll-s" @onRefresh="onRefresh" @onInfinite="onLoad" @onScroll="onScroll">
            <div class="log-list">
                <div class="log-item" v-for="i in 5">
                    <div class="col-left">
                        <div class="row-1">提现金额</div>
                        <div class="row-2"><span>￥</span>0.01</div>
                        <div class="row-3">{{formatTime(1567174961013)}}</div>
                    </div>
                    <div class="col-right">
                        <!-- <span >审核未通过</span> -->
                        <span class="success">审核通过</span>
                        <!-- <van-icon name="arrow" color="#999"/> -->
                    </div>
                </div>
            </div>
        </store-scroller>
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
        onClickLeft() {
            this.$router.go(-1)
        },   
       
        jumpLink(path) {
            this.$router.push(path)
        },
        formatTime(time){
            return format(time,'yyyy-MM-dd hh:mm:ss')
        },
        onRefresh(done) {
            setTimeout(()=>{
                if (done) 
                done();
            },300)
        },
        onScroll(top) {
        },
        onLoad(done) {
            if (done) done(true);
            this.loading = false;
            this.finished = true;
        }   
        
    }
}
</script>
<style lang="scss" scoped>
    .withdraw-log-page{
        /deep/.scroll{
            padding-top: 46px;
        }
        /deep/.store-scroller .scroll ._v-content{
            padding: 0;
        }
        .log-list{
            .log-item{
                height: 80px;
                background: #FFF;
                padding: 8px;
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
                align-items: center;
                .col-left{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                    flex-shrink: 0;
                    .row-1,.row-3{
                        font-size: 10px;
                        color: #999;
                    }
                    .row-2{
                        font-weight: bold;
                        font-size: 16px;
                        span{
                            font-size: 10px;
                        }
                    }
                }
                .col-right{
                    color: #999;
                    display: flex;
                    align-items: center;
                    >span{
                        margin-right: 4px;
                    }
                    .success{
                        color: #5cbb7a;
                    }
                }
            }
        }
        
    }
</style>
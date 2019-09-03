<!--
 银行卡列表
 -->
<template>
    <div class="bankcard-page">
        <van-nav-bar title="选择银行卡" left-arrow @click-left="onClickLeft" fixed>
            <van-icon name="plus" slot="right" @click="jumpLink('/addBankCard')" />
        </van-nav-bar>
        <div class="banl-list">
            <div class="bank-bar" v-for="i in 5" @click="select()">
                <div class="col-left">
                    <img class="bank-icon" src="">
                    <div class="col-mid">
                        <div class="title">招商银行</div>
                        <div class="info">尾号1223 快捷</div>
                    </div>
                </div>
                <div>
                    <van-icon name="success" color="#409EFF"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { NavBar, Field ,Icon} from 'vant';
Vue.use(Field).use(Icon).use(NavBar);
export default {
    data(){
        return {
            name: this.$route.query.name,
        }
    },
    methods:{
        onClickLeft() {
            this.$router.go(-1)
        },  

        jumpLink(path) {
            this.$router.push(path)
        },

    }
}
</script>
<style lang="scss" scoped>
    .bankcard-page{
        .banl-list{
            padding-top: 46px;
            margin-top: 15px;
        }
        .bank-bar{
            height: 60px;
            background: #FFF;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            border-bottom: 1px solid rgba($color: #000000, $alpha: 0.08);
            .col-left{
                display: flex;
            }
            .bank-icon{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #EEE;
                margin-right: 15px;
            }
            .col-mid{
                display: flex;
                flex-direction: column;
                justify-content: center;
                .title{
                    color: #333;
                    font-size: 16px;
                }
                .info{
                    font-size: 14px;
                    color: #999;
                }
            }
        }
    }
</style>
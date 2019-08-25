<template>
  <div class="account-login">
        <van-nav-bar  left-arrow @click-left="onClickLeft" />
        <div class="login-body">
            <p class="title">账号登录</p>
            <p>账号</p>
            <van-cell-group >
                <van-field v-model="userName" />
            </van-cell-group>
            <p>密码</p>
            <van-cell-group>
                <van-field v-model="password" type="password"/>
            </van-cell-group>
             <div class="login-btn" @click="login">
                登录
            </div>
        </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { NavBar, Icon, Field ,CellGroup } from 'vant';
Vue.use(Field).use(CellGroup).use(Icon).use(NavBar);
export default {
    data(){
        return {
            userName: '',
            password: ''
        }
    },
    methods:{
        onClickLeft() {
            this.$router.go(-1)
        },   
        login() {
            
        }
    }
}
</script>
<style lang="scss" scoped>
    .account-login{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #FFF;
        .login-body{
            margin-top: 40px;
            padding: 0 15px;
            .title{
                font-size: 20px;
                margin-bottom: 40px;
            }
            /deep/ .van-hairline--top-bottom::after{
                border-top: 0;
            }
        }
        .login-btn{
            background: $red;
            height: 40px;
            line-height: 40px;
            width: 80%;
            border-radius: 6px;
            margin: 40px auto 0;
            color: #FFF;
            font-size: 16px;
            text-align: center;
        }
    }
</style>
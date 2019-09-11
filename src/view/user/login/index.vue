<template>
    <div class="login-page">
        <van-nav-bar title="" :border="false" class="right-tips">
            <template slot="right" >
                <span @click="toHome">跳过，看好货</span>
                <van-icon  name="arrow" color="#ccc" />  
            </template>
        </van-nav-bar>
        <div class="login-body">
            <div class="welcome-word">
                欢迎来到5G云购 <br>
                请您登录/注册
            </div>
            <div class="field-group">
                 <van-cell-group >
                    <van-field  v-model="phone" type="tel"  placeholder="请输入手机号码"/>
                    <van-field v-model="code"  placeholder="请输入验证码" />
                    <div class="code-operate" @click="getCode">
                        <span :class="{gray:countDownSecond >= 0}">{{codeText}}</span>
                    </div>
                </van-cell-group>
            </div>
            <div class="login-btn" @click="login">
                登录
            </div>
            <div class="else-way">
                <p>其他登录方式</p>
                <div class="way-group">
                    <div class="way-item">
                        <img src="./img/wechat.png" alt="">
                        <p>微信</p>
                    </div>
                     <div class="way-item" @click="toAccountLogin">
                        <img src="./img/usericon.png" alt="">
                        <p>账号</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { NavBar, Icon } from 'vant';
import { CellGroup, Field , Toast} from 'vant';
Vue.use(CellGroup).use(Field).use(Icon).use(NavBar);
export default {
    data(){
        return {
            phone: '',
            code: '',
            codeText: '获取验证码',
            countDownSecond: -1,
            codeTimer: null,

        }
    },
    destroyed() {
        this.clearTimeCount(this.codeTimer);
    },
    methods:{
        onClickLeft() {
            this.$router.go(-1)
        },   
        jumpLink(path) {
            this.$router.push(path)
        },
        toHome() {
            this.$router.push('/main/home')
        },
        login() {

        },  
        toAccountLogin() {
            this.$router.push('/accountLogin')
        },
        getCode() {
            if(this.countDownSecond > 0){ 
                return;
            }
            if(this.phone == ""){
                Toast("请输入手机号码");
                return;
            }
            this.timeCountDown()

            if(this.isValidate()) { //手机号输入正确，才能获取验证码
                this.timeCountDown()
            }
        },  
        /**
         * 验证码倒计时方法
         */
        timeCountDown(){
            this.codeText = "重新获取(60s)";
            var timer = 60000;
            this.countDownSecond = timer / 1000;
            this.getCodeReq(); //获取验证码
            this.codeTimer = setInterval(()=> {
                timer -= 1000;
                if (timer <= 0) {
                clearInterval(this.codeTimer);
                this.codeText = "重新获取";
                this.countDownSecond = -1;
                } else {
                this.countDownSecond = timer / 1000;
                this.codeText = "重新获取(" + this.countDownSecond + "s)";
                }
            }, 1000);
        },
        /**
         * 清除倒计时相关数据
         */
        clearTimeCount(){
            clearInterval(this.codeTimer);
            this.codeText = "重新获取";
            this.countDownSecond = -1;
        },
        /**
         * 获取验证码接口
         */
        getCodeReq() {

        },
        /**
         * 判断输入手机号
         */
        isValidate(){
            let flag = true;
            if(!new RegExp("^1[0-9]{10}$").test(this.phone)){
                flag = false;
                Toast("请填写正确的手机号码");
            }
            return flag;
        },
    }
}
</script>
<style lang="scss" scoped>
    .login-page{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #FFF;
        .right-tips{
            color: #ccc;
        }
        .login-body{
            padding: 0 20px;
            .welcome-word{
                font-size: 30px;
                margin-top: 80px;
            }
            /deep/ .field-group{
                position: relative;
                margin-top: 40px;
            }
            .code-operate{
                position: absolute;
                right: 15px;
                bottom: 14px;
                color: $red;
                .gray{
                    color: #CCC;
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
            .else-way{
                position: absolute;
                bottom: 80px;
                >p{
                    color: #ccc;
                }
                .way-group{
                    display: flex;
                    .way-item{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        margin: 10px;
                        img{
                            width: 32px;
                            height: 32px;
                        }
                    }
                }

            }
        }
    }
</style>
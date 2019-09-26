<template>
    <div class="account-page">
        <van-nav-bar title="账户安全" left-arrow @click-left="onClickLeft" />
        <van-cell title="微信绑定" is-link value="未绑定" />
        <van-cell title="修改手机号" is-link value="修改" @click="jumpLink('editCheck',{mode:'mobile'})"/>
        <van-cell title="修改密码" is-link value="修改" @click="jumpLink('editCheck',{mode:'password'})"/>
    </div>
</template>
<script>
import Vue from 'vue';
import { NavBar, Cell, CellGroup, ActionSheet, Popup, DatetimePicker } from 'vant';
Vue.use(Cell).use(CellGroup).use(ActionSheet).use(Popup).use(DatetimePicker).use(NavBar);
export default {
    data(){
        return {
            userInfo:{
                headImg: '...',
                name: '哈哈是',
                birth: '2019-08-24',
                sex: '男'
            },
            dateSelectshow: false,
            sexSelectshow: false,
            sexactions: [
                { name: '男' },
                { name: '女' },
            ],
            currentDate: new Date()
        }
    },
    methods:{
        onClickLeft() {
            this.$router.go(-1)
        },   
            jumpLink(path, query) {
      this.$router.push({ path, query });
    },
        selectSex(item) {
             this.sexSelectshow = false;
        },
        selectDate(date) {
             this.dateSelectshow = false;
        },
        setName(name) {
            this.$router.push({ path:'/nameSet', query:{name}})
        }
    }
}
</script>
<style lang="scss" scoped>
    .account-page{
        .van-cell{
            align-items: center;
        }
        .head-img{
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: #EEE;
        }
    }   
</style>
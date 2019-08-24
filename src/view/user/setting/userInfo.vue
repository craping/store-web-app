<template>
    <div class="userInfo-page">
        <van-nav-bar title="个人资料" left-arrow @click-left="onClickLeft" />
        <van-cell title="个人头像">
            <template slot="right-icon">
                <img class="head-img" :src="userInfo.headImg" >
                <i data-v-a857212a="" class="van-icon van-icon-arrow van-cell__right-icon"></i>
            </template>
        </van-cell>
        <van-cell title="昵称" is-link :value="userInfo.name" @click="setName(userInfo.name)" />
        <van-cell title="生日" is-link :value="userInfo.birth" @click="dateSelectshow = true" />
        <van-cell title="性别" is-link :value="userInfo.sex" @click="sexSelectshow = true" />
        <van-action-sheet
            v-model="sexSelectshow"
            :actions="sexactions"
            @select="selectSex"
        />
        <van-popup
        v-model="dateSelectshow"
        position="bottom"
        :style="{ height: '30%' }">
            <van-datetime-picker
            v-model="currentDate"
            type="date"
            @confirm="selectDate"
            @cancel="dateSelectshow=false"
            />
        </van-popup>
    </div>
</template>
<script>
import Vue from 'vue';
import { NavBar, Cell, CellGroup, ActionSheet, Popup, DatetimePicker } from 'vant';
Vue.use(Cell).use(CellGroup);
Vue.use(ActionSheet).use(Popup).use(DatetimePicker);
Vue.use(NavBar);
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
        jumpLink(path) {
            this.$router.push(path)
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
    .userInfo-page{
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
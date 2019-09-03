<template>
    <div class="setting-page">
        <van-nav-bar title="设置" left-arrow @click-left="onClickLeft" />
        <van-cell title="个人资料" is-link @click="jumpLink('/userInfo')" />
        <van-cell title="关于我们" is-link @click="jumpLink('/about')" />
        <van-cell title="当前版本" value="1.0" />
        <div class="btn" @click="logout">退出登录</div>
    </div>
</template>
<script>
import Vue from 'vue';
import { NavBar, Cell, CellGroup } from 'vant';
Vue.use(Cell).use(CellGroup).use(NavBar);
export default {
    data(){
        return {

        }
    },
    methods:{
        onClickLeft() {
            this.$router.go(-1)
        },   
        jumpLink(path) {
            this.$router.push(path)
        },
        logout() {
            this.$router.push('/login')
        }
    }
}
</script>
<style lang="scss" scoped>
    .setting-page{
        .btn{
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: $red;
            background: #FFF;
            margin-top: 20px;
        }
    }
</style>
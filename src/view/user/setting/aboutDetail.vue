<template>
    <div class="about-detail">
        <van-nav-bar :title="title" left-arrow fixed @click-left="onClickLeft" />
        <div class="content">
            sdsdjal
            sadasd
            sdsd
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { NavBar, Cell, CellGroup } from 'vant';
Vue.use(Cell).use(CellGroup).use(NavBar);
export default {
    data(){
        return {
            title: this.$route.query.title
        }
    },
    methods:{
        onClickLeft() {
            this.$router.go(-1)
        },   
        jumpLink(path) {
            this.$router.push(path)
        }
    }
}
</script>
<style lang="scss" scoped>
    .about-detail{
        .content{
            padding-top: 66px;
        }
    }
</style>
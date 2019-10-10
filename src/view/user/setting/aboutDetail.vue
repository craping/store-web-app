<template>
    <div class="about-detail">
        <van-nav-bar :title="title" left-arrow fixed @click-left="onClickLeft" />
        <div class="content" v-if="title='用户服务协议书'" v-html="config.ABOUT_TERMS "></div>
        <div class="content" v-else v-html="config.ABOUT_PRIVACY "> </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { NavBar, Cell, CellGroup } from 'vant';
import { mapState } from 'vuex';
Vue.use(Cell).use(CellGroup).use(NavBar);
export default {
    data(){
        return {
            title: this.$route.query.title
        }
    },
    computed:{
        ...mapState('sys',{
            config: state => state.config,
        })
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
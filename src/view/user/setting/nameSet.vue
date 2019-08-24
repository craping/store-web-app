<template>
    <div class="setting-page">
        <van-nav-bar title="昵称" left-arrow right-text="保存" @click-left="onClickLeft" >
            <span v-show="name.trim()" class="btn" slot="right" @click-right="onClickRight">保存</span>
        </van-nav-bar>
        <van-cell-group>
            <van-field v-model="name" clearable placeholder="请输入昵称" />
        </van-cell-group>
    </div>
</template>
<script>
import Vue from 'vue';
import { NavBar, Field } from 'vant';
Vue.use(Field);
Vue.use(NavBar);
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
        onClickRight() {
            
        }, 
        jumpLink(path) {
            this.$router.push(path)
        },
        logout() {
            
        }
    }
}
</script>
<style lang="scss" scoped>
    .setting-page{
        .btn{
            color: #409EFF;
        }
    }
</style>
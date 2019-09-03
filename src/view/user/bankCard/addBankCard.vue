<!--
 添加银行卡
 -->
<template>
    <div>
        <van-nav-bar title="添加银行卡" left-arrow @click-left="onClickLeft" />
    </div>
</template>
<script>
import Vue from 'vue';
import { NavBar, Icon ,Field} from 'vant';
Vue.use(Field).use(NavBar).use(Icon);
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
        
    }
}
</script>
<style lang="scss" scoped>

</style>
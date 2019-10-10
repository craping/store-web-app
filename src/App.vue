<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import sync from "@/utils/sync";
import service from "@/utils/service";
import { mapActions } from 'vuex';

export default {
  data() {
    return {};
  },
  created() {
    // 初始化APP配置信息
    this.getSysConfig().then(data => {
      console.log(data.info)
    });
    // 初始化获取用户信息
    this.getUserInfo().then(data => {
      sync.connect();
      service.init(data.info);
    }).catch(error => {
      console.log(error)
    });
    
    this.getCartList()
  },
  mounted() {
    
  },
  methods: {
    ...mapActions('cart',['getCartList']),
    ...mapActions('sys',['getSysConfig']),
    ...mapActions('user',['getUserInfo'])
  }
};
</script>
<style lang="scss" src="./assets/scss/global.scss" />

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import sync from "@/utils/sync";
import service from "@/utils/service";
import { mapActions } from 'vuex';
import { getClientId } from '@/utils/util'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {};
  },
  created() {
    // 初始化APP配置信息
    this.getSysConfig();
    // 初始化获取用户信息
    this.getUserInfo().then(data => {
      sync.connect();
      service.init(data.info);
    }).catch(error => {
      console.log(error)
      if(getClientId() == 3 && !getToken()){
          //微信中
          const appid = 'wx455d4595caac679c'
          const returnUrl = encodeURIComponent(location.href)
          const redirect_uri =  encodeURIComponent(`http://m.5gyungou.com/wx.html?returnUrl=${returnUrl}`) 
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&connect_redirect=1#wechat_redirect`
        }
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

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
      this.getCartList()
    }).catch(error => {
      console.log(error)
      if(getClientId() == 3 && !getToken()){
          //微信中
          const appid = 'wx455d4595caac679c'
          const redirect_uri =  encodeURIComponent(`http://m.5gyungou.com/wx.html?returnUrl=${location.href}`) 
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&connect_redirect=1#wechat_redirect`
        }
    });
  },
  mounted() {
    let me = this;
    this.onPlusReady(() => {
      var first = null;  
      var webview = plus.webview.currentWebview();  
      plus.key.addEventListener('backbutton', function() {  
          webview.canBack(function(e) {  
              if (e.canBack && !me.$route.path.includes("/main/") && me.$route.path != "/") {  
                  webview.back(); //这里不建议修改自己跳转的路径  
              } else {  
                  //首次按键，提示‘再按一次退出应用’  
                  if (!first) {  
                      first = new Date().getTime(); //获取第一次点击的时间戳  
                      // console.log('再按一次退出应用');//用自定义toast提示最好  
                      // toast('双击返回键退出应用'); //调用自己写的吐丝提示 函数  
                      plus.nativeUI.toast("再按一次退出应用", {  
                          duration: 'short'  
                      }); //通过H5+ API 调用Android 上的toast 提示框  
                      setTimeout(function() {  
                          first = null;  
                      }, 1000);  
                  } else {  
                      if (new Date().getTime() - first < 1000) { //获取第二次点击的时间戳, 两次之差 小于 1000ms 说明1s点击了两次,  
                          plus.runtime.quit(); //退出应用  
                      }  
                  }  
              }  
          })  
      });
    });
  },
  methods: {
    ...mapActions('cart',['getCartList']),
    ...mapActions('sys',['getSysConfig']),
    ...mapActions('user',['getUserInfo'])
  }
};
</script>
<style lang="scss" src="./assets/scss/global.scss" />

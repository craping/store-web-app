<template>
  <div class="login-page">
    <van-nav-bar title :border="false" class="right-tips">
      <template slot="right">
        <span @click="jumpLink('/main/home')">跳过，看好货</span>
        <van-icon name="arrow" color="#ccc" />
      </template>
    </van-nav-bar>
    <div class="login-body">
      <div class="welcome-word">
        欢迎来到5G云购
        <br />请您登录/注册
      </div>
      <div class="main-btn" @click="jumpLink('register')">去注册</div>
      <div class="login-way">
        <div class="way-item" @click="jumpLink('mobileLogin')">
          <img src="./img/mobile.png" alt />
          <span>手机登录</span>
        </div>
        <div class="way-item" v-if="clientId == 1" @click="wechatLogin">
          <img src="./img/wechat.png" alt />
          <span>微信登录</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Icon } from "vant";
import { setToken } from "@/utils/auth";
import { CellGroup, Field, Toast } from "vant";
import { mapState, mapActions } from 'vuex';
Vue.use(CellGroup)
  .use(Field)
  .use(Icon)
  .use(NavBar);
export default {
  data() {
    return {};
  },
  mounted() {
    this.onPlusReady(() => {
	  plus.navigator.setStatusBarStyle('dark')
      this.initWeChatService();
    });
  },
  computed: {
    ...mapState('user',{
      beforePath: state => state.beforePath
    }),
    ...mapState('sys',{
      clientId: state => state.clientId
    })
  },
  methods: {
    ...mapActions('user',['getUserInfo']),
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path) {
      this.$router.push(path);
    },
    initWeChatService() {
      if (window.aweixin) return;
      // 微信授权登录对象
      // 获取登录授权认证服务列表，单独保存微信登录授权对象
      // 5+APP在plusready事件中调用，uni-app在vue页面的onLoad中调用
      plus.oauth.getServices(
        function(services) {
          // alert('list+:'+JSON.stringify(services));
          window.aweixin = services[0];
          // alert('weService+:'+JSON.stringify(window.aweixin));
        },
        function(e) {
          Toast("获取登录授权服务列表失败：" + JSON.stringify(e));
        }
      );
    },
    wechatLogin() {
      if (window.aweixin) {
        if (!window.aweixin.authResult) {
          window.aweixin.authorize(
            e => {
              this.$http
                .post("/wx/Login", { code: e.code })
                .then(res => {
                  console.log("e.code+:" + e.code); //app端获取到的code
                  console.log(JSON.stringify(res))
                  console.log('token+:'+res.info.token)
                  setToken(res.info.token);
                  this.getUserInfo()
                  // this.$store.commit('user/SET_USERINFO',res.info)
                  this.$router.push(this.beforePath)
                })
                .catch(error => {
                  if (error.code= -1){
                    this.$router.push("/bindAgentNo");
                  } else {
                    Toast(error.message);
                  }
                });
            },
            function(e) {
              Toast("微信授权失败" + JSON.stringify(e));
            }
          );
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.login-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  .right-tips {
    color: #ccc;
  }
  .login-body {
    padding: 0 20px;
    .welcome-word {
      font-size: 30px;
      margin-top: 80px;
    }
    .main-btn {
      margin: 100px auto 60px;
      // width: 86%;
      height: 40px;
      color: #fff;
      background: $red;
      border-radius: 20px;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
    }
    .login-way {
      display: flex;
      justify-content: space-between;
      .way-item {
        display: flex;
        align-items: center;
        width: 40%;
        background: #eee;
        height: 30px;
        border-radius: 15px;
        padding: 0 20px;
        img {
          width: 24px;
          height: 24px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
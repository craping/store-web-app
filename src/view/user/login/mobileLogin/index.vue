<template>
  <div class="register-login">
    <van-nav-bar left-arrow @click-left="onClickLeft" :border="false" />
    <div class="login-body">
      <van-field
        v-model="mobile"
        clearable
        type="tel"
        label="手机号"
        placeholder="请输入手机号码"
        left-icon="phone"
      />
      <van-field
        v-model="password"
        clearable
        label="密码"
        placeholder="请输入密码"
        left-icon="lock"
        :type="isEyeClose ? 'password' : 'text'"
        :right-icon="isEyeClose ? 'closed-eye' : 'eye-o'"
        @click-right-icon="changeShow"
      />
      <div class="bottom-btn-wrapper">
        <div @click="jumpLink('forgetPass')">忘记密码</div>
        <div @click="jumpLink('inputMobile')">短信验证码登录</div>
      </div>
      <div class="main-btn" @click="login">登录</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { setToken } from "@/utils/auth";
import md5 from "js-md5";
import { NavBar, CellGroup, Field, Toast } from "vant";
import { mapState, mapActions } from 'vuex';
import { getClient } from '@/utils/util'

Vue.use(Field)
  .use(CellGroup)
  .use(Toast)
  .use(NavBar);
export default {
  data() {
    return {
      mobile: "",
      password: "",
      isEyeClose: true
    };
  },
  mounted() {
	this.onPlusReady(() => {
		plus.navigator.setStatusBarStyle('dark')
	})
  },
  computed: {
    ...mapState('user',{
      beforePath: state => state.beforePath,
    })
  },
  methods: {
    ...mapActions('user',['getUserInfo']),
    onClickLeft() {
      this.$router.go(-1);
    },
    login() {
      const params = {
        mobile: this.mobile,
        password: md5(this.password),
        clientId: getClient()
      };
      this.$http
        .post("/login/passwrodLogin", params)
        .then(res => {
          setToken(res.info.token);
          this.getUserInfo()
          this.$router.push(this.beforePath);
        })
        .catch(error => {
          Toast(error.message);
        });
    },
    jumpLink(path) {
      this.$router.push(path);
    },
    changeShow() {
      this.isEyeClose = !this.isEyeClose;
    }
  }
};
</script>
<style lang="scss" scoped>
.register-login {
  .van-cell::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 0;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
  }
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  .login-body {
    margin-top: 100px;
    padding: 0 15px;
    .title {
      font-size: 20px;
      margin-bottom: 40px;
    }
    /deep/ .van-hairline--top-bottom::after {
      border-top: 0;
    }
    /deep/ .field-group {
      position: relative;
      margin-top: 40px;
    }
    .bottom-btn-wrapper {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      color: $red;
      padding:0 15px;
    }
  }
  .main-btn {
    margin: 40px auto;
    width: 86%;
    height: 40px;
    color: #fff;
    background: $red;
    border-radius: 20px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
  }
  .mt-10 {
    margin-top: 10px;
  }
}
</style>
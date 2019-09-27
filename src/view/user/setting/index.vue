<template>
  <div class="setting-page">
    <van-nav-bar title="设置" left-arrow @click-left="onClickLeft" />
    <van-cell title="个人资料" is-link @click="jumpLink('userInfo')" />
    <van-cell title="账户安全" is-link @click="jumpLink('account')" />
    <van-cell title="银行卡" is-link @click="jumpLink('bankCard')" />
    <van-cell title="关于我们" is-link @click="jumpLink('about')" />
    <van-cell title="当前版本" value="1.0" />
    <div class="btn" @click="logout">退出登录</div>
  </div>
</template>
<script>
import Vue from "vue";
import { removeToken } from '@/utils/auth'

import { NavBar, Cell, CellGroup, Toast } from "vant";
Vue.use(Cell)
	.use(CellGroup)
  .use(Toast)
  .use(NavBar);
export default {
  data() {
    return {};
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path) {
      this.$router.push(path);
    },
    logout() {
      this.$http
        .post("/login/loginOut", {})
        .then(res => {
          removeToken() 
          if(window.aweixin){
					  window.aweixin.authResult = null // 清空微信登录的认证
          }
      		this.$router.push("/login");
        })
        .catch(error => {
          Toast(error.message);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-page {
  .btn {
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: $red;
    background: #fff;
    margin-top: 20px;
  }
}
</style>
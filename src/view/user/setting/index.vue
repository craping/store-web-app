<template>
  <div class="setting-page">
    <van-nav-bar title="设置" left-arrow @click-left="onClickLeft" />
    <van-cell title="个人资料" is-link @click="jumpLink('userInfo')" />
    <van-cell title="账户安全" is-link @click="jumpLink('account')" />
    <van-cell title="银行卡" is-link @click="jumpLink('bankCard')" />
    <van-cell title="关于我们" is-link @click="jumpLink('about')" />
    <van-cell title="当前版本" :value="config.ABOUT_VERSION" />
    <div class="btn" @click="logout">退出登录</div>
  </div>
</template>
<script>
import Vue from "vue";
import { removeToken } from '@/utils/auth'
import { NavBar, Cell, CellGroup, Toast } from "vant";
import { mapState } from 'vuex';
import { getClient } from '@/utils/util'
Vue.use(Cell)
	.use(CellGroup)
  .use(Toast)
  .use(NavBar);
export default {
  data() {
    return {};
  },
  computed:{
    ...mapState('sys',{
      config: state => state.config,
    })
  },
  mounted() {
	this.onPlusReady(() => {
		plus.navigator.setStatusBarStyle('dark');
	})
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path) {
      this.$router.push(path);
    },
    logout() {
      let params = {
        clientId: getClient()
      }
      this.$http
        .post("/login/loginOut", params)
        .then(res => {
          removeToken() 
          this.$store.commit('user/SET_LOGOUT')
          this.$router.push("/login");
          this.$store.commit("user/SET_BEFOREPATH", '/main/home');
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
<template>
  <div class="about-page">
    <van-nav-bar title="关于我们" left-arrow @click-left="onClickLeft" />
    <div class="top-view">
      <div class="logo">
        <img width="100%" height="100%" src="@assets/images/logo.png" alt />
      </div>
      <div class="appName">5G云购</div>
      <div class="version">V1.0</div>
    </div>
    <van-cell title="用户服务协议书" is-link @click="jumpLink('用户服务协议书')" />
    <van-cell title="隐私政策" is-link @click="jumpLink('隐私政策')" />
    <div class="bottom-bar">
      <div>Copyright@2019-2020</div>
      <div>湖南省惠德电子商务有限公司</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Cell, CellGroup } from "vant";
Vue.use(Cell)
  .use(CellGroup)
  .use(NavBar);
export default {
  mounted() {
    this.getAbout();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(title) {
      this.$router.push({ path: "about-detail", query: { title } });
    },
    getAbout() {
      this.$http
        .post("/config/getSystemConfigInfo", {})
        .then(res => {})
        .catch(error => {
          Toast(error.message);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.about-page {
  .top-view {
    .logo {
      width: 80px;
      height: 80px;
      border-radius: 5px;
      margin: 30px auto 0;
    }
    .appName {
      font-weight: bold;
      text-align: center;
      font-size: 0.9rem;
      margin-top: 10px;
    }
    .version {
      margin: 5px 0 80px;
      text-align: center;
      color: #999;
    }
  }
  .bottom-bar {
    width: 100%;
    text-align: center;
    color: #999;
    position: absolute;
    margin-top: 50px;
  }
}
</style>
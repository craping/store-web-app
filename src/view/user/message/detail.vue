 <!--我的消息-->
<template>
  <div class="like-page">
    <van-nav-bar title="消息详情" left-arrow @click-left="onClickLeft" fixed/>
    <div class="page-content">
        内容
        内容

        内容

        内容
        内容

        内容

        内容

    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar } from "vant";
Vue.use(NavBar);
export default {
  data() {
    return {
      id: this.$route.query.id

    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

  }
};
</script>
<style lang="scss" scoped>
.like-page {
  height: 100vh;
  background: #fff;
  .page-content {
    padding-top: 66px;
    white-space: pre-wrap;
  }
}
</style>
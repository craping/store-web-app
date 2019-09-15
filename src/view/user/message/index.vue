 <!--我的消息-->
<template>
  <div class="like-page">
    <van-nav-bar title="消息中心" left-arrow @click-left="onClickLeft" />
    <div class="page-content">
      <div class="item-bar van-hairline--bottom" @click="jumpLink('messageList',{title:'系统消息'})">
        <div class="icon">
          <img src="./img/icon-sys.png" />
        </div>
        <div class="title">系统消息</div>
      </div>
      <div class="item-bar van-hairline--bottom" @click="jumpLink('messageList',{title:'个人消息'})">
        <div class="icon">
          <img src="./img/icon-p.png" />
        </div>
        <div class="title">个人消息</div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Icon, Field } from "vant";
Vue.use(Field)
  .use(NavBar)
  .use(Icon);
export default {
  data() {
    return {};
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    jumpLink(path, query) {
      this.$router.push({ path, query });
    }
  }
};
</script>
<style lang="scss" scoped>
.like-page {
  height: 100vh;
  background: #fff;
  .page-content {
    border-top: 8px solid #eee;
    .item-bar {
      height: 70px;
      display: flex;
      padding: 0 15px;
      .icon {
        align-self: center;
        width: 40px;
        height: 40px;
        margin-right: 10px;
        img{
            width: 100%;
        }
      }
      .title {
        padding-top: 20px;
        font-size: 13px;
        color: #666;
      }
    }
  }
}
</style>
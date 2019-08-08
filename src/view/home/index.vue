<template>
  <div>
    <van-nav-bar class="van-home-nav-bar" fixed>
      <van-search placeholder="请输入搜索关键词" shape="round" slot="title" />
      <template slot="right">
        <van-icon name="chat-o" size="24" />
        <div style="font-size:10px">消息</div>
      </template>
    </van-nav-bar>

    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item>1</van-swipe-item>
      <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { NavBar, Icon, Search, Swipe, SwipeItem, PullRefresh } from "vant";

export default {
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Search.name]: Search,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [PullRefresh.name]: PullRefresh
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss">
.van-home-nav-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  line-height: normal;

  .van-nav-bar__left,
  .van-nav-bar__right {
    position: initial;
  }

  .van-nav-bar__title {
    flex: 1;
    max-width: none;
  }

  .van-nav-bar__right {
    padding-right: 16px;
  }
}
</style>

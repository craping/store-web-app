<template>
  <div class="home">
    <van-nav-bar class="van-home-nav-bar" fixed>
      <van-search placeholder="请输入搜索关键词" shape="round" background="$red" slot="title">
        <template v-slot:left-icon>
          <van-icon name="search" color="#969799" size="15" />
        </template>
      </van-search>
      <template slot="right">
        <van-icon name="chat-o" color="#fff" size="24" />
        <div style="font-size:10px;color:#fff">消息</div>
      </template>
    </van-nav-bar>

    <div class="content">
      <div class="curtain">
        <div class="cav"></div>
      </div>
      <van-pull-refresh v-model="isLoading" :head-height="56" @refresh="onRefresh">
        <van-swipe :autoplay="3000" :height="130" class="round">
          <van-swipe-item v-for="(image, index) in images" :key="index">
            广告栏{{index+1}}
            <!-- <img v-lazy="image" height="130" width="100%"/> -->
          </van-swipe-item>
        </van-swipe>

        <br />

        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-card
            v-for="(item,index) in list"
            :key="index"
            class="round"
            price="2.00"
            origin-price="10.00"
            desc="描述信息"
            title="商品标题"
            thumb="https://img.yzcdn.cn/vant/t-thirt.jpg"
            :lazy-load="true"
          >
            <template v-slot:num>
              <van-button type="danger" size="small" round>立即抢购</van-button>
            </template>
          </van-card>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { NavBar, Icon, Search, Swipe, SwipeItem, PullRefresh, List, Cell, Toast, Card, Button } from "vant";

export default {
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Search.name]: Search,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Cell.name]: Cell,
    [Card.name]: Card,
    [Button.name]: Button,
    Toast
  },
  data() {
    return {
      isLoading: false,
      images: ["", "", "", ""],
      list: [],
      loading: false,
      finished: false
    };
  },
  methods: {
    onRefresh() {
      setTimeout(() => {
        // this.$toast('刷新成功');
        this.isLoading = false;
      }, 500);
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 500);
    }
  }
};
</script>

<style lang="scss">
.home {
  margin-top: 56px;
  .van-home-nav-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 56px;
    line-height: normal;
    background-color: $red;

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

  .van-pull-refresh__head{
    // background-color: $red;
  }
  .van-hairline--bottom::after {
    border-bottom-width: 0;
  }

  .content {
    .curtain {
      display: flex;
      justify-content: center;
      position: absolute;
      overflow-x: hidden;
      margin: 0 -15px;
      width: 100vw;
      .cav {
        height: 85px;
        border-bottom-right-radius: 50%;
        border-bottom-left-radius: 50%;
        background-color: $red;
        flex: none;
        width: 150vw;
      }
    }

    .van-swipe-item {
      color: #fff;
      font-size: 20px;
      line-height: 130px;
      text-align: center;
      background-color: #66c6f2;
    }

    .van-card{
      background-color: #fff;
      padding: 15px 15px;
      .van-card__thumb{
        width: 100px;
        height: 100px;
      }
      .van-card__content {
        justify-content: space-around;
        .van-card__title{
            font-size: $font-size-normal;
          }
        .van-card__bottom{
          line-height: 28px;
          .van-card__desc{
            color:$red;
          }
          .van-card__price{
              font-size: 18px;
          }
          .van-card__origin-price{
            font-size: $font-size-normal;
          }
        }
      }
    }
  }
}
</style>

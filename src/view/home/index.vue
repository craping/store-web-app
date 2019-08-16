<template>
  <div class="home">
    
    <van-nav-bar class="van-home-nav-bar">
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
      <div class="curtain" ref="curtain">
        <div class="cav"></div>
      </div>

      <scroller 
        ref="scroller" 
        :on-refresh="onRefresh" 
        :on-infinite="onLoad" 
        :onScroll="onScroll"
        refreshLayerColor="#ffffff" 
        loadingLayerColor="#ec4949" 
        class="scroll">

        <van-swipe :autoplay="3000" :height="130" class="round">
          <van-swipe-item v-for="(ad, index) in content.advertiseList" :key="index">
            <img v-lazy="ad.pic" height="130" width="100%"/>
          </van-swipe-item>
        </van-swipe>

        <br />

        <router-link to="/goods">
          <van-card class="round"
            v-for="(item) in content.hotProductList"
            :key="item.id"
            :price="item.price"
            :origin-price="item.originalPrice"
            :title="item.name"
            :desc="item.subTitle"
            :thumb="item.pic"
            :lazy-load="true"
          >
            <template v-slot:num>
              <van-button type="danger" size="small" round>立即抢购</van-button>
            </template>
          </van-card>
        </router-link>

      </scroller>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
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
  computed: {
    ...mapState({
      content:state => state.home.content
    })
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
  created(){
    this.$store.dispatch("home/content");
  },
  mounted() {
  },
  methods: {
    onRefresh(done) {
      this.$store.dispatch("home/content").then(() => {
        done();
      })
    },
    onScroll({left, top, zoom}){
      if(top > 0)
        this.$refs.curtain.style.transform  = 'translate(' + (-left) + 'px,' + (-(top/3)) + 'px) scale(' + zoom + ')';
    },
    onLoad(done) {
      done(true);
    }
  }
};
</script>

<style lang="scss">
.home {
  // margin-top: 56px;
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

  .van-pull-refresh__head {
    // background-color: $red;
  }
  .van-hairline--bottom::after {
    border-bottom-width: 0;
  }

  .content {
    height: calc(100vh - 106px);
    background-color: $bg-color;
    overflow-y:hidden;
    position: relative;
    
    .curtain {
      display: flex;
      justify-content: center;
      position: absolute;
      overflow-x: hidden;
      // margin: 0 -15px;
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

    .scroll{
      ._v-content{
        padding-left: 15px;
        padding-right: 15px;
      }
      .pull-to-refresh-layer{
        background-color:transparent;
        // position: absolute;
        // left: 0;
        // top: 0;
        .spinner-holder{
          .arrow{
            width: 15px;
            height: 15px;
          }
          .text{
            font-size: 12px;
          }
        }
      }
      .no-data-text{
        font-size: 12px;
      }
    }

    .van-swipe-item {
      color: #fff;
      font-size: 20px;
      line-height: 130px;
      text-align: center;
      background-color: #66c6f2;
    }

    .van-card {
      background-color: #fff;
      padding: 15px 15px;
      .van-card__thumb {
        width: 100px;
        height: 100px;
      }
      .van-card__content {
        justify-content: space-around;
        .van-card__title {
          font-size: $font-size-normal;
        }
        .van-card__bottom {
          line-height: 28px;
          .van-card__desc {
            color: $red;
          }
          .van-card__price {
            font-size: 18px;
          }
          .van-card__origin-price {
            font-size: $font-size-normal;
          }
        }
      }
    }
  }
}
</style>

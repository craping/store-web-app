<template>
  <div class="home">
    <store-nav-bar background="#ff4444">
      <template slot="title">
        <van-search placeholder="请输入搜索关键词" background="$red" >
          <template v-slot:left-icon>
            <van-icon name="search" color="#969799" size="15" />
          </template>
        </van-search>
      </template>
      <template slot="right">
        <van-icon name="chat-o" color="#fff" size="30" />
      </template>
    </store-nav-bar>
    <!-- <van-nav-bar class="van-home-nav-bar" fixed>
      <template slot="left">
        <van-icon name="chat-o" color="#fff" size="30" />
      </template>
      <template slot="title">
        <van-search placeholder="请输入搜索关键词" background="$red" >
          <template v-slot:left-icon>
            <van-icon name="search" color="#969799" size="15" />
          </template>
        </van-search>
      </template>
      <template slot="right">
        <van-icon name="chat-o" color="#fff" size="30" />
      </template>
    </van-nav-bar> -->

    <div class="content">
      <div class="curtain" ref="curtain">
        <div class="cav"></div>
      </div>

      <store-scroller @onRefresh="onRefresh" @onInfinite="onLoad" @onScroll="onScroll">
        <van-swipe :autoplay="3000" :height="130" class="round">
          <van-swipe-item v-for="(ad, index) in content.advertiseList" :key="index">
            <img v-lazy="ad.pic" height="130" width="100%" />
          </van-swipe-item>
        </van-swipe>
        <br />
        <router-link
          v-for="(item) in content.hotProductList"
          :key="item.id"
          :to="'/goods/'+item.id"
        >
          <van-card
            class="round"
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
      </store-scroller>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  Icon,
  Search,
  Swipe,
  SwipeItem,
  PullRefresh,
  List,
  Cell,
  Toast,
  Card,
  Button
} from "vant";
import Arrow from "@/components/vue-scroller/components/Arrow.vue";
import storeNavBar from "@/components/store-nav-bar";
import storeScroller from "@/components/store-scroller";
import { isIOS } from "mobile-device-detect";
import inobounce from "inobounce";

export default {
  components: {
    [Icon.name]: Icon,
    [Search.name]: Search,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Cell.name]: Cell,
    [Card.name]: Card,
    [Button.name]: Button,
    Toast,
    Arrow,
    storeNavBar,
    storeScroller
  },
  computed: {
    ...mapState({
      content: state => state.home.content
    })
  },
  
  data() {
    return {
      isIOS: isIOS,
      isLoading: false,
      images: ["", "", "", ""],
      list: [],
      loading: false,
      finished: false
    };
  },
  created() {
    this.$store.dispatch("home/content");
  },
  methods: {
    onRefresh(done) {
      this.$store.dispatch("home/content").then(() => {
        this.isLoading = false;
        if (done) 
          done();
      });
    },
    onScroll(top) {
      if (top > 0)
        this.$refs.curtain.style.transform = "translate(0px," + -(top / 3) + "px) scale(1)";
    },
    onLoad(done) {
      if (done) done(true);
        this.loading = false;
      this.finished = true;
    }
  }
};
</script>

<style lang="scss">
.home {

  .content {

    .curtain {
      display: flex;
      justify-content: center;
      position: absolute;
      overflow-x: hidden;
      width: 100vw;
      .cav {
        // height: 85px;
        height: 191px;
        border-bottom-right-radius: 50%;
        border-bottom-left-radius: 50%;
        background-color: $red;
        flex: none;
        width: 150vw;
      }
    }
    .store-scroller {
      .van-pull-refresh {
        padding-top: 66px;
        padding-bottom: 50px;
      }
      .scroll {
        padding-top: 66px;
        ._v-content {
          padding-bottom: 50px;
        }
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
      margin-bottom: 15px;
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

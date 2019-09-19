<template>
  <div class="search">
    <van-nav-bar left-arrow @click-left="left" :fixed="true">
      <template slot="title">
        <form action="/">
          <van-search v-model="keyword" placeholder="请输入搜索关键词" @search="onSearch" @focus="onFocus"/>
        </form>
      </template>
    </van-nav-bar>
    <div class="content">
      <store-scroller @onRefresh="onRefresh" @onInfinite="onLoad" @onScroll="onScroll">
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
    <div class="history full-page" style="background-color:#fff" v-show="showHistory">
      <van-cell title="搜索历史" :border="false">
        <van-icon slot="right-icon" name="delete" style="line-height: inherit;" size="16" />
      </van-cell>
      <div class="keywords">
        <van-tag round class="text-ellipsis keyword" size="large" v-for="(e, i) in keywords" :key="i" @click="setKeyword(e)">{{e}}</van-tag>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  Icon,
  Search,
  PullRefresh,
  List,
  Cell,
  CellGroup,
  Toast,
  Card,
  Button,
  NavBar,
  Tag
} from "vant";
import storeScroller from "@/components/store-scroller";
import { isIOS } from "mobile-device-detect";

export default {
  components: {
    [Icon.name]: Icon,
    [Search.name]: Search,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Card.name]: Card,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Tag.name]: Tag,
    Toast,
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
      finished: false,
      keyword: "",
      keywords:["关键词","123", "士大夫"],
      showHistory: true
    };
  },
  created() {
    this.$store.dispatch("home/content");
  },
  mounted() {
    this.onPlusReady(() => {
      Toast.success("plus加载成功");
    });
  },
  methods: {
    left() {
      this.$router.go(-1);
    },
    setKeyword(k){
      this.keyword = k;
      this.onSearch(k);
    },
    onFocus(){
      this.showHistory = true;
    },
    onSearch(value){
      this.showHistory = false;
    },
    onRefresh(done) {
      this.$store.dispatch("home/content").finally(() => {
        this.isLoading = false;
        if (done) done();
      });
    },
    onScroll(top) {
      if (top > 0)
        this.$refs.curtain.style.transform =
          "translate(0px," + -(top / 3) + "px) scale(1)";
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
.search {
  padding-top: 66px;
  .van-hairline--bottom::after {
    border-bottom-width: 0;
  }
  .van-nav-bar {
    line-height: 56px;
    .van-icon {
      color: #969799;
    }
    .van-nav-bar__title {
      max-width: none;
      padding-left: 35px;
      .van-search {
        padding: 5px 16px;
        .van-cell {
          padding: 3px 10px 3px 0;
        }
      }
    }
  }
  .history {
    position: absolute;
    .keywords {
      padding-left: 15px;
      padding-right: 15px;
      .keyword {
        max-width: 45%;
        margin-right: 10px;
      }
    }
  }
  .content {
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

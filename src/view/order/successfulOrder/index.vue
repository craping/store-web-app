<template>
  <van-row class="successOrder">
    <van-nav-bar fixed :z-index="100" title left-text="返回" left-arrow @click-left="onClickLeft"/>
    <div class="successTip">
      <div class="tip">
        <van-icon name="checked"/>
        <h2>交易成功</h2>
      </div>
      <div class="tipinfo">{{tipinfo}}</div>
      <div class="tipBtn">
        <van-button color="#ff4444" plain @click="toHome">返回首页</van-button>
        <van-button color="#ff4444" plain @click="toAssess">立即评价</van-button>
      </div>
    </div>
    <div class="content-container">
      <store-scroller @onRefresh="onRefresh">
        <storeCard :proData="productList"></storeCard>
      </store-scroller>
    </div>
  </van-row>
</template>
<script>
import Vue from 'vue'
import storeScroller from '@/components/store-scroller'
import storeCard from '@/components/store-card'
import {
  AddressList,
  Tab,
  Tabs,
  NavBar,
  Card,
  Button,
  Tag,
  Row,
  Toast,
  Icon
} from 'vant'
Vue.use(NavBar)
  .use(AddressList)
  .use(Tab)
  .use(Tabs)
  .use(Card)
  .use(Button)
  .use(Tag)
  .use(Row)
  .use(Toast)
  .use(Icon)
export default {
  name: 'successfulOrder',
  components: {
    storeScroller,
    storeCard
  },
  data() {
    return {
      tipinfo: '去评价下本次的购物体验吧~',
      productList: [
        {
          pid: '1',
          title: '漂亮衣服',
          price: 20,
          sellnums: 1,
          tag: '七天无理由退货'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          price: 20,
          sellnums: 1,
          tag: '七天无理由退货'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          price: 20,
          sellnums: 1,
          tag: '七天无理由退货'
        },
        {
          pid: '1',
          title: '漂亮衣服漂亮衣服漂亮衣服漂亮衣服',
          price: 20,
          sellnums: 1,
          tag: '七天无理由退货'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          price: 20,
          sellnums: 1,
          tag: '七天无理由退货'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          price: 20,
          sellnums: 1,
          tag: '七天无理由退货'
        }
      ]
    }
  },
  created() {},
  methods: {
    /*************返回点击事件***************/
    onClickLeft() {
      this.$router.go(-1)
    },

    /*************点击返回首页事件*********/
    toHome() {
      this.$router.push('/')
    },
    /*************点击立即评价事件*********/
    toAssess() {
      this.$router.push({
        name: 'comment',
        params: {
          pid: this.$route.params.pid
        }
      })
    },

    /***********下拉刷新事件*********/
    onRefresh(done) {
      this.$store.dispatch('home/content').finally(() => {
        // this.isLoading = false;
        if (done) done()
      })
    }
  }
}
</Script>
<style lang="scss" scoped>
.successOrder {
  padding-top: 46px;
  .successTip {
    background: #fff;
    height: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    .tip {
      display: flex;
      align-items: center;
      color: $red;
      height: 60px;
      .van-icon-checked {
        font-size: 18px;
      }
    }
    .tipinfo {
      height: 30px;
      line-height: 30px;
    }
    .tipBtn {
      width: 60%;
      margin-top: 10px;
      display: flex;
      justify-content: space-around;
      .van-button {
        border-radius: 22px;
        height: 36px;
        line-height: 36px;
      }
    }
  }
  .content-container {
    position: fixed;
    top: 230px;
    bottom: 0;
    width: 100%;
  }
}
</style>

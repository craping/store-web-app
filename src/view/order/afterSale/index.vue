<template>
  <van-row class="aftersale">
    <van-nav-bar
      fixed
      :z-index="100"
      title="我的售后"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="content">
      <store-scroller @onRefresh="onRefresh" @onInfinite="onLoad">
        <div v-for="product in productList" :key="product.id" class="pro-container">
          <van-card
            :num="product.nums"
            :title="product.title"
            :desc="product.desc"
            :price="product.price"
            thumb="https://img.yzcdn.cn/vant/t-thirt.jpg"
          >
            <div slot="tags">
              <van-tag plain type="danger">{{product.tag}}</van-tag>
            </div>
            <div slot="footer" class="refundStatus">
              <van-icon name="cash-back-record"/>
              <p>{{asStatus[product.refundType]}}</p>
              <p>{{asStatusCon[product.status]}}</p>
            </div>
            <div slot="footer">
              <van-button
                size="mini"
                plain
                type="danger"
                @click.stop="toRefundInfo(product.pid)"
              >查看详情</van-button>
            </div>
          </van-card>
        </div>
      </store-scroller>
    </div>
  </van-row>
</template>
<script>
import Vue from 'vue'
import storeScroller from '@/components/store-scroller'
import storeCard from '@/components/store-card'
import {
  Tab,
  Tabs,
  NavBar,
  Card,
  Button,
  Tag,
  Row,
  Toast,
  Dialog,
  Icon
} from 'vant'
Vue.use(NavBar)
  .use(Tab)
  .use(Tabs)
  .use(Card)
  .use(Button)
  .use(Tag)
  .use(Row)
  .use(Toast)
  .use(Dialog)
  .use(Icon)
export default {
  name: 'aftersale',
  components: {
    storeScroller,
    storeCard
  },
  data() {
    return {
      //status 0 退款成功，1，退款失败
      //refundType 0 仅退款，1，退货退款
      productList: [
        {
          pid: '1',
          title: '漂亮衣服',
          desc: '这个衣服非常适合漂亮女孩子穿',
          price: 20,
          nums: 1,
          status: '0',
          tag: '七天无理由退货',
          refundType: '0'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          desc: '这个衣服非常适合漂亮女孩子穿',
          price: 20,
          nums: 1,
          status: '1',
          tag: '七天无理由退货',
          refundType: '1'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          desc: '这个衣服非常适合漂亮女孩子穿',
          price: 20,
          nums: 1,
          status: '0',
          tag: '七天无理由退货',
          refundType: '1'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          desc: '这个衣服非常适合漂亮女孩子穿',
          price: 20,
          nums: 1,
          status: '1',
          tag: '七天无理由退货',
          refundType: '1'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          desc: '这个衣服非常适合漂亮女孩子穿',
          price: 20,
          nums: 1,
          status: '0',
          tag: '七天无理由退货',
          refundType: '0'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          desc: '这个衣服非常适合漂亮女孩子穿',
          price: 20,
          nums: 1,
          status: '1',
          tag: '七天无理由退货',
          refundType: '0'
        }
      ],
      asStatus: ['仅退款', '仅退款退货'],
      asStatusCon: ['退款成功', '退款失败']
    }
  },
  created() {},
  methods: {
    /*************返回点击事件***************/
    onClickLeft() {
      this.$router.go(-1)
    },

    /************点击查看详情事件*********/
    toRefundInfo(id) {
      console.log('查看详情', id)
      this.$router.push({
        name: 'refundInfo',
        params: {
          id
        }
      })
    },

    /***********下拉刷新事件*********/
    onRefresh(done) {
      this.$store.dispatch('home/content').finally(() => {
        this.isLoading = false
        if (done) done()
      })
    },
    onLoad(done) {
      if (done) done(true)
      this.loading = false
      // this.finished = true
    }
  }
}
</Script>
<style lang="scss" scoped>
.aftersale {
  .van-nav-bar {
    padding-top: 0;
  }
  .content {
    position: relative;
    top: 46px;
    height: 100vh;
  }
  .pro-container {
    margin-top: 8px;
    border-radius: 5px;
    .van-card {
      margin: 0;
      background-color: #fff;
      border-radius: 0 0 8px 8px;
      .productSpec {
        div {
          display: inline;
          line-height: 40px;
          span {
            font-size: 20px;
          }
        }
      }
    }
    .refundStatus {
      display: flex;
      height: 30px;
      font-size: 14px;
      align-items: center;
      .van-icon {
        font-size: 18px;
        color: $red;
        margin-right: 5px;
      }
      p {
        margin-right: 5px;
      }
    }
  }
}
</style>

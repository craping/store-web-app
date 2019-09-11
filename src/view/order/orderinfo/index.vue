<template>
  <van-row class="orderinfo">
    <van-nav-bar
      fixed
      :z-index="100"
      title="订单详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="ordercontent">
      <store-scroller @onRefresh="onRefresh">
        <div class="ordestatus">
          <div class="tip">
            <h2>交易成功</h2>
            <div class="ordersubinfo" v-show="whichStep != 'success'">{{ordersubinfo}}</div>
          </div>
          <div class="ordericon">
            <van-icon name="send-gift"/>
          </div>
        </div>
        <div class="orderAddress">
          <van-cell-group>
            <van-cell icon="location-o" :label="addressList.address">
              <template slot="title">
                <span class="custom-title">{{addressList.name}}</span>
                <span class="custom-title">{{addressList.tel}}</span>
              </template>
            </van-cell>
          </van-cell-group>
        </div>
        <div class="orderSpec">
          <van-card
            :num="orderSpec.sellnums"
            :price="orderSpec.price"
            :desc="orderSpec.tag"
            :title="orderSpec.title"
            thumb="https://img.yzcdn.cn/vant/t-thirt.jpg"
          >
            <div slot="footer" class="footerBtn">
              <van-button>退款</van-button>
            </div>
            <div
              slot="footer"
              class="footerPl"
              v-for="(value,key,index) in orderSpec.pricespec"
              :key="index"
            >
              <div>{{priceSpecList[index]}}</div>
              <div>{{index == 2 ? '-' : ''}}￥{{value.toFixed(2)}}</div>
            </div>
          </van-card>
          <van-cell title="实付款" :value="`￥${orderSpec.pricespec.orderprice.toFixed(2)}`"/>
        </div>

        <div class="orderinfos">
          <van-cell title="订单信息"/>
          <van-cell :border="false" v-for="(item,key,index) in orderinfos" :key="key">
            <!-- 使用 title 插槽来自定义标题 -->
            <template slot="title">
              <span class="custom-title">{{key}}</span>
              <span class="custom-content">{{item}}</span>
              <van-button type="danger" size="mini" v-show="index == 0">复制</van-button>
            </template>
          </van-cell>
        </div>
        <div class="mayLike">
          <div class="mayLikeTitle">
            <div class="leftLine"></div>
            <van-icon name="like"/>
            <p>可能有你喜欢的</p>
            <div class="roghtLine"></div>
          </div>
          <storeCard :proData="productList"></storeCard>
        </div>
      </store-scroller>
    </div>
    <van-tabbar>
      <van-button type="danger" plain size="mini" @click="deleteOrder">删除订单</van-button>
      <van-button type="danger" plain size="mini" @click="checkFee">查看物流</van-button>
      <van-button type="danger" plain size="mini" @click="toAssess">评价</van-button>
    </van-tabbar>
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
  Icon,
  Cell,
  CellGroup,
  Tabbar,
  TabbarItem,
  Dialog
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
  .use(Cell)
  .use(CellGroup)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Dialog)
export default {
  name: 'orderinfo',
  components: {
    storeScroller,
    storeCard
  },
  data() {
    return {
      ordersubinfo: '去评价下本次的购物体验吧~',
      whichStep: 'success',
      orderSpec: {
        pid: '1',
        title: '漂亮衣服',
        price: 20,
        sellnums: 1,
        tag: '七天无理由退货',
        pricespec: {
          totelprice: 100,
          fee: 20,
          discount: 10,
          orderprice: 110
        }
      },
      addressList: {
        id: '1',
        name: '张三',
        tel: '13000000000',
        address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室'
      },
      priceSpecList: ['商品总价', '运费', '店铺优惠', '订单总价'],
      productList: [
        {
          pid: '1',
          title: '漂亮衣服',
          desc: '这个衣服非常适合漂亮女孩子穿',
          price: 20,
          nums: 1,
          status: '0',
          tag: '七天无理由退货',
          freight: '0.00'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          desc: '这个衣服非常适合漂亮女孩子穿',
          price: 20,
          nums: 1,
          status: '1',
          tag: '七天无理由退货',
          freight: '0.00'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          desc: '这个衣服非常适合漂亮女孩子穿',
          price: 20,
          nums: 1,
          status: '2',
          tag: '七天无理由退货',
          freight: '0.00'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          desc: '这个衣服非常适合漂亮女孩子穿',
          price: 20,
          nums: 1,
          status: '3',
          tag: '七天无理由退货',
          freight: '0.00'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          desc: '这个衣服非常适合漂亮女孩子穿',
          price: 20,
          nums: 1,
          status: '4',
          tag: '七天无理由退货',
          freight: '0.00'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          desc: '这个衣服非常适合漂亮女孩子穿',
          price: 20,
          nums: 1,
          status: '1',
          tag: '七天无理由退货',
          freight: '0.00'
        }
      ],
      orderinfos: {
        订单编号: '00000000000000',
        交易号: '00000000000000',
        创建时间: '00000000000000',
        付款时间: '00000000000000',
        发货时间: '00000000000000',
        成交时间: '00000000000000'
      }
    }
  },
  created() {},
  methods: {
    /*************返回点击事件***************/
    onClickLeft() {
      this.$router.go(-1)
    },

    /*************点击返回首页事件*********/
    checkFee() {
      this.$router.push({
        name: 'productExpress',
        params: {
          pid: '0000'
        }
      })
    },
    /*************点击立即评价事件*********/
    toAssess() {
      console.log('去评价页面')
    },

    /***********下拉刷新事件*********/
    onRefresh(done) {
      this.$store.dispatch('home/content').finally(() => {
        // this.isLoading = false;
        if (done) done()
      })
    },
    /**********删除订单*********/
    deleteOrder() {
      let title = '删除订单'
      let message = '确定删除这个订单吗？'
      Dialog.confirm({
        title,
        message
      })
        .then(() => {
          // on confirm
          type == 'cancel' ? this.cancelOrder(pid) : this.deleteOrder(pid)
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</Script>
<style lang="scss" scoped>
.orderinfo {
  padding-top: 46px;
  .van-nav-bar {
    padding-top: 0;
  }
  .ordercontent {
    padding: 46px 0px;
    height: 100vh;
    position: relative;
  }
  .ordestatus {
    background: #fff;
    height: 150px;
    display: flex;
    align-items: center;
    .tip {
      width: 50%;
      display: flex;
      align-items: center;
      flex-direction: column;
      color: $red;
      height: 60px;
      .van-icon-checked {
        font-size: 18px;
      }
    }
    .ordersubinfo {
      height: 30px;
      line-height: 30px;
    }
    .ordericon {
      width: 50%;
      font-size: 100px;
      text-align: center;
      color: $red;
    }
  }
  .orderAddress {
    margin-top: 10px;
    .van-cell__left-icon {
      height: 45px;
      font-size: 40px;
      line-height: 45px;
      width: 45px;
      background: $red;
      border-radius: 50%;
      color: #fff;
      text-align: center;
    }
    .custom-title {
      margin-right: 10px;
      &:nth-child(2) {
        color: $gray-deep;
      }
    }
  }
  .orderSpec {
    background: #fff;
    margin-top: 10px;
    .van-card {
      background: #fff;
      border-bottom: 1px solid #eee;
    }
    .footerBtn {
      margin-bottom: 10px;
      .van-button {
        border-radius: 15px;
        height: 30px;
        line-height: 30px;
        border-color: $red;
      }
    }
    .footerPl {
      display: flex;
      justify-content: space-between;
      height: 20px;
      line-height: 20px;
      color: $gray-deep;

      &:nth-last-child(1) {
        height: 30px;
        line-height: 30px;
        font-size: 18px;
        color: #000;
      }
    }
    .van-cell {
      font-size: 18px;
      .van-cell__value {
        color: $red;
      }
    }
  }
  .orderinfos {
    margin-top: 10px;

    .van-cell__title {
      display: flex;

      .custom-title {
        width: 30%;
      }
      .custom-content {
        width: 50%;
        color: $gray-deep;
      }
    }
  }
  .mayLike {
    .mayLikeTitle {
      display: flex;
      align-items: center;
      height: 50px;
      justify-content: center;
      color: $red;
      font-size: 16px;
      .leftLine,
      .roghtLine {
        height: 1px;
        width: 20px;
        background: $red;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          top: -2px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: $red;
        }
      }
      .leftLine {
        margin-right: 5px;
        &::before {
          left: 0;
        }
      }
      .roghtLine {
        margin-left: 5px;
        &::before {
          right: 0;
        }
      }
    }
    .store-card {
      margin-top: 0;
    }
  }
  .van-tabbar {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    .van-button {
      border-radius: 11px;
      padding: 0 10px;
      margin: 0 10px;
    }
  }
}
</style>

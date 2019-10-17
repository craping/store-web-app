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
            <h2>{{proStatus[checkInfoList.status]}}</h2>
            <!-- <div class="ordersubinfo" v-show="whichStep != 'success'">{{ordersubinfo}}</div> -->
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
            v-for="(item,index) in checkInfoList.orderItemList"
            :key="item.id"
            :num="item.productQuantity"
            :title="item.productName"
            :price="item.productPrice"
            :thumb="item.productPic"
          >
            <div slot="tags">
              <van-tag
                plain
                type="danger"
                v-for="(item,index) in JSON.parse(item.productAttr)"
                :key="index"
              >{{item.key}}:{{item.value}}</van-tag>
            </div>
            <div
              v-show="index == checkInfoList.orderItemList.length-1"
              slot="footer"
              class="productSpec"
            >
              <!-- <div v-show="product.orderItemList">共{{product.orderItemList[0].productQuantity}}件商品</div> -->
              <div>
                应付款：￥
                <span>{{checkInfoList.totalAmount}}</span>
                (含运费￥{{checkInfoList.freightAmount}})
              </div>
            </div>
          </van-card>
          <van-cell title="实付款" :value="`￥${checkInfoList.payAmount}`"/>
        </div>

        <div class="orderinfos">
          <van-cell title="订单信息"/>
          <van-cell :border="false">
            <!-- 使用 title 插槽来自定义标题 -->
            <template slot="title">
              <span class="custom-title">订单编号</span>
              <span class="custom-content">{{checkInfoList.orderItemList[0].orderSn}}</span>
              <van-button
                type="danger"
                size="mini"
                class="copyNumClass"
                :data-clipboard-text="checkInfoList.orderItemList[0].orderSn"
                @click="copyNum"
              >复制</van-button>
            </template>
          </van-cell>
          <van-cell :border="false">
            <!-- 使用 title 插槽来自定义标题 -->
            <template slot="title">
              <span class="custom-title">创建时间</span>
              <span class="custom-content">{{checkInfoList.createTime}}</span>
            </template>
          </van-cell>
          <van-cell :border="false">
            <!-- 使用 title 插槽来自定义标题 -->
            <template slot="title">
              <span class="custom-title">付款时间</span>
              <span class="custom-content">暂时无</span>
            </template>
          </van-cell>
          <van-cell :border="false">
            <!-- 使用 title 插槽来自定义标题 -->
            <template slot="title">
              <span class="custom-title">发货时间</span>
              <span class="custom-content">暂时无</span>
            </template>
          </van-cell>
          <van-cell :border="false">
            <!-- 使用 title 插槽来自定义标题 -->
            <template slot="title">
              <span class="custom-title">成交时间</span>
              <span class="custom-content">暂时无</span>
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
    <van-tabbar v-show="isSendProduct || isGetProduct">
      <van-button type="danger" plain size="mini" v-show="isShowDelete" @click="deleteOrder">删除订单</van-button>
      <van-button type="danger" plain size="mini" v-show="isSendProduct" @click="checkFee">查看物流</van-button>
      <van-button type="danger" plain size="mini" v-show="isGetProduct" @click="toAssess">评价</van-button>
    </van-tabbar>
    <store-loding v-show="loding"></store-loding>
  </van-row>
</template>
<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import storeScroller from '@/components/store-scroller'
import storeCard from '@/components/store-card'
import ClipboardJS from 'clipboard'
import storeLoding from '@/components/store-loding'
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
    storeCard,
    storeLoding
  },
  data() {
    return {
      ordersubinfo: '去评价下本次的购物体验吧~',
      whichStep: 'success',
      proStatus: ['待付款', '待发货', '已发货', '已收货', '已关闭', '已完成'],
      priceSpecList: ['商品总价', '运费', '店铺优惠', '订单总价'],
      loding: false,
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
  computed: {
    ...mapState({
      checkInfoList: state => state.order.checkInfoList
    }),
    addressList() {
      return {
        name: this.checkInfoList.receiverName,
        tel: this.checkInfoList.receiverPhone,
        address: `${this.checkInfoList.receiverProvince}${
          this.checkInfoList.receiverCity
        }${this.checkInfoList.receiverRegion}${
          this.checkInfoList.receiverDetailAddress
        }邮编：${this.checkInfoList.receiverPostCode}`
      }
    },
    isSendProduct() {
      return (
        this.checkInfoList.status != '0' &&
        this.checkInfoList.status != '1' &&
        this.checkInfoList.status != '4'
      )
    },
    isGetProduct() {
      return (
        this.checkInfoList.status != '1' &&
        this.checkInfoList.status != '2' &&
        this.checkInfoList.status != '0'
      )
    },
    isShowDelete() {
      return (
        this.checkInfoList.status == '4' || this.checkInfoList.status == '5'
      )
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
          pid: this.checkInfoList.orderItemList[0].orderId
        }
      })
    },
    /*************点击立即评价事件*********/
    toAssess() {
      this.$router.push({
        name: 'comment',
        params: {
          pid: this.checkInfoList.orderItemList[0].orderId
        }
      })
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
          this.deleteOrder()
        })
        .catch(() => {
          // on cancel
        })
    },
    /************复制按钮点击点击事件*********/
    copyNum() {
      var clipboard = new ClipboardJS('.copyNumClass')
      clipboard.on('success', function(e) {
        Toast.success(`复制成功`)
        e.clearSelection()
      })

      clipboard.on('error', function(e) {
        Toast.fail('复制失败')
      })
    },
    /***********删除订单事件*********/
    deleteOrder() {
      this.loding = true
      const params = {
        orderId: this.checkInfoList.orderItemList[0].orderId
      }
      this.$http
        .post('/order/deleteOrder', params)
        .then(data => {
          this.loding = false
          this.$router.go(-1)
        })
        .catch(error => {
          console.log(error)
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
        width: 55%;
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

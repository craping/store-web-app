<template>
  <van-row class="order">
    <van-nav-bar
      fixed
      :z-index="100"
      title="订单中心"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-tabs @click="onClick" v-model="active">
      <store-scroller @onRefresh="onRefresh" @onInfinite="onLoad">
        <van-tab v-for="(item,index) in productStatus" :key="item.id" :title="item.title">
          <div v-for="product in showProductList" :key="product.id" class="pro-container">
            <div class="status">{{proStatus[product.status]}}</div>
            <div>
              <van-card
                v-for="(item,index) in product.orderItemList"
                :key="item.id"
                :num="item.productQuantity"
                :title="item.productName"
                :price="item.productPrice"
                :thumb="item.productPic"
                @click="checkInfo(product)"
              >
                <div slot="tags">
                  <van-tag
                    plain
                    type="danger"
                    v-for="(item,index) in JSON.parse(item.productAttr)"
                    :key="index"
                  >{{item.key}}:{{item.value}}</van-tag>
                </div>
                <div slot="footer" v-show="(product.status == 3 || product.status == 5)">
                  <div class="status" v-if="item.commentStatus == 1">已评论</div>
                  <van-button v-else size="mini" @click.stop="proEventClick(item,'评价商品')">评价商品</van-button>
                </div>
                <div
                  v-show="index == product.orderItemList.length-1"
                  slot="footer"
                  class="productSpec"
                >
                  <!-- <div v-show="product.orderItemList">共{{product.orderItemList[0].productQuantity}}件商品</div> -->
                  <div>
                    应付款：￥
                    <span>{{product.payAmount}}</span>
                    (含运费￥{{product.freightAmount}})
                  </div>
                </div>

                <div slot="footer" v-show="index == product.orderItemList.length-1">
                  <div
                    class="status"
                  >售后状态：{{afterSaleStatus[product.orderItemList[0].serviceStatus + 1]}}</div>
                  <van-button
                    v-for="(item,index) in proEventList[`event${product.status}`]"
                    :key="index"
                    size="mini"
                    :class="item == '立即付款' ? 'tored' : ''"
                    @click.stop="proEventClick(product,item)"
                  >{{item}}</van-button>
                </div>
              </van-card>
            </div>
          </div>
          <div class="mayLike" v-show="index != 0">
            <div class="mayLikeTitle">
              <div class="leftLine"></div>
              <van-icon name="like"/>
              <p>可能有你喜欢的</p>
              <div class="roghtLine"></div>
            </div>
            <store-card :proData="productList"></store-card>
          </div>
        </van-tab>
      </store-scroller>
    </van-tabs>
    <store-pay-dialog @closeDialog="closeDialog" @toPay="toPay" :show="showPayDialog"></store-pay-dialog>
    <store-loding v-show="loding"></store-loding>
  </van-row>
</template>
<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import storeScroller from '@/components/store-scroller'
import storeCard from '@/components/store-card'
import storePayDialog from '@/components/store-pay-dialog'
import storeLoding from '@/components/store-loding'
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
  name: 'order',
  components: {
    storeScroller,
    storeCard,
    storePayDialog,
    storeLoding
  },
  data() {
    return {
      active: 0, //默认为1
      loding: false,
      productStatus: [
        { id: '1', title: '全部' },
        { id: '2', title: '待付款' },
        { id: '3', title: '待发货' },
        { id: '4', title: '待收货' },
        { id: '5', title: '待评价' }
      ],
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
      // 0->待付款；1->待发货；2->已发货；3->已收货；4->已关闭；5->已完成
      proStatus: ['待付款', '待发货', '已发货', '已收货', '已关闭', '已完成'],
      //售后状态
      afterSaleStatus: [
        '无售后',
        '待处理',
        '退货中',
        '已完成',
        '已拒绝',
        '已取消'
      ],
      showProductList: [],
      proEventList: {
        event0: ['立即付款', '取消订单'],
        event1: ['取消订单'],
        event2: ['确认收货', '查看物流', '退款'],
        event3: ['退货退款'],
        event4: ['删除订单'],
        event5: ['删除订单']
      },
      showPayDialog: false, //支付弹框默认隐藏
      patyType: '', //获取支付方式

      /***********联调用的的数据************* */
      pageNums: 1, //请求数据的页数
      channel: null,
      aliChannel: null,
      wxChannel: null,
      payParamsObj: {},
      isBalanceEnough: true
    }
  },
  created() {
    this.initData()
    this.active = this.$route.query.tabId
  },
  mounted() {
    this.onPlusReady(() => {
      this.getPayChannel()
    })
  },
  computed: {
    ...mapState({
      orderList: state => state.order.orderList,
      totalnum: state => state.order.totalNum,
      platform: state => state.sys.clientId,
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    ...mapActions('user', ['getUserInfo']),
    /*************返回点击事件***************/
    onClickLeft() {
      this.$router.push('/main/user')
    },

    /*************初始化数据************ */
    initData() {
      this.loding = true
      this.$store.commit('order/SET_ORDER_LIST_INIT')
      this.$store
        .dispatch('order/getOrderList', {
          pageNum: this.pageNums,
          pageSize: 10
        })
        .then(data => {
          this.showProductList = this.orderList
        })
        .finally(() => {
          this.loding = false
        })
    },

    /*************点击查看详情事件***************/
    checkInfo(item) {
      this.$router.push({
        name: 'orderinfo'
      })
      this.$store.commit('order/SET_CHECK_INFO_LIST', item)
    },

    /*************tab切换标签点击事件*********/
    onClick(name) {
      // 0->待付款；1->待发货；2->已发货；3->已收货；4->已关闭；5->已完成
      if (name != 0) {
        this.showProductList = this.orderList.filter(item => {
          return item.status == name - 1
        })
      } else {
        this.showProductList = this.orderList
      }
    },

    /************产品按钮点击点击事件*********/
    proEventClick(product, event) {
      switch (event) {
        case '取消订单':
          this.confirmDialog('cancel', product.orderItemList)
          break
        case '删除订单':
          this.confirmDialog('delete', product.orderItemList)
          break
        case '查看物流':
          this.$store.commit('order/SET_CHECK_INFO_LIST', product)
          this.$router.push({
            name: 'productExpress',
            params: {
              id: product.id
            }
          })
          break
        case '评价商品':
          this.$store.commit('order/SET_CHECK_INFO_LIST', product)
          this.$router.push({
            name: 'comment',
            params: {
              id: product.id
            }
          })
          break
        case '退款':
          this.refundEvent(product)
          break
        case '退货退款':
          this.refundEvent(product)
          break
        case '立即付款':
          this.$store.dispatch('payChannel/getPayChannel').then(data => {
            this.showPayDialog = true
            this.isBalanceEnough =
              this.userInfo.amsAccount.balance >= product.payAmount
          })
          this.payParamsObj = {
            orderIds: product.orderItemList.map(item => item.orderId),
            sourceType: this.platform
          }
          break
        case '确认收货':
          this.$store.commit('order/SET_CHECK_INFO_LIST', product)
          this.confirmOrder(product)
          break
      }
    },

    /*******退款事件***** */
    refundEvent(p) {
      if (p.orderItemList[0].serviceStatus > -1) {
        Toast.fail('该产品已有售后处理中')
        return
      }
      this.$store.commit('order/SET_CHECK_INFO_LIST', p)
      this.$router.push({
        name: 'refund',
        params: {
          id: p.id
        }
      })
    },
    /***********点击取消订单和删除订单弹窗事件*********/
    confirmDialog(type, pArr) {
      let title = ''
      let message = ''
      if (type == 'cancel') {
        title = '取消订单'
        message = '确定取消这个订单吗？'
      } else {
        title = '删除订单'
        message = '确定删除这个订单吗？'
      }
      const id = pArr[0].orderId
      Dialog.confirm({
        title,
        message
      })
        .then(() => {
          // on confirm
          type == 'cancel' ? this.cancelOrder(id) : this.deleteOrder(id)
        })
        .catch(() => {
          // on cancel
        })
    },

    /***********取消订单事件*********/
    cancelOrder(orderId) {
      this.loding = true
      const params = {
        orderId
      }
      this.$http
        .post('/order/cancelOrder', params)
        .then(data => {
          this.initData()
        })
        .catch(error => {
          console.log(error)
        })
    },

    /***********删除订单事件*********/
    deleteOrder(pid) {
      this.loding = true
      const params = {
        orderId: pid
      }
      this.$http
        .post('/order/deleteOrder', params)
        .then(data => {
          this.initData()
        })
        .catch(error => {
          console.log(error)
          this.loding = false
        })
    },

    /*********确认收货事件******** */
    confirmOrder(p) {
      this.loding = true
      const params = {
        orderId: p.orderItemList[0].orderId
      }
      this.$http
        .post('/order/confirmOrder', params)
        .then(data => {
          this.$router.push({
            name: 'successfulOrder',
            params: {
              pid: p.id
            }
          })
        })
        .catch(error => {
          console.log(error)
          this.loding = false
        })
    },

    /*************支付弹框事件群start******/
    /***********隐藏弹框*********/
    closeDialog(bool) {
      this.showPayDialog = bool
    },
    /***********点击支付按钮事件并获取支付方式*********/
    toPay(type) {
      this.payType = type
      console.log('sfsdf', this.payType)
      var requestUrl = null
      if (this.payType == 'WXPAY') {
        requestUrl = '/trade/pay'
        this.channel = this.wxChannel
        this.payParamsObj.channelId = 2
      } else if (this.payType == 'ALIPAYPAYS') {
        requestUrl = '/ali/pay'
        this.channel = this.aliChannel
        this.payParamsObj.channelId = 4
      } else {
        requestUrl = '/trade/pay'
        this.channel = this.wxChannel
        this.payParamsObj.channelId = 1
        if (!this.isBalanceEnough) {
          Toast.fail('余额不足以支付该产品')
          return
        }
      }

      this.$http.post(requestUrl, this.payParamsObj).then(data => {
        if (this.payType == 'BALANCE') {
          this.showPayDialog = false
          Toast.success('支付成功')
          this.initData()
          this.getUserInfo()
          return
        }
        let temPrams = data.info
        temPrams.timestamp = parseInt(data.info.timestamp)
        console.log(temPrams)
        console.log('获取的通道', this.channel)
        plus.payment.request(
          this.channel,
          temPrams,
          res => {
            this.$http
              .post('trade/tradeDetail', { tradeNo: temPrams.tradeNo })
              .then(data => {
                plus.nativeUI.alert('支付成功！', function() {
                  this.$router.push('/order')
                })
              })
          },
          error => {
            plus.nativeUI.alert('支付失败：' + error.code)
          }
        )
      })
    },
    /*******调用5+支付功能********** */
    getPayChannel() {
      // 获取支付通道
      plus.payment.getChannels(
        channels => {
          for (var i = 0; i < channels.length; i++) {
            if (channels[i].id == 'alipay') {
              this.aliChannel = channels[i]
            } else if (channels[i].id == 'wxpay') {
              this.wxChannel = channels[i]
            }
          }
        },
        function(e) {
          plus.nativeUI.alert('获取支付通道失败：' + e.message)
        }
      )
    },
    /*************支付弹框事件群end******/

    /***********下拉刷新事件*********/
    onRefresh(done) {
      if (this.showProductList.length >= this.totalnum) {
        if (done) done(true)
      }
      this.pageNums += 1
      this.$store
        .dispatch('order/getOrderList', {
          pageNum: this.pageNums,
          pageSize: 10
        })
        .then(data => {
          this.showProductList = this.orderList
          this.onClick(this.active)
        })
        .finally(() => {
          if (done) done()
        })
    },
    onLoad(done) {
      if (done) done(true)
      this.loading = false
      // this.finished = true
    }
  },
  watch: {
    active(newValue, oldValue) {
      this.pageNums = 1
      this.onClick(newValue)
    }
  }
}
</Script>
<style lang="scss" scoped>
.order {
  // padding-top: 46px;
  height: 100%;
  .status {
    text-align: right;
    padding-right: 10px;
    height: 20px;
    line-height: 20px;
    background: #fff;
    color: $red;
  }
  /deep/.van-tabs--line .van-tabs__wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 66px;
    z-index: 10;
  }
  /deep/.van-tabs__content {
    margin-top: 115px;
    height: 100vh;
    width: 100%;
    .van-button {
      margin: 0 5px;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      border-radius: 15px;
      border: 1px solid #ccc;
      color: $font-color-gray;
    }
    .tored {
      background: red;
      color: #fff;
    }
  }
  /deep/.van-tabs__nav {
    .van-tab {
      flex-basis: 20% !important;
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
  .van-tab__pane {
    .pro-container {
      margin-top: 8px;
      border-radius: 5px;
      background-color: #fff;
    }

    .van-card {
      margin: 0;
      background: #fff;
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
    .status {
      text-align: right;
      padding-right: 10px;
      height: 30px;
      line-height: 30px;
      background: #fff;
      color: $red;
      border-radius: 8px 8px 0 0;
    }
  }
}
</style>

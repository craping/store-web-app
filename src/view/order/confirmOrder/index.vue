<template>
  <van-row class="confirmOrder">
    <van-nav-bar
      fixed
      :z-index="100"
      title="订单确认"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="ordercontent">
      <div class="orderAddress">
        <van-cell-group>
          <van-cell
            icon="location-o"
            :label="confirmedAddress.address"
            is-link
            @click="confirmAddress"
          >
            <template slot="title">
              <span class="custom-title">{{confirmedAddress.name}}</span>
              <span class="custom-title">{{confirmedAddress.tel}}</span>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
      <div class="orderSpec">
        <div class="order-item" v-for="item in confirmOrderList" :key="item.id">
          <van-card
            :num="item.quantity || item.num"
            :price="item.price"
            :desc="item.subTitle || item.name"
            :title="item.title"
            :thumb="item.pic"
          >
            <div slot="tags" v-if="$route.query.type == 'dir' ">
              <van-tag
                plain
                type="danger"
                v-for="item in item.productAttr"
                :key="item.key"
              >{{item.key}}:{{item.value}}</van-tag>
            </div>
            <div slot="tags" v-else>
              <van-tag
                plain
                type="danger"
                v-for="item in JSON.parse(item.productAttr)"
                :key="item.key"
              >{{item.key}}:{{item.value}}</van-tag>
            </div>
          </van-card>
        </div>

        <van-cell title="商品金额" :value="`￥${totalPrice.toFixed(2)}`"/>
        <!-- <van-cell title="优惠" :value="`-￥${orderSpec.pricespec.orderprice.toFixed(2)}`"/> -->
        <!-- <van-cell title="运费" :value="`+￥${orderSpec.pricespec.orderprice.toFixed(2)}`"/> -->
        <van-cell title="实付款" :value="`￥${totalPrice.toFixed(2)}`"/>
      </div>
    </div>
    <van-submit-bar :price="totalPrice*100" button-text="去支付" @submit="toSumbitOrder"/>
    <!-- <van-tabbar>
      <van-button type="info" @click="toSumbitOrder">去支付</van-button>
    </van-tabbar>-->
    <store-pay-dialog @closeDialog="closeDialog" @toPay="toPay" :show="showPayDialog"></store-pay-dialog>
  </van-row>
</template>
<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import storePayDialog from '@/components/store-pay-dialog'
import {
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
  Dialog,
  SubmitBar
} from 'vant'
Vue.use(NavBar)
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
  .use(SubmitBar)

export default {
  name: 'confirmOrder',
  components: {
    storePayDialog
  },
  data() {
    return {
      showPayDialog: false, //支付弹框默认隐藏
      payType: '', //获取支付方式
      showAddress: false, //显示地址列表
      confirmedAddress: {
        name: '',
        tel: '',
        address: ''
      }, //默认显示地址
      payParamsObj: {}, //传给自己后台支付接口的数据
      channel: null,
      aliChannel: null,
      wxChannel: null,
      isBalanceEnough: false
    }
  },
  computed: {
    ...mapState({
      confirmOrderList: state => state.order.confirmOrderList,
      platform: state => state.sys.clientId,
      addressInfo: state => state.address.addressInfo,
      userInfo: state => state.user.userInfo
    }),
    totalPrice() {
      return this.confirmOrderList.reduce((pre, cur) => {
        return pre + cur.price * cur.quantity
      }, 0)
    }
  },
  created() {
    this.getAddressList()
    this.initAddress()
  },
  mounted() {
    this.onPlusReady(() => {
      this.getPayChannel()
    })
  },
  methods: {
    ...mapActions('user', ['getUserInfo']),
    ...mapActions('address', ['getAddressList']),

    /*************返回点击事件***************/
    onClickLeft() {
      this.$router.go(-1)
    },

    /*************点击打开支付弹框事件*********/

    toShowPay() {
      this.$store.dispatch('payChannel/getPayChannel').then(data => {
        this.showPayDialog = true
        this.isBalanceEnough =
          this.userInfo.amsAccount.balance >= this.totalPrice
      })
    },

    /*********获取用户的收货地址*********** */
    initAddress() {
      const { addressInfo } = this
      this.confirmedAddress.name = addressInfo.name || '请先选择地址'
      this.confirmedAddress.tel = addressInfo.tel || ''
      if (addressInfo.province) {
        const detaliaddress = addressInfo.addressDetail || addressInfo.address
        this.confirmedAddress.address = `${addressInfo.province}${
          addressInfo.city
        }${addressInfo.county}${detaliaddress}`
      } else {
        this.confirmedAddress.address = ''
      }
    },

    //点击支付触发提交订单接口
    toSumbitOrder() {
      if (!this.confirmedAddress.address) {
        Toast.fail('请选择地址')
        return
      }
      const { confirmOrderList } = this
      let temSkuids = []
      if (this.$route.query.type == 'dir') {
        temSkuids = [confirmOrderList[0].id]
      } else {
        temSkuids = confirmOrderList.map(item => {
          return item.skuId
        })
      }
      let params = {
        skuIds: temSkuids,
        addressId: this.addressInfo.id,
        type: this.$route.query.type,
        sourceType: this.platform
        // sourceType: 1
      }
      if (this.$route.query.type == 'dir') {
        params = {
          ...params,
          quantity: confirmOrderList[0].quantity,
          productAttr: confirmOrderList[0].productAttr,
          note: '备注'
        }
        if (this.$route.query.recommenderId) {
          params = {
            ...params,
            recommenderId: this.$route.query.recommenderId
          }
        }
      }

      this.$http
        .post('/order/create', params)
        .then(data => {
          console.log(data.info)
          this.payParamsObj = {
            // orderSn: data.info.orderSn,
            orderIds: data.info.orderIds.split(','),
            sourceType: this.platform
          }
        })
        .catch(error => {
          console.log(error)
        })
      this.toShowPay()
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
          this.getUserInfo()
          this.$router.push('/order')
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
    /*************支付弹框事件群end******/

    /*************取消订单******/
    cancelOrder() {
      console.log('cancel')
    },

    /********打开地址列表**** */
    confirmAddress() {
      this.$router.push({
        path: '/address',
        query: {
          type: 'select'
        }
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
    }
  }
}
</Script>
<style lang="scss" scoped>
.confirmOrder {
  padding-top: 46px;
  .ordercontent {
    padding-bottom: 50px;
    padding-top: 20px;
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
    .van-cell__right-icon {
      height: 45px;
      line-height: 45px;
    }
    .custom-title {
      margin-right: 10px;
      &:nth-child(2) {
        color: $gray-deep;
      }
    }
  }
  .orderSpec {
    margin-top: 10px;
    .order-item {
      margin-bottom: 10px;
    }
    .van-card {
      background: #fff;
      border-bottom: 1px solid #eee;
    }
    .van-cell {
      font-size: 18px;
      &:nth-child(3) {
        .van-cell__value {
          color: $red;
        }
      }
    }
  }
  .van-tabbar {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    .van-button {
      border-radius: 11px;

      margin: 0 10px;
    }
  }
}
</style>

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
        ></van-card>
        <van-cell title="商品金额" :value="`￥${orderSpec.pricespec.orderprice.toFixed(2)}`"/>
        <!-- <van-cell title="优惠" :value="`-￥${orderSpec.pricespec.orderprice.toFixed(2)}`"/> -->
        <van-cell title="运费" :value="`+￥${orderSpec.pricespec.orderprice.toFixed(2)}`"/>
        <van-cell title="实付款" :value="`￥${orderSpec.pricespec.orderprice.toFixed(2)}`"/>
      </div>
    </div>
    <van-tabbar>
      <van-button type="danger" plain size="mini" @click="toShowPay">去支付</van-button>
      <van-button type="danger" plain size="mini" @click="toDelete">取消订单</van-button>
    </van-tabbar>
    <store-pay-dialog @closeDialog="closeDialog" @toPay="toPay" :show="showPayDialog"></store-pay-dialog>
  </van-row>
</template>
<script>
import Vue from 'vue'
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
  Dialog
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
export default {
  name: 'confirmOrder',
  components: {
    storePayDialog
  },
  data() {
    return {
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
      showPayDialog: false, //支付弹框默认隐藏
      patyType: '' //获取支付方式
    }
  },
  created() {},
  methods: {
    /*************返回点击事件***************/
    onClickLeft() {
      this.$router.go(-1)
    },

    /*************点击打开支付弹框事件*********/
    toShowPay() {
      this.showPayDialog = true
    },
    toDelete() {
      Dialog.confirm({
        title: '取消订单',
        message: '确定取消这个订单吗？'
      })
        .then(() => {
          // on confirm
          this.cancelOrder()
        })
        .catch(() => {
          // on cancel
        })
    },
    /*************支付弹框事件群start******/
    /***********隐藏弹框*********/
    closeDialog(bool) {
      this.showPayDialog = bool
    },
    /***********点击支付按钮事件并获取支付方式*********/
    toPay(type) {
      Toast.success('去支付页面')
      this.patyType = type
      console.log('sfsdf', this.patyType)
    },
    /*************支付弹框事件群end******/

    /*************取消订单******/
    cancelOrder() {
      console.log('cancel')
    }
  }
}
</Script>
<style lang="scss" scoped>
.confirmOrder {
  padding-top: 46px;
  .van-nav-bar {
    padding-top: 0;
  }
  .ordercontent {
    height: 100vh;
    position: relative;
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
      padding: 0 10px;
      margin: 0 10px;
    }
  }
}
</style>

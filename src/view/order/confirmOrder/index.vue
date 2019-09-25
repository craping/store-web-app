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
        <div class="order-item" v-for="item in confirmOrderList" :key="item.skuId">
          <van-card
            :num="item.num"
            :price="item.price"
            :desc="item.subTitle"
            :title="item.title"
            :thumb="item.pic"
          >
            <div slot="tags">
              <van-tag
                plain
                type="danger"
                v-for="item in item.productAttr"
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
    <van-tabbar>
      <van-button type="danger" plain size="mini" @click="toSumbitOrder">去支付</van-button>
    </van-tabbar>
    <store-pay-dialog @closeDialog="closeDialog" @toPay="toPay" :show="showPayDialog"></store-pay-dialog>
    <van-action-sheet v-model="showAddress" :actions="addressList" @select="onSelect"/>
  </van-row>
</template>
<script>
import Vue from 'vue'
import { mapState } from 'vuex'
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
      // addressList: {
      //   id: '1',
      //   name: '张三',
      //   tel: '13000000000',
      //   address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室'
      // },
      showPayDialog: false, //支付弹框默认隐藏
      patyType: '', //获取支付方式

      /********联调后做的数据*******/
      confirmOrderList: [
        {
          skuId: 1, //skuId
          title: '标题', //标题
          subTitle: '子标题', //子标题
          supId: 1, //供应商ID
          price: 100, //商品价格
          pic:
            'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ac1bf58Ndefaac16.jpg', //图片
          num: 2, //数量
          productAttr: [
            {
              key: '颜色',
              value: '金色'
            },
            {
              key: '容量',
              value: '4G'
            }
          ]
        },
        {
          skuId: 2, //skuId
          title: '标题', //标题
          subTitle: '子标题', //子标题
          supId: 1, //供应商ID
          price: 100, //商品价格
          pic:
            'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ac1bf58Ndefaac16.jpg', //图片
          num: 2, //数量
          productAttr: [
            {
              key: '颜色',
              value: '白色'
            },
            {
              key: '容量',
              value: '4G'
            }
          ]
        }
      ],
      showAddress: false, //显示地址列表
      confirmedAddress: {}, //默认显示地址
      addressList: [
        {
          id: '1',
          name: '张三',
          tel: '13000000000',
          address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室'
        },
        {
          id: '2',
          name: '李四',
          tel: '1310000000',
          address: '浙江省杭州市拱墅区莫干山路 50 号'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      // confirmOrderList: state => state.order.confirmOrderList,
      platform: state => state.user.platform
    }),
    totalPrice() {
      return this.confirmOrderList.reduce((pre, cur) => {
        return pre + cur.price
      }, 0)
    }
  },
  created() {
    this.getAddress()
  },
  methods: {
    /*************返回点击事件***************/
    onClickLeft() {
      this.$router.go(-1)
    },

    /*************点击打开支付弹框事件*********/

    toShowPay() {
      this.showPayDialog = true
    },

    /*********获取用户的收货地址*********** */
    getAddress() {
      this.$http
        .get('/address/getUserInfoAddress')
        .then(data => {
          this.addressList = data.alert
          this.confirmedAddress = this.addressList[0] //默认地址
        })
        .catch(error => {
          console.log(error)
        })
    },

    //点击支付触发提交订单接口
    toSumbitOrder() {
      const params = {
        skuIds: ['134', '135'],
        addressId: '1',
        type: this.$route.query.type,
        sourceType: this.platform,
        quantity: 1,
        productAttr: { color: 'gold' },
        note: '备注',
        recommenderId: '123'
      }
      this.$http
        .post('/order/create', params)
        .then(data => {
          console.log(data)
          this.toShowPay()
        })
        .catch(error => {
          console.log(error)
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
    },

    /********打开地址列表**** */
    confirmAddress() {
      this.showAddress = true
    },
    /********确定好地址******* */
    onSelect(item) {
      this.confirmedAddress = item
      this.showAddress = false
    }
  }
}
</Script>
<style lang="scss" scoped>
.confirmOrder {
  padding-top: 46px;
  .ordercontent {
    position: relative;
    top: 20px;
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
      padding: 0 10px;
      margin: 0 10px;
    }
  }
}
</style>

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
            <van-card
              :num="product.nums"
              :title="product.title"
              :desc="product.desc"
              :price="product.price"
              thumb="https://img.yzcdn.cn/vant/t-thirt.jpg"
              @click="checkInfo(product.pid)"
            >
              <div slot="tags">
                <van-tag plain type="danger">{{product.tag}}</van-tag>
              </div>
              <div slot="footer" class="productSpec">
                <div>共{{product.nums}}件商品</div>
                <div>
                  应付款：￥
                  <span>{{product.nums*product.price}}</span>
                  (含运费￥{{product.freight}})
                </div>
              </div>
              <div slot="footer">
                <van-button
                  v-for="item in proEventList[`event${product.status}`]"
                  :key="item.id"
                  size="mini"
                  :class="item == '立即付款' ? 'tored' : ''"
                  @click.stop="proEventClick(product.pid,item)"
                >{{item}}</van-button>
              </div>
            </van-card>
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
  </van-row>
</template>
<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import storeScroller from '@/components/store-scroller'
import storeCard from '@/components/store-card'
import storePayDialog from '@/components/store-pay-dialog'
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
    storePayDialog
  },
  data() {
    return {
      active: 0, //默认为1
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
      proStatus: ['已发货', '待付款', '待发货', '待收货', '待评价'],
      showProductList: [],
      proEventList: {
        event1: ['立即付款', '取消订单'],
        event2: ['取消订单'],
        event3: ['确认收货', '查看物流', '退款'],
        event4: ['评价商品', '退货退款', '删除订单']
      },
      showPayDialog: false, //支付弹框默认隐藏
      patyType: '', //获取支付方式

      /***********联调用的的数据************* */
      pageNums: 1 //请求数据的页数
    }
  },
  created() {
    this.showProductList = this.productList
    this.active = this.$route.query.tabId
    this.$store.dispatch('order/getOrderList', {
      pageNum: 1,
      pageSize: 10
    })
  },
  computed: {
    ...mapState({
      orderList: state => state.order.orderList
    })
  },
  methods: {
    /*************返回点击事件***************/
    onClickLeft() {
      this.$router.go(-1)
    },

    /*************点击查看详情事件***************/
    checkInfo(id) {
      this.$router.push({
        name: 'orderinfo',
        params: {
          id
        }
      })
    },

    /*************tab切换标签点击事件*********/
    onClick(name) {
      if (name != 0) {
        this.showProductList = this.productList.filter(item => {
          return item.status == name
        })
      } else {
        this.showProductList = this.productList
      }
    },

    /************产品按钮点击点击事件*********/
    proEventClick(pid, event) {
      switch (event) {
        case '取消订单':
          this.confirmDialog('cancel', pid)
          break
        case '删除订单':
          this.confirmDialog('delete', pid)
          break
        case '查看物流':
          this.$router.push({
            name: 'productExpress',
            params: {
              pid
            }
          })
          break
        case '评价商品':
          this.$router.push({
            name: 'comment',
            params: {
              pid
            }
          })
          break
        case '退款':
          this.$router.push({
            name: 'refund',
            params: {
              pid
            }
          })
          break
        case '退货退款':
          this.$router.push({
            name: 'refund',
            params: {
              pid
            }
          })
          break
        case '立即付款':
          this.showPayDialog = true
          console.log('sadfkjskdfj', this.showPayDialog)
          break
        case '确认收货':
          this.$router.push({
            name: 'successfulOrder',
            params: {
              pid
            }
          })
          break
      }
    },

    /***********点击取消订单和删除订单弹窗事件*********/
    confirmDialog(type, pid) {
      let title = ''
      let message = ''
      if (type == 'cancel') {
        title = '取消订单'
        message = '确定取消这个订单吗？'
      } else {
        title = '删除订单'
        message = '确定删除这个订单吗？'
      }
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
    },

    /***********取消订单事件*********/
    cancelOrder(pid) {
      console.log('取消订单')
    },

    /***********删除订单事件*********/
    deleteOrder(pid) {
      console.log('删除订单')
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

    /***********下拉刷新事件*********/
    onRefresh(done) {
      this.pageNums += 1
      this.$store
        .dispatch('order/getOrderList', {
          pageNum: this.pageNums,
          pageSize: 10
        })
        .finally(() => {
          this.isLoading = false
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
    }

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

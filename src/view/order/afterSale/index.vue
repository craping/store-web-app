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
        <div v-for="product in listContainer" :key="product.id" class="pro-container">
          <van-card
            :num="product.productCount"
            :title="product.productName"
            :price="product.productPrice"
            :thumb="product.productPic"
          >
            <div slot="tags">
              <van-tag
                plain
                type="danger"
                v-for="(item,index) in JSON.parse(product.productAttr)"
                :key="index"
              >{{item.key}}:{{item.value}}</van-tag>
            </div>
            <div slot="footer" class="refundStatus">
              <p>退款金额:</p>
              <p>{{product.returnAmount}}元</p>
            </div>
            <div slot="footer" class="refundStatus">
              <p>退款原因:</p>
              <p>{{product.reason}}</p>
            </div>
            <div slot="footer" class="refundStatus">
              <van-icon name="cash-back-record"/>
              <p>{{asStatus[product. receiveStatus]}}</p>
              <p>{{afterSaleStatus[product.status]}}</p>
            </div>
            <div slot="footer">
              <van-button size="small" plain type="info" @click.stop="toRefundInfo(product)">查看详情</van-button>
              <van-button size="small" plain type="danger" @click.stop="cancelRefund(product)">取消售后</van-button>
            </div>
          </van-card>
        </div>
      </store-scroller>
    </div>
  </van-row>
</template>
<script>
import Vue from 'vue'
import { mapState } from 'vuex'
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
      // `status` int(1) DEFAULT NULL COMMENT '申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝；4->已取消',
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
      // 0->待处理；1->退货中；2->已完成；3->已拒绝；4->已取消
      afterSaleStatus: [
        '无售后',
        '待处理',
        '退货中',
        '已完成',
        '已拒绝',
        '已取消'
      ],

      /***联调后的数据***/
      listContainer: [], //用来放获取的数据列表数据
      pageNums: 1 //下拉刷新增加的页码数
    }
  },
  created() {
    this.getAfterSale()
  },
  computed: {
    ...mapState({
      afterSaleList: state => state.afterSale.afterSaleList
    })
  },
  methods: {
    /*************返回点击事件***************/
    onClickLeft() {
      this.$router.go(-1)
    },

    /************点击查看详情事件*********/
    toRefundInfo(p) {
      this.$router.push({
        name: 'refundInfo',
        params: {
          id: p.id
        }
      })
    },

    /***********下拉刷新事件*********/
    onRefresh(done) {
      this.pageNums += 1
      this.$store
        .dispatch('afterSale/getAfterSaleList', {
          pageNum: this.pageNums,
          pageSize: 10
        })
        .then(() => {
          this.listContainer = [...this.afterSaleList, ...this.listContainer]
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
    },
    /*********获取售后列表方法**********/
    getAfterSale() {
      this.$store
        .dispatch('afterSale/getAfterSaleList', {
          pageNum: 1,
          pageSize: 10
        })
        .then(() => {
          this.listContainer = [...this.afterSaleList]
        })
    },

    /********取消售后******** */
    cancelRefund(p) {
      debugger
      const params = {
        returnId: p.orderId,
        orderItemId: p.productId
      }
      Dialog.confirm({
        title: '取消售后',
        message: '确定取消此产品的售后？'
      })
        .then(() => {
          // on confirm
          this.$http
            .post('/orderReturnApply/cancel', params)
            .then(data => {
              console.log(data)
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</Script>
<style lang="scss" scoped>
.aftersale {
  .content {
    position: relative;
    top: 66px;
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

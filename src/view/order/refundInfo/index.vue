<template>
  <van-row class="refundInfo">
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
        <div class="ordestatus" v-if="isShow">
          <div class="tip">
            <h2>{{afterSaleStatus[refundSpecObj.status]}}</h2>
            <p>{{formatTime(refundSpecObj.createTime)}}</p>
          </div>
          <div class="ordericon">
            <van-icon name="after-sale"/>
          </div>
        </div>
        <div class="refundMoney">
          <van-cell-group>
            <van-cell title="退款总金额" :value="`￥${refundSpecObj.returnAmount}`"/>
            <!-- <van-cell title="退回微信钱包" class="redMoney" :value="returnAmount"/> -->
          </van-cell-group>
        </div>
        <div class="refundSpec">
          <van-cell title="退款信息"/>
          <van-card
            :num="refundSpecObj.productCount"
            :price="refundSpecObj.productPrice"
            :title="refundSpecObj.productName"
            :thumb="refundSpecObj.productPic"
          >
            <div slot="tags" v-if="refundSpecObj.productAttr">
              <van-tag
                plain
                type="danger"
                v-for="(item,index) in JSON.parse(refundSpecObj.productAttr)"
                :key="index"
              >{{item.key}}:{{item.value}}</van-tag>
            </div>
            <div slot="footer" class="footerPl">
              <p>退款金额:</p>
              <p>{{refundSpecObj.returnAmount}}元</p>
            </div>
            <div slot="footer" class="footerPl">
              <p>退款原因:</p>
              <p>{{refundSpecObj.reason}}</p>
            </div>
            <div slot="footer" class="footerPl">
              <p>申请时间:</p>
              <p>{{formatTime(refundSpecObj.createTime)}}</p>
            </div>
            <div slot="footer" class="footerPl">
              <p>申请人电话:</p>
              <p>{{refundSpecObj.returnPhone}}</p>
            </div>
            <div slot="footer" class="footerPl">
              <p>备注:</p>
              <p>{{refundSpecObj.description}}</p>
            </div>
          </van-card>
        </div>
        <div class="postExpressInfo">
          <van-cell-group v-if="isShowSumbit">
            <van-cell title="退货物流信息"/>
            <van-field
              v-model="expressNo"
              type="number"
              required
              clearable
              label="物流单号"
              placeholder="请输入物流单号"
            />

            <van-field
              v-model="expressCom"
              type="text"
              label="物流公司"
              placeholder="请输入物流公司"
              required
              clearable
            />
            <van-button plain hairline size="large" type="danger" @click="postExpressInfo">提交</van-button>
          </van-cell-group>
          <van-cell-group v-else>
            <van-cell title="退货物流信息"/>
            <van-field v-model="refundSpecObj.deliverySn" type="number" label="物流单号" disabled/>

            <van-field v-model="refundSpecObj.deliveryCompany" type="text" label="物流公司" disabled/>
          </van-cell-group>
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
  </van-row>
</template>
<script>
import Vue from 'vue'
import storeScroller from '@/components/store-scroller'
import storeCard from '@/components/store-card'
import { format } from '@/utils/util'
import {
  Tab,
  Tabs,
  NavBar,
  Card,
  Tag,
  Row,
  Toast,
  Icon,
  Cell,
  CellGroup,
  Button,
  Field
} from 'vant'
Vue.use(NavBar)
  .use(Tab)
  .use(Tabs)
  .use(Card)
  .use(Tag)
  .use(Row)
  .use(Toast)
  .use(Icon)
  .use(Cell)
  .use(CellGroup)
  .use(Button)
  .use(Field)
export default {
  name: 'orderinfo',
  components: {
    storeScroller,
    storeCard
  },
  data() {
    return {
      refundStep: ['退款处理中', '退款成功'],
      afterSaleStatus: ['待处理', '退货中', '已完成', '已拒绝', '已取消'],
      whichStep: 'success',
      totalMoney: '88',
      refundSpec: {
        pid: '1',
        title: '漂亮衣服',
        price: 20,
        sellnums: 1,
        tag: '七天无理由退货',
        reasons: {
          reason: '不喜欢',
          money: 88,
          applyTime: '2019-12-12 12:12',
          refundId: '0000000000'
        },
        expressInfo: '',
        applyStatus: 1, //0待处理，1退货中，2已完成，3已拒绝
        productStatus: 1 //0未收到货1已收到货
      },
      refundSpecList: ['退款原因', '退款金额', '申请时间', '退款编号'],
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
      expressNo: '', //物流单号
      expressCom: '', //物流公司,
      isShowSumbit: false, //是否显示提交物流信息

      /*******联调的新数据*******/
      refundSpecObj: {},
      isShow: false
    }
  },
  created() {
    this.getRefund()
  },
  methods: {
    /*************返回点击事件***************/
    onClickLeft() {
      this.$router.go(-1)
    },

    /***********下拉刷新事件*********/
    onRefresh(done) {
      this.$store.dispatch('home/content').finally(() => {
        // this.isLoading = false;
        if (done) done()
      })
    },
    /***********提交物流信息事件*********/
    postExpressInfo() {
      const deliverySn = this.expressNo
      const deliveryCompany = this.expressCom
      if (!deliverySn) {
        Toast.fail('请填写物流单号')
        return
      }
      if (!deliveryCompany) {
        Toast.fail('请填写物流公司')
        return
      }
      const params = {
        returnId: this.$route.params.id,
        deliverySn,
        deliveryCompany
      }
      this.$http
        .post('/orderReturnApply/insertDeliveryInfo', params)
        .then(data => {
          this.getRefund()
        })
    },

    /****** 获取售后详情 *****/
    getRefund() {
      this.$http
        .post('/orderReturnApply/detail', { returnId: this.$route.params.id })
        .then(data => {
          this.refundSpecObj = data.info
          this.isShowSumbit =
            !this.refundSpecObj.deliveryCompany &&
            !this.refundSpecObj.deliverySn &&
            this.refundSpecObj.receiveStatus == 1
          this.$nextTick(() => {
            this.isShow = true
          })
        })
    },
    formatTime(time) {
      return format(time, 'yyyy-MM-dd')
    }
  }
}
</Script>
<style lang="scss" scoped>
.refundInfo {
  padding-top: 66px;
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
    .ordericon {
      width: 50%;
      font-size: 100px;
      text-align: center;
      color: $red;
    }
  }
  .refundMoney {
    .redMoney {
      .van-cell__value {
        font-size: 18px;
        color: $red;
      }
    }
  }
  .refundSpec {
    background: #fff;
    margin-top: 10px;
    .van-card {
      background: #fff;
      border-bottom: 1px solid #eee;
    }
    .footerPl {
      display: flex;
      height: 20px;
      line-height: 20px;
      color: $gray-deep;
      margin-top: 10px;
      div {
        margin-right: 10px;
      }
    }
  }
  .postExpressInfo {
    margin-top: 10px;
    .van-button {
      margin-top: 15px;
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
}
</style>

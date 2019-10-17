<template>
  <van-row class="refund">
    <van-nav-bar
      fixed
      :z-index="100"
      title="选择服务类型"
      left-text="返回"
      right-text
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="proInfo" v-for="item in orderInfo" :key="item.id">
      <van-card
        :num="item.productQuantity"
        :price="item.productPrice"
        :title="item.productName"
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
      </van-card>
    </div>
    <div class="refundStatus">
      <van-cell-group>
        <van-cell title="我要退款(无需退货)" :label="selectedReason" is-link @click="noproduct"/>
        <van-cell title="我要退款退货" :label="selectedReason2" is-link @click="hasproduct"/>
      </van-cell-group>
    </div>
  </van-row>
</template>
<script>
import Vue from 'vue'
import { mapState } from 'vuex'
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
  ActionSheet,
  Cell,
  CellGroup,
  Field,
  Uploader
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
  .use(ActionSheet)
  .use(Cell)
  .use(CellGroup)
  .use(Field)
  .use(Uploader)
export default {
  name: 'refund',
  components: {
    storeScroller,
    storeCard
  },
  data() {
    return {
      refundStatusName: ['已收到货', '未收到货'],
      actions: [
        { name: '颜色不好看' },
        { name: '衣服尺寸太小了' },
        { name: '没钱了' }
      ],
      showReason: false,
      showExpressInfo: [],
      toggleShowName: '展开',
      isHide: true,
      selectedReason: '没收到货，或与卖家协商同意不用退货只退款',
      selectedReason2: '已收到货，需要退还收到的货物'
    }
  },
  computed: {
    ...mapState({
      checkInfoList: state => state.order.checkInfoList
    }),
    orderInfo() {
      return this.checkInfoList.orderItemList
    }
  },
  created() {
    console.log('dd', this.$route)
  },
  methods: {
    /*************返回点击事件***************/
    onClickLeft() {
      this.$router.go(-1)
    },
    noproduct() {
      this.toRefund('0')
    },
    hasproduct() {
      this.toRefund('1')
    },
    /************跳转到申请退款页面事件*********/
    toRefund(status) {
      this.$router.push({
        name: 'applyrefund',
        query: {
          pid: this.$route.params.pid,
          receiveStatus: status
        }
      })
    }
  }
}
</Script>
<style lang="scss" scoped>
.refund {
  padding-top: 46px;
  display: flex;
  flex-direction: column;
  .van-nav-bar {
    padding-top: 0;
  }
  .proInfo {
    .van-card {
      background: #fff;
    }
  }
  .refundStatus {
    margin-top: 10px;
  }
  .confirm {
    position: fixed;
    width: 100%;
    bottom: 0;
  }
}
</style>

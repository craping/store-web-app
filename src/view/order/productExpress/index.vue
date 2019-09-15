<template>
  <van-row class="successOrder">
    <van-nav-bar
      fixed
      :z-index="100"
      title="查看物流"
      left-text="返回"
      right-text
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="expressInfo">
      <img src="https://img.yzcdn.cn/vant/t-thirt.jpg">
      <div class="container">
        <div class="company">
          <p class="left">物流公司：</p>
          <p class="name">xxxxxxxx</p>
        </div>
        <div class="checkNum">
          <p class="left">物流单号：</p>
          <p class="num">123456</p>
          <van-button
            type="danger"
            plain
            hairline
            size="mini"
            data-clipboard-text="123456"
            @click="copyNum"
            class="copyNumClass"
          >复制</van-button>
        </div>
        <div class="telephone">
          <p class="left">物流电话：</p>
          <p class="name">95554</p>
        </div>
      </div>
    </div>
    <div class="expressStep">
      <van-nav-bar left-text="物流状态"/>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="(item,index) in showExpressInfo" :key="index">
          <h3>{{item.status}}</h3>
          <p>{{item.updateTime}}</p>
        </van-step>
      </van-steps>
      <van-button type="default" size="large" @click="toggleShow">{{toggleShowName}}</van-button>
    </div>
    <div class="content-container">
      <store-scroller @onRefresh="onRefresh">
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
import ClipboardJS from 'clipboard'
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
  Step,
  Steps
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
  .use(Step)
  .use(Steps)
export default {
  name: 'productExpress',
  components: {
    storeScroller,
    storeCard
  },
  data() {
    return {
      tipinfo: '去评价下本次的购物体验吧~',
      productList: [
        {
          pid: '1',
          title: '漂亮衣服',
          price: 20,
          sellnums: 1,
          tag: '七天无理由退货'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          price: 20,
          sellnums: 1,
          tag: '七天无理由退货'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          price: 20,
          sellnums: 1,
          tag: '七天无理由退货'
        },
        {
          pid: '1',
          title: '漂亮衣服漂亮衣服漂亮衣服漂亮衣服',
          price: 20,
          sellnums: 1,
          tag: '七天无理由退货'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          price: 20,
          sellnums: 1,
          tag: '七天无理由退货'
        },
        {
          pid: '1',
          title: '漂亮衣服',
          price: 20,
          sellnums: 1,
          tag: '七天无理由退货'
        }
      ],
      expressInfo: [
        { status: '【城市】物流状态3', updateTime: '2016-07-12 12:40' },
        { status: '【城市】物流状态2', updateTime: '2016-07-11 12:40' },
        { status: '【城市】物流状态1', updateTime: '2016-07-10 12:40' }
      ],
      showExpressInfo: [],
      toggleShowName: '展开',
      isHide: true
    }
  },
  created() {
    this.showExpressInfo = [this.expressInfo[0]]
  },
  methods: {
    /*************返回点击事件***************/
    onClickLeft() {
      this.$router.go(-1)
    },

    /*************展开收起按钮事件*********/
    toggleShow() {
      this.isHide = !this.isHide
      this.showExpressInfo =
        this.isHide == true ? [this.expressInfo[0]] : this.expressInfo
      this.toggleShowName = this.isHide == true ? '展开' : '收起'
    },

    /************复制按钮点击点击事件*********/
    copyNum() {
      var clipboard = new ClipboardJS('.copyNumClass')
      clipboard.on('success', function(e) {
        Toast.success(`复制成功${e.text}`)
        e.clearSelection()
      })

      clipboard.on('error', function(e) {
        Toast.fail('复制失败')
      })
    },

    /***********下拉刷新事件*********/
    onRefresh(done) {
      this.$store.dispatch('home/content').finally(() => {
        // this.isLoading = false;
        if (done) done()
      })
    }
  }
}
</Script>
<style lang="scss" scoped>
.successOrder {
  padding-top: 46px;
  display: flex;
  flex-direction: column;
  .van-nav-bar {
    padding-top: 0;
  }
  .expressInfo {
    background: #fff;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 20px;
    img {
      width: 20%;
      border: 1px solid $gray;
    }
    .container {
      width: 70%;
      height: 75%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .company,
      .checkNum,
      .telephone {
        display: flex;
        height: 33.333%;
        align-items: center;
        .num {
          margin-right: 10px;
        }
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
  .content-container {
    height: 300px;
    width: 100%;
    position: relative;
  }
}
</style>

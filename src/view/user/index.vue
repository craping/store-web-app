<template>
  <div class="user-page">
    <div class="curtain" ref="curtain">
      <div class="cav">
        <!-- <div class="no-vip-card">
          升级<span class="vip-grade-bar">会员等级</span>享受更多权益
        </div>-->
      </div>
    </div>
    <div class="top-info">
      <div class="row-1">
        <van-icon name="chat-o" @click="jumpLink('/message')" color="#fff" size="30"/>
      </div>
      <div class="row-2">
        <div class="head-img" src></div>
        <div class="base-info">
          <div class="phone-num">15323232323</div>
          <span class="vip-grade-bar">会员等级</span>
        </div>
      </div>
      <div class="vip-card" @click="jumpLink('/vip')">
        <div class="vip-row-1">
          <span class="word-text">
            <span>可提现余额(元)</span>
            <span class="money">142</span>
          </span>
          <span class="btn" @click.stop.prevent="jumpLink('/withdraw')">提现</span>
        </div>
        <div class="vip-row-2">
          <div class="gird-item">
            <span class="num">1123</span>
            <span>累计收益(元)</span>
          </div>
          <div class="gird-item">
            <span class="num">1123</span>
            <span>未到账余额(元)</span>
          </div>
          <div class="gird-item">
            <span class="num">13</span>
            <span>我的团队</span>
          </div>
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="my-order grid-panel">
        <div class="grid-top">
          <span>订单中心</span>
          <router-link :to="'/order'">
            <span class="link">查看全部订单></span>
          </router-link>
        </div>
        <van-grid :border="false" :column-num="5">
          <van-grid-item
            v-for="(tab,index) in orderTabs"
            :key="index"
            :icon="tab.icon"
            :text="tab.name"
            @click="jumpLink(tab.link,tab.prams)"
          />
        </van-grid>
      </div>
      <div class="my-service grid-panel">
        <div class="grid-top">
          <span>我的服务</span>
        </div>
        <van-grid :border="false">
          <van-grid-item
            v-for="(tab,index) in serviceTabs"
            :key="index"
            :icon="tab.icon"
            :text="tab.name"
            @click="jumpLink(tab.link)"
          />
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import storeNavBar from '@/components/store-nav-bar'
import { Grid, GridItem, Icon } from 'vant'
Vue.use(Grid).use(GridItem)

export default {
  components: {
    [Icon.name]: Icon,
    storeNavBar
  },

  data() {
    return {
      orderTabs: [
        {
          name: '待付款',
          link: '/order',
          icon: 'paid',
          prams: 1
        },
        {
          name: '待发货',
          link: '/order',
          icon: 'send-gift-o',
          prams: 2
        },
        {
          name: '待收货',
          link: '/order',
          icon: 'logistics',
          prams: 3
        },
        {
          name: '待评论',
          link: '/order',
          icon: 'label-o',
          prams: 4
        },
        {
          name: '退款/售后',
          link: '/aftersale',
          icon: 'refund-o'
        }
      ],
      serviceTabs: [
        {
          name: '收货地址',
          link: '/address',
          icon: 'location-o'
        },
        {
          name: '我的收藏',
          link: '/like',
          icon: 'like-o'
        },
        {
          name: '设置',
          link: '/setting',
          icon: 'setting-o'
        },
        {
          name: '客服',
          link: '',
          icon: 'service-o'
        }
      ]
    }
  },
  methods: {
    jumpLink(path, params) {
      this.$router.push({
        path,
        query: {
          tabId: params
        }
      })
    },
    toOrderCenter() {
      this.$router.push('/order')
    }
  }
}
</script>

<style lang="scss" scoped>
.user-page {
  padding-bottom: 50px;
  .curtain {
    display: flex;
    justify-content: center;
    overflow-x: hidden;
    position: absolute;
    width: 100vw;
    .cav {
      height: 191px;
      border-bottom-right-radius: 50%;
      border-bottom-left-radius: 50%;
      background-color: $red;
      flex: none;
      width: 200vw;
      display: flex;
      justify-content: center;
      overflow: hidden;
      .no-vip-card {
        height: 40px;
        width: 80vw;
        background: #50545f;
        align-self: flex-end;
        border-radius: 5px;
        padding-top: 10px;
        padding-left: 20px;
        color: #fbe5ae;
        .vip-grade-bar {
          margin: 0 4px;
        }
      }
    }
  }
  .vip-grade-bar {
    display: inline-block;
    padding: 0 4px;
    border-radius: 8px;
    color: #895c29;
    background: #fbe5ae;
  }
  .top-info {
    min-height: 191px;
    position: relative;
    padding: 0 15px;
    .row-1 {
      text-align: right;
      padding-top: 20px;
    }
    .row-2 {
      margin-top: 16px;
      display: flex;
      .head-img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #eee;
      }
      .base-info {
        margin-left: 20px;
        .phone-num {
          font-size: 16px;
          margin: 5px 0;
          color: #fff;
          font-weight: bold;
        }
      }
    }
    .vip-card {
      margin-top: 30px;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 20px;
      .vip-row-1 {
        height: 36px;
        background: #fbe5ae;
        padding: 0 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .word-text {
          color: #895c29;
          vertical-align: middle;
          span {
            vertical-align: middle;
          }
          .money {
            color: $red;
            font-size: 18px;
            padding-left: 5px;
          }
        }
        .btn {
          float: right;
          color: #fff;
          background: #895c29;
          border-radius: 8px;
          padding: 1px 6px;
        }
      }
      .vip-row-2 {
        background: #fff;
        display: flex;
        .gird-item {
          width: 33.3%;
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .num {
            font-weight: bold;
            font-size: 16px;
            padding-bottom: 10px;
            color: #000;
          }
          span {
            color: #888;
          }
        }
      }
    }
  }
  .main-content {
    .grid-panel {
      background: #fff;
      padding: 0 15px;
      margin: 0 15px 20px;
      border-radius: 5px;
      /deep/ .van-grid-item__content {
        padding: 16px 0;
      }
      .grid-top {
        padding-top: 15px;
        display: flex;
        justify-content: space-between;
        .link {
          color: $red;
        }
      }
    }
  }
}
</style>


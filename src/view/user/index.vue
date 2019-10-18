<template>
  <div class="user-page">
    <div class="curtain" ref="curtain">
      <div class="cav"></div>
    </div>
    <div class="top-info">
      <div class="row-1">
        <van-icon name="chat-o" @click="jumpLink('/message')" color="#fff" size="30" />
      </div>
      <div class="row-2">
        <div class="head-img" @click="jumpLink('/userInfo')"> 
          <img :src="umsMember.icon">
        </div>
        <div class="base-info">
          <div>
            <span class="nick-phone" @click="jumpLink('/userInfo')">{{umsMember.nickname || bindPhoneStr}}</span>&nbsp;
            <span class="vip-grade-bar" v-if="vipEnable">{{amsAccount.levelName}}</span>
          </div>
          <div class="vip-agentNo" v-if="vipEnable">邀请码 {{amsAccount.agentNo}} | <span class="copyAgentNo" :data-clipboard-text="amsAccount.agentNo" @click="copyAgentNo">复制</span></div>
        </div>
      </div>
      <div v-if="vipEnable" class="vip-card"  @click="jumpLink('/vip')">
        <div class="vip-row-1">
          <span class="word-text">
            <span>可提现余额(元)</span>
            <span class="money">{{amsAccount.balance}}</span>
          </span>
          <span class="btn" @click.stop.prevent="jumpLink('/withdraw')">提现</span>
        </div>
        <div class="vip-row-2">
          <div class="gird-item">
            <span class="num">{{amsAccount.income}}</span>
            <span>累计收益(元)</span>
          </div>
          <div class="gird-item">
            <span class="num">{{amsAccount.unreceivedIncome}}</span>
            <span>未到账余额(元)</span>
          </div>
          <div class="gird-item">
            <span class="num">{{amsAccount.directTeams}}</span>
            <span>我的团队</span>
          </div>
        </div>
      </div>
      <div v-else-if="!isVip && vipEnable" class="no-vip-card" @click="jumpLink('/vipGrade')">
        成为<span class="vip-grade-bar">会员</span>享受更多优惠
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
import Vue from "vue";
import { mapState, mapGetters } from "vuex";
import storeNavBar from "@/components/store-nav-bar";
import { Grid, GridItem, Icon, Toast } from "vant";
import Clipboard from "clipboard";
Vue.use(Grid).use(GridItem);


export default {
  components: {
    [Icon.name]: Icon,
    storeNavBar
  },

  data() {
    return {
      orderTabs: [
        {
          name: "待付款",
          link: "/order",
          icon: "paid",
          prams: 1
        },
        {
          name: "待发货",
          link: "/order",
          icon: "send-gift-o",
          prams: 2
        },
        {
          name: "待收货",
          link: "/order",
          icon: "logistics",
          prams: 3
        },
        {
          name: "待评论",
          link: "/order",
          icon: "label-o",
          prams: 4
        },
        {
          name: "退款/售后",
          link: "/aftersale",
          icon: "refund-o"
        }
      ],
      serviceTabs: [
        {
          name: "收货地址",
          link: "/address",
          icon: "location-o"
        },
        {
          name: "我的收藏",
          link: "/like",
          icon: "like-o"
        },
        {
          name: "设置",
          link: "/setting",
          icon: "setting-o"
        },
        {
          name: "客服",
          link: "",
          icon: "service-o"
        }
      ]
    };
  },
  computed:{
    ...mapState('user',{
      isVip: state => state.isVip,
      amsAccount: state => state.userInfo.amsAccount || {},
      umsMember: state => state.userInfo.umsMember || {},
    }),
    ...mapState('sys',{
      VIP_ENABLE: state => state.config.VIP_ENABLE,
    }),
    ...mapGetters('user',['bindPhoneStr']),
    ...mapGetters("sys", ["vipEnable"])
  },
  methods: {
    jumpLink(path, params) {
      this.$router.push({
        path,
        query: {
          tabId: params
        }
      });
    },
    toOrderCenter() {
      this.$router.push("/order");
    },
    copyAgentNo(){
      let clipboard = new Clipboard(".copyAgentNo");
      clipboard.on("success", e => {
        Toast.success("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        Toast.fail("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    }
  }
};
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
    }
  }
  .vip-grade-bar {
    display: inline-block;
    width: 56px;
    text-align: center;
    border-radius: 8px;
    color: #895c29;
    background: #fbe5ae;
  }
  .top-info {
    // min-height: 191px;
    position: relative;
    padding: 0 15px;
    .row-1 {
      text-align: right;
      padding-top: 20px;
    }
    .row-2 {
      margin-top: 16px;
      margin-bottom: 16px;
      display: flex;
      .head-img {
        background: #fff;
        border-radius: 50%;
        overflow: hidden;
        width: 60px;
        height: 60px;
        img{
          width: 60px;
          height: 60px;
        }
      }
      .base-info {
        margin-left: 20px;
        align-self: center;
        .nick-phone {
          font-size: 16px;
          margin: 5px 0;
          color: #fff;
          font-weight: bold;
        }
        .vip-agentNo{
          color:#fff;
          margin-top: 5px;
        }
      }
    }
    .no-vip-card {
      margin-top: 32px;
      margin-bottom: 16px;
      height: 40px;
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
    .vip-card {
      margin: 0px 0 20px;
      border-radius: 5px;
      overflow: hidden;
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
    position: relative;
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


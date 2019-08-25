<template>
  <div class="user-page">
    <div class="curtain" ref="curtain">
      <div class="cav">
        <!-- <div class="no-vip-card">
          升级<span class="vip-grade-bar">会员等级</span>享受更多权益
        </div> -->
      </div>
    </div>
    <div class="top-info">
      <div class="row-1"><van-icon name="chat-o" color="#fff" size="30" /></div>
      <div class="row-2">
        <div class="head-img" src=""></div>
        <div class="base-info">
          <div class="phone-num">15323232323</div>
          <span class="vip-grade-bar">会员等级</span>
        </div>
      </div>
      <div class="vip-card">
        <div class="vip-row-1">
          <span class="word-text">
            <span>可提现余额(元) </span>
            <span class="money">142</span>
          </span>
          <span class="btn">提现</span>
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
    <div class="main">
      <div class="my-order grid-panel">
        <div class="grid-top">
          <span>订单中心</span>
          <span class="link">查看全部订单></span>
        </div>
        <van-grid :border="false" :column-num="5">
          <van-grid-item 
            v-for="(tab,index) in orderTabs"
            :key="index"
            icon="gift"
            :text="tab.name"
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
            icon="gift"
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
import storeNavBar from "@/components/store-nav-bar";
import { Grid, GridItem, Icon, } from 'vant';
Vue.use(Grid).use(GridItem);

export default {
  components: {
    [Icon.name]: Icon,
    storeNavBar
  },
 
  data() {
    return {
      orderTabs:[
        {
          name:'待付款',
          link:''
        },
        {
          name:'待发货',
          link:''

        },
        {
          name:'待收货',
          link:''
        },
        {
          name:'待评论',
          link:''
        },
        {
          name:'退款/售后',
          link:''
        },
      ],
      serviceTabs:[
        {
          name:'收货地址',
          link:'/address'
        },
        {
          name:'我的收藏',
          link:''
        },
        {
          name:'设置',
          link:'/setting'
        },
        {
          name:'会员中心',
          link:'/vip'
        },
      ],
    };
  },
   methods: {
    jumpLink(path) {
       this.$router.push(path)
    }
  },
};
</script>

<style lang="scss" scoped>
  .user-page{
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
        .no-vip-card{
          height: 40px;
          width: 80vw;
          background: #50545F;
          align-self: flex-end;
          border-radius: 5px;
          padding-top: 10px;
          padding-left: 20px;
          color: #FBE5AE;
          .vip-grade-bar{
            margin: 0 4px;
          }
        }
      }
    }
    .vip-grade-bar{
        display: inline-block;
        padding: 0 4px;
        border-radius: 8px;
        color: #895C29;
        background: #FBE5AE;
      }
    .top-info{
      min-height: 191px;
      position: relative;
      padding: 0 15px;
      .row-1{
        text-align: right;
        padding-top: 15px;
      }
      .row-2{
        margin-top: 20px;
        display: flex;
        .head-img{
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #EEE;
        }
        .base-info{
          margin-left: 20px;
          .phone-num{
            font-size: 16px;
            margin: 5px 0;
            color: #FFF;
            font-weight: bold;
          }
          
        }
      }
      .vip-card{
        margin-top: 30px;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 20px;
        .vip-row-1{
          height: 36px;
          background: #FBE5AE;
          padding: 0 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .word-text{
            color: #895C29;
            vertical-align: middle;
            span{
              vertical-align: middle;
            }
            .money{
              color: $red;
              font-size: 18px;
              padding-left: 5px;
            }
          }
          .btn{
            float: right;
            color: #FFF;
            background: #895C29;
            border-radius: 8px;
            padding: 1px 6px;
          }
        }
        .vip-row-2{
          background: #FFF;
          display: flex;
          .gird-item{
            width: 33.3%;
            height: 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .num{
              font-weight: bold;
              font-size: 16px;
              padding-bottom: 10px;
              color: #000;
            }
            span{
              color: #888;
            }
          }
        }
      }
    }
    .main{
      .grid-panel{
        background: #fff;
        padding: 0 15px;
        margin: 0 15px 20px;
        border-radius: 5px;
        /deep/ .van-grid-item__content{
          padding: 16px 0;
        }
        .grid-top{
          padding-top: 15px;
          display: flex;
          justify-content: space-between;
          .link{
            color: #409EFF;
          }
        }
      }
    }
  }
</style>


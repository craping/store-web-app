<!--
 未结算
 -->
<template>
  <div class="unliquidated-page">
    <van-nav-bar class="nav" title="未结算收益" left-arrow @click-left="onClickLeft" fixed />
    <div class="content">
      <div class="month-item" ref="monthItem" v-for="i in 2">
        <div class="bill-list">
          <div class="bill-item" @click="jumpLink('/billDetail')" v-for="i in 8">
            <div class="col-1">
              <van-icon name="cart" size="35" color="#fcc" />
            </div>
            <div class="col-2">
              <div class="title">分享商品-用户13800000000</div>
              <div class="type">直推佣金</div>
              <div class="time">2019-07-23 12:13</div>
            </div>
            <div class="col-3">+15.00</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import {
  NavBar,
  Overlay,
  Sticky,
  ActionSheet,
  Popup,
  DatetimePicker,
  Icon,
  Tab,
  Tabs
} from "vant";
Vue.use(Tab)
  .use(Tabs)
  .use(Overlay)
  .use(Sticky)
  .use(ActionSheet)
  .use(Popup)
  .use(DatetimePicker)
  .use(NavBar)
  .use(Icon)
  .use(Sticky)
  .use(Overlay);
export default {
  data() {
    return {
    };
  },
  mounted() {
   
  },

  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path) {
      this.$router.push(path);
    },
  }
};
</script>
<style lang="scss" scoped>
.unliquidated-page {
  >>> .nav {
    z-index: 1000 !important;
  }
  .content {
    padding-top: 66px;
    .top-bar-wrapper {
      position: relative;
    }
    .top-bar {
      height: 30px;
      background: #fff;
      line-height: 30px;
      color: #999;
      padding: 0 15px;
      position: relative;
      z-index: 20;
      .exp {
        color: $red;
      }
    }
    .option-pop {
      height: 300px;
      padding: 0 15px;
      background: #fff;
      overflow: hidden;
      position: relative;
      z-index: 20;
      .title {
        font-size: 14px;
        margin: 20px 0;
      }
      .option-wrapper {
        display: flex;
        flex-wrap: wrap;
      }
      .option-item {
        background: #eee;
        border-radius: 2px;
        font-size: 12px;
        padding: 8px 0;
        width: 22%;
        text-align: center;
        margin-right: 10px;
        margin-bottom: 10px;
        &.active {
          background: #ffeeee;
          color: $red;
        }
      }

      .bottom-btn {
        position: absolute;
        width: 100%;
        height: 40px;
        bottom: 0;
        left: 0;
        display: flex;
        .btn {
          width: 50%;
          line-height: 40px;
          text-align: center;
          font-size: 14px;
          color: #fff;
          background: $red;
          &.reset {
            color: $red;
            background: #ffeeee;
          }
        }
      }
    }
  }
  .month-item {
    .info-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 15px;
      background: #f2f2f2;
    }
    .all-money {
      color: #999;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      text-align: right;
    }
    .bill-list {
      padding: 0 15px;
      background: #fff;
      .bill-item {
        padding: 10px 0;
        display: flex;
        align-items: center;
        .col-1 {
          width: 15%;
        }
        .col-2 {
          width: 55%;
          .title {
            font-size: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .type {
            margin: 6px 0;
          }
          .time {
            font-size: 10px;
            color: #999;
          }
        }
        .col-3 {
          width: 30%;
          font-size: 20px;
          text-align: right;
        }
      }
    }
  }
}
</style>
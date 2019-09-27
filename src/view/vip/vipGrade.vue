<!--
 会员等级页面
 -->
<template>
  <div class="vip-grade-page">
    <van-nav-bar title="会员等级" left-arrow @click-left="onClickLeft" fixed />
    <div class="title">钻石会员等级</div>
    <div class="subtitle">规则大解析</div>
    <div class="rule-table">
      <div class="tb-row head">
        <div class="left-col">等级</div>
        <div class="right-col">90天内订单数(笔)</div>
      </div>
      <div class="tb-row" v-for="i in 7">
        <div class="left-col">
          <i class="v">V</i>
          <i class="num">{{i}}</i>
        </div>
        <div class="right-col">≥{{i}}</div>
      </div>
    </div>
    <div class="tip">*会员等级根据上一日24:00为止的的订单数结算得出</div>
    <div class="rule-item">
      <i>1</i> 购买礼包注册成功即为新人，V1-V6会员按照最近90天内购物产生的订单数升降级。
    </div>
    <div class="rule-item">
      <i>2</i> 购买礼包注册成功即为新人，V1-V6会员按照最近90天内购物产生的订单数升降级。
    </div>
    <div class="rule-item">
      <i>3</i> 购买礼包注册成功即为新人，V1-V6会员按照最近90天内购物产生的订单数升降级。
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Icon, Field } from "vant";
import { format } from "@/utils/util";
import storeScroller from "@/components/store-scroller";

Vue.use(Field)
  .use(NavBar)
  .use(Icon);
export default {
  data() {
    return {
      loading: false,
      finished: false
    };
  },
  components: {
    storeScroller
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.vip-grade-page {
  background: #fddc8f;
  color: #a24b04;
  min-height: 100vh;
  padding-top: 66px;
  padding-bottom: 20px;
  .title {
    font-size: 30px;
    text-align: center;
    margin-top: 20px;
  }
  .subtitle {
    font-size: 20px;
    text-align: center;
    margin: 6px 0 20px;
  }
  .rule-table {
    margin: 0 25px;
    border-radius: 8px;
    border: 2px solid #a24b04;
    background: #fefaee;
    .tb-row {
      display: flex;
      font-size: 16px;
      height: 32px;
      line-height: 32px;
      &.head {
        height: 40px;
        line-height: 40px;
        font-weight: bold;
      }
      &:not(:last-child) {
        border-bottom: 1px solid #ddd;
      }
      .left-col {
        width: 30%;
        border-right: 1px solid #ddd;
        text-align: center;
        .v {
          font-weight: bolder;
        }
        .num {
          font-size: 10px;
        }
      }
      .right-col {
        width: 70%;
        text-align: center;
      }
    }
  }
  .tip {
    padding: 0 25px;
    margin: 6px 0 15px;
  }
  .rule-item {
    font-size: 14px;
    padding: 5px 25px;
    i {
      display: inline-block;
      background: #a24b04;
      color: #fddc8f;
      border-radius: 50%;
      width: 14px;
      height: 14px;
      font-size: 12px;
      line-height: 14px;
      text-align: center;
    }
  }
}
</style>
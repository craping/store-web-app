<!--
 提现页面
 -->
<template>
  <div class="withdraw-page">
    <van-nav-bar title="提现" left-arrow @click-left="onClickLeft" />
    <div class="bank-bar" @click="jumpLink('bankCard',{from:'choose',money:money})">
      <div class="col-left">
        <div class="col-mid" v-if="currentCard.id">
          <div class="title">{{currentCard.bankName}}</div>
          <div class="info">尾号{{currentCard.bankCardNumber.slice(-4)}}</div>
        </div>
        <div class="col-mid" v-else>
          <div class="title">请选择</div>
        </div>
      </div>
      <div>
        <van-icon name="arrow" color="#999" />
      </div>
    </div>
    <div class="withdraw-info">
      <div class="tip">
        <div><span>提现金额</span> (最少提现{{config.ACCOUNT_MIN_WITHDRAW}}元)</div>
        <div>
          手续费:{{(money * config.ACCOUNT_FEE * 0.01).toFixed(2)}}元 ({{config.ACCOUNT_FEE}}%)
        </div>
      </div>
      <div class="input-wrapper">
        <span>￥</span>
        <van-field
          input-align="right"
          v-model="money"
          type="number"
        />
        <!-- <input type="tel" v-model="money" :maxlength="10" /> -->
      </div>
      <div class="bottom-bar">
        <div class="can-use">可用余额 {{amsAccount.balance}}元</div>
        <div class="btn-text" @click="getAll">全部提现</div>
      </div>
    </div>
    <div class="btn" :class="{'disable':!canApply}" @click="sureHandle">下一步</div>
  </div>
</template>
<script>
import Vue from "vue";
import {  } from 'vant';
import { NavBar, Icon, Field, Toast, NumberKeyboard } from "vant";
import { mapState } from "vuex";

Vue.use(Field)
  .use(NavBar)
  .use(NumberKeyboard)
  .use(Toast)
  .use(Icon);
export default {
  data() {
    return {
      money: ""
    };
  },
  computed: {
    ...mapState("user", {
      bindPhone: state => state.bindPhone,
      amsAccount: state => state.userInfo.amsAccount || {}
    }),
    ...mapState("bankCard", {
      currentCard: state => state.currentCard
    }),
    ...mapState('sys',{
      config: state => state.config,
    }),
    canApply() {
      return this.money && this.currentCard.id && this.money >= this.config.ACCOUNT_MIN_WITHDRAW;
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getAll() {
      this.money = this.amsAccount.balance;
      this.$forceUpdate()
    },
    jumpLink(path, query) {
      this.$router.push({ path, query });
    },
    sureHandle() {
      if (!this.canApply) return;
      if (this.money > this.amsAccount.balance) {
        Toast('可用余额不足')
        return
      }
      if (!this.bindPhone) {
        Toast('请去设置->账户安全中绑定手机号')
        return
      }
      this.jumpLink('withdrawCheck',{amount:this.money,bankCardId:this.currentCard.id})
    }
  }
};
</script>
<style lang="scss" scoped>
.withdraw-page {
  .bank-bar {
    margin: 15px 0 20px;
    height: 60px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    .col-left {
      display: flex;
    }
    .bank-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #eee;
      margin-right: 15px;
    }
    .col-mid {
      display: flex;
      flex-direction: column;
      justify-content: center;
      .title {
        color: #333;
        font-size: 16px;
      }
      .info {
        font-size: 14px;
        color: #999;
      }
    }
  }
  .withdraw-info {
    background: #fff;
    overflow: hidden;
    padding: 0 15px;
    color: #888;
    .tip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      margin-top: 20px;
      span{
        font-size: 15px;
      }
    }
    .input-wrapper {
      margin: 20px 0 10px;
      height: 60px;
      display: flex;
      color: #000;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.08);
      span {
        width: 50px;
        font-size: 40px;
      }
      /deep/ input {
        flex: 1;
        height: 100%;
        border: 0;
        font-size: 30px;
        text-align: right;
      }
    }
    .bottom-bar {
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      font-size: 13px;
      .can-use {
      }
      .btn-text {
        color: $red;
      }
    }
  }
  .btn {
    margin: 30px 15px;
    height: 40px;
    line-height: 40px;
    background: $red;
    border-radius: 5px;
    text-align: center;
    font-size: 16px;
    color: #fff;
    &.disable {
      background: rgba($color: $red, $alpha: 0.5);
    }
  }
}
</style>
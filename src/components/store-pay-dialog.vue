<template>
  <div class="payDialog">
    <van-action-sheet
      v-model="showDialog"
      @click-overlay="cancelDialog"
      @cancel="cancelDialog"
      title="支付方式"
    >
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell title="微信支付" icon="wechat" clickable @click="wxClick">
            <van-radio slot="right-icon" name="wx"/>
          </van-cell>
          <van-cell title="支付宝支付" icon="alipay" clickable @click="aliClick">
            <van-radio slot="right-icon" name="ali"/>
          </van-cell>
          <van-cell title="钱包-余额支付" icon="gold-coin" clickable @click="balanceClick">
            <van-radio slot="right-icon" name="balance"/>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <div class="btn">
        <van-button type="danger" size="large" @click="payClick">去支付</van-button>
      </div>
    </van-action-sheet>
  </div>
</template>


<script>
import Vue from 'vue'
import {
  ActionSheet,
  CellGroup,
  Cell,
  RadioGroup,
  Radio,
  Button,
  Icon
} from 'vant'
import { get } from 'http'
Vue.use(ActionSheet)
  .use(CellGroup)
  .use(Cell)
  .use(RadioGroup)
  .use(Radio)
  .use(Button)
  .use(Icon)
export default {
  name: 'store-pay-dialog',
  data() {
    return {
      showDialog: this.show,
      radio: 'wx'
    }
  },
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    cancelDialog() {
      this.$emit('closeDialog', false)
    },
    wxClick() {
      this.radio = 'wx'
    },
    aliClick() {
      this.radio = 'ali'
    },
    balanceClick() {
      this.radio = 'balance'
    },
    payClick() {
      this.$emit('toPay', this.radio)
    }
  },
  watch: {
    show(newValue, oldValue) {
      this.showDialog = newValue
    }
  }
}
</script>
<style lang="scss" scoped>
.payDialog {
  .van-popup {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
  .van-action-sheet__header {
    text-align: left;
    padding: 10px;
  }
  .van-cell__left-icon {
    font-size: 30px;
  }
  .van-icon-wechat {
    color: #39b94e;
  }
  .van-icon-alipay {
    color: #108ee9;
  }
  .van-icon-gold-coin {
    color: $red;
  }
  .btn {
    margin: 20px 0;
    padding: 0 20px;
    .van-button--large {
      border-radius: 25px;
    }
  }
}
</style>

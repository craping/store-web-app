<template>
  <div class="payDialog">
    <van-action-sheet
      v-model="showDialog"
      @click-overlay="cancelDialog"
      @cancel="cancelDialog"
      title="支付方式">
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell
            v-for="item in payChannels"
            :key="item.id"
            :title="item.channelName == '余额支付' ? `余额支付(余额: ${userInfo.amsAccount.balance || 0})`:item.channelName"
            :icon="icons[item.type]"
            clickable
            @click="getChannelClick(item.type, item.methodType)"
          >
            <van-radio slot="right-icon" :name="item.type"/>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <div class="btn">
        <van-button type="danger" size="large" @click="payClick">去支付</van-button>
      </div>
    </van-action-sheet>

    <van-overlay v-show="showOverlay" @click="closeOverLay"/>
    <van-password-input
      v-if="showOverlay"
      :value="password"
      info="请输入6位数字密码"
      :focused="showKeyboard"
      @focus="showKeyboard = true"
    />
    <van-number-keyboard
      :show="showKeyboard"
      theme="custom"
      close-button-text="完成"
      @blur="showKeyboard = false"
      @input="onInput"
      @delete="onDelete"
    />
  </div>
</template>


<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  ActionSheet,
  CellGroup,
  Cell,
  RadioGroup,
  Radio,
  Button,
  Icon,
  PasswordInput,
  NumberKeyboard,
  Overlay
} from 'vant'
import { get } from 'http'
import { setTimeout } from 'timers'
import md5 from 'js-md5'
import { getToken } from '@/utils/auth'
Vue.use(ActionSheet)
  .use(CellGroup)
  .use(Cell)
  .use(RadioGroup)
  .use(Radio)
  .use(Button)
  .use(Icon)
  .use(PasswordInput)
  .use(NumberKeyboard)
  .use(Overlay)
export default {
  name: 'store-pay-dialog',
  data() {
    return {
      showDialog: this.show,
      radio: '', // 支付方式
      methodType: '', // 支付类型
      icons: {
        'ALIPAY': 'alipay',
        'WXPAY': 'wechat',
        'BALANCE': 'gold-coin'
      },
      showOverlay: false, //遮罩层
      password: '',
      showKeyboard: false
    }
  },
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState({
      payChannels: state => state.payChannel.payChannel,
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    cancelDialog() {
      this.$emit('closeDialog', false)
    },
    getChannelClick(c, t) {
      // c=> BALANCE余额 WXPAY ALIPAYPAYS
      console.log(c)
      console.log(t)
      this.radio = c
      this.methodType = t
      if (c == 'BALANCE') {
        if (this.userInfo.payLogo) { 
          this.showOverlay = true
          this.showDialog = false
        } else {
          // 跳转到设置密码
          this.$router.push('editPayPassword')
        }
      }
    },
    /* 去支付 */
    payClick() {
      this.$emit('toPay', this.radio, this.methodType)
    },
    onInput(key) {
      this.password = (this.password + key).slice(0, 6)
      if (this.password.length == 6) {
        const token = getToken()
        // this.$emit('getPayPassword', md5(token + md5(this.password)))
        this.$emit('getPayPassword', md5(this.password))
        this.showOverlay = false
        this.showKeyboard = false
        this.showDialog = false
        // this.radio = ''
        this.password = ''
        setTimeout(() => {
          this.$emit('toPay', this.radio, this.methodType)
        }, 0)
      }
    },
    onDelete() {
      this.password = this.password.slice(0, this.password.length - 1)
    },
    closeOverLay() {
      this.showOverlay = false
      this.showDialog = true
      this.radio = ''
      this.password = ''
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
  .van-overlay {
    z-index: 200 !important;
  }
  .van-password-input {
    z-index: 201;
    transform: translateY(-100%);
    .van-password-input__info {
      color: #fff;
    }
  }
  .van-number-keyboard {
    z-index: 201 !important;
  }
}
</style>

<template>
  <div>
    <van-nav-bar
      fixed
      :z-index="100"
      title="支付结果"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import { Dialog, NavBar } from 'vant'
Vue.use(Dialog).use(NavBar)
export default {
  name: 'payBack',
  created() {
    // document.addEventListener('visibilitychange', this.handler)
    this.handler()
  },
  methods: {
    handler() {
      // tradeNo
      console.log('this.$route.query', this.$route.query)
      this.$http
        .post('trade/tradeDetail', { tradeNo: this.$route.query.tradeNo })
        .then(data => {
          if (data.errcode == 0) {
            Dialog.confirm({
              title: '支付成功',
              message: data.info
            })
              .then(() => {
                // on confirm
                this.$router.push('/order')
              })
              .catch(() => {
                // on cancel
                this.$router.push('/order')
              })
          } else {
            Dialog.confirm({
              title: '支付失败',
              message: data.info
            })
              .then(() => {
                // on confirm
                this.$router.push('/order')
              })
              .catch(() => {
                // on cancel
                this.$router.push('/order')
              })
          }
        })
    },
    onClickLeft() {
      this.$router.push('/order')
    }
  }
}
</script>

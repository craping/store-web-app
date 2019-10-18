<template>
  <van-overlay :show="true">
    <van-loading vertical>加载中...</van-loading>
  </van-overlay>
</template>
<script>
import Vue from 'vue'
import { Loading, Overlay } from 'vant'
Vue.use(Loading).use(Overlay)
export default {
  name: 'store-loding'
}
</script>
<style lang="scss" scoped>
.van-loading {
  position: relative;
  top: 50%;
  display: flex;
  justify-content: center;
}
</style>

<template>
  <div>
    <router-view class="main"></router-view>
    <store-tabbar v-show="!hideBotBar"/>
  </div>
</template>

<script>
import storeTabbar from "../../components/store-tabbar";

export default {
  components: {storeTabbar},
  data() {
    return {
      hideBotBar: this.$route.query.hideBotBar
    }
  }
};
</script>

<style lang="scss">
.main{
  background-color: $bg-color;
  // margin-bottom: 50px;
  // padding-left: 15px;
  // padding-right: 15px;
}
</style>

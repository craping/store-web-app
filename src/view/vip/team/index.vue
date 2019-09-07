<template>
  <div class="tema-page">
    <van-nav-bar :title="isMy?'我的团队':'他的团队'" left-arrow @click-left="onClickLeft" fixed />
    <div class="page-content">
    <van-sticky :offset-top="66" v-if="!isMy">
      <item-card :isTop="true"></item-card>
    </van-sticky>
      <item-card v-for="i in 11" @toNext="toNext"></item-card>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Cell, CellGroup, Tab, Sticky, Icon } from "vant";
import itemCard from './item-card'
Vue.use(Tab)
  .use(Sticky)
  .use(Cell)
  .use(CellGroup)
  .use(NavBar)
  .use(Icon);
export default {
  data() {
    return {
        isMy: true
    };
  },
  components:{
      itemCard
  },
  watch:{
      $route(to,from){
          if(to.query.id){
              this.isMy = false
          }else{
              this.isMy = true
          }
      }
  },
  mounted(){

  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path) {
      this.$router.push(path);
    },
    toNext() {
      this.$router.push({path:'team',query:{id:Math.random()}})
    }
  }
};
</script>
<style lang="scss" scoped>
.tema-page {
  .page-content {
    padding-top: 66px;
  }
}
</style>
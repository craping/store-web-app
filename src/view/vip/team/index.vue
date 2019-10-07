<template>
  <div class="tema-page">
    <van-nav-bar :title="isMy?'我的团队':'他的团队'" left-arrow @click-left="onClickLeft" fixed />
    <div class="page-content">
    <!-- <van-sticky :offset-top="66" v-if="!isMy">
      <item-card :isTop="true"></item-card>
    </van-sticky> -->
      <item-card v-for="(item,index) in subAgents" :key="index" @toNext="toNext(item)"></item-card>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Cell, CellGroup, Tab, Sticky, Icon, Toast } from "vant";
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
        isMy: true,
        subAgents: [],
        parentId: this.$route.query.parentId
    };
  },
  components:{
      itemCard
  },
  watch:{
      $route(to,from){
          if(to.query.parentId){
              this.isMy = false
          }else{
              this.isMy = true
          }
      }
  },
  mounted(){
    this.getSubAgents()
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    toNext(item) {
      this.$router.push({path:'team',query:{parentId:item.parentId}})
    },
    getSubAgents() {
      const params = {
        parentId: this.$route.query.parentId,
        pageNum: 0,
        pageSize: 10,
      }
      this.$http
        .post("/account/subAgents", params)
        .then(res => {
          this.subAgents = res.info
        })
        .catch(error => {
          Toast(error.message)
        });
      
    },
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
 <!--我的收藏-->
<template>
  <div class="like-page">
    <van-nav-bar title="我的收藏" left-arrow fixed @click-left="onClickLeft" />
    <!-- <store-scroller class="scoll-s" @onRefresh="onRefresh" @onInfinite="onLoad"> -->
      <div class="content">
        <van-card
          class="round"
          v-for="(item) in likeList"
          :key="item.productId"
          :price="item.price"
          :title="item.name"
          :desc="item.description"
          :thumb="item.pic"
          :lazy-load="true"
          @click="toDetail(item)"
        >
          <template v-slot:num>
            <van-button type="danger" size="mini" round @click.stop="cancelLike(item)">取消收藏</van-button>
          </template>
        </van-card>
      </div>
    <!-- </store-scroller> -->
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Icon, Card, Button, Toast } from "vant";
Vue.use(Card)
  .use(NavBar)
  .use(Button)
  .use(Icon);
import storeScroller from "@/components/store-scroller";

export default {
  components: {
    storeScroller
  },
  data() {
    return {
      likeList: []
    };
  },

  created() {
    this.getLikeList();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getLikeList() {
      return new Promise((resolve, reject) => {
        this.$http
          .post("/collec/getProductList", {})
          .then(res => {
            this.likeList = res.info || [];
            resolve();
          })
          .catch(error => {
            Toast(error.message);
            reject();
          });
      });
    },
    jumpLink(path) {
      this.$router.push(path);
    },
    onRefresh(done) {
      this.getLikeList().finally(() => {
        if (done) done();
      });
    },
    onLoad(done) {
      if (done) done(true);
    },
    toDetail(item) {
      this.$router.push({name:'goods',params:{id:item.productId}})
    },
    cancelLike(item) {
      this.$http
        .post("/collec/deleteProduct", { id: item.productId })
        .then(res => {
          Toast('删除成功');
        })
        .catch(error => {
          Toast(error.message);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.like-page {
  .content {
    padding-top: 66px;
    /deep/ .van-card__content {
      justify-content: space-around;
    }
  }
}
</style>
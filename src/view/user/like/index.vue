 <!--我的收藏-->
<template>
  <div class="like-page">
    <van-nav-bar title="我的收藏" left-arrow @click-left="onClickLeft" />
    <store-scroller class="scoll-s" @onRefresh="onRefresh" @onInfinite="onLoad">
      <div class="content">
        <van-card
          class="round"
          v-for="(item) in content.hotProductList"
          :key="item.id"
          :price="item.price"
          :origin-price="item.originalPrice"
          :title="item.name"
          :desc="item.subTitle"
          :thumb="item.pic"
          :lazy-load="true"
          @click="toDetail(item)"
        >
          <template v-slot:num>
            <van-button type="danger" size="mini" round @click.stop="cancelLike">取消收藏</van-button>
          </template>
        </van-card>
      </div>
    </store-scroller>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Icon, Card, Button } from "vant";
Vue.use(Card)
  .use(NavBar)
  .use(Button)
  .use(Icon);
import storeScroller from "@/components/store-scroller";
import { mapState } from "vuex";

export default {
  components: {
    storeScroller,
  },
  data() {
    return {};
  },
  computed: {

  ...mapState({
    content: state => state.home.content
  }),
  },
  created() {
    this.$store.dispatch("home/content");
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    jumpLink(path) {
      this.$router.push(path);
    },
    onRefresh(done) {
      setTimeout(() => {
        if (done) done();
      }, 300);
    },
    onLoad(done) {
      if (done) done(true);
    },
    toDetail(item){
        console.log('todetail')
    },
    cancelLike(item){
        console.log('cancel')
    },
  }
};
</script>
<style lang="scss" scoped>
.like-page {
  .content {
    padding-top: 66px;
    >>>.van-card__content{
        justify-content: space-around;
    }
  }
}
</style>
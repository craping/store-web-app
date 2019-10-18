 <!--个人消息-->
<template>
  <div class="message-list-page">
    <van-nav-bar :title="title" left-arrow @click-left="onClickLeft" fixed />
    <div class="page-content">
      <store-scroller class="scoll-s" @onRefresh="onRefresh" @onInfinite="onLoad">
        <div class="item-bar van-hairline--bottom" v-for="i in 5" @click="jumpLink('messageDetail',{id:id})">
          <div class="left-col">
            <img src />
          </div>
          <div class="right-col">
            <div class="title">消息标题</div>
            <div class="info">内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容</div>
          </div>
        </div>
      </store-scroller>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar } from "vant";
Vue.use(NavBar);
import storeScroller from "@/components/store-scroller";

export default {
  data() {
    return {
      title: this.$route.query.title,
      id: 1,
      list: [],
    };
  },

  components: {
    storeScroller
  },
  mounted() {
    this.getMessageList()
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getMessageList() {
      return new Promise((resolve, reject) => {
        this.$http
          .post("/config/getSystemMessages", {})
          .then(res => {
            this.list = res.info || [];
            resolve();
          })
          .catch(error => {
            Toast(error.message);
            reject();
          });
      });
    },
    jumpLink(path, query) {
      this.$router.push({ path, query });
    },
    onRefresh(done) {
      setTimeout(() => {
        if (done) done();
      }, 300);
    },
    onLoad(done) {
      if (done) done();
    },

  }
};
</script>
<style lang="scss" scoped>
.message-list-page {
  .page-content {
    padding-top: 66px;
    /deep/ .scoll-s {
      ._v-container {
        padding-top: 66px;
      }
    }
    .item-bar {
      height: 80px;
      padding: 0 15px;
      display: flex;
      background: #fff;
      margin: 8px 0;
      border-radius: 5px;
      .left-col {
        align-self: center;
        width: 50px;
        height: 50px;
        background: #eee;
        border-radius: 50%;
        margin-right: 10px;
      }
      .right-col {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .title {
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .info {
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          color: #999;
        }
      }
    }
  }
}
</style>
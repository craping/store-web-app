 <!--个人消息-->
<template>
  <div class="message-list-page">
    <van-nav-bar :title="title" left-arrow @click-left="onClickLeft" fixed />
    <div class="page-content">
      <store-scroller class="scoll-s" @onRefresh="onRefresh" @onInfinite="onLoad">
        <div
          class="item-bar van-hairline--bottom"
          v-for="(msg, index) in messageList"
          :key="index"
          @click="showDetail(msg.content)"
        >
          <div class="right-col">
            <div class="title">
              <span>{{msg.title}}</span>
              <span>{{formatTime(msg.sendTime)}}</span>
            </div>
            <div class="info">{{msg.content}}</div>
          </div>
        </div>
      </store-scroller>
    </div>
    <van-popup
      v-model="show"
      closeable
      position="bottom"
      :style="{ height: '90%' }"
    >
      <div class="content" style="padding:30px 10px 10px;" v-html="content"></div>
    </van-popup>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Popup } from "vant";
Vue.use(NavBar)
.use(Popup);
import storeScroller from "@/components/store-scroller";
import { mapActions, mapState } from "vuex";
import { format } from "@/utils/util";

export default {
  data() {
    return {
      title: this.$route.query.title,
      show:false,
      content:""
    };
  },

  components: {
    storeScroller
  },
  computed: {
    ...mapState("message", {
      messageList: state => state.messageList
    })
  },
  mounted() {
    this.getMessageList();
  },
  methods: {
    ...mapActions("message", ["getMessageList"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path, query) {
      this.$router.push({ path, query });
    },
    showDetail(content){
      this.show = true;
      this.content = content;
    },
    onRefresh(done) {
      this.getMessageList().finally(() => {
        if (done) done();
      });
    },
    onLoad(done) {
      if (done) done();
    },
    formatTime(time) {
      return format(time, "yyyy-MM-dd");
    }
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
          display: flex;
          justify-content: space-between;
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
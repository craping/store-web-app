<!--
 未结算收益
 -->
<template>
  <div class="bill-page">
    <van-nav-bar class="nav" title="未结算收益" left-arrow @click-left="onClickLeft" fixed />
    <div class="content">
      <van-sticky :offset-top="66" :z-index="101">
        <div class="top-bar-wrapper">
          <div
            id="filter-node"
            class="top-bar van-hairline--bottom"
            :class="{isPup:filterShow}"
            @click="filterShow = !filterShow"
          >
            <span :class="{'exp':filterShow}">
              筛选
              <van-icon v-show="!filterShow" name="arrow-down" />
              <van-icon v-show="filterShow" name="arrow-up" />
            </span>
          </div>
        </div>
      </van-sticky>
      <van-list v-model="loading" :finished="finished" :error.sync="error" error-text="请求失败，点击重新加载"  finished-text="没有更多了" @load="onLoad">
          <div class="bill-list">
            <div class="bill-item" @click="jumpLink('/billDetail',{id:item.id})" v-for="item in list" :key="item.id">
              <div class="col-1">
                <van-icon name="cart" size="35" color="#fcc" />
              </div>
              <div class="col-2">
                <div class="title">购买商品名购买商品名称是多少来得及称是多少来得及</div>
                <div class="type">订单交易</div>
                <div class="time">2019-07-23 12:13</div>
              </div>
              <div class="col-3">+15.00</div>
            </div>
        </div>
      </van-list>
      <van-popup
        v-model="filterShow"
        position="top"
        :get-container="getContainer"
        :style="{top: '96px'}"
      >
        <div>
          <div class="option-pop" v-show="filterShow">
            <div class="item">
              <div class="title">快捷筛选</div>
              <div class="option-wrapper">
                <div
                  class="option-item"
                  v-for="(item,index) in channelList"
                  :class="{'active':channelId == item.id}"
                  :key="index"
                  @click="selectQuik(item)"
                >{{item.name}}</div>
              </div>
            </div>
            <div class="bottom-btn">
              <div class="btn reset" @click="reset">重置</div>
              <div class="btn" @click="queryHandle">确定</div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { format } from "@/utils/util";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("bill");
import {
  NavBar,
  Overlay,
  Sticky,
  ActionSheet,
  Popup,
  DatetimePicker,
  Icon,
  Tab,
  Tabs,
  Toast,
  List
} from "vant";
Vue.use(Tab)
  .use(Tabs)
  .use(Sticky)
  .use(ActionSheet)
  .use(Popup)
  .use(DatetimePicker)
  .use(NavBar)
  .use(Icon)
  .use(List)
  .use(Overlay);
export default {
  data() {
    return {
      filterShow: false,
      channelList: [
        {
          name: "全部分类",
          id: null
        },
        {
          name: "购物返现",
          id: "1"
        },
        {
          name: "分销佣金",
          id: "2"
        },
        {
          name: "直推佣金",
          id: "3"
        }
      ],
      channelId: null,
      mode: this.$route.query.mode, // d:今日，m:本月
      pageNum: 1,
      pageSize: 10,
      loading: false,
      finished: false,
      error: false,
      list: []
    };
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  computed: {},
  methods: {
    getContainer() {
      return document.querySelector(".top-bar-wrapper");
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path, query) {
      this.$router.push({ path, query });
    },
    selectQuik(item) {
      this.channelId = item.id;
    },
    reset() {
      this.channelId = null;
    },
    queryHandle() {
      this.pageNum = 1
      this.list = 0
      this.queryRequest()
    },
    queryRequest() {
      this.filterShow = false
      const params = {
        mode: this.mode,
        channel: this.channelId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      return new Promise((resolve, reject) => {
        this.$http
          .post("/account/bill/unsettled", params)
          .then(res => {
            let temList = res.info || []
            this.list = this.list.concat(temList);
            if(this.list.length == res.totalnum){
              this.finished = true
            }
            resolve();
          })
          .catch(error => {
            Toast(error.message);
            reject();
          });
      });
    },
    onLoad() {
      this.queryRequest().then(()=>{
        this.pageNum++
        this.loading = false;
      }).catch(()=>{
        this.error = true
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.bill-page {
  /deep/ .nav {
    z-index: 3000 !important;
  }
  .content {
    padding-top: 66px;
    .top-bar-wrapper {
      position: relative;
    }
    .top-bar {
      height: 30px;
      background: #fff;
      line-height: 30px;
      color: #999;
      padding: 0 15px;
      position: relative;
      z-index: 20;
      .exp {
        color: $red;
      }
      &.isPup {
        z-index: 3000;
      }
    }
    .option-pop {
      height: 180px;
      padding: 0 15px;
      background: #fff;
      overflow: hidden;
      position: relative;
      z-index: 20;
      .title {
        font-size: 14px;
        margin: 20px 0;
      }
      .option-wrapper {
        display: flex;
        flex-wrap: wrap;
      }
      .option-item {
        background: #eee;
        border-radius: 2px;
        font-size: 12px;
        padding: 8px 0;
        width: 22%;
        text-align: center;
        margin: 0 2% 2% 0;

        &.active {
          background: #ffeeee;
          color: $red;
        }
      }

      .bottom-btn {
        position: absolute;
        width: 100%;
        height: 40px;
        bottom: 0;
        left: 0;
        display: flex;
        .btn {
          width: 50%;
          line-height: 40px;
          text-align: center;
          font-size: 14px;
          color: #fff;
          background: $red;
          &.reset {
            color: $red;
            background: #ffeeee;
          }
        }
      }
    }
  }
  .tool-bar {
    padding: 5px 15px;
    display: flex;
    justify-content: space-between;
    > div {
      font-size: 14px;
    }
    .sure {
      color: $red;
    }
  }

  .bill-list {
    padding: 0 15px;
    background: #fff;
    .bill-item {
      padding: 10px 0;
      display: flex;
      align-items: center;
      .col-1 {
        width: 15%;
      }
      .col-2 {
        width: 55%;
        .title {
          font-size: 14px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .type {
          margin: 6px 0;
        }
        .time {
          font-size: 10px;
          color: #999;
        }
      }
      .col-3 {
        width: 30%;
        font-size: 20px;
        text-align: right;
      }
    }
  }
  .date-select-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 50px;
    .date-input {
      width: 40%;
      flex: 1;
      text-align: center;
      border-bottom: 1px solid #333;
      padding-bottom: 4px;
      &.active {
        border-bottom: 1px solid $red;
        color: $red;
      }
    }
    span {
      padding: 0 20px;
    }
  }
}
</style>
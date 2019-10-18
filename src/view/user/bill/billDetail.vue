<!--
 账单详细
 -->
<template>
  <div class="bill-detial-page">
    <van-nav-bar class="nav" title="账单详细" left-arrow @click-left="onClickLeft" fixed />
    <div class="content">
      <div class="top-row">
        <div class="title">订单交易</div>
        <div class="money">-150</div>
      </div>
      <div class="detail-row">
        <template v-if="type == 1">
          <div class="cell">
            <span class="label">订单标号</span>
            <span>GR321321321SDF</span>
          </div>
          <div class="cell">
            <span class="label">商品说明</span>
            <span>商品说明sss</span>
          </div>
        </template>
        <template v-if="type == 2">
          <div class="cell">
            <span class="label">当前状态</span>
            <span>处理中</span>
          </div>
          <div class="cell">
            <span class="label">服务费</span>
            <span>商品说明sss</span>
          </div>
          <div class="cell">
            <span class="label">提现银行</span>
            <span>招商银行 (4567) 姓名</span>
          </div>
          <div class="cell">
            <span class="label">提现单号</span>
            <span>FGR321321321SDF</span>
          </div>
        </template>
        <template v-if="type == 3">
          <div class="cell">
            <span class="label">佣金渠道</span>
            <span>分销</span>
          </div>
          <div class="cell">
            <span class="label">结算等级</span>
            <span>黄金会员</span>
          </div>
          <div class="cell">
            <span class="label">下级结算等级</span>
            <span>黄金会员</span>
          </div>
          <div class="cell">
            <span class="label">订单编号</span>
            <span>FGR321321321SDF</span>
          </div>
          <div class="goos-list van-hairline--top">
            <div class="goods-item" v-for="i in 3">
              <div class="col-1">
                <img src alt />
              </div>
              <div class="col-2">
                <div class="title">商品标题是是的商品标题是是的商品标题是是的商品标题是是的商品标题是是的商品商品标题是是的商品</div>
                <div class="num">数量x1</div>
                <div class="money-row">
                  <span>消费金额: ￥11</span>
                  <span class="profit">佣金收益: ￥22</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="cell van-hairline--top">
          <span class="label">创建时间</span>
          <span>2019-08-26 22:50</span>
        </div>
        <div class="cell">
          <span class="label">账单编号</span>
          <span>GR321321321SDFGR32132</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import {
  NavBar,
  Overlay,
  Sticky,
  ActionSheet,
  Popup,
  DatetimePicker,
  Icon
} from "vant";
Vue.use(Overlay)
  .use(Sticky)
  .use(ActionSheet)
  .use(Popup)
  .use(DatetimePicker)
  .use(NavBar)
  .use(Icon);
Vue.use(Sticky);
Vue.use(Overlay);
export default {
  data() {
    return {
      type: 3,
      id: this.$route.query.id
    };
  },
  created() {
      this.getDetail()
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path) {
      this.$router.push(path);
    },
    getDetail() {
      this.$http
        .post("/account/bill/detail", {id:this.id})
        .then(res => {
            
        })
        .catch(error => {
          Toast(error.message);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.bill-detial-page {
  .content {
    padding-top: 66px;
    background: #fff;
    .top-row {
      padding: 20px 15px 50px;
      text-align: center;
      .title {
        font-size: 14px;
        margin-bottom: 10px;
      }
      .money {
        font-size: 20px;
      }
    }
    .detail-row {
      .cell {
        padding: 0 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        font-size: 13px;
        .label {
          color: #999;
        }
      }
      .goos-list {
        padding-top: 15px;
      }
      .goods-item {
        display: flex;
        height: 80px;
        padding: 0 15px 15px;
        box-sizing: content-box;

        .col-1 {
          width: 80px;
          height: 80px;
          background: #eee;
          margin-right: 15px;
          flex-shrink: 0;
        }
        .col-2 {
          width: calc(100% - 100px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .title {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
          }
          .money-row {
            display: flex;
            justify-content: space-between;
            .profit {
              color: $red;
            }
          }
        }
      }
    }
  }
}
</style>
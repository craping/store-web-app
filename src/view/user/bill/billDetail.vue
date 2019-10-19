<!--
 账单详细
 -->
<template>
  <div class="bill-detial-page">
    <van-nav-bar class="nav" title="账单详细" left-arrow @click-left="onClickLeft" fixed />
    <div class="content">
      <div class="top-row">
        <div class="title">{{viewTypeStr}}</div>
        <div class="money">{{type ?'+':'-'}}{{amount}}</div>
      </div>
      <div class="detail-row">
        <template v-if="viewType == 1">
          <div class="cell">
            <span class="label">订单编号</span>
            <span>{{info.orderSn}}</span>
          </div>
          <div class="cell">
            <span class="label">商品说明</span>
            <span>{{info.productName}}</span>
          </div>
        </template>
        <template v-if="viewType == 2">
          <div class="cell">
            <span class="label">售后编号</span>
            <span>{{info.orderSn}}</span>
          </div>
          <div class="cell">
            <span class="label">商品说明</span>
            <span>{{info.productName}}</span>
          </div>
        </template>
        <template v-if="viewType == 3">
          <div class="cell">
            <span class="label">佣金渠道</span>
            <span>{{setChannelStr(info.channel)}}</span>
          </div>
          <div class="cell">
            <span class="label">结算等级</span>
            <span>{{info.levelName}}</span>
          </div>
          <div class="cell">
            <span class="label">下级结算等级</span>
            <span>{{info.subLevelName}}</span>
          </div>
          <div class="cell">
            <span class="label">订单编号</span>
            <span>{{info.orderSn}}</span>
          </div>
          <div class="goos-list van-hairline--top">
            <div class="goods-item">
              <div class="col-1">
                <img :src="info.productPic" alt />
              </div>
              <div class="col-2">
                <div class="title">{{info.productName}}</div>
                <div class="num">数量x{{info.quantity}}</div>
                <div class="money-row">
                  <span>消费金额: ￥{{info.price}}</span>
                  <span class="profit">佣金收益: ￥{{info.commission}}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="viewType == 4">
          <div class="cell">
            <span class="label">当前状态</span>
            <span>{{status2Str(info.status)}}</span>
          </div>
          <div class="cell">
            <span class="label">服务费</span>
            <span>{{info.fees}}</span>
          </div>
          <div class="cell">
            <span class="label">提现银行</span>
            <span>{{info.bankName}}({{info.cardNo.slice(-4)}}) {{info.cardName}}</span>
          </div>
          <div class="cell">
            <span class="label">提现单号</span>
            <span>{{info.recordNo}}</span>
          </div>
        </template>
        <div class="cell van-hairline--top">
          <span class="label">创建时间</span>
          <span>{{formatTime(info.reateTime)}}</span>
        </div>
        <div class="cell">
          <span class="label">账单编号</span>
          <span>{{recordSn}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { format } from "@/utils/util";
import { NavBar, Toast } from "vant";
Vue.use(Toast).use(NavBar);
export default {
  data() {
    return {
      viewType: 3, // 1订单 ，2 售后 3 佣金 4.提现,
      viewTypeStr: "",
      srcType: this.$route.query.srcType, // 数据来源类型
      id: this.$route.query.id, 
      recordSn: this.$route.query.recordSn, // 账单编码
      type: this.$route.query.type, // 资金类型[1：收入，0：支出]
      amount: this.$route.query.amount, // 账变金额
      info: {}
    };
  },
  created() {
    this.getDetail();
    this.srcType2Type()
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path) {
      this.$router.push(path);
    },
    srcType2Type() {
      switch (this.srcType) {
        case "0_1":
          this.viewTypeStr = "订单交易";
          this.viewType = 1;
        case "1_4":
          this.viewTypeStr = "取消订单";
          this.viewType = 1;
          break;
        case "1_5":
          this.viewTypeStr = "售后退款";
          this.viewType = 2;
          break;
        case "1_1":
          this.viewTypeStr = "购物返现";
          this.viewType = 3;
        case "1_2":
          this.viewTypeStr = "直推佣金";
          this.viewType = 3;
          break;
        case "1_3":
          this.viewTypeStr = "分销佣金";
          this.viewType = 3;
          break;
        case "1_6":
          this.viewTypeStr = "感恩奖励";
          this.viewType = 3;
          break;
        case "0_2":
          this.viewTypeStr = "提现申请";
          this.viewType = 4;
          break;
      }
    },
    status2Str(status) {
      switch (status) {
        case -1:
          return '提现失败'
        case 0:
          return '处理中'
        case 1:
          return '提现成功'    
      }
    },
    getDetail() {
      this.$http
        .post("/account/bill/detail", { id: this.id })
        .then(res => {
          this.info = res.data.info || {}
        })
        .catch(error => {
          Toast(error.message);
        });
    },
    setChannelStr(key) {
      switch (parseInt(key)) {
        case 1:
          return "返现";
        case 2:
          return "直推";
        case 3:
          return "分销";
        case 4:
          return "感恩奖";
      }
    },
    formatTime(time) {
      return format(time, "yyyy-MM-dd hh:mm:ss");
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
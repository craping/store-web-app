<!--
 * @Description: 
 -->
<template>
  <div class="vip-page">
    <van-nav-bar title="会员中心" left-arrow @click-left="onClickLeft" fixed />
    <div class="page-body">
      <div class="top-card">
        <div class="card-row-1">
          <div>
            <div class="title-1">账户余额</div>
            <div class="rest-money">
              <span class="sign">￥</span>
              {{amsAccount.balance}}
            </div>
          </div>
          <div class="btn" @click="jumpLink('/withdraw')">
            <van-icon name="bill" />去提现
          </div>
        </div>
        <div class="card-row-2">
          <div>
            <div class="title-2">累计收入(元)</div>
            <div>{{amsAccount.income}}</div>
          </div>
          <div>
            <div class="title-2">已提现(元)</div>
            <div>{{amsAccount.cashout}}</div>
          </div>
          <div>
            <div class="title-2">未结算(元)</div>
            <div>{{amsAccount.unreceivedIncome}}</div>
          </div>
        </div>
      </div>
      <van-tabs v-model="active" color="#ff4444">
        <van-tab title="今日未结算收益">
          <div class="profit-card card round">
            <div style="margin-bottom:10px;">
              <div class="row-title">我的未结算收益</div>
              <div class="row-data">
                <div class="col-item">
                  <div class="title">订单数</div>
                  <div>{{viewData.day.selfOrder}}</div>
                </div>
                <div class="col-item">
                  <div class="title">预估收益(元)</div>
                  <div>{{viewData.day.selfCommission}}</div>
                </div>
              </div>
            </div>
            <div>
              <div class="row-title">团队未结算收益</div>
              <div class="row-data">
                <div class="col-item">
                  <div class="title">订单数</div>
                  <div>{{viewData.day.teamOrder}}</div>
                </div>
                <div class="col-item">
                  <div class="title">预估收益(元)</div>
                  <div>{{viewData.day.teamCommission}}</div>
                </div>
              </div>
            </div>
            <p class="look-detail" @click="toUnliquidated('d')">查看详情></p>
          </div>
        </van-tab>
        <van-tab title="本月未结算收益">
          <div class="profit-card card round">
            <div style="margin-bottom:10px;">
              <div class="row-title">我的未结算收益</div>
              <div class="row-data">
                <div class="col-item">
                  <div class="title">订单数</div>
                  <div>{{viewData.month.selfOrder}}</div>
                </div>
                <div class="col-item">
                  <div class="title">预估收益(元)</div>
                  <div>{{viewData.month.selfCommission}}</div>
                </div>
              </div>
            </div>
            <div>
              <div class="row-title">团队未结算收益</div>
              <div class="row-data">
                <div class="col-item">
                  <div class="title">订单数</div>
                  <div>{{viewData.month.teamOrder}}</div>
                </div>
                <div class="col-item">
                  <div class="title">预估收益(元)</div>
                  <div>{{viewData.month.teamCommission}}</div>
                </div>
              </div>
            </div>
            <p class="look-detail" @click="toUnliquidated('m')">查看详情></p>
          </div>
        </van-tab>
      </van-tabs>
      <div class="team-card card round">
        <div style="margin-bottom:10px;">
          <div class="row-title">我的团队</div>
          <div class="row-data">
            <div class="col-item">
              <div class="title">会员数</div>
              <div>{{viewData.teams.vip}}</div>
            </div>
            <div class="col-item">
              <div class="title">用户数</div>
              <div>{{viewData.teams.member}}</div>
            </div>
          </div>
        </div>
        <p class="look-detail" @click="jumpLink('/team',{parentId:amsAccount.parentId})">查看详情></p>
      </div>
      <div class="bottom-bar">
        <van-cell title="提现记录" @click="toBill('0', '0_2')" is-link />
        <van-cell title="余额明细" @click="toBill('1', null)" is-link />
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Cell, CellGroup, Tab, Tabs, Icon } from "vant";
import { mapState, mapActions } from "vuex";
Vue.use(Tab)
  .use(Tabs)
  .use(Cell)
  .use(CellGroup)
  .use(NavBar)
  .use(Icon);
export default {
  data() {
    return {
			active: 0,
			viewData:{
				day: {},
				month: {},
				teams: {}
			}
      
    };
  },
  computed: {
    ...mapState("user", {
      amsAccount: state => state.userInfo.amsAccount || {}
    })
  },
  mounted() {
    this.getVipView();
  },
  methods: {
    ...mapActions("bill", ["setQueryparams", "queryBill"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path, query) {
      this.$router.push({ path, query });
    },
    getVipView() {
      this.$http
        .post("/account/overview", {})
        .then(res => {
					if (res.info) {
						this.viewData = res.info
					}
				})
        .catch(error => {});
    },
    /**
     * @method:
     * @param {type}
     * @return:
     */

    toBill(type, srcType) {
      this.$store.commit("bill/RESET_QUERYPARAMS", type)
      this.$store.commit("bill/SET_TYPE", type)
      this.$store.commit("bill/SET_SRCTYPE", srcType)
      this.jumpLink("/bill")
    },
    toUnliquidated(mode) {
      this.jumpLink("/unliquidated",{mode});
    }
  }
};
</script>
<style lang="scss" scoped>
.vip-page {
  .page-body {
    padding-top: 66px;
  }
  .top-card {
    margin: 5px;
    border-radius: 5px;
    background: rgba(255, 68, 68, 0.7);
    color: #fff;
    padding: 15px;
    .card-row-1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .title-1 {
        font-size: 16px;
        margin-bottom: 10px;
      }
      .rest-money {
        font-size: 20px;
        .sign {
          font-size: 14px;
        }
      }
      .btn {
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 2px 6px;
        display: flex;
        align-items: center;
      }
    }
    .card-row-2 {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      padding-top: 10px;
      justify-content: space-between;
      text-align: center;
      .title-2 {
        margin-bottom: 10px;
      }
    }
  }
  .card {
    background: #fff;
    padding: 15px 15px 5px;
    margin: 10px;
    .row-title {
      padding-bottom: 4px;
      border-bottom: 1px solid #eee;
      font-size: 16px;
      margin-bottom: 4px;
    }
    .row-data {
      display: flex;
      margin: 20px 0;
      .col-item {
        text-align: center;
        flex: 1;
        font-size: 16px;
        .title {
          margin-bottom: 10px;
          color: #999;
          font-size: 12px;
        }
      }
    }
    .look-detail {
      color: $red;
      text-align: right;
    }
  }
  .bottom-bar {
    margin: 10px 0;
  }
}
</style>
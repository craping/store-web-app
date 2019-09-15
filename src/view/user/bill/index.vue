<!--
 账单
 -->
<template>
  <div class="bill-page">
    <van-nav-bar class="nav" title="账单" left-arrow @click-left="onClickLeft" fixed />
    <div class="content">
      <van-sticky :offset-top="46" :z-index="101">
        <div class="top-bar-wrapper">
          <div
            id="filter-node"
            class="top-bar van-hairline--bottom"
            @click="filterShow = !filterShow"
          >
            <span :class="{'exp':filterShow}">
              筛选
              <van-icon v-show="!filterShow" name="arrow-down" />
              <van-icon v-show="filterShow" name="arrow-up" />
            </span>
          </div>
          <div>
            <div class="option-pop" v-show="filterShow">
              <div class="item">
                <div class="title">收支类型</div>
                <div class="option-wrapper">
                  <div
                    class="option-item"
                    v-for="(item,index) in typekList"
                    :class="{'active':queryParams.inExType == item.id}"
                    :key="index"
                    @click="selectType(item)"
                  >{{item.name}}</div>
                </div>
              </div>
              <div class="item">
                <div class="title">快捷筛选</div>
                <div class="option-wrapper">
                  <div
                    class="option-item"
                    v-for="(item,index) in quickList"
                    :class="{'active':queryParams.typeFilter == item.id}"
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
            <van-overlay :show="filterShow" @click="filterShow = false" z-index="10" />
          </div>
        </div>
      </van-sticky>
      <div class="month-item" ref="monthItem" v-for="i in 2">
        <van-sticky :offset-top="76" :container="container1[i-1]">
          <div class="info-bar">
            <div class="time" @click="dateSelectshow = true">
              2019年{{i}}月
              <van-icon name="arrow-down" />
            </div>
            <div class="all-money">
              <div>收入：￥111</div>
              <div>支出：￥222</div>
            </div>
          </div>
        </van-sticky>
        <div class="bill-list">
          <div class="bill-item" @click="jumpLink('/billDetail')" v-for="i in 8">
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
      </div>
      <van-popup v-model="dateSelectshow" position="bottom" :style="{ height: '50%' }">
        <div class="tool-bar">
          <div class="cancel" @click="dateSelectshow=false">取消</div>
          <div class="sure" @click="queryHandle">确定</div>
        </div>
        <van-tabs v-model="dateType" color="#ff4444">
          <van-tab title="按月选择">
            <van-datetime-picker
              v-model="currentMonth"
              type="year-month"
              :show-toolbar="false"
              @confirm="selectDate"
              @cancel="dateSelectshow=false"
            />
          </van-tab>
          <van-tab title="按日选择">
            <div class="date-select-wrapper">
              <div class="date-input" :class="{active:dateInputType==0}" @click="selectInput(0,'startDate')">{{startDate|| '开始日期'}}</div>
              <span>至</span>
              <div class="date-input" :class="{active:dateInputType==1}" @click="selectInput(1,'endDate')">{{endDate|| '结束日期'}}</div>
            </div>
            <van-datetime-picker
              v-model="currentDate"
              type="date"
              :show-toolbar="false"
              @change="changeCurrentDate"
              @confirm="selectDate"
              @cancel="dateSelectshow=false"
            />
          </van-tab>
        </van-tabs>
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
  Tabs
} from "vant";
Vue.use(Tab)
  .use(Tabs)
  .use(Overlay)
  .use(Sticky)
  .use(ActionSheet)
  .use(Popup)
  .use(DatetimePicker)
  .use(NavBar)
  .use(Icon)
  .use(Sticky)
  .use(Overlay);
export default {
  data() {
    return {
      container1: [],
      filterShow: false,
      dateSelectshow: false,
      typekList: [
        {
          name: "全部分类",
          id: 0
        },
        {
          name: "收入",
          id: 1
        },
        {
          name: "支出",
          id: 2
        }
      ],
      quickList: [
        {
          name: "全部分类",
          id: 0
        },
        {
          name: "订单交易",
          id: 1
        },
        {
          name: "分销佣金",
          id: 2
        },
        {
          name: "直推佣金",
          id: 3
        },
        {
          name: "提现申请",
          id: 4
        }
      ],
      currentMonth: new Date(),
      currentDate: new Date(),
      startDate: "2019-09-02",
      endDate: "",
      dateType: 0, // 0按月，1按日
      dateInputType: 0 //0开始，1结束
    };
  },
  mounted() {
    this.container1 = this.$refs.monthItem;
    window.scrollTo(0, 0);
    this.queryBill();
  },
  computed: {
    ...mapState({
      queryParams: state => state.queryParams,
      bills: state => state.bills
    })
  },
  methods: {
    ...mapActions(["setQueryparams", "queryBill"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path) {
      this.$router.push(path);
    },
    selectType(item) {
      this.setQueryparams({ inExType: item.id });
    },
    selectQuik(item) {
      this.setQueryparams({ typeFilter: item.id });
    },
    selectDate(date) {
      this.setQueryparams({ dateTime: date });
    },
    reset() {
      this.setQueryparams({ inExType: 0, typeFilter: 0 });
    },
    queryHandle() {
      this.queryBill()
        .then(() => {
          this.filterShow = false;
        })
        .catch(() => {});
    },
    formatTime(time) {
      return format(time, "yyyy-MM-dd");
    },
    selectInput(type, name) {
      this.dateInputType = type;
      if (this[name]) {
        this.currentDate = new Date(this[name]);
      } else {
        this.currentDate = new Date()
        this[name] = this.formatTime(new Date())
      }
    },
    changeCurrentDate(picker){
      let currentVal = picker.getValues().join('-')

      if(this.dateInputType){
        this.endDate = currentVal
      }else{
        this.startDate = currentVal

      }
    }
  }
};
</script>
<style lang="scss" scoped>
.bill-page {
  >>> .nav {
    z-index: 1000 !important;
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
    }
    .option-pop {
      height: 300px;
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
        margin-right: 10px;
        margin-bottom: 10px;
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
  .month-item {
    .info-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 15px;
      background: #f2f2f2;
    }
    .all-money {
      color: #999;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      text-align: right;
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
      &.active{
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
<!--
 账单
 -->
<template>
  <div class="bill-page">
    <van-nav-bar class="nav" title="账单" left-arrow @click-left="onClickLeft" fixed />
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
      <van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="没有更多了" :offset="50" @load="onLoad">
        <div class="month-item" ref="monthItem" v-for="(monthItem,index) in billByMonth" :key="index">
          <van-sticky :offset-top="96" :container="container1[index]">
            <div class="info-bar">
              <div class="time" @click="handleDateSelectshow(monthItem.monthStr)">
                {{monthItem.monthStr}}
                <van-icon name="arrow-down" />
              </div>
              <div class="all-money">
                <!-- <div>收入：￥111</div>
                <div>支出：￥222</div> -->
              </div>
            </div>
          </van-sticky>
          <div class="bill-list">
            <div class="bill-item" @click="jumpLink('/billDetail',{id:item.id,srcType:item.srcType,recordSn:item.recordSn})" v-for="(item,index) in monthItem.list" :key="index">
              <div class="col-1">
                <van-icon v-if="item.srcType=='0_1'||item.srcType=='1_4'" name="cart" size="35" color="#fcc" />
                <van-icon v-if="item.srcType=='1_5'||item.srcType=='1_1'" name="refund-o" size="35" color="#fcc" />
                <van-icon v-if="item.srcType=='1_1'||item.srcType=='1_2'||item.srcType=='1_3'||item.srcType=='1_6'" name="friends" size="35" color="#fcc" />
                <van-icon v-if="item.srcType=='0_2'" name="gold-coin" size="35" color="#fcc" />
              </div>
              <div class="col-2">
                <div class="title">{{item.remark}}</div>
                <div class="type">{{srcType2Type(item.srcType)}}</div>
                <div class="time">{{formatDateTime(item.createTime)}}</div>
              </div>
              <div class="col-3">{{item.type ?'+':'-'}}{{item.amount}}</div>
            </div>
          </div>
        </div>
      </van-list>
      <van-popup v-model="filterShow" position="top" :get-container="getContainer" :style="{top: '96px'}">
         <div>
            <div class="option-pop" v-show="filterShow">
              <div class="item">
                <div class="title">收支类型</div>
                <div class="option-wrapper">
                  <div
                    class="option-item"
                    v-for="(item,index) in typekList"
                    :class="{'active':queryParams.type == item.id}"
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
                    :class="{'active':queryParams.srcType == item.id}"
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
      <van-popup v-model="dateSelectshow" position="bottom" :style="{ height: '60%' }">
        <div class="tool-bar">
          <div class="cancel" @click="dateSelectshow=false">取消</div>
          <div class="sure" @click="sureSetDate">确定</div>
        </div>
        <van-tabs v-model="dateType" color="#ff4444" @change="changeDateType">
          <van-tab title="按月选择">
             <div class="date-select-wrapper center">
              <div
                class="date-input"
                :class="{active:monthInputType==1}"
                @click="selectMonthInput"
              >{{currentMonth || '选择月份'}}</div>
            </div>
            <div class="delete-date-bar">
              <van-icon @click="resetMonth" name="delete" />
            </div>
            <van-datetime-picker v-show="monthInputType" v-model="pickerMonthDate" type="year-month" :max-date="maxDate" :show-toolbar="false" @change="changePickerMonthDate"  />
          </van-tab>
          <van-tab title="按日选择">
            <div class="date-select-wrapper">
              <div
                class="date-input"
                :class="{active:dayInputType==1}"
                @click="selectDayInput(1,'startDate')"
              >{{startDate || '开始日期'}}</div>
              <span>至</span>
              <div
                class="date-input"
                :class="{active:dayInputType==2}"
                @click="selectDayInput(2,'endDate')"
              >{{endDate|| '结束日期'}}</div>
            </div>
            <div class="delete-date-bar">
              <van-icon @click="resetDay" name="delete" />
            </div>
            <van-datetime-picker
              v-show="dayInputType"
              v-model="pickerDayDate"
              type="date"
              :show-toolbar="false"
              :max-date="maxDate"
              @change="changePickerDayDate"
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
const { mapState, mapActions, mapGetters } = createNamespacedHelpers("bill");
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
      container1: [],
      filterShow: false,
      dateSelectshow: false,
      typekList: [
        {
          name: "全部分类",
          id: null
        },
        {
          name: "收入",
          id: 1
        },
        {
          name: "支出",
          id: 0
        }
      ],
      quickList: [
        {
          name: "全部分类",
          id: null
        },
        {
          name: "订单交易",
          id: "0_1"
        },
        {
          name: "提现申请",
          id: "0_2"
        },
        {
          name: "购物返现",
          id: "1_1"
        },
        {
          name: "分销佣金",
          id: "1_2"
        },
        {
          name: "直推佣金",
          id: "1_3"
        },
        {
          name: "取消订单",
          id: "1_4"
        },
        {
          name: "售后退款",
          id: "1_5"
        }
      ],
      pickerMonthDate: new Date(),
      pickerDayDate: new Date(),
      currentMonth: "",
      startDate: "",
      endDate: "",
      dateType: 0, // 0按月，1按日
      monthInputType: 1, // 0未选择 1选择
      dayInputType: 1, // 0未选择 1开始，2结束 
      loading: true,
      finished: false,
      maxDate: new Date(),
    };
  },
  mounted() {
    this.queryHandle()
    
  },
  computed: {
    ...mapState({
      queryParams: state => state.queryParams,
    }),
    ...mapGetters(['billByMonth'])
  },
  methods: {
    ...mapActions(["queryBill"]),
    handleDateSelectshow(time) {
      if (this.dateType) {
        this.dayDate2View()
      } else {
        this.currentMonth = this.formatMonth(new Date(time))
        this.monthDate2View(time)
      }
      this.dateSelectshow = true
    },
    getContainer() {
      return document.querySelector('.top-bar-wrapper');
    },
    srcType2Type(srcType) {
      switch (srcType) {
        case "0_1":
          return "订单交易";
        case "1_4":
          return "取消订单";
        case "1_5":
          return "售后退款";
        case "1_1":
          return "购物返现";
        case "1_2":
          return "直推佣金";
        case "1_3":
          return "分销佣金";
        case "1_6":
          return "感恩奖励";
        case "0_2":
          return "提现申请";
      }
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path, query) {
      this.$router.push({ path, query });
    },
    selectType(item) {
      this.$store.commit("bill/SET_TYPE", item.id);
    },
    selectQuik(item) {
      this.$store.commit("bill/SET_SRCTYPE", item.id);
    },
    reset() {
      this.$store.commit("bill/SET_TYPE", null);
      this.$store.commit("bill/SET_SRCTYPE", null);
    },
    changeDateType(val) {
      if (val) {
        this.dayDate2View()
      }
    },
    queryHandle() {
      this.filterShow = false;
      this.loading = true
      this.$store.commit("bill/SET_PAGENUM", 1);
      this.$store.commit("bill/SET_BILLS", []);
      this.queryBill()
        .then((data) => {
          this.$nextTick(()=>{
            this.container1 = this.$refs.monthItem;
            // console.log( this.container1)
            if (data.page >= data.totalpage) {
              this.finished = true
              this.loading = false
            } else {
              this.loading = false
            }
          })
        })
        .catch(() => {});
    },
    formatDate(time) {
      return format(time, "yyyy-MM-dd");
    },
    formatMonth(time) {
      return format(time, "yyyy-MM");
    },
    formatMonthStr(time) {
      return format(time, "yyyy年MM月");
    },
    formatDateTime(time) {
      return format(time, "yyyy-MM-dd hh:mm:ss");
    },
    changePickerMonthDate(picker) {
      this.currentMonth = picker.getValues().join("-");
    },
    changePickerDayDate(picker) {
      let currentVal = picker.getValues().join("-");
      if (this.dayInputType == 1) {
        this.startDate = currentVal;
      } else {
        this.endDate = currentVal;
      }
    },
    dayDate2View() {
      let typeStr =  this.dayInputType == 1 ? 'startDate' : 'endDate'
      if (this[typeStr]) {
        this.pickerDayDate = new Date(this[typeStr]);
      } else {
        this.pickerDayDate = new Date();
        this[typeStr] = this.formatDate(new Date());
      }
    },
    monthDate2View(time) {
      if (this.currentMonth) {
        this.pickerMonthDate = new Date(this.currentMonth)
      } else {
        this.pickerMonthDate = time ? new Date(time) : new Date()
        this.currentMonth = this.formatMonth(this.pickerMonthDate)
      }
    },
    selectMonthInput() {
      this.monthInputType = 1
      this.monthDate2View()
    },  
    selectDayInput(type) {
      this.dayInputType = type;
      this.dayDate2View()
    },
    resetMonth() {
      this.monthInputType = 0
      this.currentMonth = ''
    },
    resetDay() {
      this.dayInputType = 0
      this.startDate = ''
      this.endDate = ''
    },
    sureSetDate() {
      this.dateSelectshow = false
      if (this.dateType) {
        this.$store.commit("bill/SET_DATE", null);
        this.$store.commit("bill/SET_BEGINDATE", this.startDate || null);
        this.$store.commit("bill/SET_ENDDATE", this.endDate || null);
      } else {
        this.$store.commit("bill/SET_BEGINDATE", null);
        this.$store.commit("bill/SET_ENDDATE", null);
        this.$store.commit("bill/SET_DATE", this.currentMonth || null);
      }
      this.queryHandle()
    }, 
    onLoad() {
      console.log('onLoad')
      this.queryBill().then((data)=>{
        if (data.page >= data.totalpage) {
          this.finished = true
          this.loading = false
        } else {
          this.loading = false
        }
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
      &.isPup{
        z-index: 3000;
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
    &.center{
      justify-content: center;
    }
    .date-input {
      width: 40%;
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
  .delete-date-bar{
    text-align: right;
  }
}
</style>
<template>
  <div class="cart-page">
    <div class="curtain" ref="curtain">
      <div class="cav"></div>
    </div>
    <div class="fix-bar">
      <span class="title">购物车</span>
      <span class="operate" @click="changeOperate">{{isOperate?'完成':'管理'}}</span>
    </div>
    <store-scroller class="scoll-s" @onRefresh="onRefresh">
      <div class="content">
        <van-checkbox-group class="card-goods" v-model="checkedGoods">
          <van-checkbox
            class="card-goods-item"
            v-for="item in itemList"
            :key="item.id"
            :name="item.id"
            icon-size="16px"
            checked-color="#ff4444"
          >
            <cardItem :item="item">
              <van-stepper
                slot="num-step"
                :value="item.num"
                input-width="26px"
                button-size="20px"
                integer
                async-change
                @change="(val)=>onChangeNum(val,item)"
              />
            </cardItem>
          </van-checkbox>
        </van-checkbox-group>
      </div>
    </store-scroller>
    <van-submit-bar
      v-show='!isOperate'
      :style="{bottom:this.$route.meta.single?'0':'50px'}"
      :safe-area-inset-bottom="true"
      :price="totalPrice"
      :disabled="!checkedGoods.length"
      :button-text="'结算'+selectCount"
      @submit="onSubmit"
    >
      <van-checkbox
        icon-size="16px"
        checked-color="#ff4444"
        v-model="isSelectAll"
        @change="changeAll"
      >全选</van-checkbox>
    </van-submit-bar>
    <div class="operate-bar" v-show='isOperate'>
      <van-checkbox
        icon-size="16px"
        checked-color="#ff4444"
        v-model="isSelectAll"
        @change="changeAll"
      >全选</van-checkbox>
      <div class="white"></div>
      <button class="btn" :disabled="!checkedGoods.length" :class="{'disable_btn':!checkedGoods.length}" @click="deleteItem">删除{{selectCount}}</button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import storeScroller from "@/components/store-scroller";
import cardItem from "./cartItem";

import { Checkbox, CheckboxGroup, Stepper, SubmitBar, Toast } from "vant";
Vue.use(Checkbox)
  .use(CheckboxGroup)
  .use(Stepper)
  .use(SubmitBar)
  .use(Toast);

export default {
  components: {
    storeScroller,
    cardItem
  },
  data() {
    return {
      isOperate: false,
      checkedGoods: ["1", "2", "3"],
      itemList: [
        {
          id: "1",
          title: "进口香蕉",
          desc: "约250g，2根",
          price: 200,
          num: 1,
          thumb:
            "https://img.yzcdn.cn/public_files/2017/10/24/2f9a36046449dafb8608e99990b3c205.jpeg"
        },
        {
          id: "2",
          title: "陕西蜜梨",
          desc: "约600g",
          price: 690,
          num: 1,
          thumb:
            "https://img.yzcdn.cn/public_files/2017/10/24/f6aabd6ac5521195e01e8e89ee9fc63f.jpeg"
        },
        {
          id: "3",
          title: "美国伽力果",
          desc: "约680g/3个",
          price: 2680,
          num: 1,
          thumb:
            "https://img.yzcdn.cn/public_files/2017/10/24/320454216bbe9e25c7651e1fa51b31fd.jpeg"
        },
        {
          id: "4",
          title: "美国伽力果",
          desc: "约680g/3个",
          price: 2680,
          num: 1,
          thumb:
            "https://img.yzcdn.cn/public_files/2017/10/24/320454216bbe9e25c7651e1fa51b31fd.jpeg"
        },
        {
          id: "5",
          title: "美国伽力果",
          desc: "约680g/3个",
          price: 2680,
          num: 1,
          thumb:
            "https://img.yzcdn.cn/public_files/2017/10/24/320454216bbe9e25c7651e1fa51b31fd.jpeg"
        },
        {
          id: "6",
          title: "美国伽力果",
          desc: "约680g/3个",
          price: 2680,
          num: 1,
          thumb:
            "https://img.yzcdn.cn/public_files/2017/10/24/320454216bbe9e25c7651e1fa51b31fd.jpeg"
        },
        {
          id: "7",
          title: "美国伽力果",
          desc: "约680g/3个",
          price: 2680,
          num: 1,
          thumb:
            "https://img.yzcdn.cn/public_files/2017/10/24/320454216bbe9e25c7651e1fa51b31fd.jpeg"
        }
      ],
      isSelectAll: false
    };
  },
  computed: {
    selectCount() {
      const count = this.checkedGoods.length;
      if (count == this.itemList.length && count != 0) {
        this.isSelectAll = true;
      } else {
        this.isSelectAll = false;
      }
      return count ? `(${count})` : "";
    },
    totalPrice() {
      return this.itemList.reduce(
        (total, item) =>
          total +
          (this.checkedGoods.indexOf(item.id) !== -1
            ? item.price * item.num
            : 0),
        0
      );
    }
  },

  methods: {
    getCartList() {
      this.$http
        .get("/cartItem/getCartItemList", {})
        .then(res => {
          this.itemList = res.info || []
        })
        .catch((error) => {
          Toast(error.message);
        });
    },
    changeOperate() {
      this.isOperate = !this.isOperate;
    },
    changeAll(val) {
      if (this.isSelectAll) {
        this.checkedGoods = this.itemList.map(item => item.id);
      } else {
        if (this.checkedGoods.length == this.itemList.length) {
          this.checkedGoods = [];
        }
      }
    },
    formatPrice(price) {
      return (price / 100).toFixed(2);
    },
    onChangeNum(val, item) {
      item.num = val;
    },
    onSubmit() {
      Toast("点击结算");
    },
    deleteItem(){
      this.goods = this.goods.filter((ele,index)=>{
        if(!this.checkedGoods.includes(ele.id)){
          return ele
        }
      })
      this.checkedGoods = []
    },
    onRefresh(done) {
      setTimeout(() => {
        if (done) done();
      }, 300);
    },
    onScroll(top) {},
    onLoad(done) {
      if (done) done(true);
      this.loading = false;
      this.finished = true;
    },
  }
};
</script>

<style lang="scss" scoped>
.cart-page {
  .curtain {
    display: flex;
    justify-content: center;
    overflow-x: hidden;
    position: fixed;
    width: 100vw;
    .cav {
      height: 191px;
      border-bottom-right-radius: 50%;
      border-bottom-left-radius: 50%;
      background-color: $red;
      flex: none;
      width: 200vw;
      display: flex;
      justify-content: center;
      overflow: hidden;
    }
  }
  .fix-bar {
    position: fixed;
    width: 100vw;
    text-align: center;
    z-index: 10;
    background: $red;
    height: 66px;
    padding-top: 35px;
    .title {
      font-size: 14px;
      color: #fff;
    }
    .operate {
      color: #fff;
      position: absolute;
      right: 15px;
    }
  }
  .content {
    padding-top: 86px;
    .card-goods {
      padding: 0 10px;
      background-color: #fff;
      border-radius: 5px;
      overflow: hidden;
      /deep/ .van-card {
        background: transparent;
        width: 100%;
      }
      /deep/ .van-checkbox__label {
        width: 100%;
        flex: 1;
      }
      &__item {
        position: relative;
        background-color: #fafafa;
        .card-goods-item {
          padding: 0 15px;
        }
        .van-checkbox__icon {
          top: 50%;
          left: 10px;
          z-index: 1;
          position: absolute;
          margin-top: -10px;
        }

        .van-card__price {
          color: #f44;
        }
      }
    }
  }
  .van-submit-bar {
    .van-checkbox {
      margin-left: 15px;
    }
  }
  .operate-bar {
    position: fixed;
    bottom: 50px;
    left: 0;
    z-index: 100;
    width: 100%;
    background-color: #fff;
    -webkit-user-select: none;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
    .van-checkbox {
      margin-left: 15px;
    }
    .white {
      flex: 1;
    }
    .btn {
      width: 110px;
      color: #fff;
      background-color: #f44;
      border: 1px solid #f44;
      height: 50px;
      line-height: 48px;
      font-size: 16px;
      text-align: center;
      &.disable_btn{
        opacity: 0.5;
      }
    }
  }
}
</style>

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
            class="card-goods-item van-hairline--bottom"
            v-for="item in itemList"
            :key="item.id"
            :name="item.id"
            icon-size="16px"
            checked-color="#ff4444"
          >
            <cardItem :item="item">
              <van-stepper
                slot="num-step"
                :value="item.quantity"
                integer
                input-width="26px"
                button-size="20px"
                @change="(val)=>onChangeNum(val,item)"
              />
            </cardItem>
          </van-checkbox>
        </van-checkbox-group>
      </div>
    </store-scroller>
    <van-submit-bar
      v-show="!isOperate"
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
    <div class="operate-bar" v-show="isOperate">
      <van-checkbox
        icon-size="16px"
        checked-color="#ff4444"
        v-model="isSelectAll"
        @change="changeAll"
      >全选</van-checkbox>
      <div class="white"></div>
      <button
        class="btn"
        :disabled="!checkedGoods.length"
        :class="{'disable_btn':!checkedGoods.length}"
        @click="deleteItem"
      >删除{{selectCount}}</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import storeScroller from '@/components/store-scroller'
import cardItem from './cartItem'
import { Checkbox, CheckboxGroup, Stepper, SubmitBar, Toast } from 'vant'
import { mapActions, mapState } from 'vuex'
Vue.use(Checkbox)
  .use(CheckboxGroup)
  .use(Stepper)
  .use(SubmitBar)
  .use(Toast)

export default {
  components: {
    storeScroller,
    cardItem
  },
  data() {
    return {
      isOperate: false,
      quantity: 2,
      checkedGoods: [],
      isSelectAll: false,
      timeout: null
    }
  },
  mounted() {
    // this.getCartList()
  },
  computed: {
    ...mapState({
      itemList: state => state.cart.itemList || []
    }),
    selectCount() {
      const count = this.checkedGoods.length
      if (count == this.itemList.length && count != 0) {
        this.isSelectAll = true
      } else {
        this.isSelectAll = false
      }
      return count ? `(${count})` : ''
    },
    totalPrice() {
      return this.itemList.reduce(
        (total, item) =>
          total +
          (this.checkedGoods.indexOf(item.id) !== -1
            ? item.price * item.quantity
            : 0),
        0
      )
    }
  },

  methods: {
    ...mapActions('cart', ['getCartList']),
    changeOperate() {
      this.isOperate = !this.isOperate
    },
    changeAll(val) {
      if (this.isSelectAll) {
        this.checkedGoods = this.itemList.map(item => item.id)
      } else {
        if (this.checkedGoods.length == this.itemList.length) {
          this.checkedGoods = []
        }
      }
    },
    formatPrice(price) {
      return (price / 100).toFixed(2)
    },
    onChangeNum(val, item) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        const params = {
          id: item.id,
          quantity: val
        }
        this.$http
          .post('/cartItem/updateQuantity', params)
          .then(res => {})
          .catch(error => {
            Toast(error.message)
          })
      }, 500)
    },
    onSubmit() {
      let sku = []
      this.itemList.forEach(element => {
        if (this.checkedGoods.includes(element.id)) {
          sku.push(element)
        }
      })
      // console.log('sku',sku)
      this.$store.commit('order/SET_CONFIRM_ORDER_LIST', [...sku])
      this.$router.push({
        name: 'confirmOrder',
        query: {
          type: 'cart'
        }
      })
    },
    deleteItem() {
      this.$http
        .post('/cartItem/delete', { ids: this.checkedGoods })
        .then(res => {
          Toast('删除成功')
          this.checkedGoods = []
          this.getCartList()
        })
        .catch(error => {
          Toast(error.message)
        })
    },
    onRefresh(done) {
      this.getCartList().finally(() => {
        if (done) done()
      })
    },
    onScroll(top) {},
    onLoad(done) {
      if (done) done(true)
      this.loading = false
      this.finished = true
    }
  }
}
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
      background-color: #fff;
      border-radius: 5px;
      overflow: hidden;
      min-height: calc(100vh - 186px);
      /deep/ .van-card {
        background: transparent;
        width: 100%;
      }
      /deep/ .van-checkbox__label {
        width: 100%;
        flex: 1;
      }

      /deep/.card-goods-item {
        padding: 0 10px;
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
      &.disable_btn {
        opacity: 0.5;
      }
    }
  }
}
</style>

<template>
  <div class="cart-item" @click.stop="toDetail(item)">
    <div class="left-col">
      <img :src="item.pic" />
    </div>
    <div class="right-col">
      <div class="title">{{item.name}}</div>
      <div class="desc">{{formatAttr(item.productAttr)}}</div>
      <div class="price">￥{{formatPrice(item.price)}}</div>
      <div class="num-step" @click.stop="stop">
        <slot name="num-step"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    formatPrice(price) {
      return price.toFixed(2);
    },
    formatAttr(data) {
      const attrArray = JSON.parse(data)
      return attrArray.map(ele => ele.value).join(",") || '';
    },
    toDetail(item) {
      this.$router.push({name:'goods',params:{id:item.productId}})
    },
    stop() {
      //防止冒泡
    }
  }
};
</script>
<style lang="scss" scoped>
.cart-item {
  padding: 8px 16px;
  display: flex;
  .left-col {
    width: 90px;
    height: 90px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right-col {
    flex: 1;
    margin-left: 12px;
    position: relative;
    .title {
      max-height: 32px;
      font-weight: 500;
      line-height: 16px;
      font-size: 14px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .desc {
      max-height: 20px;
      line-height: 20px;
      color: #7d7e80;
      word-break: break-all;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .price {
      display: inline-block;
      color: #f44;
      font-weight: 500;
    }
    .num-step {
      position: absolute;
      right: 0;
    }
  }
}
</style>
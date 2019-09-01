<template>
  <div class="store-card">
    <div class="store-card-item" v-for="(item,index) in proData" :key="index">
      <img src="https://img.yzcdn.cn/vant/t-thirt.jpg">
      <h2 class="store-card-title">{{item.title}}</h2>
      <p class="store-card-tag">{{item.tag}}</p>
      <div class="store-card-footer">
        <p class="price">￥{{item.price}}</p>
        <p class="sell">{{item.sellnums}}人购买</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'store-card',
  props: {
    proData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {}
  },

  created() {},

  methods: {}
}
</script>
<style lang="scss">
.store-card {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 15px;
  .store-card-item {
    background: #fff;
    width: 48%;
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    img {
      height: 150px;
    }
    h2 {
      font-size: 16px;
      color: #333;
      line-height: 26px;
      height: 52px;
      padding: 0 5px;
    }
    .store-card-tag {
      color: $red;
      padding: 0 5px;
    }
    .store-card-footer {
      display: flex;
      padding: 0 5px;
      align-items: center;
      p {
        margin-right: 10px;
      }
      .price {
        color: $red;
        font-size: 16px;
      }
    }
  }
}
</style>
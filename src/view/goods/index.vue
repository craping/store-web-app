<template>
  <div class="goods">

    <store-nav-bar background="#fff" :opacity="opacityIn" v-show="opacityIn  > 0">
      <template v-slot:left>
        <van-icon name="arrow-left" color="#999" size="20" @click="left('in')"/>
      </template>
      <template v-slot:title>
        <van-icon name="arrow-left" color="#999" size="20" />
      </template>
      <template v-slot:right>
        <van-icon name="chat-o" color="#999" size="20" />
      </template>
    </store-nav-bar>

    <store-nav-bar :opacity="opacityOut" v-show="opacityOut > 0">
      <template v-slot:left>
        <van-icon name="arrow-left" color="#999" size="20" @click="left('out')"/>
      </template>
      <template v-slot:right>
        <van-icon name="chat-o" color="#999" size="20" />
      </template>
    </store-nav-bar>

    <div class="content" >
      
      <van-swipe ref="swipe" class="goods-swipe" :autoplay="3000">
        <van-swipe-item v-for="(thumb, index) in goods.thumb" :key="index" @click="preview(index)">
          <img :src="thumb" >
        </van-swipe-item>
      </van-swipe>

      <van-cell-group>
        <van-cell>
          <div class="goods-title">{{ goods.title }}</div>
          <div class="goods-price">{{ formatPrice(goods.price) }}</div>
        </van-cell>
        <van-cell class="goods-express">
          <van-col span="10">运费：{{ goods.express }}</van-col>
          <van-col span="14">剩余：{{ goods.remain }}</van-col>
        </van-cell>
      </van-cell-group>

      <van-cell-group class="goods-cell-group" v-for="i in 10" :key="i">
        <van-cell value="进入店铺" icon="shop-o" is-link @click="sorry">
          <template slot="title">
            <span class="van-cell-text">有赞的店</span>
            <van-tag class="goods-tag" type="danger">官方</van-tag>
          </template>
        </van-cell>
        <van-cell title="线下门店" icon="location-o" is-link @click="sorry" />
      </van-cell-group>

      <van-cell-group class="goods-cell-group">
        <van-cell title="查看商品详情" is-link @click="sorry" />
      </van-cell-group>

    </div>

    <van-goods-action>
      <van-goods-action-icon icon="chat-o" @click="sorry">
        客服
      </van-goods-action-icon>
      <van-goods-action-icon icon="cart-o" @click="onClickCart">
        购物车
      </van-goods-action-icon>
      <van-goods-action-button type="warning" @click="sorry">
        加入购物车
      </van-goods-action-button>
      <van-goods-action-button type="danger" @click="sorry">
        立即购买
      </van-goods-action-button>
    </van-goods-action>
  </div>
</template>

<script>
import {
  Tag,
  Col,
  Icon,
  Cell,
  CellGroup,
  Swipe,
  Toast,
  SwipeItem,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  ImagePreview,
  Tab,
  Tabs
} from 'vant';
import storeNavBar from "@/components/store-nav-bar";

export default {
  components: {
    [Tag.name]: Tag,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton.name]: GoodsActionButton,
    [ImagePreview.name]: ImagePreview,
    storeNavBar
  },

  data() {
    return {
      opacityIn:0,
      opacityOut:1,
      goods: {
        title: '美国伽力果（约680g/3个）',
        price: 2680,
        express: '免运费',
        remain: 19,
        thumb: [
          'https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg',
          'https://img.yzcdn.cn/public_files/2017/10/24/1791ba14088f9c2be8c610d0a6cc0f93.jpeg'
        ]
      }
    };
  },
  created(){
    console.log("created:"+this.$route.params.id)
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true);
    console.log("mounted:"+this.$route.params.id)
  },
   beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll(e){
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      this.opacityIn = scrollTop/(this.$refs.swipe.$el.offsetHeight- 66);
      this.opacityOut = 1 - (scrollTop/(this.$refs.swipe.$el.offsetHeight - 66));
      console.log("opacityIn:"+this.opacityIn+", opacityOut:"+this.opacityOut)
    },
    preview(index){
      ImagePreview({
        images:this.goods.thumb,
        startPosition:index
      });
    },
    left(e){
      alert(e)
    },
    formatPrice() {
      return '¥' + (this.goods.price / 100).toFixed(2);
    },

    onClickCart() {
      this.$router.push('cart');
    },

    sorry() {
      Toast('暂无后续逻辑~');
    }
  }
};
</script>

<style lang="scss">
.goods {
  .van-home-nav-bar {
    background-color: $red;
  }

  .van-hairline--bottom::after {
    border-bottom-width: 0;
  }
  .content {
  }
  &-swipe {
    img {
      width: 100%;
      display: block;
    }
  }

  &-title {
    font-size: 16px;
  }

  &-price {
    color: #f44;
  }

  &-express {
    color: #999;
    font-size: 12px;
    padding: 5px 15px;
  }

  &-cell-group {
    margin: 15px 0;

    .van-cell__value {
      color: #999;
    }
  }

  &-tag {
    margin-left: 5px;
  }
}
</style>

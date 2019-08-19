<template>
  <div class="goods">

    <store-nav-bar class="nav-out" :opacity="opacityOut" v-show="opacityOut > 0">
      <template v-slot:left>
        <div class="back arrow-left">
          <van-icon name="arrow-left" color="#fff" size="20" @click="left('out')"/>
        </div>
      </template>
      <template v-slot:right>
        <div class="back share">
          <van-icon name="share" color="#fff" size="20"/>
        </div>
      </template>
    </store-nav-bar>

    <store-nav-bar class="nav-in" background="#fff" :opacity="opacityIn" v-show="opacityIn  > 0">
      <template v-slot:left>
        <van-icon name="arrow-left" color="#999" size="20" @click="left('in')"/>
      </template>
      <template v-slot:title>
        <van-tabs v-model="activeTab" line-width="40" :border="false" @click="scrollToAnchor">
          <van-tab ref="tab-product" title="商品" name="product"></van-tab>
          <van-tab ref="tab-comment" title="评价" name="comment"></van-tab>
          <van-tab ref="tab-detail" title="详情" name="detail"></van-tab>
        </van-tabs>
      </template>
      <template v-slot:right>
        <van-icon name="share" color="#999" size="20" />
      </template>
    </store-nav-bar>
  







    <van-swipe class="goods-swipe" :autoplay="3000" @change="onSwipeChange">
      <van-swipe-item v-for="(thumb, index) in goods.thumb" :key="index" @click="preview(index)">
        <img :src="thumb" >
      </van-swipe-item>
      <div class="custom-indicator" slot="indicator">
        {{ swipe.current + 1 }}/{{ goods.thumb.length }}
      </div>
    </van-swipe>

    <van-cell-group ref="product">
      <van-cell class="goods-price">
        <div class="price">{{ goods.title }}</div>
        <div class="originalPrice">{{ formatPrice(goods.price) }}</div>
        <!-- <div class="goods-title">{{ goods.title }}</div>
        <div class="goods-price">{{ formatPrice(goods.price) }}</div> -->
      </van-cell>
      <van-cell class="goods-express">
        <van-col span="10">运费：{{ goods.express }}</van-col>
        <van-col span="14">剩余：{{ goods.remain }}</van-col>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="goods-cell-group" ref="comment">
      <van-cell title="商品评价" />
      <van-cell value="单元格" icon="shop-o" is-link @click="sorry" v-for="i in 5" :key="i">
        <template slot="title">
          <span class="van-cell-text"></span>
          <van-tag class="goods-tag" type="danger">标签</van-tag>
        </template>
      </van-cell>
      <van-cell title="线下门店" icon="location-o" is-link @click="sorry" />
    </van-cell-group>
    
    <van-cell-group class="goods-cell-group" ref="detail">
      <van-cell title="图文详细" @click="sorry" />
      <van-cell value="单元格" icon="shop-o" is-link @click="sorry" v-for="i in 20" :key="i">
        <template slot="title">
          <span class="van-cell-text"></span>
          <van-tag class="goods-tag" type="danger">标签</van-tag>
        </template>
      </van-cell>
      <van-cell title="线下门店" icon="location-o" is-link @click="sorry" />
    </van-cell-group>
      

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
    [Tab.name]:Tab,
    [Tabs.name]:Tabs,
    storeNavBar
  },

  data() {
    return {
      opacityIn:0,
      opacityOut:1,
      activeTab:"product",
      swipe:{
        current:0,
      },
      goods: {
        title: '美国伽力果（约680g/3个）',
        originalPrice: 3564,
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
      this.opacityIn = scrollTop/(this.$refs.product.offsetTop- 66);
      this.opacityOut = 1 - (scrollTop/(this.$refs.product.offsetTop - 66));

      if(!this.tabClick){
        if(scrollTop < this.$refs.comment.offsetTop)
          this.activeTab = "product"
        if(scrollTop >= this.$refs.comment.offsetTop - 66 && scrollTop < this.$refs.detail.offsetTop - 66)
          this.activeTab = "comment"
        if(scrollTop >= this.$refs.detail.offsetTop - 66)
          this.activeTab = "detail"
      }
      console.log(scrollTop);
    },
    scrollToAnchor(e){
      let offsetTop = 0;
      switch (e) {
        case "product":
          offsetTop = 0;
          break;
        case "comment":
          offsetTop = this.$refs.comment.offsetTop - 66;
          break;
        case "detail":
          offsetTop = this.$refs.detail.offsetTop - 66;
          break;
      }
      this.tabClick = true
      window.scrollTo({ 
        top: offsetTop, 
        behavior: "smooth" 
      });
      setTimeout(() => {
        this.tabClick = false;
      }, 500);
    },
    left(e){
      this.$router.replace("/main/home");
    },
    onSwipeChange(index) {
      this.swipe.current = index;
    },
    preview(index){
      ImagePreview({
        images:this.goods.thumb,
        startPosition:index
      });
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
  margin-bottom: 50px;

  .back{
    position: relative;
  }
  .back::before{
    content: '';
    width: 30px;
    height: 30px;
    background-color: #000;
    border-radius: 50%;
    opacity: .3;
    display: block;
    position: absolute;
    
  }
  .arrow-left.back:before{
    left: -4px;
    top: -5px;
  }
  .share.back:before{
    left: -5px;
    top: -5px;
  }

  .nav-out.van-hairline--bottom::after{
      border-bottom-width: 0;
  }
  .nav-in{
    .van-nav-bar__title{
      margin-bottom: -10px;
      .van-tabs__nav{
        display: block;
        .van-tab{
          display: inline-block;
          padding: 0 15px;
        }
      }
    }
  }

  &-swipe {
    img {
      width: 100%;
      display: block;
    }
    .custom-indicator {
      position: absolute;
      right: 5px;
      bottom: 5px;
      padding: 2px 5px;
      color: #fff;
      font-size: 12px;
      background: rgba(0, 0, 0, 0.1);
    }
  }

  &-price {
    background-color: $red;
    color:#fff;
    .price{
      color:#fff;
    }

  }

  &-title {
    font-size: 16px;
  }

  &-originalPrice{
    color:#fff;
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

<template>
  <div class="goods">

    <store-nav-bar class="nav-out" :opacity="opacityOut" v-show="opacityOut > 0">
      <template v-slot:left>
        <div class="back arrow-left">
          <van-icon name="arrow-left" color="#fff" size="20" @click="left('out')"/>
        </div>
      </template>
      <template v-slot:right>
        <div class="back share" @click="share.show = true">
          <van-icon name="share" color="#fff" size="20"/>
        </div>
      </template>
    </store-nav-bar>

    <store-nav-bar class="nav-in" background="#fff" :opacity="opacityIn" v-show="opacityIn  > 0">
      <template v-slot:left>
        <van-icon name="arrow-left" color="#999" size="20" @click="left('in')"/>
      </template>
      <template v-slot:title>
        <van-tabs v-model="activeTab" :class="{'visibility':showJudgeSheet}" line-width="40" :border="false" @click="scrollToAnchor">
          <van-tab ref="tab-product" title="商品" name="product"></van-tab>
          <van-tab ref="tab-comment" title="评价" name="comment"></van-tab>
          <van-tab ref="tab-detail" title="详情" name="detail"></van-tab>
        </van-tabs>
      </template>
      <template v-slot:right>
        <van-icon name="share" color="#999" size="20" @click="share.show = true"/>
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

    <van-cell-group ref="product" :border="false">
      <van-cell class="goods-price" :border="false" :center="true">
        <div class="price">{{ formatPrice(goods.price) }}</div>
        <div class="originalPrice">
          价格 <span class="line-through">{{ formatPrice(goods.originalPrice) }}</span>
        </div>
      </van-cell>
      <van-cell :title="goods.name" title-style="font-size:1rem;" :label="goods.subTitle"/>
      <van-cell :title="'运费：'+goods.express" style="font-size:.8rem;color:#969799" :value="'已售'+goods.remain"/>
    </van-cell-group>

    <van-cell-group class="goods-cell-group">
       <van-cell title-class="title" title="7天退换.免费包邮" value="" :is-link="true" @click="showServiceSheet = true" >
        <template v-slot:icon class="title">服务：</template>
      </van-cell>
      <van-cell  title-class="title" title="型号、品牌" value="" :is-link="true" @click="showParamSheet = true">
        <template v-slot:icon class="title">参数：</template>
      </van-cell>
      <van-cell  title-class="title" title="7天退换.免费包邮" value="" :is-link="true">
        <template v-slot:icon class="title">规格：</template>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="goods-cell-group" ref="comment" @click="showJudge"> 
      <div class="judge-top van-hairline--bottom">
        <div>商品评价(1111)</div>
        <div class="right">查看全部<van-icon name="arrow" color="#f44"/></div>
      </div>
      <div class="judge-area">
        <div class="row-1">
          <img class="head-img" src="">
          <span class="user-name">名**字</span>
        </div>
        <div class="row-2 overhide">
          很好看很好看很好看很好看很好看，很好看很好看很好看很好看，很好看很好看很好看很好很好看很好看很好看，很好看很好看很好看很好看很好看很好看很好看很好看很好看很好看很好看很好看很好看
        </div>
      </div>
    </van-cell-group>
    <van-cell-group class="goods-cell-group" ref="detail">
      <van-cell title="图文详细" @click="sorry" />
      <div class="goods-detail" >
        <img v-for="j in 4" src="https://img.yzcdn.cn/vant/apple-1.jpg" >
      </div>
      
    </van-cell-group>
    
    <store-share :show="share.show" @cancel="share.show=false"></store-share>

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
  
    <van-popup
      class="judge-popup"
      v-model="showJudgeSheet"
      position="right"
    >
      <judge-sheet @showPre="showPre"></judge-sheet>
    </van-popup>
    <van-popup
      class="bottom-popup"
      v-model="showServiceSheet"
      position="bottom"
    >
      <div class="service-content popup-content">
        <div class="title">服务说明</div>
        <div class="item-wrapper">
          <div class="item" v-for='i in 5'>
          <div class="left"><van-icon name="certificate" color="#f44" /></div>
          <div class="right">
            <div class="itme-title">正品保证</div>
            <div class="itme-info">本商品是滴是滴时间来得及啊第四季度是本商品是滴是滴时间来得及啊第四季度是</div>
          </div>
        </div>
        </div>
        <div class="btn" @click="showServiceSheet=false">完成</div>
      </div>
    </van-popup>
    <van-popup
      class="bottom-popup"
      v-model="showParamSheet"
      position="bottom"
    >
      <div class="params-content popup-content">
        <div class="title">产品参数</div>
        <div class="item-wrapper">
          <div class="item van-hairline--bottom" v-for='i in 5'>
            <div class="left">型号</div>
            <div class="right">Eu22923</div>
          </div>
        </div>
        <div class="btn" @click="showServiceSheet=false">完成</div>
      </div>
    </van-popup>
    <van-image-preview
      v-model="prePicShow"
      :images="preImage"
      :show-index='false'
      >
    </van-image-preview>
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
  Tabs,
  Popup
} from 'vant';
import storeNavBar from "@/components/store-nav-bar";
import storeShare from "@/components/store-share";
import judgeSheet from "./judgeSheet";
import Big from "big.js";
import Vue from 'vue';
Vue.use(ImagePreview);
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
    [Popup.name]:Popup,
    storeNavBar,
    storeShare,
    judgeSheet
  },

  data() {
    return {
      opacityIn:0,
      opacityOut:1,
      activeTab:"product",
      swipe:{
        current:0,
      },
      share:{
        show:false
      },
      goods: {
        name: 'HLA海澜之家简约动物印花短袖T恤',
        subTitle: '2018夏季新品微弹舒适新款短T男生 6月6日-6月20日，满300减30，参与互动赢百元礼券，立即分享赢大奖',
        originalPrice: 98,
        price: 98,
        express: '免运费',
        remain: 19,
        thumb: [
          'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5ad83a4fN6ff67ecd.jpg!cc_350x449.jpg',
          'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5ac98b64N70acd82f.jpg!cc_350x449.jpg',
          'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5a51eb88Na4797877.jpg'
        ]
      },
      showJudgeSheet: false,
      prePicShow: false,
      preImage: [],
      showServiceSheet: false,  
      showParamSheet: false    
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
    window.removeEventListener('scroll', this.handleScroll, true);
  },
  methods: {
    handleScroll(e){
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if(this.showJudgeSheet)return
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
      console.log('ss',this.showJudgeSheet)
      if(this.showJudgeSheet) {
        this.showJudgeSheet = false
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        this.opacityIn = scrollTop/(this.$refs.product.offsetTop- 66);
      } else {
        this.$router.replace("/main/home");
      }
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
    formatPrice(price) {
      return '¥ ' + new Big(price).toFixed(2);
    },

    onClickCart() {
      this.$router.push('cart');
    },

    sorry() {
      Toast('暂无后续逻辑~');
    },
    showJudge() {
      this.opacityIn = 1
      this.showJudgeSheet = true
    },
    showPre(img) {
      this.preImage = [
        'https://img.yzcdn.cn/vant/apple-1.jpg',
      ]
      this.prePicShow = true
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
    height: 55vh;
    background-color: #fff;
    .van-swipe-item{
      display: flex;
      align-items: center;
      img {
        width: 100%;
        display: block;
      }
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
      font-size: 26px;
    }
    .originalPrice{
      color:#fff;
    }
  }

  .title {
    font-size:.8rem;
    color:#969799
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
    .visibility{
    visibility: hidden;
  }
  .judge-top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    font-size: 14px;
    .right{
      color: $red;
      display: flex;
      align-items: center;
      font-size: 12px;
    }
  }
  .judge-area{
    min-height: 100px;
    padding: 15px;
    &.inPopup{
      margin: 10px;
      border-radius: 4px;
      overflow: hidden;
      background: #FFF;
    }
    .row-1{
      display: flex;
      align-items: center;
      .head-img{
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #eee;
      }
      .user-name{
        color: #999;
      }
    }
    .row-2{
      margin-top: 10px;
      &.overhide{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .pic-area{
        margin-top: 10px;
        img{
          width: 70px;
          height: 70px;
          margin-right: 10px;
        }
      }
    }
    .row-3{
      margin-top: 10px;
      color: #999;
    }
  }
  .van-image-preview__overlay{
    z-index: 3100 !important;
  }
  .van-image-preview{
    z-index: 3120 !important;
  }
  .judge-popup{
    height: 100%;
    width: 100%;
    padding-top: 76px;
    background: #f2f2f2;
  }
  .bottom-popup{
    height: 50%;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
  }
  .goods-detail{
    img{
      width: 100%;
    }
  }
  .popup-content{
    padding: 0 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .title{
      margin: 15px 0;
      font-size: 16px;
      text-align: center;
      color: #000;
    }
    .item-wrapper{
      flex: 1;
      overflow: auto;
      &::-webkit-scrollbar { 
        width: 0 ; 
        display: none;
      }
    }
    &.service-content{
      .item{
        display: flex;
        align-items: flex-start;
        margin-bottom: 15px;
        .left{
          margin: 3px 5px 0 0;
        }
        .itme-title{
          font-size: 14px;
        }
        .itme-info{
          margin-top: 4px;
          color: #999;
        }
      }
    }
    &.params-content{
      .item{
        display: flex;
        align-items: center;
        font-size: 12px;
        height: 40px;
        .left{
          margin-right: 20px;
          width: 15%;
          color: #999;
        }
        .right{
          flex: 1;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    
    .btn{
      width: 95%;
      background: $red;
      text-align: center;
      height: 40px;
      line-height: 40px;
      color: #FFF;
      font-size: 16px;
      margin: 0 auto;
      flex-basis: 0;
      border-radius: 20px;
    }
  }
}
</style>

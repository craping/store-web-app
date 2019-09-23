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
  







    <van-swipe class="goods-swipe" :loop="false" :autoplay="0" @change="onSwipeChange">
      <van-swipe-item v-for="(thumb, index) in goods.thumb" :key="index" @click="preview(index)">
        <template v-if="video.url && index == 0">
          <video 
            ref="video" 
            v-show="video.show" 
            :src="video.url" 
            controls="controls" 
            x5-playsinline="" 
            playsinline="" 
            webkit-playsinline="" 
            @loadedmetadata="videoLoaded" 
            @ended="video.show=false"
          ></video>
          <div v-show="!video.show" class="play" @click.stop="displayVideo">
            <van-icon name="play" />&nbsp;<p>{{video.duration}}</p>
          </div>
        </template>
        <img :src="thumb" >
        
      </van-swipe-item>
      <div class="custom-indicator" slot="indicator">
        {{ swipe.current + 1 }}/{{ goods.thumb.length }}
      </div>
    </van-swipe>

    <van-cell-group ref="product" :border="false">
      <van-cell class="goods-price" :border="false" :center="true">
        <div class="price">{{ formatPrice(goods.price, goods.maxPrice) }}</div>
        <div class="originalPrice">
          价格 <span class="line-through">{{ formatPrice(goods.originalPrice) }}</span>
        </div>
        <div class="originalPrice">
          赚 <span>{{ formatPrice(goods.commission, goods.maxCommission) }}</span>
        </div>
      </van-cell>
      <van-cell :title="goods.title" title-style="font-size:1rem;" :label="goods.subTitle"/>
      <van-cell :title="'运费：'+(goods.baseCarriage?goods.baseCarriage:'免运费')" style="font-size:.8rem;color:#969799" :value="'已售'+goods.sale"/>
    </van-cell-group>

    <van-cell-group class="goods-cell-group">
       <van-cell title-class="title text-ellipsis" value-class="flex-0" :title="goods.service" @click="showServiceSheet = true" :is-link="true">
        <template v-slot:icon class="title">服务：</template>
      </van-cell>
      <van-cell  title-class="title text-ellipsis" :title="goods.params" :is-link="true" @click="params.show=true">
        <template v-slot:icon class="title">参数：</template>
      </van-cell>
      <van-cell  title-class="title text-ellipsis" :title="goods.sku" :is-link="true" @click="sku.show=true">
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
      <div class="goods-detail" v-html="goods.detailHtml" @click="showHTMLPre($event)"></div>
      
    </van-cell-group>
    
    <store-share :show="share.show" @cancel="share.show=false"></store-share>

    <van-sku
      v-model="sku.show"
      :sku="sku"
      :goods="goods"
      :quota="0"
      :hide-stock="sku.hide_stock"
    />

    <van-goods-action>
      <van-goods-action-icon icon="chat-o" @click="sorry">
        客服
      </van-goods-action-icon>
      <van-goods-action-icon icon="cart-o" @click="onClickCart">
        购物车
      </van-goods-action-icon>
      <van-goods-action-button type="warning" @click="sku.show=true">
        加入购物车
      </van-goods-action-button>
      <van-goods-action-button type="danger" @click="sku.show=true">
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
  Popup,
  Sku
} from 'vant';
import storeNavBar from "@/components/store-nav-bar";
import storeShare from "@/components/store-share";
import judgeSheet from "./judgeSheet";
import {PrefixInteger} from "@/utils/util";
import Big from "big.js";
import Vue from 'vue';
Vue.use(ImagePreview);
const service = ["","7天退换", "正品保障", "免费包邮"];
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
    [Sku.name]: Sku,
    storeNavBar,
    storeShare,
    judgeSheet
  },

  data() {
    return {
      opacityIn:0,
      opacityOut:1,
      activeTab:"product",
      video:{
        show:false,
        url:null,
        duration:""
      },
      swipe:{
        current:0,
      },
      share:{
        show:false
      },
      goods: {
        title: '',
        subTitle: '',
        picture: '',
        originalPrice: 0,
        price: 0,
        express: '免运费',
        sale: 0,
        thumb: []
      },
      sku: {
        show:false,
        tree: [],
        list: [],
        price: '',
        stock_num: 227,
        collection_id: 2261, // 默认skuID
        none_sku: false, // 是否无规格商品
        messages: [],
        hide_stock: true // 是否隐藏剩余库存
      },
      params:{
        list:[],
        show:false
      },
      comments:[],
      showJudgeSheet: false,
      prePicShow: false,
      preImage: [],
      showServiceSheet: false,  
      showParamSheet: false    
    };
  },
  created(){
    this.$http.post("product/detail", {
      pId:this.$route.params.pId,
      pacId:this.$route.params.pacId
    }).then(data => {
      //goods初始化
      let product = data.info.product;
      let skus = data.info.skus;
      product.title = product.name;
      product.thumb = product.albumPics==""?[]:product.albumPics.split(",");
      product.thumb.unshift(product.pic);
      const index = product.thumb.findIndex(e => {
        if(e.includes(".mp4")){
          this.video.url = e;
          return true;
        }
        return false;
      });
      if(index != -1)
        product.thumb.splice(index, 1);

      product.picture = product.pic;
      product.sku = "";
      product.params = "";
      product.service = "";
      skus.sort((a, b) => {
        return a.price > b.price ? 1 : -1;
      })
      product.commission = skus[0].commission;
      if(skus.length > 1){
        product.maxCommission = skus[skus.length-1].commission;
        product.maxPrice = skus[skus.length-1].price;
      }
      product.serviceIds.split(",").forEach(e => {
        product.service += service[parseInt(e)] + " ";
      })
      this.goods = product;
      //参数初始化
      data.info.params.forEach(e => {
        this.goods.params += e.name + " ";
      })

      //sku初始化
      this.sku.price = new Big(product.price).toFixed(2);
      for (let i = 0; i < data.info.specifications.length; i++) {
        const e = data.info.specifications[i];
        this.goods.sku += e.name + " ";
        const sp = {
          k: e.name,
          v:[],
          k_s: 'sp'+(i+1)
        };
        e.inputList.split(",").forEach(v => {
          sp.v.push({
            id:v,
            name:v
          })
        });
        this.sku.tree.push(sp);
      }
      skus.forEach(e => {
        e.stock_num = 9999;
        e.price *= 100;
      })
      this.sku.list = skus;
      this.comments = data.info.comments;
    })
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true);
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
      // console.log(scrollTop);
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
        this.$router.go(-1);
      }
    },
    displayVideo(){
      this.video.show = true;
      this.videoPlay();
    },
    videoPlay(){
      this.$refs.video[0].play();
    },
    videoPause(){
      this.$refs.video[0].pause();
    },
    videoLoaded(){
      const duration = this.$refs.video[0].duration;
      const m = parseInt(duration/60);
      const s = parseInt(duration%60);
      this.video.duration = (m?PrefixInteger(m, 2)+"'":"00'")+PrefixInteger(s, 2)+"''";
    },
    onSwipeChange(index) {
      this.swipe.current = index;
      if(index != 0)
        this.videoPause();
    },
    preview(index){
      if(index == 0 && this.video.show)
        return;
      ImagePreview({
        images:this.goods.thumb,
        startPosition:index
      });
    },
    formatPrice(minPrice, maxPrice) {
      if(!minPrice)
        return "";
      return '¥' + new Big(minPrice).toFixed(2) + (maxPrice?'~¥' + new Big(maxPrice).toFixed(2):"");
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
    showHTMLPre(e) {
      if(e.target.nodeName === "IMG") {
        this.preImage = [e.target.getAttribute("src")]
        this.prePicShow = true
      }
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
    // height: 45vh;
    background-color: #fff;
    .van-swipe-item{
      display: flex;
      align-items: center;
      background-color: #000;
      img {
        width: 100%;
        display: block;
      }
      video{
        width: 100%;
        height: 100%;
      }
      .play{
        color:#fff;
        font-size: 1rem;
        padding: .5rem;
        display: flex;
        align-items: center;
        background: rgba(0,0,0,.4);
        border-radius: 1.5rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 50;
        p{
          height: 1rem;
        }
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
      font-size: 18px;
    }
    .originalPrice{
      color:#fff;
      font-size: 12px;
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

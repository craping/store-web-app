<template>
  <div class="goods">
    <store-nav-bar class="nav-out" :opacity="opacityOut" v-show="opacityOut > 0">
      <template v-slot:left>
        <div class="back arrow-left">
          <van-icon name="arrow-left" color="#fff" size="20" @click="left('out')"/>
        </div>
      </template>
      <template v-slot:right v-if="shareEnable">
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
        <van-tabs
          v-model="activeTab"
          :class="{'visibility':showCommentsSheet}"
          line-width="40"
          :border="false"
          @click="scrollToAnchor"
        >
          <van-tab ref="tab-product" title="商品" name="product"></van-tab>
          <van-tab ref="tab-comment" title="评价" name="comment"></van-tab>
          <van-tab ref="tab-detail" title="详情" name="detail"></van-tab>
        </van-tabs>
      </template>
      <template v-slot:right v-if="shareEnable">
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
            x5-playsinline
            playsinline
            webkit-playsinline
            @loadedmetadata="videoLoaded"
            @ended="video.show=false"
          ></video>
          <div v-show="!video.show" class="play" @click.stop="displayVideo">
            <van-icon name="play"/>&nbsp;
            <p>{{video.duration}}</p>
          </div>
        </template>
        <img :src="thumb">
      </van-swipe-item>
      <div
        class="custom-indicator"
        slot="indicator"
      >{{ swipe.current + 1 }}/{{ goods.thumb.length }}</div>
    </van-swipe>

    <van-cell-group ref="product" :border="false">
      <van-cell class="goods-price" :border="false" :center="true">
        <div class="price">{{ formatPrice(goods.price, goods.maxPrice) }}</div>
        <div v-if="vipEnable" class="commission">
          赚
          <span>{{ commission }}</span>
        </div>
        <div v-else class="originalPrice">
          价格
          <span class="line-through">{{ formatPrice(goods.originalPrice) }}</span>
        </div>
      </van-cell>
      <van-cell v-if="vipEnable" class="goods-level" icon="info-o" :center="true">
        本品最高返现{{levelCommission}}，您当前级别返现为{{ commission }}
      </van-cell>
      <van-cell :title="goods.title" title-style="font-size:1rem;" :label="goods.subTitle"/>
      <van-cell
        :title="'运费：'+(goods.baseCarriage?goods.baseCarriage:'免运费')"
        style="font-size:.8rem;color:#969799"
        :value="'已售'+goods.sale"
      />
    </van-cell-group>

    <van-cell-group class="goods-cell-group">
      <van-cell
        title-class="title text-ellipsis"
        value-class="flex-0"
        :title="goods.service"
        @click="serviceSheet.show = true"
        :is-link="true"
      >
        <template v-slot:icon class="title">服务：</template>
      </van-cell>
      <van-cell
        title-class="title text-ellipsis"
        :title="goods.params"
        :is-link="true"
        @click="paramsSheet.show=true"
      >
        <template v-slot:icon class="title">参数：</template>
      </van-cell>
      <van-cell
        title-class="title text-ellipsis"
        :title="goods.sku"
        :is-link="true"
        @click="showSku"
      >
        <template v-slot:icon class="title">规格：</template>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="goods-cell-group" ref="comment">
      <div class="comments-top van-hairline--bottom" @click="showCommentsHandle">
        <div>商品评价({{commentsTotalnum}})</div>
        <div class="right" v-if="comments.length">
          查看全部
          <van-icon name="arrow" color="#f44"/>
        </div>
      </div>
      <div class="no-comments-area" v-if="comments.length == 0">暂无评价</div>
      <div v-else class="comments-area" v-for="item in comments" :key="item.id">
        <div class="row-1">
          <img class="head-img" :src="item.memberIcon">
          <span class="user-name">{{item.memberUsername}}</span>
        </div>
        <div class="row-2">
          <div class="overhide">{{item.content}}</div>
          <div class="pic-area" v-if="item.pics">
            <img
              v-for="(pic,index) in JSON.parse(item.pics)"
              :key="index"
              :src="pic.url"
              @click="showPre(JSON.parse(item.pics))"
            >
          </div>
        </div>
        <div class="row-3">{{formatTime(item.createTime)}} 规格:{{formatAttr(item.productAttribute)}}</div>
      </div>
    </van-cell-group>
    <van-cell-group class="goods-cell-group" ref="detail">
      <van-cell title="图文详细" @click="sorry"/>
      <div class="goods-detail" v-html="goods.detailHtml" @click="showHTMLPre($event)"></div>
    </van-cell-group>

    <store-share
      v-if="shareEnable"
      v-model="share.msg"
      :show="share.show"
      @cancel="share.show=false"
    ></store-share>
    <van-sku
      ref="sku"
      v-model="sku.show"
      :sku="sku"
      :goods-id="goods.id"
      :goods="goods"
      :quota="0"
      :hide-stock="sku.hide_stock"
      @buy-clicked="buy"
      @add-cart="addCart"
      @sku-selected="skuSelected"
      @stepper-change="stepperChange"
    >
      <template slot="sku-actions" slot-scope="props">
        <div class="van-sku-actions">
          <van-button
            square
            size="large"
            type="warning"
            @click="props.skuEventBus.$emit('sku:addCart')"
          >
            <div style="line-height:normal">
              <div>加入购物车</div>
              <div v-if="vipEnable" class="commission">省 {{ skuCommission }}</div>
            </div>
          </van-button>
          <!-- 直接触发 sku 内部事件，通过内部事件执行 buy 回调 -->
          <van-button square size="large" type="danger" @click="props.skuEventBus.$emit('sku:buy')">
            <div style="line-height:normal">
              <div>立即购买</div>
              <div v-if="vipEnable" class="commission">省 {{ skuCommission }}</div>
            </div>
          </van-button>
        </div>
      </template>
    </van-sku>

    <van-goods-action>
      <van-goods-action-icon icon="chat-o" @click="openService" :info="unread">客服</van-goods-action-icon>
      <van-goods-action-icon icon="like-o" @click="addLike">收藏</van-goods-action-icon>
      <!-- <van-goods-action-icon icon="like" icon-class="had-like" @click="cancelLike" >已收藏</van-goods-action-icon> -->
      <van-goods-action-icon icon="cart-o" @click="onClickCart" :info="cartNum">购物车</van-goods-action-icon>
      <template v-if="vipEnable">
        <van-goods-action-button type="warning" @click="sku.show=true">
          <div style="line-height:normal">
            <div>购买</div>
            <div class="commission">省 {{ commission }}</div>
          </div>
        </van-goods-action-button>
        <van-goods-action-button type="danger" @click="share.show=true">
          <div style="line-height:normal">
            <div>分享</div>
            <div class="commission">赚 {{ commission }}</div>
          </div>
        </van-goods-action-button>
      </template>
      <template v-else>
        <van-goods-action-button type="warning" @click="showSku">加入购物车</van-goods-action-button>
        <van-goods-action-button type="danger" @click="showSku">立即购买</van-goods-action-button>
      </template>
    </van-goods-action>

    <van-popup class="comments-popup" :zIndex="500" v-model="showCommentsSheet" position="right">
      <comments @showPre="showPre"></comments>
    </van-popup>

    <van-popup class="bottom-popup" v-model="serviceSheet.show" position="bottom">
      <div class="service-content popup-content">
        <div class="title">服务说明</div>
        <div class="item-wrapper">
          <div class="item" v-for="(item,index) in serviceSheet.list" :key="index">
            <div class="left">
              <van-icon name="certificate" color="#f44"/>
            </div>
            <div class="right">
              <div class="itme-title">{{item.value}}</div>
              <div class="itme-info">{{item.desc}}</div>
            </div>
          </div>
        </div>
        <div class="btn" @click="serviceSheet.show=false">完成</div>
      </div>
    </van-popup>
    <van-popup class="bottom-popup" v-model="paramsSheet.show" position="bottom">
      <div class="params-content popup-content">
        <div class="title">产品参数</div>
        <div class="item-wrapper">
          <div
            class="item van-hairline--bottom"
            v-for="(item,index) in paramsSheet.list"
            :key="index"
          >
            <div class="left">{{item.name}}</div>
            <div class="right">{{item.inputList}}</div>
          </div>
        </div>
        <div class="btn" @click="paramsSheet.show=false">完成</div>
      </div>
    </van-popup>
    <van-image-preview v-model="prePicShow" :images="preImage" :show-index="false"></van-image-preview>
    <store-service :value.sync="showService"></store-service>
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
  Sku,
  Button
} from 'vant'
import storeNavBar from '@/components/store-nav-bar'
import storeShare from '@/components/store-share'
import storeService from '@/components/store-service'
import comments from './comments'
import { PrefixInteger } from '@/utils/util'
import service from '@/utils/service'
import Big from 'big.js'
import Vue from 'vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import sync from '@/utils/sync'
import { format } from '@/utils/util'

Vue.use(ImagePreview)
const serviceItems = [
  {
    key: '1',
    value: '7天退换',
    desc: '满足相应条件时，消费者可申请“七天无理由退换货”'
  },
  {
    key: '2',
    value: '正品保障',
    desc: '本商品由海内外认证的供应商或品牌商直供货源，保证100%正品。'
  },
  {
    key: '3',
    value: '免费包邮',
    desc: '物流费用由卖家承担'
  }
]
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
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Popup.name]: Popup,
    [Sku.name]: Sku,
    [Button.name]: Button,
    storeNavBar,
    storeShare,
    storeService,
    comments
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      isLogin: state => state.user.isLogin,
      commentsTotalnum: state => state.comments.commentsTotalnum,
      unread: state => state.sys.unread
    }),
    ...mapGetters('cart', ['cartNum']),
    ...mapGetters('sys', ['shareEnable', 'vipEnable']),
    commission: function() {
      return this.formatPrice(this.goods.commission, this.goods.maxCommission)
    },
    skuCommission: function() {
      return this.formatPrice(this.sku.commission, this.sku.maxCommission)
    },
    levelCommission: function() {
      return this.formatPrice(this.goods.levelCommission, this.goods.levelMaxCommission)
    },
    recommenderId: function() {
      return this.goods.id == this.$route.query.shopId
        ? this.$route.query.recommenderId
        : null
    }
  },
  data() {
    return {
      opacityIn: 0,
      opacityOut: 1,
      activeTab: 'product',
      video: {
        show: false,
        url: null,
        duration: ''
      },
      swipe: {
        current: 0
      },
      share: {
        show: false,
        msg: {
          title: null,
          content: null,
          thumbs: [],
          href: null
        }
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
        show: false,
        tree: [],
        list: [],
        price: '',
        stock_num: 227,
        collection_id: 2261, // 默认skuID
        none_sku: false, // 是否无规格商品
        messages: [],
        hide_stock: true, // 是否隐藏剩余库存
        commission: 0,
        maxCommission: 0
      },
      paramsSheet: {
        list: [],
        show: false
      },
      serviceSheet: {
        list: [],
        show: false
      },
      comments: [],
      showService: false,
      showCommentsSheet: false,
      prePicShow: false,
      preImage: []
    }
  },
  created() {
    this.$http
      .post('product/detail', {
        id: this.$route.params.id
      })
      .then(data => {
        //goods初始化
        let { product, skus, specifications, comments } = data.info
        product.title = product.name
        product.thumb =
          product.albumPics == '' ? [] : product.albumPics.split(',')
        product.thumb.unshift(product.pic)
        const index = product.thumb.findIndex(e => {
          if (e.includes('.mp4')) {
            this.video.url = e
            return true
          }
          return false
        })
        if (index != -1) product.thumb.splice(index, 1)

        product.picture = product.pic
        product.sku = ''
        product.params = ''
        product.service = ''
        skus.sort((a, b) => {
          if (a.price != b.price) {
              return a.price - b.price;
          }else {
              return a.commission - b.commission;
          }

          return a.price > b.price ? 1 : -1
        })
        product.commission = skus[0].commission
        product.levelCommission = skus[0].maxCommission
        if (skus.length > 1) {
          product.maxCommission = skus[skus.length - 1].commission
          product.levelMaxCommission = skus[skus.length - 1].maxCommission
          product.maxPrice = skus[skus.length - 1].price
        }
        //服务初始化
        this.serviceSheet.list = serviceItems.filter(ele =>
          product.serviceIds.split(',').includes(ele.key)
        )
        console.log('this.serviceSheet.list', this.serviceSheet.list)
        this.serviceSheet.list.forEach(e => {
          product.service += e.value + ' '
        })
        this.goods = product
        //参数初始化
        data.info.params.forEach(e => {
          this.goods.params += e.name + ' '
        })
        this.paramsSheet.list = data.info.params || []

        //sku初始化
        this.sku.price = new Big(product.price).toFixed(2)
        for (let i = 0; i < specifications.length; i++) {
          const e = specifications[i]
          this.goods.sku += e.name + ' '
          const sp = {
            k: e.name,
            v: [],
            k_s: 'sp' + (i + 1)
          }
          e.inputList.split(',').forEach(v => {
            sp.v.push({
              id: v,
              name: v
            })
          })
          this.sku.tree.push(sp)
        }
        skus.forEach(e => {
          e.stock_num = 9999
          e.price *= 100
          e.title = product.title
          e.subTitle = product.subTitle
          e.supId = product.supId
          e.pic = product.pic
          e.productAttr = []
          for (let i = 1; i <= 3; i++) {
            const value = e['sp' + i]
            if (value)
              e.productAttr.push({
                key: specifications[i - 1].name,
                value: value
              })
          }
        })
        this.sku.list = skus
        this.sku.commission = product.commission
        this.sku.maxCommission = product.maxCommission
        //分享组件初始化
        this.share.msg = {
          title: product.title,
          content: product.subTitle,
          thumbs: [product.pic],
          href: process.env.VUE_APP_SHARE + product.id + '?shopId=' + product.id
        }
        this.comments = comments
      })

    this.queryComments({
      id: this.$route.params.id,
      pageNum: 1,
      pageSize: 10
    })
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true)
    this.onPlusReady(() => {
      plus.key.addEventListener('backbutton', this.handleback)
    });
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, true)
    this.onPlusReady(() => {
      plus.key.removeEventListener("backbutton",this.handleback);
    });
  },
  methods: {
    ...mapActions('comments', ['queryComments']),
    handleback() {
      if (this.prePicShow) {
        this.prePicShow = false
      } else if (this.video.show) {
        this.video.show = false
      } else if (this.share.show) {
        this.share.show = false
      } else if (this.showCommentsSheet) {
        this.showCommentsSheet = false
      } else {
        this.$router.go(-1)
      }
    },
    handleScroll(e) {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      if (this.showCommentsSheet) return
      this.opacityIn = scrollTop / (this.$refs.product.offsetTop - 66)
      this.opacityOut = 1 - scrollTop / (this.$refs.product.offsetTop - 66)

      if (!this.tabClick) {
        if (scrollTop < this.$refs.comment.offsetTop) this.activeTab = 'product'
        if (
          scrollTop >= this.$refs.comment.offsetTop - 66 &&
          scrollTop < this.$refs.detail.offsetTop - 66
        )
          this.activeTab = 'comment'
        if (scrollTop >= this.$refs.detail.offsetTop - 66)
          this.activeTab = 'detail'
      }
      // console.log(scrollTop);
    },
    scrollToAnchor(e) {
      let offsetTop = 0
      switch (e) {
        case 'product':
          offsetTop = 0
          break
        case 'comment':
          offsetTop = this.$refs.comment.offsetTop - 66
          break
        case 'detail':
          offsetTop = this.$refs.detail.offsetTop - 66
          break
      }
      this.tabClick = true
      try{
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        })
      }catch(e){
        window.scrollTo(0, offsetTop);
      }
      setTimeout(() => {
        this.tabClick = false
      }, 500)
    },
    left(e) {
      if (this.showCommentsSheet) {
        this.showCommentsSheet = false
        const scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop
        this.opacityIn = scrollTop / (this.$refs.product.offsetTop - 66)
      } else {
        if (window.history.length <= 1) this.$router.push('/main/home')
        else this.$router.go(-1)
      }
    },
    displayVideo() {
      this.video.show = true
      this.videoPlay()
    },
    videoPlay() {
      this.$refs.video[0].play()
    },
    videoPause() {
      this.$refs.video[0].pause()
    },
    videoLoaded() {
      const duration = this.$refs.video[0].duration
      const m = parseInt(duration / 60)
      const s = parseInt(duration % 60)
      this.video.duration =
        (m ? PrefixInteger(m, 2) + "'" : "00'") + PrefixInteger(s, 2) + "''"
    },
    onSwipeChange(index) {
      this.swipe.current = index
      if (index != 0) this.videoPause()
    },
    preview(index) {
      if (index == 0 && this.video.show) return
      this.preImage = this.goods.thumb
      this.prePicShow = true
      // ImagePreview({
      //   images: this.goods.thumb,
      //   startPosition: index
      // })
    },
    formatPrice(minPrice, maxPrice) {
      if (!minPrice) return ''
      return (
        '¥' +
        new Big(minPrice).toFixed(2) +
        (maxPrice && minPrice!=maxPrice ? '~¥' + new Big(maxPrice).toFixed(2) : '')
      )
    },
    // 添加收藏
    addLike() {
      if (!this.isLogin) {
        this.$router.push('/login')
        this.$store.commit('user/SET_BEFOREPATH', this.$route.path)
        // Toast('用户未登录')
        return
      }
      this.$http
        .post("/collec/addProduct", {productId:this.$route.params.id})
        .then(res => {
          Toast('收藏成功');
        })
        .catch(error => {
          Toast(error.message);
        });
    },
    // 取消收藏
    cancelLike(id) {
      this.$http
        .post("/collec/deleteProduct", { id: this.$route.params.id })
        .then(res => {
          Toast('取消收藏');
        })
        .catch(error => {
          Toast(error.message);
        });
    },
    onClickCart() {
      this.$router.push({path:'/main/cart', query:{hideBotBar:true}})
    },

    sorry() {
      Toast('暂无后续逻辑~')
    },
    showCommentsHandle() {
      this.showCommentsSheet = true

      if (this.comments.length) {
        this.opacityIn = 1
        this.showCommentsSheet = true
      }
    },
    showHTMLPre(e) {
      if (e.target.nodeName === 'IMG') {
        this.preImage = [e.target.getAttribute('src')]
        this.prePicShow = true
      }
    },
    showPre(picArray) {
      this.preImage = picArray.map(ele => ele.url)
      this.prePicShow = true
    },
    showSku() {
      if (!this.isLogin) {
        this.$router.push('/login')
        this.$store.commit('user/SET_BEFOREPATH', this.$route.path)
        // Toast('用户未登录')
        return
      }
      this.sku.show = true
    },
    /********点击立即购买去到确认订单中心******/
    buy(skuData) {
      const sku = {
        ...skuData.selectedSkuComb, 
        quantity:skuData.selectedNum,
        recommenderId:this.recommenderId
      };
      sku.price /= 100; 
      // console.log(sku);
      this.$store.commit('order/SET_CONFIRM_ORDER_LIST', [sku])
      this.$router.push({
        name: 'confirmOrder',
        query: {
          type: 'dir'
        }
      })
    },
    addCart(skuData) {
      const sku = {
        ...skuData.selectedSkuComb, 
        quantity:skuData.selectedNum,
        recommenderId:this.recommenderId
      };
      sku.price /= 100; 
      // console.log(sku)
      this.$http
        .post('cartItem/addCart', {
          productSkuId: sku.id,
          quantity: sku.quantity,
          productAttr: JSON.stringify(sku.productAttr),
          recommenderId: this.recommenderId
        })
        .then(data => {
          Toast.success('添加成功')
          this.sku.show = false
          this.$store.dispatch('cart/getCartList')
        })
        .catch(error => {
          Toast(error.message)
        })
    },
    skuSelected({ skuValue, selectedSku, selectedSkuComb }) {
      // console.log(skuValue)
      // console.log(selectedSku)
      const { selectedNum } = this.$refs.sku.getSkuData()
      this.commissionChange(selectedSkuComb, selectedNum)
    },
    stepperChange(num) {
      const { selectedSkuComb } = this.$refs.sku.getSkuData()
      this.commissionChange(selectedSkuComb, num)
    },
    commissionChange(selectedSkuComb, num) {
      if (selectedSkuComb) {
        this.sku.commission = new Big(selectedSkuComb.commission)
          .mul(num)
          .toFixed(2)
        this.sku.maxCommission = null
      } else {
        this.sku.commission = new Big(this.goods.commission).mul(num).toFixed(2)
        if (this.goods.maxCommission)
          this.sku.maxCommission = new Big(this.goods.maxCommission)
            .mul(num)
            .toFixed(2)
        else this.sku.maxCommission = null
      }
    },
    openService() {
      let me = this
      if (!this.isLogin) {
        this.$router.push('/login')
        this.$store.commit('user/SET_BEFOREPATH', this.$route.path)
        // Toast('用户未登录')
        return
      }
      // 获取客服组id
      // this.$http.post("/url", {})
      //   .then(res => {
      //     ysf("onready", () => {
      //       service.init(this.userInfo, this.goods , res.data.groupid, () => {
      //         this.showService = true
      //       });
      //     });
      //   })
      //   .catch(error => {

      //   });
    },
    formatTime(time) {
      return format(time, 'yyyy-MM-dd')
    },
    formatAttr(data) {
      const attrArray = JSON.parse(data)
      return attrArray.map(ele => ele.value).join(',') || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.goods {
  margin-bottom: 50px;

  .back {
    position: relative;
  }
  .back::before {
    content: '';
    width: 30px;
    height: 30px;
    background-color: #000;
    border-radius: 50%;
    opacity: 0.3;
    display: block;
    position: absolute;
  }
  .arrow-left.back:before {
    left: -4px;
    top: -5px;
  }
  .share.back:before {
    left: -5px;
    top: -5px;
  }

  .nav-out.van-hairline--bottom::after {
    border-bottom-width: 0;
  }
  .nav-in {
    .van-nav-bar__title {
      margin-bottom: -10px;
      .van-tabs__nav {
        display: block;
        .van-tab {
          display: inline-block;
          padding: 0 15px;
        }
      }
    }
  }

  &-swipe {
    // height: 45vh;
    background-color: #fff;
    .van-swipe-item {
      display: flex;
      align-items: center;
      background-color: #000;
      img {
        width: 100%;
        display: block;
      }
      video {
        width: 100%;
        height: 100%;
      }
      .play {
        color: #fff;
        font-size: 1rem;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 1.5rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 50;
        p {
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
    color: #fff;
    .price {
      color: #fff;
      font-size: 18px;
    }
    .originalPrice {
      color: #fff;
      font-size: 12px;
    }
  }

  &-level {
    padding: 5px 16px;
    color: #895c29;
    background: #fbe5ae;
    .van-cell__value{
      color: #895c29;
    }
  }

  .commission {
    color: #fff;
    font-size: 12px;
  }

  .title {
    font-size: 0.8rem;
    color: #969799;
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
  .visibility {
    visibility: hidden;
  }
  .comments-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    font-size: 14px;
    .right {
      color: $red;
      display: flex;
      align-items: center;
      font-size: 12px;
    }
  }
  .no-comments-area {
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #999;
  }
  .comments-area {
    min-height: 100px;
    padding: 15px;
    &.inPopup {
      margin: 10px 0;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
    }
    .row-1 {
      display: flex;
      align-items: center;
      .head-img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #eee;
      }
      .user-name {
        color: #999;
      }
    }
    .row-2 {
      margin-top: 10px;
      & .overhide {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .pic-area {
        margin-top: 10px;
        img {
          width: 70px;
          height: 70px;
          margin-right: 10px;
        }
      }
    }
    .row-3 {
      margin-top: 10px;
      color: #999;
    }
  }
  .van-image-preview__overlay {
    z-index: 3100 !important;
  }
  .van-image-preview {
    z-index: 3120 !important;
  }
  .comments-popup {
    height: 100%;
    width: 100%;
    padding-top: 66px;
    background: #f2f2f2;
  }
  .bottom-popup {
    height: 50%;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
  }
  .goods-detail {
    img {
      width: 100%;
    }
  }
  .popup-content {
    padding: 0 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .title {
      margin: 15px 0;
      font-size: 16px;
      text-align: center;
      color: #000;
    }
    .item-wrapper {
      flex: 1;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0;
        display: none;
      }
    }
    &.service-content {
      .item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 15px;
        .left {
          margin: 3px 5px 0 0;
        }
        .itme-title {
          font-size: 14px;
        }
        .itme-info {
          margin-top: 4px;
          color: #999;
        }
      }
    }
    &.params-content {
      .item {
        display: flex;
        align-items: center;
        font-size: 12px;
        height: 40px;
        .left {
          margin-right: 20px;
          width: 15%;
          color: #999;
        }
        .right {
          flex: 1;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .btn {
      width: 95%;
      background: $red;
      text-align: center;
      height: 40px;
      line-height: 40px;
      color: #fff;
      font-size: 16px;
      margin: 0 auto;
      flex-basis: 0;
      border-radius: 20px;
    }
  }

}
/deep/.had-like{
  color: #F00;
}
</style>

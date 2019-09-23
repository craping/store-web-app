<template>
  <div class="store-scroller">
    <div v-if="isIOS">
      <slot name="curtain"></slot>

      <scroller
        ref="iosScroller"
        :on-refresh="_onRefresh"
        :on-infinite="_onInfinite"
        :onScroll="_onScroll"
        refreshLayerColor="#ffffff"
        loadingLayerColor="#ec4949"
        class="scroll"
      >
        <slot></slot>
      </scroller>
    </div>

    <div v-else>
      <van-pull-refresh ref="refresh" v-model="refresh" :head-height="60" @refresh="_onRefresh">
       <template v-slot:pulling>
         <arrow fillColor="#fff" style="width: 15px; height: 15px;"></arrow>
         <div class="text" style="color:#fff;font-size: 12px;margin: 0 auto;line-height: 20px;text-align: center;width: 100%;">下拉刷新</div>
       </template>
       <template v-slot:loosing>
         <arrow class="arrow" fillColor="#fff" style="width: 15px; height: 15px;"></arrow>
         <div class="text" style="color:#fff;font-size: 12px;margin: 0 auto;line-height: 20px;text-align: center;width: 100%;">下拉刷新</div>
       </template>
       <template v-slot:loading>
          <svg class="spinner" style="fill:#fff;stroke:#fff;width: 32px;height: 32px;" viewBox="0 0 64 64">
            <g stroke-width="7" stroke-linecap="round">
              <line x1="10" x2="10" y1="27.3836" y2="36.4931">
                <animate attributeName="y1" dur="750ms" values="16;18;28;18;16;16" repeatCount="indefinite"></animate>
                <animate attributeName="y2" dur="750ms" values="48;46;36;44;48;48" repeatCount="indefinite"></animate>
                <animate attributeName="stroke-opacity" dur="750ms" values="1;.4;.5;.8;1;1" repeatCount="indefinite"></animate>
              </line>
              <line x1="24" x2="24" y1="18.6164" y2="45.3836">
                <animate attributeName="y1" dur="750ms" values="16;16;18;28;18;16" repeatCount="indefinite"></animate>
                <animate attributeName="y2" dur="750ms" values="48;48;46;36;44;48" repeatCount="indefinite"></animate>
                <animate attributeName="stroke-opacity" dur="750ms" values="1;1;.4;.5;.8;1" repeatCount="indefinite"></animate>
              </line>
              <line x1="38" x2="38" y1="16.1233" y2="47.8767">
                <animate attributeName="y1" dur="750ms" values="18;16;16;18;28;18" repeatCount="indefinite"></animate>
                <animate attributeName="y2" dur="750ms" values="44;48;48;46;36;44" repeatCount="indefinite"></animate>
                <animate attributeName="stroke-opacity" dur="750ms" values=".8;1;1;.4;.5;.8" repeatCount="indefinite"></animate>
              </line>
              <line x1="52" x2="52" y1="16" y2="48">
                <animate attributeName="y1" dur="750ms" values="28;18;16;16;18;28" repeatCount="indefinite"></animate>
                <animate attributeName="y2" dur="750ms" values="36;44;48;48;46;36" repeatCount="indefinite"></animate>
                <animate attributeName="stroke-opacity" dur="750ms" values=".5;.8;1;1;.4;.5" repeatCount="indefinite"></animate
                ></line>
              </g>
          </svg>
        </template>
        
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="_onInfinite">

          <slot></slot>

          <template v-slot:loading>
            <svg class="spinner" style="fill:#ec4949;stroke:#ec4949;width: 32px;height: 32px;" viewBox="0 0 64 64">
                <g>
                  <circle cx="16" cy="32" stroke-width="0" r="3">
                    <animate attributeName="fill-opacity" dur="750ms" values=".5;.6;.8;1;.8;.6;.5;.5" repeatCount="indefinite"></animate>
                    <animate attributeName="r" dur="750ms" values="3;3;4;5;6;5;4;3" repeatCount="indefinite"></animate>
                  </circle>
                  <circle cx="32" cy="32" stroke-width="0" r="3.09351">
                    <animate attributeName="fill-opacity" dur="750ms" values=".5;.5;.6;.8;1;.8;.6;.5" repeatCount="indefinite"></animate>
                    <animate attributeName="r" dur="750ms" values="4;3;3;4;5;6;5;4" repeatCount="indefinite"></animate>
                  </circle>
                  <circle cx="48" cy="32" stroke-width="0" r="4.09351">
                    <animate attributeName="fill-opacity" dur="750ms" values=".6;.5;.5;.6;.8;1;.8;.6" repeatCount="indefinite"></animate>
                    <animate attributeName="r" dur="750ms" values="5;4;3;3;4;5;6;5" repeatCount="indefinite"></animate>
                  </circle></g>
              </svg>
          </template>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>


<script>
import Vue from 'vue';
import { PullRefresh, List } from "vant";
import Arrow from "./vue-scroller/components/Arrow";
import { isIOS } from "mobile-device-detect";
import inobounce from "inobounce";
import VueScroller from '@/components/vue-scroller'

if(isIOS)
  Vue.use(VueScroller);
export default {
  name: "store-scroller",
  components: {
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    Arrow,
    inobounce
  },

  props: {
  },


  data() {
    return {
      isIOS: isIOS,
      refresh:false,
      loading:false,
      finished:false,
    };
  },

  created() {
    if (isIOS)
      inobounce.enable();
    else
      inobounce.disable();
  },
  mounted() {
    if(!isIOS)
      window.addEventListener("scroll", this.handleScroll, true);
  },
  beforeDestroy() {
    if (isIOS)
      inobounce.disable();
    else
      window.removeEventListener('scroll', this.handleScroll, true);
  },
  methods: {
    pullToRefresh(){
      if (isIOS)
        this.$refs.iosScroller.triggerPullToRefresh();
      else
        this.$emit('onRefresh', this.finishRefresh)
    },
    handleScroll(e){
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this._onScroll({top:scrollTop})
    },
    finishRefresh(finished){
      this.refresh = false;
      this.finished = finished;
    },
    finishInfinite(finished) {
      this.loading = false;
      this.finished = finished;
    },
    
    _onRefresh(done) {
      this.$emit('onRefresh', done?done:this.finishRefresh)
    },
    _onInfinite(done) {
      if(!this.finished)
        this.$emit('onInfinite', done?done:this.finishInfinite)
    },
    _onScroll({ top }) {
      this.$emit('onScroll', top)
    }
  }
};
</script>
<style lang="scss">
  .store-scroller{
    .van-pull-refresh__head{
      line-height: 15px;
    }
    .van-pull-refresh{
      padding-left: 15px;
      padding-right: 15px;
      .arrow {
        -webkit-transform: translate3d(0,0,0) rotate(180deg);
        transform: translate3d(0,0,0) rotate(180deg);
      }
    }
    .scroll{
      ._v-content{
        padding-left: 15px;
        padding-right: 15px;
      }
      .pull-to-refresh-layer{
        background-color:transparent;
        // position: absolute;
        // left: 0;
        // top: 0;
        .spinner-holder{
          .arrow{
            width: 15px;
            height: 15px;
          }
          .text{
            font-size: 12px;
          }
        }
      }
      .no-data-text{
        font-size: 12px;
      }
    }
  }
</style>
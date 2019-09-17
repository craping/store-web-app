<template>
  <div class="store-share">
    <van-action-sheet
      v-model="showDialog"
      @click-overlay="cancel"
      @cancel="cancel"
      cancel-text="取消"
    >
      <van-grid :column-num="3" :border="false">
        <van-grid-item v-for="(e, index) in channels" :key="index" :text="e.title" >
          <template v-slot:icon>
            <icon :name="e.icon" scale="5"></icon>
          </template>
        </van-grid-item>
      </van-grid>
    </van-action-sheet>
  </div>
</template>


<script>
import Vue from "vue";
import {
  ActionSheet,
  Icon,
  Grid,
  GridItem
} from "vant";
import { get } from "http";
export default {
  components: {
    [ActionSheet.name]: ActionSheet,
    [Icon.name]: Icon,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem
  },
  name: "store-share",
  data() {
    return {
      showDialog: this.show,
      channels: [
        {
          title: "微信",
          icon: "share_wx"
        },
        {
          title: "朋友圈",
          icon: "share_pyq"
        },
        {
          title: "商品链接",
          icon: "share_link"
        }
      ]
    };
  },
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  mounted (){
    this.onPlusReady(() =>{
      
    })
  },
  methods: {
    cancel() {
      this.$emit("cancel", false);
    }
  },
  watch: {
    show(newValue, oldValue) {
      this.showDialog = newValue;
    }
  }
};
</script>
<style lang="scss" scoped>
.store-share {
  .van-action-sheet__cancel::before{
    height: 0;
  }
  .van-popup {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
  .van-action-sheet__header {
    text-align: left;
    padding: 10px;
  }
  .van-cell__left-icon {
    font-size: 30px;
  }
  .van-icon-wechat {
    color: #39b94e;
  }
  .van-icon-alipay {
    color: #108ee9;
  }
  .van-icon-gold-coin {
    color: $red;
  }
  .btn {
    margin: 20px 0;
    padding: 0 20px;
    .van-button--large {
      border-radius: 25px;
    }
  }
}
</style>

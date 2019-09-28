<template>
  <div class="store-share">
    <van-action-sheet
      v-model="showDialog"
      @click-overlay="cancel"
      @cancel="cancel"
      cancel-text="取消"
    >
      <van-grid :column-num="3" :border="false">
        <van-grid-item
          v-for="(e, index) in channels"
          :key="index"
          :text="e.title"
          @click="shareAction(e)"
        >
          <template v-slot:icon>
            <icon :name="e.icon" scale="5"></icon>
          </template>
        </van-grid-item>
        <van-grid-item text="商品链接" class="store-share-link" :data-clipboard-text="value.href" @click="shareLink">
          <template v-slot:icon>
            <icon name="share_link" scale="5"></icon>
          </template>
        </van-grid-item>
        <!-- <van-grid-item v-for="(e, index) in channels" :key="index" :text="e.title">
          <template v-slot:icon>
            <icon :name="e.icon" scale="5"></icon>
          </template>
        </van-grid-item>-->
      </van-grid>
    </van-action-sheet>
  </div>
</template>


<script>
import { ActionSheet, Icon, Grid, GridItem, Toast } from "vant";
import { mapState } from 'vuex'
import Clipboard from "clipboard";

export default {
  components: {
    [ActionSheet.name]: ActionSheet,
    [Icon.name]: Icon,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Toast.name]: Toast
  },
  name: "store-share",
  computed:{
    ...mapState({
      userInfo: state => state.user.userInfo,
      isLogin: state => state.user.isLogin
    })
  },
  data() {
    return {
      showDialog: this.show,
      msg: {},
      channels: [
        {
          title: "微信",
          icon: "share_wx",
          type:"web",
          scene: "WXSceneSession",
          share: null
        },
        {
          title: "朋友圈",
          icon: "share_pyq",
          type:"web",
          scene: "WXSceneTimeline",
          share: null
        }
      ]
    };
  },
  props: {
    /**
     * 分享消息实体
     * @param {plus.share.ShareMessage} s
     *
     * title:"HLA海澜之家简约动物印花短袖T恤",
     * content: "2018夏季新品微弹舒适新款短T男生 6月6日-6月20日，满300减30，参与互动赢百元礼券，立即分享赢大奖",
     * thumbs:["http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5ad83a4fN6ff67ecd.jpg!cc_350x449.jpg"],
     * href:"http://www.baidu.com"
     */
    value: {
      type: Object,
      default:() =>{
        return {
          title:"",
          content:"",
          thumbs:[],
          href:"http://www.baidu.com"
        }
      }
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    let me = this;
    this.shorten(this.value);
    this.onPlusReady(() => {
      plus.share.getServices(
        function(s) {
          s.forEach(e => {
            switch (e.id) {
              case "weixin":
                me.channels[0].share = e;
                me.$set(me.channels, 0, me.channels[0]);
                me.channels[1].share = e;
                me.$set(me.channels, 1, me.channels[1]);
                break;
              default:
                break;
            }
          });
        },
        function(e) {
          Toast.fail("获取分享服务列表失败：" + e.message);
        }
      );
    });
  },
  methods: {
    cancel() {
      this.$emit("cancel", false);
    },
    /**
     * 分享操作
     * @param {plus.share.ShareService} channel.share
     */
    shareAction(channel) {
      let me = this;
      if (!channel.share) {
        return;
      }
      this.value = {
        ...{ extra: { scene: channel.scene } }, 
        type:channel.type, 
        ...this.value 
      };
      if (channel.share.authenticated) {
        this.shareMessage(channel.share);
      } else {
        channel.share.authorize(this.shareMessage, function(e) {
          Toast.fail("未进行认证");
          me.cancel();
        });
      }
    },
    /**
     * 发送分享消息
     * @param {plus.share.ShareService} share
     */
    shareMessage(share) {
      let me = this;
      share.send(
        this.value,
        function() {
          Toast.success("分享成功！");
          me.cancel();
        },
        function(e) {
          Toast.fail("分享失败：" + e.message);
          me.cancel();
        }
      );
    },
    shareLink() {
      let me = this;
      let clipboard = new Clipboard(".store-share-link");
      clipboard.on("success", e => {
        Toast.success("复制成功");
        // 释放内存
        clipboard.destroy();
        me.cancel();
      });
      clipboard.on("error", e => {
        // 不支持复制
        Toast.fail("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
        me.cancel();
      });
    },
    shorten(msg){
      if(!msg || !msg.href)
        return;
      const {amsAccount:{memberId, agentNo}} = this.userInfo;
      let url =  msg.href + (msg.href.includes("?")?"&":"?") + "recommenderId="+memberId+"&recommenderNo="+agentNo;
      this.$http.post("api/shorturl", {
        url:url
      }).then(data =>{
        this.value.href = data.info;
      })
    }
  },
  watch: {
    show(newValue, oldValue) {
      this.showDialog = newValue;
    },
    value(newValue, oldValue){
      this.shorten(newValue)
    }
  }
};
</script>
<style lang="scss" scoped>
.store-share {
  .van-action-sheet__cancel::before {
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

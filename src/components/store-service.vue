<template>
  <div class="store-service">
    <van-popup
      class="popup-service"
      v-model="show"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100vh', overflow: 'hidden'}"
      :zIndex="9999"
      :overlay="false"
      :lazy-render="false"
      @open="open"
      @close="close"
    >
      <div ref="serviceWrap" style="height: 100vh;width: 100vw;border: none;overflow: hidden;">
        <!-- <iframe
          ref="service"
          name="service"
          id="service"
          frameborder="0"
          border="0"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
          allowtransparency="yes"
          :src="src"
          style="height: 100vh;width: 100vw;border: none;overflow: hidden;"
        ></iframe>-->
      </div>
    </van-popup>
  </div>
</template>


<script>
import { Popup, Toast } from "vant";
import { mapState } from "vuex";

export default {
  components: {
    [Popup.name]: Popup,
    [Toast.name]: Toast
  },
  name: "store-service",
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      isLogin: state => state.user.isLogin
    })
  },
  data() {
    return {
      show: this.value,
      src: "",
      iframe: null
    };
  },
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  mounted() {},
  methods: {
    open() {
      ysf("onready", () => {
        // this.src = ysf("url");
        let iframe = document.createElement("iframe");
        iframe.src = ysf("url");
        iframe.style.width = "100vw";
        iframe.style.height = "100vh";
        iframe.style.margin = "0";
        iframe.style.padding = "0";
        iframe.style.overflow = "hidden";
        iframe.style.border = "none";
        this.iframe = iframe;

        this.$refs.serviceWrap.appendChild(iframe);
      });
    },
    close() {
      // ysf('logoff')
      this.iframe.src = "about:blank";
      try {
        this.iframe.contentWindow.document.write("");
        this.iframe.contentWindow.document.clear();
      } catch (e) {}
      //把iframe从页面移除
      this.iframe.parentNode.removeChild(this.iframe);
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.show = newValue;
    },
    show: function(newVal, oldVal) {
      this.$emit("update:value", newVal);
    }
  }
};
</script>
<style lang="scss">
.store-service {
  .van-popup.popup-service {
    .van-popup__close-icon {
      color: #ffffff;
      left: 4px;
      font-size: 16px;
    }
  }
}
</style>

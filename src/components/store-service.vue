<template>
  <div class="store-service">
    <van-popup
      class="popup-service"
      v-model="show"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100vh', overflow: 'hidden'}"
      @open="open"
      @close="close"
    >
      <iframe
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
      ></iframe>
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
      show:this.value,
      src: ""
    };
  },
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
  },
  methods: {
    open() {
      ysf("onready", () => {
        this.src = ysf("url");
      });
      // if(this.$refs.service){
      //   window.frames["service"].location.reload(true);
      //   this.$refs.service.contentWindow.location.reload(true);
      // }
    },
    close() {
      // this.src = "#";
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.show = newValue;
    },
    show : function(newVal, oldVal){
      this.$emit("update:value", newVal);
    }
  }
};
</script>
<style lang="scss">
.store-service {
  .van-popup.popup-service{
    .van-popup__close-icon{
      color: #ffffff;
      left: 4px;
      font-size: 16px;
    }
  }
}
</style>

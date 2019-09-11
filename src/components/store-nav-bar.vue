<template>
	<van-nav-bar class="store-nav-bar" :style="{backgroundColor: background, opacity:opacity}" fixed>
    <template v-slot:left>
      <slot name="left"></slot>
    </template>
    <template v-slot:title>
      <slot name="title"></slot>
    </template>
    <template v-slot:right>
      <slot name="right"></slot>
    </template>
  </van-nav-bar>
</template>


<script>
import { NavBar } from "vant";

export default {
  name: 'store-nav-bar',
  components: {
    [NavBar.name]: NavBar
  },
  props: {
    background: {
      type: String,
      default: 'transparent'
    },
    opacity:{
      type: Number,
      default: 1
    }
  },
  data() {
    return {}
  },

  created() {
  },

  methods: {
  }
};
</script>
<style lang="scss">
.store-nav-bar {
    transition: background-color .2s linear;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    line-height: normal;
    padding-bottom: 10px;
    .van-search {
      padding: 0 16px;
      .van-cell{
        padding: 3px 10px 3px 0;
      }
    }
    .van-nav-bar__left,
    .van-nav-bar__right {
      position: initial;
    }

    .van-nav-bar__title {
      flex: 1;
      max-width: none;
    }
    .van-nav-bar__left {
      padding-left: 15px;
    }
    .van-nav-bar__left:empty{
      padding-left: 0;
    }
    .van-nav-bar__right {
      padding-right: 15px;
    }
    .van-nav-bar__right:empty{
      padding-right: 0;
    }
  }
</style>
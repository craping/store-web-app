<template>
  <div class="team-card van-hairline--bottom">
    <div class="left-col">
      <div class="head-img">
        <img src />
      </div>
      <div class="team-info">
        <div class="row-1">
          <span class="phone">1234324323</span>
          <span class="vip">会员等级</span>
        </div>
        <div class="row-2">
          <span>用户昵称</span>
          <span class="name">2019.07.31</span>
        </div>
        <div class="row-3">团队:5 直属:2</div>
      </div>
    </div>
    <div class="right-col" v-if="!isTop">
      <van-icon name="arrow" />
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Sticky, Icon } from "vant";
Vue.use(Sticky).use(Icon);
export default {
  data() {
    return {};
  },
  props: {
      isTop:{
          type:Boolean
      }
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
.team-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 15px;
  .left-col {
    display: flex;
    align-items: center;
  }
  .head-img {
    width: 60px;
    height: 60px;
    background: #eee;
    border-radius: 50%;
  }
  .team-info {
    margin-left: 10px;
    .phone {
      font-size: 14px;
      margin-right: 5px;
    }
    .row-2 {
      margin: 5px 0;
      .name {
        margin-left: 5px;
        color: #999;
      }
    }
    .vip {
      display: inline-block;
      padding: 0 4px;
      border-radius: 8px;
      color: #895c29;
      background: #fbe5ae;
    }
  }
  .right-col {
    float: right;
  }
}
</style>
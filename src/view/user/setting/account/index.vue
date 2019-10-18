<template>
  <div class="account-page">
    <van-nav-bar title="账户安全" left-arrow @click-left="onClickLeft" />
    <van-cell
      v-if="client == 1"
      title="微信绑定"
      :is-link="!umsMember.openId"
      :value="umsMember.openId ? '已绑定' : '未绑定'"
      @click="bindWx"
    />
    <van-cell
      is-link
      :title="bindPhone ? '更换手机号' : '绑定手机号'"
      :value="bindPhone ? '更换' : '未绑定'"
      @click="jumpLink('editCheck',{mode:'mobile'})"
    />
    <van-cell
      is-link
      :title="umsMember.password ? '修改登录密码' : '设置登录密码'"
      :value="umsMember.password ? '修改' : '未设置'"
      @click="jumpLink('editCheck',{mode:'password'})"
    />
  </div>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";

import {
  NavBar,
  Cell,
  CellGroup,
  ActionSheet,
  Popup,
  DatetimePicker
} from "vant";
Vue.use(Cell)
  .use(CellGroup)
  .use(ActionSheet)
  .use(Popup)
  .use(DatetimePicker)
  .use(NavBar);
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("user", {
      bindPhone: state => state.bindPhone,
      umsMember: state => state.userInfo.umsMember || {}
    }),
    ...mapState('sys',{
      client: state => state.client
    })
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path, query) {
      this.$router.push({ path, query });
    },
    bindWx() {
      if (this.umsMember.openId) return;
      if (window.aweixin) return;
      // 微信授权登录对象
      // 获取登录授权认证服务列表，单独保存微信登录授权对象
      // 5+APP在plusready事件中调用
      plus.oauth.getServices(
        services => {
          window.aweixin = services[0];
          if (!window.aweixin.authResult) {
            window.aweixin.authorize(
              e => {
                this.$http
                  .post("/wx/bindingWeChat", { code: e.code })
                  .then(res => {})
                  .catch(error => {
                    Toast(error.message);
                  });
              },
              e => {
                Toast("微信授权失败" + JSON.stringify(e));
              }
            );
          }
        },
        e => {
          Toast("获取登录授权服务列表失败：" + JSON.stringify(e));
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.account-page {
  .van-cell {
    align-items: center;
  }
  .head-img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: #eee;
  }
}
</style>
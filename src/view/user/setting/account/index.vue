<template>
  <div class="account-page">
    <van-nav-bar title="账户安全" left-arrow @click-left="onClickLeft" />
    <van-cell title="微信绑定" is-link value="未绑定" @click="bindWx" />
    <van-cell title="修改手机号" is-link value="修改" @click="jumpLink('editCheck',{mode:'mobile'})" />
    <van-cell title="修改密码" is-link value="修改" @click="jumpLink('editCheck',{mode:'password'})" />
  </div>
</template>
<script>
import Vue from "vue";
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
    return {
      userInfo: {
        headImg: "...",
        name: "哈哈是",
        birth: "2019-08-24",
        sex: "男"
      },
      dateSelectshow: false,
      sexSelectshow: false,
      sexactions: [{ name: "男" }, { name: "女" }],
      currentDate: new Date()
    };
  },
  mounted() {
    this.onPlusReady(() => {
      this.initWeChatService();
    });
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path, query) {
      this.$router.push({ path, query });
    },
    initWeChatService() {
      if (window.aweixin) return;
      // 微信授权登录对象
      // 获取登录授权认证服务列表，单独保存微信登录授权对象
      // 5+APP在plusready事件中调用
      plus.oauth.getServices(
        services => {
          window.aweixin = services[0];
        },
        e => {
          Toast("获取登录授权服务列表失败：" + JSON.stringify(e));
        }
      );
    },
    wechatLogin() {
      if (window.aweixin) {
        if (!window.aweixin.authResult) {
          window.aweixin.authorize(
            e => {
              // Toast("e.code+:" + e.code); //app端获取到的code
              
            },
            function(e) {
              alert("微信授权失败" + JSON.stringify(e));
            }
          );
        }
      } else {
          Toast("当前环境不支持微信登录");
			}
    },
    bindWx() {}
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
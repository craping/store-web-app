<template>
  <div class="account-page">
    <van-nav-bar title="账户安全" left-arrow @click-left="onClickLeft" />
    <van-cell
      v-if="clientId == 1"
      title="微信绑定"
      :is-link="!umsMember.openId"
      :value="umsMember.openId ? '已绑定' : '未绑定'"
      @click="bindWx"
    />
    <van-cell
      is-link
      :title="bindPhone ? '更换手机号' : '绑定手机号'"
      :value="bindPhone ? '更换' : '未绑定'"
      @click="toUpdatePhone"
    />
    <van-cell
      is-link
      :title="umsMember.password ? '修改登录密码' : '设置登录密码'"
      :value="umsMember.password ? '修改' : '未设置'"
      @click="toUpdatePassWord"
    />
    <van-cell
      is-link
      :title="payLogo ? '修改支付密码' : '设置支付密码'"
      :value="payLogo ? '修改' : '未设置'"
      @click="toUpdatePayPassWord"
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
  DatetimePicker,
  Toast
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
      payLogo: state => state.userInfo.payLogo,
      umsMember: state => state.userInfo.umsMember || {}
    }),
    ...mapState('sys',{
      clientId: state => state.clientId
    })
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
    toUpdatePhone() {
      if (this.bindPhone) {
        this.jumpLink('editCheck',{mode:'mobile'})
      } else {
        this.jumpLink("editMobile",{isNew:true});
      }
    },
    toUpdatePassWord() {
      if (!this.bindPhone) {
        Toast('请先绑定手机号码')
      }
      this.jumpLink('editCheck',{mode:'password'})
    },
    toUpdatePayPassWord() {
      if (!this.bindPhone) {
        Toast('请先绑定手机号码')
      }
      this.jumpLink('editCheck',{mode:'payPassword'})
    },
    initWeChatService() {
      if (window.aweixin) return;
      // 微信授权登录对象
      // 获取登录授权认证服务列表，单独保存微信登录授权对象
      // 5+APP在plusready事件中调用，uni-app在vue页面的onLoad中调用
      plus.oauth.getServices(
        function(services) {
          console.log('init')
          // alert('list+:'+JSON.stringify(services));
          window.aweixin = services[0];
          // alert('weService+:'+JSON.stringify(window.aweixin));
        },
        function(e) {
          Toast("获取登录授权服务列表失败：" + JSON.stringify(e));
        }
      );
    },
    bindWx() {
      console.log(1)
      console.log('2+:'+this.umsMember.openId)
      console.log('3+:'+window.aweixin)
      if (this.umsMember.openId) return;
      window.aweixin.authorize(
        e => {
          console.log("e.code+111:" + e.code); //app端获取到的code
          this.$http
            .post("/wx/bindingWeChat", { code: e.code })
            .then(res => {
              console.log("e.code+:" + e.code); //app端获取到的code
              console.log(JSON.stringify(res))
              console.log('token+:'+res.info.token)
              Toast('绑定成功');
            })
            .catch(error => {
              console.log('err+:'+JSON.stringify(error))
              Toast(error.message);
            });
        },
        e => {
          console.log('dsds')
          Toast("微信授权失败" + JSON.stringify(e));
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
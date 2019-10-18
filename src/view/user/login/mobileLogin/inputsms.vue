<template>
  <div class="input-mobile-page">
    <van-nav-bar title="验证码" left-arrow @click-left="onClickLeft" />
    <div class="login-body">
      <p class="tips-bar">验证码已发送至{{mobile}}</p>
      <van-cell-group>
        <van-field v-model="verCode" clearable label="验证码" placeholder="请输入验证码" left-icon="aim" />
        <div class="code-operate" @click="timeCountDown">
          <span :class="{gray:countDownSecond >= 0}">{{codeText}}</span>
        </div>
      </van-cell-group>
      <div class="main-btn" @click="sureHandle">登录</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Icon } from "vant";
import { setToken } from "@/utils/auth";
import { CellGroup, Field, Toast } from "vant";
import { mapState, mapActions } from 'vuex';
Vue.use(CellGroup)
  .use(Field)
  .use(Icon)
  .use(NavBar);
const aweixin = null;
export default {
  data() {
    return {
      mobile: this.$route.query.mobile,
      verCode: "",
      codeText: "获取验证码",
      countDownSecond: -1,
      codeTimer: null
    };
  },
  destroyed() {
    clearInterval(this.codeTimer);
  },
  computed: {
    ...mapState('user',{
      beforePath: state => state.beforePath,
    })
  },
  methods: {
    ...mapActions('user',['getUserInfo']),
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path) {
      this.$router.push(path);
    },

    sureHandle() {
      if (!this.verCode) {
        Toast("请输入验证码");
      }
      const params = {
        mobile: this.mobile,
        verCode: this.verCode,
        clientId: "wap"
      };
      this.$http
        .post("/login/verCodeLogin", params)
        .then(res => {
          setToken(res.info.token);
          this.getUserInfo()
          this.$store.commit('user/SET_USERINFO',res.info)
          this.$router.push(this.beforePath);
        })
        .catch(error => {
          Toast(error.message);
        });
    },
    /**
     * 验证码倒计时方法
     */
    timeCountDown() {
      this.codeText = "60s后重新发送";
      var timer = 60000;
      this.countDownSecond = timer / 1000;
      this.getCodeReq(); //获取验证码
      this.codeTimer = setInterval(() => {
        timer -= 1000;
        if (timer <= 0) {
          clearInterval(this.codeTimer);
          this.codeText = "重新获取";
          this.countDownSecond = -1;
        } else {
          this.countDownSecond = timer / 1000;
          this.codeText = `${this.countDownSecond}s后重新发送`;
        }
      }, 1000);
    },
    /**
     * 获取验证码接口
     */
    getCodeReq() {
      const params = { mobile: this.mobile };
      this.$http
        .post("/authCode/getLoginCode", params)
        .then(res => {})
        .catch(error => {
          Toast(error.message);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.input-mobile-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  .login-body {
    .tips-bar {
      color: #999;
      height: 50px;
      line-height: 50px;
      padding: 0 12px;
      font-size: 13px;
      margin-bottom: 10px;
    }
    .van-cell-group {
      overflow: hidden;
    }
    .welcome-word {
      font-size: 30px;
      margin-top: 80px;
    }

    .main-btn {
      margin: 30px auto;
      width: 86%;
      height: 40px;
      color: #fff;
      background: $red;
      border-radius: 20px;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
    }
    .code-operate {
      padding: 0 12px;
      margin-top: 15px;
      color: $red;
      .gray {
        color: #ccc;
      }
    }
  }
}
</style>
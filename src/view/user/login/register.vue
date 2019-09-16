<template>
  <div class="register-login">
    <van-nav-bar left-arrow @click-left="onClickLeft" />
    <div class="login-body">
      <p class="title">马上注册</p>
      <van-cell-group>
        <van-field v-model="phone" type="tel" placeholder="请输入手机号码" />
        <van-field v-model="code" placeholder="请输入验证码" />
        <div class="code-operate" @click="getCode">
          <span :class="{gray:countDownSecond >= 0}">{{codeText}}</span>
        </div>
        <van-field v-model="inviteCode" placeholder="请输入邀请码" />
      </van-cell-group>
      <div class="login-btn" @click="register">注册</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, CellGroup, Field, Toast } from "vant";
Vue.use(Field)
  .use(CellGroup)
  .use(Toast)
  .use(NavBar);
export default {
  data() {
    return {
      phone: "",
      code: "",
      inviteCode: "",
      codeText: "获取验证码",
      countDownSecond: -1,
      codeTimer: null
    };
  },
  destroyed() {
    this.clearTimeCount(this.codeTimer);
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getCode() {
      if (this.countDownSecond > 0) {
        return;
      }
      if (this.phone == "") {
        Toast("请输入手机号码");
        return;
      }
      this.timeCountDown();

      if (this.isValidate()) {
        //手机号输入正确，才能获取验证码
        this.timeCountDown();
      }
    },
    /**
     * 验证码倒计时方法
     */
    timeCountDown() {
      this.codeText = "重新获取(60s)";
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
          this.codeText = "重新获取(" + this.countDownSecond + "s)";
        }
      }, 1000);
    },
    /**
     * 清除倒计时相关数据
     */
    clearTimeCount() {
      clearInterval(this.codeTimer);
      this.codeText = "重新获取";
      this.countDownSecond = -1;
    },
    /**
     * 获取验证码接口
     */
    getCodeReq() {},
    /**
     * 判断输入手机号
     */
    isValidate() {
      let flag = true;
      if (!new RegExp("^1[0-9]{10}$").test(this.phone)) {
        flag = false;
        Toast("请填写正确的手机号码");
      }
      return flag;
    },
    register() {}
  }
};
</script>
<style lang="scss" scoped>
.register-login {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  .login-body {
    margin-top: 40px;
    padding: 0 15px;
    .title {
      font-size: 20px;
      margin-bottom: 40px;
    }
    /deep/ .van-hairline--top-bottom::after {
      border-top: 0;
    }
    /deep/ .field-group {
      position: relative;
      margin-top: 40px;
    }
    .code-operate {
      position: absolute;
      right: 15px;
      bottom: 14px;
      color: $red;
      .gray {
        color: #ccc;
      }
    }
  }
  .login-btn {
    background: $red;
    height: 40px;
    line-height: 40px;
    width: 80%;
    border-radius: 6px;
    margin: 40px auto 0;
    color: #fff;
    font-size: 16px;
    text-align: center;
  }
  .mt-10 {
    margin-top: 10px;
  }
}
</style>
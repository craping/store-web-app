<template>
  <div class="register-login">
    <van-nav-bar left-arrow @click-left="onClickLeft" />
    <div class="login-body">
      <p class="title">马上注册</p>
      <van-cell-group>
        <van-field
          v-model="mobile"
          clearable
          type="tel"
          label="手机号"
          placeholder="请输入手机号码"
          left-icon="phone"
        />
        <van-field v-model="verCode" clearable label="短信验证码" placeholder="请输入短信验证码" left-icon="aim">
          <div class="code-operate" slot="button" @click="getCode">
            <span :class="{gray:countDownSecond >= 0}">{{codeText}}</span>
          </div>
        </van-field>
        <van-field
          v-model="password"
          clearable
          label="密码"
          placeholder="请输入新密码"
          left-icon="lock"
          :type="isEyeClose ? 'password' : 'text'"
          :right-icon="isEyeClose ? 'closed-eye' : 'eye-o'"
          @click-right-icon="changeShow"
        />
        <van-field
          v-model="agentNo"
          clearable
          label="邀请码"
          placeholder="请输入邀请码"
          left-icon="friends-o"
        />
      </van-cell-group>
      <div class="main-btn" @click="register">注册</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import md5 from 'js-md5';
import { NavBar, CellGroup, Field, Toast } from "vant";
Vue.use(Field)
  .use(CellGroup)
  .use(Toast)
  .use(NavBar);
export default {
  data() {
    return {
      mobile: "",
      verCode: "",
      agentNo: "",
      password: "",
      codeText: "获取验证码",
      countDownSecond: -1,
      codeTimer: null,
      isEyeClose: true
    };
  },
  destroyed() {
    this.clearTimeCount(this.codeTimer);
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    changeShow() {
      this.isEyeClose = !this.isEyeClose;
    },
    getCode() {
      if (this.countDownSecond > 0) {
        return;
      }
      if (this.mobile == "") {
        Toast("请输入手机号码");
        return;
      }
      if (this.isValidateTel()) {
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
    getCodeReq() {
      const params = { mobile: this.mobile };
      //手机号输入正确，才能获取验证码
      this.$http
        .post("/authCode/getRegisterCode", params)
        .then(res => {
          Toast("已发送验证码");
        })
        .catch((error) => {
          Toast(error.message);
        });
    },
    /**
     * 判断输入手机号
     */
    isValidateTel() {
      let flag = true;
      if (!new RegExp("^1[0-9]{10}$").test(this.mobile)) {
        flag = false;
        Toast("请填写正确的手机号码");
      }
      return flag;
    },
    register() {
      const params = {
        mobile: this.mobile,
        verCode: this.verCode,
        agentNo: this.agentNo,
        password: md5(this.password)
      };
      if(!this.verCode){
        Toast("请填写验证码")
        return
      }
      if(!this.agentNo){
        Toast("请填写邀请码")
        return
      }
      if(!this.password){
        Toast("请设置密码")
        return
      }
      if (this.isValidateTel()) {
        //手机号输入正确，才能获取验证码
        this.$http
          .post("/login/register", params)
          .then(res => {
            Toast('注册成功')
            this.$router.go(-1)
          })
          .catch((error) => {
            Toast(error.message);
          });
      }
    }
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
      color: $red;
      .gray {
        color: #ccc;
      }
    }
  }
  .main-btn {
    margin: 40px auto 0;
    width: 86%;
    height: 40px;
    color: #fff;
    background: $red;
    border-radius: 20px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
  }
}
</style>
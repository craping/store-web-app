<template>
  <div class="foget-page">
    <van-nav-bar title="忘记密码" left-arrow @click-left="onClickLeft" />
    <div class="login-body">
      <van-cell-group>
        <van-field
          v-model="mobile"
          clearable
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
      </van-cell-group>
      <div class="main-btn" @click="sureHandle">完成</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Icon } from "vant";
import { CellGroup, Field, Toast } from "vant";
import md5 from "js-md5";

Vue.use(CellGroup)
  .use(Field)
  .use(Icon)
  .use(NavBar);
const aweixin = null;
export default {
  data() {
    return {
      mobile: "",
      verCode: "",
      password: "",
      codeText: "获取验证码",
      countDownSecond: -1,
      codeTimer: null,
      isEyeClose: true
    };
  },
  destroyed() {
    clearInterval(this.codeTimer);
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path) {
      this.$router.push(path);
    },
    changeShow() {
      this.isEyeClose = !this.isEyeClose;
    },
    sureHandle() {
      const params = {
        mobile: this.mobile,
        verCode: this.verCode,
        password: md5(this.password),
      };
      this.$http
        .post("/login/forgetPassword ", params)
        .then(res => {
        })
        .catch(error => {
        });
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
     * 获取验证码接口
     */
    getCodeReq() {
      const params = { mobile: this.mobile };
      this.$http
        .post("/login/getVerCode", params)
        .then(() => {})
        .catch((error) => {
          Toast(error.message)
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
    }
  }
};
</script>
<style lang="scss" scoped>
.foget-page {
  .right-tips {
    color: #ccc;
  }
  .login-body {
    margin-top: 10px;
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
      color: $red;
      .gray {
        color: #ccc;
      }
    }
  }
}
</style>
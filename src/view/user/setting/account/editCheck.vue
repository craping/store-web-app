<template>
  <div class="edit-check-page">
    <van-nav-bar title="验证" left-arrow @click-left="onClickLeft" />
    <div class="login-body">
      <van-cell-group>
        <van-field value="153232322" clearable label="手机号" disabled />
        <van-field v-model="verCode" clearable label="短信验证码" placeholder="请输入短信验证码">
          <div class="code-operate" slot="button" @click="getCode">
            <span :class="{gray:countDownSecond >= 0}">{{codeText}}</span>
          </div>
        </van-field>
        <div class="main-btn" @click="sureHandle">下一步</div>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Icon } from "vant";
import { CellGroup, Field, Toast } from "vant";
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
      codeText: "获取验证码",
      countDownSecond: -1,
      codeTimer: null,
      isEyeClose: true,
      mode: this.$route.mode
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
        verCode: this.verCode
      };
      this.$http
        .post("/login/checkingCode", params)
        .then(res => {
          if ((this.mode = "mobile")) {
            this.jumpLink("editMobile");
          } else if ((this.mode = "password")) {
            this.jumpLink("editPassword");
          }
        })
        .catch(error => {});
    },
    getCode() {
      if (this.countDownSecond > 0) {
        return;
      }
      if (this.mobile == "") {
        Toast("请输入手机号码");
        return;
      }
      this.timeCountDown();
      this.timeCountDown();
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
        .then(res => {})
        .catch(error => {
          Toast("获取验证码失败");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.edit-check-page {
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
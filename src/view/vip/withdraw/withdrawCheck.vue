<template>
  <div class="edit-check-page">
    <van-nav-bar title="手机验证" left-arrow @click-left="onClickLeft" />
    <div class="login-body">
      <van-cell-group>
        <van-field :value="bindPhoneStr" clearable label="手机号" disabled />
        <van-field v-model="verCode" clearable label="短信验证码" placeholder="请输入短信验证码">
          <div class="code-operate" slot="button" @click="getCode">
            <span :class="{gray:countDownSecond >= 0}">{{codeText}}</span>
          </div>
        </van-field>
        <div class="main-btn" @click="sureHandle">完成</div>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Icon } from "vant";
import { CellGroup, Field, Toast } from "vant";
import { mapState, mapGetters } from "vuex";
Vue.use(CellGroup)
  .use(Field)
  .use(Icon)
  .use(NavBar);
const aweixin = null;
export default {
  data() {
    return {
      verCode: "",
      codeText: "获取验证码",
      countDownSecond: -1,
      codeTimer: null,
      amount: this.$route.query.amount,
      bankCardId: this.$route.query.bankCardId,
    };
  },
  destroyed() {
    clearInterval(this.codeTimer);
  },
  computed: {
    ...mapState("user", {
      bindPhone: state => state.bindPhone
    }),
    ...mapGetters("user", ["bindPhoneStr"])
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path) {
      this.$router.push(path);
    },
    sureHandle() {
      if (!this.verCode) {
        Toast("请输入验证码");
        return
      }
      const params = {
        bankCardId: this.bankCardId,
        amount: this.amount,
        verCode: this.verCode
      };
      this.$http
        .post("/user/withdraw", params)
        .then(res => {
          Toast("提交申请成功");
        })
        .catch(error => {
          Toast(error.message);
        });
      
    },
    getCode() {
      if (this.countDownSecond > 0) {
        return;
      }
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
      const params = { mobile: this.bindPhone };
      this.$http
        .post("/authCode/getWithdrawCode", params)
        .then(res => {
          Toast("已发送");
        })
        .catch(error => {
          Toast(error.message);
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
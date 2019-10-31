<template>
  <div class="edit-check-page">
    <van-nav-bar :title="bindPhone?'更换手机号':'绑定手机号'" left-arrow @click-left="onClickLeft" />
    <div class="login-body">
      <van-cell-group>
        <van-field v-model="newmobile" clearable type="tel" label="新手机号"  placeholder="请输入新手机号"/>
        <van-field v-model="verCode" clearable label="短信验证码" placeholder="请输入短信验证码">
          <div class="code-operate" slot="button" @click="getCode">
            <span :class="{gray:countDownSecond >= 0}">{{codeText}}</span>
          </div>
        </van-field>
        <div class="main-btn" @click="sureHandle">确定</div>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { CellGroup, Field, Toast, NavBar, Icon } from "vant";
import { mapState, mapActions } from 'vuex';

Vue.use(CellGroup)
  .use(Field)
  .use(Icon)
  .use(NavBar);
const aweixin = null;
export default {
  data() {
    return {
      newmobile: "",
      verCode: "",
      codeText: "获取验证码",
      countDownSecond: -1,
      codeTimer: null,
      isEyeClose: true,
      isNew: this.$route.query.isNew || false
    };
  },
  computed: {
    ...mapState('user',{
      bindPhone: state => state.bindPhone,
    }),
  },
  destroyed() {
    clearInterval(this.codeTimer);
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
      const params = {
        newMobile: this.newMobile,
        verCode: this.verCode
      };
      this.$http
        .post("/user/updataMobile", params)
        .then(res => {
          if (this.isNew) {
            Toast("绑定成功");
            this.$router.go(-1);
          } else {
            Toast("修改成功");
            this.$router.go(-2);
          }
          this.$store.commit('user/SET_PHONE',this.newMobile)
        })
        .catch(error => {
          Toast(error.message);
        });
    },
    getCode() {
      if (this.countDownSecond > 0) {
        return;
      }
      if (this.mobile == "") {
        Toast("请输入新手机号码");
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
      const params = { mobile: this.newmobile };
      this.$http
        .post("/authCode/getUpdateCode", params)
        .then(res => {
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
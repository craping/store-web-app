<template>
  <div class="edit-check-page">
    <van-nav-bar title="设置密码" left-arrow @click-left="onClickLeft" />
    <div class="login-body">
      <van-cell-group>
        <van-field
          v-model="payPassword"
          clearable
          label="密码"
          placeholder="请输入密码"
          left-icon="lock"
          :type="isEyeClose ? 'password' : 'text'"
          :right-icon="isEyeClose ? 'closed-eye' : 'eye-o'"
          @click-right-icon="isEyeClose=!isEyeClose"
        />
        <div class="main-btn" @click="sureHandle">确定</div>
      </van-cell-group>
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
      payPassword: '',
      isEyeClose: true
    };
  },

  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path) {
      this.$router.push(path);
    },
    sureHandle() {
      const params = {
        payPassword: md5(this.payPassword),
      };
      this.$http
        .post("/user/paymentCode", params)
        .then(res => {
          this.$store.commit('user/SET_PAYLOGO')
          Toast("设置成功");
          this.$router.go(-2);
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
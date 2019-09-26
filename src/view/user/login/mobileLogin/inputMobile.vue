<template>
  <div class="input-mobile-page">
    <van-nav-bar title="手机号" left-arrow @click-left="onClickLeft" />
    <div class="login-body">
      <van-cell-group>
        <van-field
          v-model="mobile"
          clearable
          type="tel"
          label="手机号"
          placeholder="请输入手机号码"
          left-icon="phone"
        />
        <div class="main-btn" @click="checkMobile">下一步</div>
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
      mobile: ""
    };
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path, query) {
      this.$router.push({ path, query });
    },
    changeShow() {
      this.isEyeClose = !this.isEyeClose;
    },
    checkMobile() {
      if (this.isValidate()) {
        const params = { mobile: this.mobile };
        this.$http
          .post("/authCode/getLoginCode", params)
          .then(res => {
            this.jumpLink("inputsms", { mobile: this.mobile });
          })
          .catch(error => {
            Toast(error.message);
          });
      }
    },

    /**
     * 判断输入手机号
     */
    isValidate() {
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
.input-mobile-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  .login-body {
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
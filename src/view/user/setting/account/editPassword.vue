<template>
  <div class="edit-check-page">
    <van-nav-bar title="修改密码" left-arrow @click-left="onClickLeft" />
    <div class="login-body">
      <van-cell-group>
        <van-field
          v-model="password"
          clearable
          label="新密码"
          placeholder="请输入新密码"
        />
        <van-field
          v-model="passwrods"
          clearable
          label="确认新密码"
          placeholder="请再次输入新密码"
        />
        <div class="main-btn" @click="sureHandle">修改</div>
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
      password: "",
      passwords: "",
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
      if (this.passwrod !== this.passwrods) {
        Toast("两次输入的密码不相同");
        return;
      }
      const params = {
        passwrod: this.passwrod,
        passwrods: this.passwrods
      };
      this.$http
        .post("/user/updataPassword ", params)
        .then(res => {
          Toast("修改成功");
        })
        .catch(error => {});
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
<template>
  <div class="edit-check-page">
    <van-nav-bar title="设置密码" left-arrow @click-left="onClickLeft" />
    <div class="login-body">
      <van-cell-group>
        <van-field
          v-model="password"
          clearable
          label="新密码"
          placeholder="请输入新密码"
          left-icon="lock"
          :type="isEyeClose1 ? 'password' : 'text'"
          :right-icon="isEyeClose1 ? 'closed-eye' : 'eye-o'"
          @click-right-icon="isEyeClose1=!isEyeClose1"
        />
        <van-field
          v-model="passwords"
          clearable
          label="确认新密码"
          placeholder="请输入密码"
          left-icon="lock"
          :type="isEyeClose2 ? 'password' : 'text'"
          :right-icon="isEyeClose2 ? 'closed-eye' : 'eye-o'"
          @click-right-icon="isEyeClose2=!isEyeClose2"
        />
        <van-field v-model="password" clearable label="新密码" placeholder="请输入新密码" />
        <van-field v-model="passwords" clearable label="确认新密码" placeholder="请再次输入新密码" />
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
      password: "",
      passwords: "",
      isEyeClose1: true,
      isEyeClose2: true
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
      if (this.password !== this.passwords) {
        Toast("两次输入的密码不一致");
        return;
      }
      const params = {
        password: md5(this.password),
        passwords: md5(this.passwords)
      };
      this.$http
        .post("/user/updataPassword", params)
        .then(res => {
          Toast("修改成功");
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
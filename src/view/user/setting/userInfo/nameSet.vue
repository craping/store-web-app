<template>
  <div class="setting-page">
    <van-nav-bar title="昵称" left-arrow right-text="保存" @click-left="onClickLeft">
      <span v-show="nickName.trim()" class="btn" slot="right" @click="onClickRight">保存</span>
    </van-nav-bar>
    <van-cell-group>
      <van-field v-model="nickName" clearable placeholder="请输入昵称" />
    </van-cell-group>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Field, CellGroup,Toast } from "vant";
import { mapActions } from 'vuex';
Vue.use(Field)
  .use(CellGroup)
  .use(NavBar);
export default {
  data() {
    return {
      nickName: this.$route.query.name
    };
  },
  methods: {
    ...mapActions('user',['getUserInfo']),
    onClickLeft() {
      this.$router.go(-1);
    },
    onClickRight() {
      const params = {
        nickName: this.nickName
      };
      this.$http
        .post("/user/updataNickName", params)
        .then(res => {
          Toast("修改成功");
          this.$store.commit('user/SET_NICKNAME',this.nickName)
          this.$router.go(-1);
        })
        .catch(error => {
          Toast(error.message)
        });
    },
    jumpLink(path) {
      this.$router.push(path);
    },
    logout() {}
  }
};
</script>
<style lang="scss" scoped>
.setting-page {
  .btn {
    color: $red;
  }
}
</style>
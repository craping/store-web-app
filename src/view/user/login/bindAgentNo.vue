<template>
  <div class="bind-agentNo">
    <van-nav-bar title="填写邀请码" left-arrow @click-left="onClickLeft" />
    <div class="login-body">
      <van-cell-group>
        <van-field
          v-model="agentNo"
          clearable
          label="邀请码"
          placeholder="请输入邀请码"
          left-icon="friends-o"
        />
      </van-cell-group>
      <div class="main-btn" @click="wechatLogin">确定</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { setToken } from "@/utils/auth";
import { NavBar, Icon } from "vant";
import { CellGroup, Field, Toast } from "vant";
import { mapState, mapActions } from 'vuex';

Vue.use(CellGroup)
  .use(Field)
  .use(Icon)
  .use(NavBar);
const aweixin = null;
export default {
  data() {
    return {
      agentNo: ""
    };
  },
  mounted() {},
  computed: {
    ...mapState('user',{
      beforePath: state => state.beforePath,
    })
  },
  methods: {
    ...mapActions('user',['getUserInfo']),
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path, query) {
      this.$router.push({ path, query });
    },
    wechatLogin() {
      if (window.aweixin) {
        if (!window.aweixin.authResult) {
          window.aweixin.authorize(
            e => {
              // alert("e.code+:" + e.code); //app端获取到的code
              this.$http
                .post("/wx/Login", { code: e.code, agentNo:this.agentNo})
                .then(res => {
                  // console.log("e.code+:" + e.code); //app端获取到的code
                  // console.log(JSON.stringify(res))
                  setToken(res.info.token);
                  this.getUserInfo()
                  // this.$store.commit("user/SET_USERINFO", res.info);
                  this.$router.push(this.beforePath);
                })
                .catch(error => {
                  Toast(error.message);
                });
            },
            function(e) {
              Toast("微信授权失败" + JSON.stringify(e));
            }
          );
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.bind-agentNo {
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
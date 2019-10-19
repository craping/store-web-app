<!--
 添加银行卡
 -->
<template>
  <div>
    <van-nav-bar :title="id ? '修改银行卡' : '添加银行卡'" left-arrow @click-left="onClickLeft" />
    <van-field v-model="bankCardNumber" label="银行卡号" placeholder="请输入银行卡号" required />
    <van-field v-model="bankName" label="银行名称" placeholder="请输入银行名称" required />
    <van-field v-model="userName" label="户主名字" placeholder="请输入户主名字" required />
    <van-field v-model="openingBank" label="开户网点" placeholder="请输入开户网点" required />
    <div class="btn" v-if="id" @click="sureHandle">修改信息</div>
    <div class="btn" v-else @click="sureHandle">添加</div>
    <div class="btn" v-if="id" @click="delHandle">解除绑定</div>
  </div>
</template>
<script>
import Vue from "vue";
import { mapState, mapActions} from "vuex";
import { NavBar, Icon, Field, Toast } from "vant";
Vue.use(Field)
  .use(NavBar)
  .use(Icon)
  .use(Toast);
export default {
  data() {
    return {
      bankCardNumber: "",
      bankName: "",
      userName: "",
      openingBank: "",
      id: null
    };
  },
  computed: {
    ...mapState({
      currentCard: state => state.bankCard.currentCard,
      bindPhone: state => state.user.bindPhone,
    })
  },

  mounted() {
    // 从store中取带过来的数据,有id,说明是编辑
    this.id = this.currentCard.id;
    this.bankCardNumber = this.currentCard.bankCardNumber;
    this.bankName = this.currentCard.bankName;
    this.userName = this.currentCard.userName;
    this.openingBank = this.currentCard.openingBank;
  },
  beforeDestroy() {
    this.setCurrentCard();
  },
  methods: {
    ...mapActions('bankCard',["setCurrentCard"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    delHandle() {
      Dialog.confirm({
        title: "提示",
        message: "确认移除该银行卡吗"
      }).then(() => {
        this.$router.push({ path:'bankCheck', query:{
          bankCardNumber: this.bankCardNumber,
          bankName: this.bankName,
          userName: this.userName,
          openingBank: this.openingBank,
          id: this.id,
          mode: 'del',
        } });
      });
    },
    sureHandle() {
      if (
        !this.bankCardNumber ||
        !this.bankName ||
        !this.userName ||
        !this.openingBank
      ) {
        Toast("请填写必填信息");
        return;
      }
      if (!this.bindPhone) {
        Toast('请去设置->账户安全中绑定手机号')
        return
      }
      this.$router.push({ path:'bankCheck', query:{
        bankCardNumber: this.bankCardNumber,
        bankName: this.bankName,
        userName: this.userName,
        openingBank: this.openingBank,
        id: this.id,
      } });
    },

  }
};
</script>
<style lang="scss" scoped>
.btn {
  margin: 30px 15px;
  height: 40px;
  line-height: 40px;
  background: $red;
  border-radius: 5px;
  text-align: center;
  font-size: 16px;
  color: #fff;
}
</style>
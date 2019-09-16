<!--
 添加银行卡
 -->
<template>
  <div>
    <van-nav-bar :title="title" left-arrow @click-left="onClickLeft" />
    <van-field v-model="bankCardNumber" label="银行卡号" placeholder="请输入银行卡号" required />
    <van-field v-model="userName" label="银行名称" placeholder="请输入银行名称" required />
    <van-field v-model="userName" label="户主名字" placeholder="请输入户主名字" required />
    <van-field v-model="openingBank" label="开户网点" placeholder="请输入开户网点" required />
    <div class="btn" @click="sureHandle">添加</div>
  </div>
</template>
<script>
import Vue from "vue";
import { createNamespacedHelpers } from 'vuex'
const {mapState,mapActions} = createNamespacedHelpers('bankCard')
import { NavBar, Icon, Field, Toast } from "vant";
Vue.use(Field)
  .use(NavBar)
  .use(Icon)
  .use(Toast);
export default {
  data() {
    return {
      bankCardNumber: '',
      bankName: '',
      userName: '',
      openingBank: '',
      title: "添加银行卡"
    };
  },
  computed:{
    ...mapState({
      currentCard: (state) => state.currentCard,
    }),
  },
  
  mounted(){
    this.bankCardNumber = this.currentCard.bankCardNumber
    this.bankName = this.currentCard.bankName
    this.userName = this.currentCard.userName
    this.openingBank = this.currentCard.openingBank
  },
  beforeDestroy(){
    this.setCurrentCard()
  },
  methods: {
    ...mapActions(["setCurrentCard"]),
    onClickLeft() {
      this.$router.go(-1);
    },
    sureHandle() {
      if (!bankCardNumber || !bankName || !userName || !openingBank) {
        Toast("请填写必填信息");
        return;
      }
      this.$http
        .get("/bankCard/addBankCardInfo", {
          bankCardNumber,
          bankName,
          userName,
          openingBank
        })
        .then(data => {
          Toast("添加成功");
          this.$router.go(-1);
        })
        .catch(error => {
          Toast("添加失败");
        });
    }
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
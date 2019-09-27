<!--
 添加银行卡
 -->
<template>
  <div>
    <van-nav-bar :title="title" left-arrow @click-left="onClickLeft" />
    <van-field v-model="bankCardNumber" label="银行卡号" placeholder="请输入银行卡号" required />
    <van-field v-model="bankName" label="银行名称" placeholder="请输入银行名称" required />
    <van-field v-model="userName" label="户主名字" placeholder="请输入户主名字" required />
    <van-field v-model="openingBank" label="开户网点" placeholder="请输入开户网点" required />
    <div class="btn" @click="sureHandle">{{id?'修改':'添加'}}</div>
  </div>
</template>
<script>
import Vue from "vue";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("bankCard");
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
      title: "添加银行卡",
      id: null
    };
  },
  computed: {
    ...mapState({
      currentCard: state => state.currentCard
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
    ...mapActions(["setCurrentCard"]),
    onClickLeft() {
      this.$router.go(-1);
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
      if (this.id) {
        this.updateHandle()
      } else {
        this.addHandle()
      }
    },
    // 添加银行卡
    addHandle() {
      this.$http
        .post("/bankCard/addBankCardInfo", {
          bankCardNumber: this.bankCardNumber,
          bankName: this.bankName,
          userName: this.userName,
          openingBank: this.openingBank
        })
        .then(data => {
          Toast("添加成功");
          this.$router.go(-1);
        })
        .catch(error => {
          Toast(error.message)
        });
    },
    // 修改银行卡
    updateHandle() {
      this.$http
        .post("/bankCard/updateBankCardInfo", {
          id: this.id,
          bankCardNumber: this.bankCardNumber,
          bankName: this.bankCardNumber,
          userName: this.userName,
          openingBank: this.openingBank
        })
        .then(data => {
          Toast("添加成功");
          this.$router.go(-1);
        })
        .catch(error => {
          Toast(error.message)
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
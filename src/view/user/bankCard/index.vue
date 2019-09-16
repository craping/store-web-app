<!--
 银行卡列表
 -->
<template>
  <div class="bankcard-page">
    <van-nav-bar :title="title" left-arrow @click-left="onClickLeft" fixed>
      <van-icon name="plus" slot="right" color="#f44" @click="jumpLink('/addBankCard')" />
    </van-nav-bar>
    <div class="banl-list">
      <div
        class="bank-bar"
        v-for="(item,index) in cardList"
        :key="index"
        @click="clickHandle(item)"
      >
        <div class="col-left">
          <img class="bank-icon" src />
          <div class="col-mid">
            <div class="title">招商银行</div>
            <div class="info">尾号1223 快捷</div>
          </div>
        </div>
        <div v-if="from">
          <van-icon name="success" size="14px" color="#f44" />
        </div>
        <div v-else @click="removeHandle(item)">
          <van-icon name="delete" size="14px" color="#f44" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("bankCard");
import { NavBar, Field, Icon } from "vant";
Vue.use(Field)
  .use(Icon)
  .use(NavBar);
export default {
  data() {
    return {
      title: "银行卡",
      from: this.$route.query.from || "",
      cardList: [{}, {}]
    };
  },
  methods: {
    ...mapActions(["setCurrentCard"]),
    onClickLeft() {
      this.$router.go(-1);
    },

    jumpLink(path, query) {
      this.$router.push({ path, query });
    },
    getCardList() {
      this.$http
        .get("/bankCard/getBankCardInfo", {})
        .then(data => {
          this.cardList = data || [];
        })
        .catch(error => {});
    },
    clickHandle(item) {
      if (this.from == "choose") {
        this.$router.go(-1);
      } else {
        const param = {
          // bankCardNumber: item.bankCardNumber,
          // bankName: item.bankName,
          // userName: item.userName,
          // openingBank: item.openingBank
          bankCardNumber: '3',
          bankName: 'item.bankName',
          userName: 'item.userName',
          openingBank: 'item.openingBank'
        };
        this.setCurrentCard(param);
        this.jumpLink("addBankCard");
      }
    },
    removeHandle(item) {
      this.$http
        .get("/bankCard/removeBankCardInfo", {
          id: item.id
        })
        .then(data => {
          Toast("删除成功");
          this.$router.go(-1);
        })
        .catch(error => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.bankcard-page {
  .banl-list {
    padding-top: 66px;
    margin-top: 15px;
  }
  .bank-bar {
    height: 60px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.08);
    .col-left {
      display: flex;
    }
    .bank-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #eee;
      margin-right: 15px;
    }
    .col-mid {
      display: flex;
      flex-direction: column;
      justify-content: center;
      .title {
        color: #333;
        font-size: 16px;
      }
      .info {
        font-size: 14px;
        color: #999;
      }
    }
    .remove-span {
      color: $red;
    }
  }
}
</style>
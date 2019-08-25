<template>
  <van-row>
    <van-nav-bar
      title="收货地址列表"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-address-list
      v-model="chosenAddressId"
      :list="list"
      :disabled-list="disabledList"
      disabled-text="以下地址超出配送范围"
      @add="onAdd"
      @edit="onEdit"
    />
  </van-row>
</template>
<script>
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex'
const {mapState,mapActions} = createNamespacedHelpers('address')
import { Row, NavBar, AddressList} from 'vant';
Vue.use(Row).use(NavBar).use(AddressList);
export default {
  data() {
    return {
      chosenAddressId: '1',
      list: [
        {
          id: '1',
          name: '张三',
          tel: '13000000000',
          address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室'
        },
        {
          id: '2',
          name: '李四',
          tel: '1310000000',
          address: '浙江省杭州市拱墅区莫干山路 50 号'
        }
      ],
      disabledList: [
        {
          id: '3',
          name: '王五',
          tel: '1320000000',
          address: '浙江省杭州市滨江区江南大道 15 号'
        }
      ]
    }
  },
  mounted() {
    // this.getAddressList()
  },
  methods: {
    ...mapActions(['setAddressInfo']),
    getAddressList() {
      this.$http.get("api", {}).then(res => {

      }).catch(error => {
        
      })
    },
    onClickLeft() {
      this.$router.go(-1)
    },
    onAdd() {
      //Toast('新增地址');
      this.setAddressInfo({})
      this.$router.push({path:'/addAddress', query:{mode: 'add'}})
    },
    onEdit(item, index) {
      this.setAddressInfo(JSON.parse(JSON.stringify(item).replace(/address/, "addressDetail")))
      this.$router.push({path:'/addAddress', query:{mode:'edit'}})
    }
  }
}
</Script>
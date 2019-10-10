<template>
  <van-row>
    <van-nav-bar title="收货地址列表" left-arrow @click-left="onClickLeft"/>
    <van-address-list
      v-if="chosenAddressId"
      v-model="chosenAddressId"
      :list="addressList"
      :disabled-list="disabledList"
      disabled-text="以下地址超出配送范围"
      @add="onAdd"
      @edit="onEdit"
    />
    <van-address-list
      v-else
      :switchable="canSelect"
      :list="addressList"
      @add="onAdd"
      @edit="onEdit"
      @select="onSelect"
    />
  </van-row>
</template>
<script>
import Vue from 'vue'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('address')
import { Row, NavBar, AddressList } from 'vant'
Vue.use(Row)
  .use(NavBar)
  .use(AddressList)
export default {
  data() {
    return {
      chosenAddressId: this.$route.query.chosenAddressId || '', // 上个页面传来的地址id
      list: [
        // {
        //   id: '1',
        //   name: '张三',
        //   tel: '13000000000',
        //   address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室'
        // },
        // {
        //   id: '2',
        //   name: '李四',
        //   tel: '1310000000',
        //   address: '浙江省杭州市拱墅区莫干山路 50 号'
        // }
      ],
      disabledList: [
        // {
        //   id: '3',
        //   name: '王五',
        //   tel: '1320000000',
        //   address: '浙江省杭州市滨江区江南大道 15 号'
        // }
      ]
    }
  },
  mounted() {
    this.getAddressList()
  },
  computed: {
    ...mapState({
      addressList: state => state.addressList
    }),
    canSelect() {
      //判断是否显示可以选择地址，默认不可以，只有从选择收货地址过来才显示
      return this.$route.query.type === 'select'
    }
  },
  methods: {
    ...mapActions(['setAddressInfo', 'getAddressList']),
    onClickLeft() {
      this.$router.go(-1)
    },
    // 新增地址
    onAdd() {
      this.setAddressInfo({})
      this.$router.push({ path: '/addAddress', query: { mode: 'add' } })
    },
    // 编辑地址
    onEdit(item, index) {
      const coby = JSON.parse(
        JSON.stringify(item).replace(/address/, 'addressDetail')
      )
      coby.isDefault = !coby.isDefault
      this.setAddressInfo(coby)
      this.$router.push({ path: '/addAddress', query: { mode: 'edit' } })
    },
    // 选择地址
    onSelect(item, index) {
      this.setAddressInfo(
        JSON.parse(JSON.stringify(item).replace(/address/, 'addressDetail'))
      )
      this.$router.go(-1)
    }
  }
}
</Script>
<template>
  <van-row>
    <van-nav-bar
      title="编辑收货地址"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-address-edit
      :area-list="areaList"
      show-postal
      :show-delete="showDelete"
      show-set-default
      show-search-result
      :address-info="adderssInfo"
      :search-result="searchResult"
      @save="onSave"
      @delete="onDelete"
    />
  </van-row>
</template>
<script>
import Vue from "vue";
import AreaList from './area';
import { Row, NavBar, AddressEdit, Area} from "vant";
import { createNamespacedHelpers } from 'vuex'
const {mapState,mapActions} = createNamespacedHelpers('address')
Vue.use(Row).use(AddressEdit).use(Area).use(NavBar);
export default {
  data() {
    return {
      areaList: AreaList,
      searchResult: [],
      mode: this.$route.query.mode,
      showDelete: false
    };
  },
  computed: {
    ...mapState({
      adderssInfo: (state) => state.adderssInfo,
    }),
  },
  mounted() {
    this.showDelete = this.mode == 'edit'
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onSave(data) {
      console.log(data)
      this.$http.get("api", {}).then(res => {
        Toast("保存成功");
      }).catch(error => {
        
      })
    },
    onDelete(data) {
      console.log(data)
      this.$http.get("api", {}).then(res => {
        Toast("删除成功");
      }).catch(error => {
        
      })
      // Toast("delete");
    }
  }
};
</script>
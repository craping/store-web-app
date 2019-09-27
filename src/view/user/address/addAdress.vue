<template>
  <van-row>
    <van-nav-bar :title="addressInfo.id?'编辑收货地址':'新增收货地址'" left-arrow @click-left="onClickLeft" />
    <van-address-edit
      :area-list="areaList"
      show-postal
      :show-delete="!!addressInfo.id"
      show-set-default
      show-search-result
      :address-info="addressInfo"
      :search-result="searchResult"
      @save="onSave"
      @delete="onDelete"
    />
  </van-row>
</template>
<script>
import Vue from "vue";
import AreaList from "./area";
import { Row, NavBar, AddressEdit, Area, Toast } from "vant";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("address");
Vue.use(Row)
  .use(AddressEdit)
  .use(Area)
  .use(NavBar)
  .use(Toast);
export default {
  data() {
    return {
      areaList: AreaList,
      searchResult: [],
      mode: this.$route.query.mode
    };
  },
  computed: {
    ...mapState({
      addressInfo: state => state.addressInfo
    })
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onSave(data) {
      const params = {
        name: data.name,
        phone: data.tel,
        province: data.province,
        city: data.city,
        region: data.county,
        detailAddress: data.addressDetail,
        defaultStatus: !data.isDefault * 1,
        postalCode: data.postalCode,
        areaCode: data.areaCode
      };
      if (data.id) {
        params.id = data.id;
      }
      this.$http
        .post("/address/saveOrUpdateAddress", params)
        .then(res => {
          Toast("保存成功");
          this.$router.go(-1);
        })
        .catch(error => {
          Toast(error.message);
        });
    },

    onDelete(data) {
      const params = {
        id: data.id
      };
      this.$http
        .post("/address/removeAddress", params)
        .then(res => {
          Toast("删除成功");
          this.$router.go(-1);
        })
        .catch(error => {
          Toast(error.message);
        });
    }
  }
};
</script>
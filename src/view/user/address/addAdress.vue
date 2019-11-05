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
    // 点击保存按钮时触发
    onSave(data) {
      const params = {
        name: data.name,
        phoneNumber: data.tel,
        province: data.province,
        city: data.city,          
        region: data.county,
        detailAddress: data.addressDetail,
        defaultStatus: data.isDefault? 1 : 0,
        postCode: data.postalCode,
        areaCode: data.areaCode
      };
      /*
        接口说明：添加或修改收货地址
        address/saveOrUpdateAddress
          token:用户Token [是否必要：true]
          id:地址ID [是否必要：false]
          name:收货人名称 [是否必要：true]
          phoneNumber:收货人电话 [是否必要：true]
          defaultStatus:是否为默认地址 [是否必要：true]
          areaCode:地区码 [是否必要：true]
          postCode:邮政编码 [是否必要：false]
          province:省份/直辖市 [是否必要：true]
          city:城市 [是否必要：true]
          region:区 [是否必要：true]
          detailAddress:详细地址(街道) [是否必要：true]
      */
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
    // 确认删除地址时触发
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
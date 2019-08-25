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
import { Row, NavBar, AddressEdit, Area} from "vant";
import { createNamespacedHelpers } from 'vuex'
const {mapState,mapActions} = createNamespacedHelpers('address')
Vue.use(Row).use(AddressEdit).use(Area).use(NavBar);
export default {
  data() {
    return {
      areaList: {
        province_list: {
          110000: "北京市",
          120000: "天津市"
        },
        city_list: {
          110100: "北京市",
          110200: "县",
          120100: "天津市",
          120200: "县"
        },
        county_list: {
          110101: "东城区",
          110102: "西城区",
          110105: "朝阳区",
          110106: "丰台区",
          120101: "和平区",
          120102: "河东区",
          120103: "河西区",
          120104: "南开区",
          120105: "河北区"
        }
      },
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
<template>
	<van-tabbar v-model="active" @change="routeLink">
		<van-tabbar-item replace
			v-for="(tab, index) in tabbar"
			:icon="tab.icon"
			:dot="tab.dot"
			:info="tab.info"
			:key="index">
			{{tab.name}}
		</van-tabbar-item>
	</van-tabbar>
</template>


<script>
import { Tabbar, TabbarItem } from "vant";
import { mapState , mapGetters} from 'vuex';

export default {
  name: 'store-tabbar',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  data() {
    return {
      active: 0,
      tabbar: [
        {
          name: "首页",
          path: "/main/home",
          pathName: "home",
          icon: "wap-home",
          dot: false,
          info: ""
        },
        {
          name: "砍价",
          path: "/main/bargain",
          pathName: "class",
          icon: "discount",
          dot: false,
          info: ""
        },
        {
          name: "购物车",
          path: "/main/cart",
          pathName: "cart",
          icon: "shopping-cart",
          dot: false,
          info: ""
        },
        {
          name: "我的",
          path: "/main/user",
          pathName: "user",
          icon: "user-o",
          dot: false,
          info: ""
        }
      ]
    };
  },

  watch: {
    $route: "changeActive",
    cartNum (newNum) {
      if (newNum) {
        this.tabbar[2].dot = true
      }
    },
  },
  computed: {
    ...mapState({
      isLogin: state => state.user.isLogin,
    }),
    ...mapGetters('cart', ['cartNum']),
  },
  created() {
    const toName = this.$route.name;
    this.setActive(toName);
  },

  methods: {
    changeActive({ name }) {
      this.setActive(name);
    },
    setActive(name) {
      this.tabbar.forEach((tab, i) => {
        if (tab.pathName == name) {
          this.active = i;
          return false;
        }
      });
    },
    routeLink(active) {
      if((active == 2 || active == 3) && !this.isLogin){
        this.$router.push('/login')
      } else {
        this.$router.push(this.tabbar[active].path)
      }
    },
  }
};
</script>

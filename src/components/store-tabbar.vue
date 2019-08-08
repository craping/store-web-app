<template>
	<van-tabbar route v-model="active">
		<van-tabbar-item
			v-for="(tab, index) in tabbar"
			:icon="tab.icon"
			:to="tab.path"
			:dot="tab.dot"
			:info="tab.info"
			:key="index">
			{{tab.name}}
		</van-tabbar-item>
	</van-tabbar>
</template>


<script>
import { Tabbar, TabbarItem } from "vant";

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
          path: "/main/free",
          pathName: "class",
          icon: "class-full",
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
    $route: "changeActive"
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
    }
  }
};
</script>

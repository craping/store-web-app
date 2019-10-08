<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import sync from "@/utils/sync";
import service from "@/utils/service";

export default {
  data() {
    return {};
  },
  created() {
    this.$store.dispatch("user/getUserInfo").then(data => {
      // sync.connect();
      // service.init(data.info);
    }).catch(error => {
      console.log(error)
    });
  },
  mounted() {
    
  },
  methods: {
  }
};
</script>
<style lang="scss" src="./assets/scss/global.scss" />

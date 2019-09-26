<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import sync from "@/utils/sync";

export default {
  data() {
    return {};
  },
  created() {
    this.$store.dispatch("user/getUserInfo").then(data => {
      sync.connect();
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

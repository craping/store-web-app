<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth';

export default {
  data() {
    return {
    };
  },
  created() {
    this.$http.post("user/getUserInfo", {}).then(data => {

    });
  }
}
</script>
<style lang="scss" src="./assets/scss/global.scss" />

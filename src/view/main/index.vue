<template>
  <div>
    <router-view class="main"></router-view>
    <store-tabbar/>
  </div>
</template>

<script>
import storeTabbar from "../../components/store-tabbar";

export default {
  components: {storeTabbar}
};
</script>

<style>
.main{
  margin-bottom: 50px;
}
</style>

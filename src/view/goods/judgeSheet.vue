<template>
  <div>
    <div class="judge-area inPopup" v-for="i in 10">
      <div class="row-1">
        <img class="head-img" src />
        <span class="user-name">名**字</span>
      </div>
      <div class="row-2">
        很好看很好看很好看很好看很好看，很好看很好看很好看很好看，很好看很好看很好看很好很好看很好看很好看，很好看很好看很好看很好看很好看很好看很好看很好看很好看很好看很好看很好看很好看
        <div class="pic-area">
          <img v-for="j in 3" src="https://img.yzcdn.cn/vant/apple-1.jpg" @click="showPre" />
        </div>
      </div>
      <div class="row-3">2019-09-10 规格：红色</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods:{
      showPre() {
          const img = 'https://img.yzcdn.cn/vant/apple-1.jpg'
        this.$emit('showPre',img)
      }
  }
};
</script>
<template>
  <div class="comment-sheet">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="judge-area inPopup" v-for="i in 10">
        <div class="row-1">
          <img class="head-img" src />
          <span class="user-name">名**字</span>
        </div>
        <div class="row-2">
          很好看很好看很好看很好看很好看，很好看很好看很好看很好看，很好看很好看很好看很好很好看很好看很好看，很好看很好看很好看很好看很好看很好看很好看很好看很好看很好看很好看很好看很好看
          <div class="pic-area">
            <img v-for="j in 3" src="https://img.yzcdn.cn/vant/apple-1.jpg" @click="showPre(j)" />
          </div>
        </div>
        <div class="row-3">2019-09-10 规格：红色</div>
      </div>
    </van-list>
  </div>
</template>
<script>
import Vue from "vue";
import { List } from "vant";
import { mapState, mapActions } from 'vuex'

Vue.use(List);
export default {
  components: {},
  data() {
    return {
      loading: false,
      finished: false,
      pageNum: 0,
    };
  },
  methods: {
    ...mapActions('comments',['queryComments']),
    showPre(index) {
      const img = [
        "https://img.yzcdn.cn/vant/apple-1.jpg",
        "https://img.yzcdn.cn/vant/apple-1.jpg"
      ];
      this.$emit("showPre", { img, index: index - 1 });
    },
    onLoad() {
      console.log('load')
      let params = {
        id: this.$route.params.id,
        pageNum: this.pageNum++,
        pageSize: 10
      }
      this.loading = true
      this.queryComments(params).then((data)=>{
        if(data.info && data.info.length == 0){
          this.finished = true
        }
        this.loading = false
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.comment-sheet {
  /deep/.scoll-s .scroll {
    padding-top: 66px;
  }
}
</style>
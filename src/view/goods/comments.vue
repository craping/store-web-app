<template>
  <div class="comment-sheet">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="comments-area inPopup" v-for="item in commentList" :key="item.id">
        <div class="row-1">
          <img class="head-img" :src="item.memberIcon">
          <span class="user-name">{{item.memberUsername}}</span>
        </div>
        <div class="row-2">
          <div>{{item.content}}</div>
          <div class="pic-area" >
            <img v-for="(pic,index) in (item.pics.split(','))" :key="index" :src="pic" @click="showPre(index+1)" />
          </div>
        </div>
        <div class="row-3">{{formatTime(item.createTime)}} 规格:{{formatAttr(item.productAttribute)}}</div>
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
      pageNum: 1,
    };
  },
  computed:{
    ...mapState({
      commentList: state => state.comments.commentList,
    })
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
        pageNum: this.pageNum,
        pageSize: 10
      }
      this.loading = true
      this.queryComments(params).then((data)=>{
        this.pageSize++
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
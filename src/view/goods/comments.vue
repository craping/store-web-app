<template>
  <div class="comment-sheet">
    <van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="没有更多了"  @load="onLoad">
      <div class="comments-area inPopup" v-for="item in commentList" :key="item.id">
        <div class="row-1">
          <img class="head-img" :src="item.memberIcon">
          <span class="user-name">{{item.memberUsername}}</span>
        </div>
        <div class="row-2">
          <div>{{item.content}}</div>
          <div class="pic-area" >
            <img v-for="(pic,index) in JSON.parse(item.pics)" :key="index" :src="pic.url" @click="showPre(JSON.parse(item.pics))" />
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
import { format } from "@/utils/util";
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
    showPre(picArray) {
      this.$emit("showPre",  picArray );
    },
    onLoad() {
      let params = {
        id: this.$route.params.id,
        pageNum: this.pageNum,
        pageSize: 10
      }
      this.loading = true
      debugger
      this.queryComments(params).then((data)=>{
        this.pageNum++
        if ( data.page >= data.totalpage) {
          this.finished = true
          this.loading = true
        } else {
          this.loading = false
        }
      });
    },
    formatTime(time) {
      return format(time, "yyyy-MM-dd");
    },
    formatAttr(data) {
      const attrArray = JSON.parse(data)
      return attrArray.map(ele => ele.value).join(",") || '';
    },
  }
};
</script>
<style lang="scss" scoped>
 .comments-area {
    min-height: 100px;
    padding: 15px;
    &.inPopup {
      margin: 10px 0;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
    }
    .row-1 {
      display: flex;
      align-items: center;
      .head-img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #eee;
      }
      .user-name {
        color: #999;
      }
    }
    .row-2 {
      margin-top: 10px;
      & .overhide {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .pic-area {
        margin-top: 10px;
        img {
          width: 70px;
          height: 70px;
          margin-right: 10px;
        }
      }
    }
    .row-3 {
      margin-top: 10px;
      color: #999;
    }
  }
</style>
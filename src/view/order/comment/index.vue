<template>
  <van-row class="comment">
    <van-nav-bar
      fixed
      :z-index="100"
      title="发表评价"
      left-text="返回"
      right-text
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="proInfo">
      <van-card desc="描述信息" title="商品标题" thumb="https://img.yzcdn.cn/vant/t-thirt.jpg"/>
    </div>
    <div class="commentStar" style="background:#fff">
      <div class="item">
        <h2>{{starts.name}}</h2>
        <van-rate v-model="starts.initStar" @change="getStar" icon="like" void-icon="like-o"/>
        <p>请选择评分</p>
      </div>
    </div>
    <div class="commentWord">
      <van-field
        v-model="commentWord"
        type="textarea"
        :maxlength="maxWord"
        :autosize="commentStyle"
        :placeholder="commentDefault"
        @blur="getWord"
      />
    </div>
    <div class="commentPicture">
      <div class="title">上传图片</div>
      <van-uploader v-model="fileList" :before-read="beforeRead" accept="*" multiple :max-count="3"/>
    </div>
    <div class="confirm">
      <van-button type="danger" size="large" @click="doSubmit">提交</van-button>
    </div>
  </van-row>
</template>
<script>
import Vue from 'vue'
import { UUID } from '@/utils/util'
import { NavBar, Rate, Button, Card, Row, Field, Uploader } from 'vant'
Vue.use(NavBar)
  .use(Rate)
  .use(Button)
  .use(Card)
  .use(Row)
  .use(Field)
  .use(Uploader)
export default {
  name: 'comment',
  components: {},
  data() {
    return {
      starts: { name: '商品评分', initStar: 0 },
      commentDefault:
        '亲，您对这个商品满意吗？您的评价会帮助我们选择更好的商品哦~',
      commentWord: '', //获取评论内容
      maxWord: 50, //最大评论字数
      commentStyle: { maxHeight: 150, minHeight: 100 },
      fileList: []
    }
  },
  created() {
    console.log('dd', this.$route)
  },
  methods: {
    /*************返回点击事件***************/
    onClickLeft() {
      this.$router.go(-1)
    },

    /*************修改星数量事件*********/
    getStar(num) {
      console.log(num)
    },

    /************获取评论内容*********/
    getWord(e) {
      this.commentWord = e.target.value
    },

    /***********上传图片之前事件*********/
    beforeRead(file) {
      console.log('beforeRead')
      console.log(file)
      this.$http.post('aliyun/oss/policy', {}).then(data => {
        console.log(data.info)
        let form = new FormData()
        const filename = UUID() + '.' + file.name.split('.')[1]
        form.append('policy', data.info.policy)
        form.append('signature', data.info.signature)
        form.append('key', data.info.dir + '/' + filename)
        form.append('ossaccessKeyId', data.info.accessKeyId)
        form.append('dir', data.info.dir)
        form.append('host', data.info.host)
        form.append('file', file)

        this.$http
          .post(data.info.host, form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(() => {
            this.fileList.push({
              url: data.info.host + '/' + data.info.dir + '/' + filename
            })
          })
      })
      return false
    },

    /***********将base64转换为文件*********/
    doSubmit() {
      const { commentWord, starts, fileList } = this
      const pid = this.$route.params.pid
      const params = {
        productId: pid,
        productName: 'xx',
        star: starts.initStar,
        productAttribute: 'cccc',
        content: commentWord,
        pics: fileList
      }

      this.$http
        .post('/orderItem/releaseComment', params)
        .then(data => {
          console.log(data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</Script>
<style lang="scss" scoped>
.comment {
  padding-top: 46px;
  display: flex;
  flex-direction: column;
  .van-nav-bar {
    padding-top: 0;
  }
  .proInfo {
    .van-card {
      background: #fff;
    }
    border-bottom: 1px solid #eee;
  }
  .commentStar {
    padding: 15px;
    .item {
      display: flex;
      align-items: center;
      height: 30px;
      h2 {
        color: $gray-deep;
        font-size: 16px;
        margin-right: 5px;
        line-height: 30px;
      }
      p {
        padding-left: 20px;
        font-size: 14px;
        color: #999;
      }
    }
  }
  .commentWord {
    margin-top: 10px;
  }
  .commentPicture {
    margin-top: 10px;
    background: #fff;
    padding: 15px;
    .title {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: $red;
    }
  }
  .confirm {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    .van-button {
      width: 90%;
    }
  }
}
</style>

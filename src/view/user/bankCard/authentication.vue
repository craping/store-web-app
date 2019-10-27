<template>
  <div class="authentication-page">
    <van-nav-bar title="认证身份" left-arrow @click-left="onClickLeft" />
    <div class="tips-bar">绑定银行卡需先上传身份信息</div>
    <div class="upload-area">
      <div class="upload-item">
        <van-uploader :after-read="(obj) => afterRead(obj,'back')">
          <div class="scale-box">
             <img class="upload-img" :src="backImg" alt="">
            <img class="bg-img" src="./b-bg.png" alt="">
          </div>
        </van-uploader>
      </div>
      <div class="upload-item">
        <van-uploader :after-read="(obj) => afterRead(obj,'front')">
             <img class="upload-img" :src="frontImg" alt="">
          <img class="bg-img" src="./a-bg.png" alt="">
        </van-uploader>
      </div>
    </div>
    <div class="desc-bar">
      要求：照片信息清晰可见，信息完整无缺失，身份照片真实严禁经过PS处理
    </div>
    <van-cell-group>
      <van-field
        placeholder="上传身份证图片自动识别"
        :value="name"
        label="真实姓名"
        disabled
      />
      <van-field
        placeholder="上传身份证图片自动识别"
        :value="idcard"
        label="身份证号"
        disabled
      />
    </van-cell-group>
    <div class="main-btn" @click="authenticationHandle">认证身份</div>

  </div>
</template>
<script>
import { UUID } from "@/utils/util";

import Vue from "vue";
import { NavBar, Uploader, Toast, NoticeBar, Field ,CellGroup} from "vant";
Vue.use(Toast)
  .use(Uploader)
  .use(NoticeBar)
  .use(Field)
  .use(CellGroup)
  .use(NavBar);
export default {
  data() {
    return {
      backImg: '',
      frontImg: '',
      name: '',
      idcard: '',
    };
  },
  computed: {},
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    afterRead(data,side) {
      if (side == 'back') {
        this.backImg = data.content
      } else {
        this.frontImg = data.content
      }
      this.getInfoByPic(data.content,side)
    },
    getInfoByPic(imageBase64,side) {
      // front:身份证带人脸一面，back:身份证带国徽片一面
      this.$http
        .post("/user/getIdendo", { imageBase64, side })
        .then(res => {
          console.log(res)
        })
        .catch(error => {
          Toast(error.message);
        });
      
    },
    authenticationHandle() {
      if (!this.backImg) {
        Toast('请上传身份证国徽面');
        return
      }
      if (!this.frontImg) {
        Toast('请上传身份证头像面');
        return
      }
      if (!this.idcard || !this.name) {
        Toast('未能识别身份信息');
        return
      }
      this.$http
        .post("/user/realName", { idcard: this.idcard, name: this.name })
        .then(res => {
          Toast('认证成功');
        })
        .catch(error => {
          Toast(error.message);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.authentication-page {
  .tips-bar {
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: #fff7cc;
    color: #f00;
    margin-bottom: 10px;
  }
  .upload-area{
    display: flex;
    padding: 0 10px;
    background: #FFF;
    .upload-item{
      flex: 1;
      .bg-img{
        width: 100%;
        height: 106px;
      }
      .upload-img{
        width: 100%;
        height: 106px;
        position: absolute;
      }
      &:first-child{
        margin-right: 10px;
      }
    }
  }
  .desc-bar{
    padding: 10px;
    background: #FFF;
    margin-bottom: 10px;
    font-size: 12px;
    color: #999;
  }
  .main-btn {
    margin: 30px auto;
    width: 86%;
    height: 40px;
    color: #fff;
    background: $red;
    border-radius: 20px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
  }
}
</style>
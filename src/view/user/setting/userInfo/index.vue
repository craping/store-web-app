<template>
  <div class="userInfo-page">
    <van-nav-bar title="个人资料" left-arrow @click-left="onClickLeft" />
    <van-uploader :before-read="beforeRead">
      <van-cell title="个人头像">
        <template slot="right-icon">
          <img class="head-img" :src="umsMember.icon || ''" />
          <i data-v-a857212a class="van-icon van-icon-arrow van-cell__right-icon"></i>
        </template>
      </van-cell>
    </van-uploader>
    <van-cell
      title="昵称"
      is-link
      :value="umsMember.nickname || ''"
      @click="setName(umsMember.nickname|| '')"
    />
    <!-- <van-cell title="生日" is-link :value="userInfo.birth" @click="dateSelectshow = true" />
    <van-cell title="性别" is-link :value="userInfo.sex" @click="sexSelectshow = true" />
    <van-action-sheet v-model="sexSelectshow" :actions="sexactions" @select="selectSex" />
    <van-popup v-model="dateSelectshow" position="bottom" :style="{ height: '30%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        @confirm="selectDate"
        @cancel="dateSelectshow=false"
      />
    </van-popup>-->
  </div>
</template>
<script>
import { UUID } from "@/utils/util";

import Vue from "vue";
import {
  NavBar,
  Cell,
  CellGroup,
  ActionSheet,
  Popup,
  DatetimePicker,
  Uploader,
  Toast
} from "vant";
import { mapState, mapActions } from "vuex";
Vue.use(Cell)
  .use(CellGroup)
  .use(ActionSheet)
  .use(Popup)
  .use(Toast)
  .use(DatetimePicker)
  .use(Uploader)
  .use(NavBar);
export default {
  data() {
    return {
      dateSelectshow: false,
      sexSelectshow: false,
      sexactions: [{ name: "男" }, { name: "女" }],
      currentDate: new Date(),
    };
  },
  computed: {
    ...mapState({
      umsMember: state => state.user.userInfo.umsMember || {}
    })
  },
  methods: {
    ...mapActions('user',['getUserInfo']),
    onClickLeft() {
      this.$router.go(-1);
    },
    jumpLink(path) {
      this.$router.push(path);
    },
    selectSex(item) {
      this.sexSelectshow = false;
    },
    selectDate(date) {
      this.dateSelectshow = false;
    },
    setName(name) {
      this.$router.push({ path: "/nameSet", query: { name } });
    },
    /***********上传图片之前事件*********/
    beforeRead(file) {
      this.$http.post("aliyun/oss/policy", {}).then(data => {
        let form = new FormData();
        const filename = UUID() + "." + file.name.split(".")[1];
        form.append("policy", data.info.policy);
        form.append("signature", data.info.signature);
        form.append("key", data.info.dir + "/" + filename);
        form.append("ossaccessKeyId", data.info.accessKeyId);
        form.append("dir", data.info.dir);
        form.append("host", data.info.host);
        form.append("file", file);
        this.$http
          .post(data.info.host, form, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(() => {
            const icon = data.info.host + "/" + data.info.dir + "/" + filename 
            const params = {
              icon: icon
            };
            this.$http
              .post("/user/updataIcon", params)
              .then(res => {
                Toast("修改成功");
                this.$store.commit('user/SET_ICON',icon)
              })
              .catch(error => {
                Toast(error.message);
              });
          });
      });
      return false;
    }
  }
};
</script>
<style lang="scss" scoped>
.userInfo-page {
  .van-uploader {
    width: 100%;
    /deep/ .van-uploader__input-wrapper {
      width: 100%;
    }
  }
  .van-cell {
    align-items: center;
  }
  .head-img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: #eee;
  }
}
</style>
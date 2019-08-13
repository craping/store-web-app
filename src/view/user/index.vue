<template>
  <div>
    <div class="user-root-test">
      <van-col span="0" style="width:100%;height:100%;">
        <van-icon name="chat-o" size="2em" style="float:right" />
      </van-col>
      <van-row class="user-test" type="flex">
        <van-col span="7">
          <van-image round class="user-image" src="https://img.yzcdn.cn/vant/cat.jpeg" />
        </van-col>
        <van-col span="7" style="margin-top:6%;">
          <label style="font-size:23px;">15074013265</label>
          <van-goods-action-button type="warning" text="会员等级" @click="onClickButton" />
        </van-col>
      </van-row>
      <div class="user-panel">
        <van-row class="user-test-chide" type="flex">
          <van-col
            span="2.5"
            style="font-size: 15px;text-align:center;margin-top:8px;margin-left:15px;"
          >
            <label>升级</label>
          </van-col>
          <van-col span="5">
            <label>
              <van-goods-action-button type="warning" text="会员等级" @click="onClickButton" />
            </label>
          </van-col>
          <van-col span="8" style="margin-left:6px;margin-top:7px;">
            <label style="font-size: 15px; text-align: center;">享受更多权益</label>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="user-souyi">
      <van-row class="user-test" type="flex" justify="center" gutter="20">
        <van-col span="7">
          <label>25.25</label>
        </van-col>
        <van-col span="7">
          <label>25</label>
        </van-col>
        <van-col span="7">
          <label>362.23</label>
        </van-col>
      </van-row>
      <van-row class="user-test" type="flex" justify="center" gutter="20">
        <van-col span="7">
          <label>累计收益(元)</label>
        </van-col>
        <van-col span="8">
          <label>未到账余额(元)</label>
        </van-col>
        <van-col span="7">
          <label>我的团队</label>
        </van-col>
      </van-row>
    </div>
    <div class="user-row-links">
      <div style="padding: 10px 15px 0px 15px;">
        <van-row type="flex" justify="space-between">
          <van-col span="5">
            <label style="font-size: 15px; text-align:center;">订单中心</label>
          </van-col>
          <van-col span="12">
            <a href style="font-size:77%;float:right;">查看全部订单></a>
          </van-col>
        </van-row>
      </div>
      <van-row class="user-links" type="flex" justify="space-around">
        <van-col span="6">
          <van-icon name="pending-payment" />待付款
        </van-col>
        <van-col span="6">
          <van-icon name="records" />待发货
        </van-col>
        <van-col span="6">
          <van-icon name="tosend" />待收货
        </van-col>
        <van-col span="6">
          <van-icon name="logistics" />已发货
        </van-col>
        <van-col span="6">
          <van-icon name="logistics" />退款/售后
        </van-col>
      </van-row>
    </div>

    <div class="user-row-links">
      <div style="padding: 10px 15px 0px 15px;">
        <label style="font-size: 15px; text-align: center;">我的服务</label>
      </div>
      <van-row class="user-links">
        <van-col span="6">
          <van-icon name="gift"  @click="adders"/>收货地址
        </van-col>
        <van-col span="6">
          <van-icon name="star" />收藏
        </van-col>
        <van-col span="6">
          <van-icon name="setting" />设置
        </van-col>
        <van-col span="6">
          <van-icon name="friends" />客服
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { Row, Col, Icon, Cell, CellGroup, Uploader, Image, Panel } from "vant";
import { GoodsAction, GoodsActionIcon, GoodsActionButton } from "vant"; 

export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Uploader.name]: Uploader,
    [Image.name]: Image,
    [Panel.name]: Panel,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton.name]: GoodsActionButton
  },
  methods: {

    adders:function(){
       alert("4444")
       this.$router.push({name:'adderss'});
    }
  },

  data() {
    return {
      fileList: [{ url: "https://img.yzcdn.cn/vant/cat.jpeg" }]
    };
  }
};
</script>

<style lang="less">
.user {
  &-poster {
    display: block;
  }

  &-group {
    margin-bottom: 15px;
  }

  &-image {
    width: 25%;
    height: 25%;
  }

  &-row-links {
    margin-top: 10%;
    width: 90%;
    margin-left: 4.5%;
    background: #fff;
    border-radius: 15px 15px 15px 15px;
  }

  &-root-test {
    width: 100%;
    background: red;
    border-radius: 0 0 30px 30px;
  }
  &-panel {
    width: 90%;
    height: 200%;
    background: yellow;
    margin-left: 4.5%;
    border-radius: 15px 15px 0 0;
  }
  &-goods-action-button {
    width: 100%;
    height: 25%;
  }

  &-souyi {
    width: 90%;
    margin-left: 4.5%;
    background: #fff;
    border-radius: 0 0 15px 15px;
  }

  &-test-chide {
    margin-top: 10%;
    .label {
      font-size: 15px;
    }
  }

  &-test {
    width: 100%;
    padding: 15px 0;
    text-align: center;
    .van-image {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    .van-icon {
      display: block;
      font-size: 24px;
    }
  }
}
</style>


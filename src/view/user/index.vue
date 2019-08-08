<template>
  <div>
    <div class="user-root-test">
    <van-col span="0" style="width:100%;height:100%;">
      <van-icon name="chat-o" size="2em" style="float:right" />
    </van-col>
    <van-row class="user-test">
      <van-col span="6" style="margin-left:15px">
        <van-image round class="user-image" src="https://img.yzcdn.cn/vant/cat.jpeg" />
      </van-col>
      <van-col span="6">
        <van-row class="user-test-chide">
          <label style="font-size: 23px;">15074013265</label>
          <van-goods-action-button type="warning" text="会员等级" @click="onClickButton" />
        </van-row>
      </van-col>
    </van-row>
    <div class="user-panel">
        <van-row class="user-test-chide">
           <van-col span="6">
           <label style="font-size: 15px; text-align: center;">升级</label>
           </van-col>
           <van-col span="6">
           <label><van-goods-action-button type="warning" text="会员等级" @click="onClickButton" /></label>
           </van-col>
           <van-col span="6">
          <label style="font-size: 15px; text-align: center;">享受更多权益</label>
           </van-col>
        </van-row> 
      </div>
    </div>

<div class="user-row-links">
  <div>
     <label style="font-size: 15px; text-align: center;">升级</label>
  </div>
   <van-row class="user-links">
      <van-col span="4">
        <van-icon name="pending-payment" />待付款
      </van-col>
      <van-col span="4">
        <van-icon name="records" />待接单
      </van-col>
      <van-col span="4">
        <van-icon name="tosend" />待发货
      </van-col>
      <van-col span="4">
        <van-icon name="logistics" />已发货
      </van-col>
      <van-col span="4">
        <van-icon name="logistics" />已发货
      </van-col>
      <van-col span="4">
        <van-icon name="logistics" />已发货
      </van-col>
    </van-row>
    </div>
   
<div class="user-row-links">
  <div>
     <label style="font-size: 15px; text-align: center;">我的服务</label>
  </div>
   <van-row class="user-links">
      <van-col span="6">
        <van-icon name="pending-payment" />待付款
      </van-col>
      <van-col span="6">
        <van-icon name="records" />待接单
      </van-col>
      <van-col span="6">
        <van-icon name="tosend" />待发货
      </van-col>
      <van-col span="6">
        <van-icon name="logistics" />已发货
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

  &-row-links{
    margin-top: 15px;
    padding: 19px;
    width: 80%;
    margin-left: 23px;
    background: red;
    border-radius:30px 30px 30px 30px;
  }

  &-root-test{
     background: red;
     border-radius:0 0 30px 30px;  
  }
  &-panel{
    width: 90%;
    height: 200%;
    background: yellow;
    margin-left: 20px;
    border-radius:15px 15px 0 0;  
    
  }
  &-goods-action-button {
    width: 100%;
    height: 25%;
  }

  &-test-chide {
    margin-top: 16px;
    .label {
      font-size: 15px;
    }
  }

  &-test {
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

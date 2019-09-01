<template>
  <van-row class="applyrefund">
    <van-nav-bar
      fixed
      :z-index="100"
      title="申请退款"
      left-text="返回"
      right-text
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="proInfo">
      <van-card desc="描述信息" title="商品标题" thumb="https://img.yzcdn.cn/vant/t-thirt.jpg"/>
    </div>
    <div class="refundStatus">
      <van-cell-group>
        <van-cell
          title="物流状态"
          :value="$route.params.refund == 'hasPro'?refundStatusName[0]:refundStatusName[1]"
        />
        <van-cell title="退款原因" value="请选择" :label="selectedReason" is-link @click="selectReason"/>
      </van-cell-group>
    </div>
    <div class="refundStatus">
      <van-cell-group>
        <van-field error label="退款金额" :placeholder="`￥${proMoney}`" disabled/>
        <van-field v-model="refundSpec" label="退款说明" placeholder="选填"/>
      </van-cell-group>
    </div>
    <div class="refundStatus">
      <van-cell-group>
        <van-cell title="上传凭证"/>
        <van-cell>
          <van-uploader
            v-model="fileList"
            :max-count="3"
            multiple
            :preview-image="true"
            :after-read="afterRead"
          />
        </van-cell>
      </van-cell-group>
    </div>
    <van-action-sheet v-model="showReason" :actions="actions" @select="onSelectReason"/>
    <div class="confirm">
      <van-button type="danger" size="large">提交</van-button>
    </div>
  </van-row>
</template>
<script>
import Vue from 'vue'
import storeScroller from '@/components/store-scroller'
import storeCard from '@/components/store-card'
import {
  AddressList,
  Tab,
  Tabs,
  NavBar,
  Card,
  Button,
  Tag,
  Row,
  Toast,
  Icon,
  ActionSheet,
  Cell,
  CellGroup,
  Field,
  Uploader
} from 'vant'
Vue.use(NavBar)
  .use(AddressList)
  .use(Tab)
  .use(Tabs)
  .use(Card)
  .use(Button)
  .use(Tag)
  .use(Row)
  .use(Toast)
  .use(Icon)
  .use(ActionSheet)
  .use(Cell)
  .use(CellGroup)
  .use(Field)
  .use(Uploader)
export default {
  name: 'applyrefund',
  components: {
    storeScroller,
    storeCard
  },
  data() {
    return {
      refundStatusName: ['已收到货', '未收到货'],
      actions: [
        { name: '颜色不好看' },
        { name: '衣服尺寸太小了' },
        { name: '没钱了' }
      ],
      showReason: false,
      showExpressInfo: [],
      toggleShowName: '展开',
      isHide: true,
      selectedReason: '原因详情',
      proMoney: 100,
      refundSpec: '',
      fileList: [{ url: 'https://img.yzcdn.cn/vant/cat.jpeg' }]
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

    /*************点击弹出原因弹框事件*********/
    selectReason() {
      this.showReason = true
    },

    /************原因选择事件*********/
    onSelectReason(item) {
      this.selectedReason = item.name
      this.showReason = false
    },

    /***********上传图片事件*********/
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file)

      let files = this.dataURLtoFile(file)
      let formData = new FormData()
      formData.append('file', files)
      console.log('xxxfiles', files)
      console.log('xxx', formData)
    },

    /***********将base64转换为文件*********/
    dataURLtoFile(file) {
      var arr = file.content.split(','),
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], file.file.name, {
        type: file.file.type
      })
    }
  }
}
</Script>
<style lang="scss" scoped>
.applyrefund {
  padding-top: 46px;
  display: flex;
  flex-direction: column;
  .proInfo {
    .van-card {
      background: #fff;
    }
  }
  .refundStatus {
    margin-top: 10px;
  }
  .confirm {
    position: fixed;
    width: 100%;
    bottom: 0;
  }
}
</style>

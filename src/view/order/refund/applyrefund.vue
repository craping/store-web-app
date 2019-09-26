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
            :before-read="beforeRead"
            :preview-image="true"
            :after-read="afterRead"
          />
        </van-cell>
      </van-cell-group>
    </div>
    <van-action-sheet v-model="showReason" :actions="actions" @select="onSelectReason"/>
    <div class="confirm">
      <van-button type="danger" size="large" @click="doSumbit">提交</van-button>
    </div>
  </van-row>
</template>
<script>
import Vue from 'vue'
import storeScroller from '@/components/store-scroller'
import storeCard from '@/components/store-card'
import { UUID } from '@/utils/util'
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

    /******提交事件****** */
    doSumbit() {
      const params = {
        orderId: this.$route.query.pid,
        orderSn: '0',
        orderItemId: '0',
        quantity: '1',
        receiveStatus: this.$route.query.receiveStatus,
        reason: this.selectedReason,
        description: this.refundSpec,
        proofPics: this.fileList
      }
      this.$http
        .post('/orderReturnApply/create', params)
        .then(data => {})
        .catch(error => {
          console.log(error)
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
  .van-nav-bar {
    padding-top: 0;
  }
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

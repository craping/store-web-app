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
    <div class="proInfo" v-for="item in orderInfo" :key="item.id">
      <van-card
        :num="item.productQuantity"
        :price="item.productPrice"
        :title="item.productName"
        :thumb="item.productPic"
      >
        <div slot="tags">
          <van-tag
            plain
            type="danger"
            v-for="(item,index) in JSON.parse(item.productAttr)"
            :key="index"
          >{{item.key}}:{{item.value}}</van-tag>
        </div>
      </van-card>
    </div>
    <div class="refundStatus">
      <van-cell-group>
        <van-cell
          title="物流状态"
          :value="checkInfoList.confirmStatus == '1'? refundStatusName[0]: refundStatusName[1]"
        />
        <van-cell title="退款原因" value="请选择" :label="selectedReason" is-link @click="selectReason"/>
      </van-cell-group>
    </div>
    <div class="refundStatus">
      <van-cell-group>
        <van-field error label="退款金额" :placeholder="`￥${proMoney}`" disabled/>
        <van-field v-model="refundSpec" label="退款说明" placeholder="选填"/>
        <!-- <van-field
          v-show="checkInfoList.confirmStatus == '1'"
          label="物流公司"
          v-model="express.company"
          placeholder="请输入物流公司(必填)"
        />
        <van-field
          v-show="checkInfoList.confirmStatus == '1'"
          label="物流单号"
          v-model="express.expressNo"
          placeholder="请输入物流单号(必填)"
        />-->
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
import { mapState } from 'vuex'
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
      actions: [],
      showReason: false,
      showExpressInfo: [],
      toggleShowName: '展开',
      isHide: true,
      selectedReason: '请选择原因详情',
      reasonId: '',
      proMoney: 100,
      refundSpec: '',
      fileList: []
      // express: {
      //   company: '',
      //   expressNo: ''
      // }
    }
  },
  computed: {
    ...mapState({
      checkInfoList: state => state.order.checkInfoList
    }),
    orderInfo() {
      return this.checkInfoList.orderItemList
    }
  },
  created() {
    console.log('dd', this.$route)
    this.getReasonList()
  },
  methods: {
    /*************返回点击事件***************/
    onClickLeft() {
      this.$router.go(-1)
    },

    /*****获取原因时间**** */
    getReasonList() {
      this.$http
        .post('/orderReturnApply/getReasons')
        .then(data => {
          this.actions = data.info
        })
        .catch(error => {
          console.log(error)
        })
    },

    /*************点击弹出原因弹框事件*********/
    selectReason() {
      this.showReason = true
    },

    /************原因选择事件*********/
    onSelectReason(item) {
      this.selectedReason = item.name
      this.reasonId = item.id
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
      if (!this.reasonId) {
        Toast.success('请选择退款原因')
        return
      }

      const { orderInfo, checkInfoList } = this

      // if (
      //   checkInfoList.confirmStatus == 1 &&
      //   !this.express.expressNo &&
      //   !this.express.company
      // ) {
      //   Toast.success('请填写物流信息')
      //   return
      // }
      const quantity = orderInfo.reduce((pre, next) => {
        return pre + next.productQuantity
      }, 0)

      // if (checkInfoList.confirmStatus == 1) {
      //   const expressParams = {
      //     returnId: orderInfo[0].orderId,
      //     deliverySn: this.express.expressNo,
      //     deliveryCompany: this.express.company
      //   }
      //   this.$http
      //     .post('/orderReturnApply/insertDeliveryInfo', expressParams)
      //     .catch(error => {
      //       console.log(error)
      //     })
      // }

      const params = {
        orderId: orderInfo[0].orderId,
        orderSn: checkInfoList.orderSn,
        orderItemId: checkInfoList.id,
        quantity,
        receiveStatus: checkInfoList.confirmStatus,
        reasonId: this.reasonId,
        reason: this.selectedReason,
        description: this.refundSpec,
        proofPics: this.fileList
      }
      this.$http
        .post('/orderReturnApply/create', params)
        .then(() => {
          this.$router.push('/afterSale')
        })
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

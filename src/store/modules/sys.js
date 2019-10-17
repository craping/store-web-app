import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { getClient } from '@/utils/util'

export default {
  namespaced: true,
  state: {
    client: getClient(),
    config: {
      //VIP启用状态
      VIP_ENABLE:false,
      //提现手续费
      ACCOUNT_FEE:0,
      //最低提现申请金额
      ACCOUNT_MIN_WITHDRAW:100,
      //关于我们-用户协议
      ABOUT_TERMS:"",
      //关于我们-隐私政策
      ABOUT_PRIVACY:"",
      //关于我们-版本号
      ABOUT_VERSION:"1.0.0"
    },
    // 客服未读消息数
    unread:""
  },
  getters: {
    shareEnable: (state, getters, rootState) => {
      return state.client == 1 && rootState.user.isLogin;
    },
    vipEnable: (state, getters, rootState) => {
      return state.client == 1 && state.config.VIP_ENABLE && rootState.user.isVip;
    }
  },
  mutations: {
    SET_CONFIG(state, config) {
      state.config = config;
    },
    SET_VIPENABLE(state, enable) {
      console.log("invoke SET_VIPENABLE:"+enable)
      state.config.VIP_ENABLE = enable;
    },
    SET_UNREAD(state, unread) {
      state.unread = unread
    },
  },
  actions: {
    getSysConfig({ commit }) {
      return new Promise((resolve, reject) => {
        request
          .post('config/getSystemConfigInfo')
          .then(data => {
            commit('SET_CONFIG', data.info)
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  }
}

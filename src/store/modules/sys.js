import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { getClient } from '@/utils/util'

export default {
  namespaced: true,
  state: {
    client: getClient(),
    config: {
      VIP_ENABLE:false,
      ACCOUNT_FEE:0,
      ABOUT_TERMS:"",
      ABOUT_PRIVACY:""
    },
    // 客服未读消息数
    unread:""
  },
  getters: {
    shareEnable: (state, getters, rootState) => {
      return /* state.client == 1 &&  */rootState.user.isLogin;
    },
    vipEnable: (state, getters, rootState) => {
      return /* state.client == 1 &&  */state.config.VIP_ENABLE && rootState.user.isVip;
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

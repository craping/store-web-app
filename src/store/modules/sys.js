import request from '@/utils/request'
import { getClientId, getClient } from '@/utils/util'

export default {
  namespaced: true,
  state: {
    clientId: getClientId(),
    client: getClient(),
    config: {
      //VIP启用状态
      VIP_ENABLE:0,
      //提现手续费
      ACCOUNT_FEE:0,
      //最低提现申请金额
      ACCOUNT_MIN_WITHDRAW:100,
      //关于我们-用户协议
      ABOUT_TERMS:"",
      //关于我们-隐私政策
      ABOUT_PRIVACY:"",
      //关于我们-版本号
      ABOUT_VERSION:"1.0.0",
      //同等级会员佣金返点率
      COMMISSION_EQUAL_RATE:0.02,
      //同等级会员佣金返点层级
      COMMISSION_EQUAL_LEVEL:1
    },
    // 客服未读消息数
    unread:""
  },
  getters: {
    shareEnable: (state, getters, rootState) => {
      return state.clientId == 1 && rootState.user.isLogin;
    },
    vipEnable: (state, getters, rootState) => {
      return state.clientId == 1 && state.config.VIP_ENABLE && rootState.user.isVip;
    }
  },
  mutations: {
    SET_CONFIG(state, config) {
      for (const key in config) {
        if (config.hasOwnProperty(key) && key != "ABOUT_VERSION") {
          const value = config[key];
          const parseValue = parseFloat(value);
          config[key] = isNaN(parseValue)?(value=="true"||value=="false"?value=="true":value):parseValue;
        }
      }
      console.log(config)
      state.config = config;
    },
    SET_CONFIG_SINGLE(state, sysConfig) {
      const value = sysConfig.configValue;
      const parseValue = parseFloat(value);
      if(sysConfig.configCode != "ABOUT_VERSION"){
        state.config[sysConfig.configCode] = isNaN(parseValue)?(value=="true"||value=="false"?value=="true":value):parseValue;
      } else {
        state.config[sysConfig.configCode] = sysConfig.configValue;
      }
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

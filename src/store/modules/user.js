import request from '../../utils/request'
import { getToken } from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    platform: navigator.userAgent.includes('Html5Plus') ? 1 : 0,
    userInfo: {},
    // 用户是否登录
    isLogin: false,
    // 用户是否是会员
    isVip: false,
    // 系统是否开启屏蔽
    isShield: false
  },
  mutations: {
    SET_USERINFO(state, userInfo) {
      state.userInfo = userInfo
      state.isLogin = true
    }
  },
  actions: {
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        if (!getToken()) {
          reject()
          return
        }
        request
          .get('user/getUserInfo', {})
          .then(data => {
            commit('SET_USERINFO', data.info)
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

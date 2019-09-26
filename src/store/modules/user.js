import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { getClient } from '@/utils/util'

export default {
  namespaced: true,
  state: {
    client: getClient(),
    userInfo: {},
    // 用户是否登录
    isLogin: false,
    // 用户是否是会员
    isVip: false,
    // 系统是否开启安全模式
    isSafe: false
  },
  mutations: {
    SET_USERINFO(state, userInfo) {
      state.userInfo = userInfo
      state.isLogin = true
      state.isVip = userInfo.amsAccount.orders > 0;
    },
    SET_SAFE(state, safe) {
      console.log("invoke SET_SAFE:"+safe)
      state.isSafe = safe;
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

import request from '@/utils/request'
import { getToken, removeToken} from '@/utils/auth'
import { getClient } from '@/utils/util'

export default {
  namespaced: true,
  state: {
    userInfo: {},
    // 用户是否登录
    isLogin: false,
    // 用户是否是会员
    isVip: false,
    // 绑定的手机号
    bindPhone: '',
    // 登录前的路由地址
    beforePath: '/main/home',
  },
  getters: {
    bindPhoneStr: state => {
      if (state.bindPhone) {
        return state.bindPhone.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")
      }
      return ''
    }
  },
  mutations: {
    SET_USERINFO(state, userInfo) {
      state.userInfo = userInfo
      state.bindPhone = userInfo.umsMember.phone || ''
      state.isLogin = true
      state.isVip = userInfo.amsAccoun && userInfo.amsAccount.orders > 0
    },
    SET_BEFOREPATH(state, data) {
      state.beforePath = data
    },
    SET_NICKNAME(state, data) {
      state.userInfo.umsMember.nickname = data
    },
    SET_PHONE(state, data) {
      state.userInfo.umsMember.phone = data
    },
    SET_ICON(state, data) {
      state.userInfo.umsMember.icon = data
    },
  },
  actions: {
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        if (!getToken()) {
          reject()
          return
        }
        request
          .post('user/getUserInfo', {})
          .then(data => {
            commit('SET_USERINFO', data.info)
            resolve(data)
          })
          .catch(error => {
            removeToken()
            reject(error)
          })
      })
    },
  }
}

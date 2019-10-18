import request from '../../utils/request'

export default {
  namespaced: true,
  state: {
    orderList: [],
    totalNum: null,
    confirmOrderList: [],
    checkInfoList: {}
  },
  mutations: {
    SET_ORDER_LIST(state, content) {
      state.orderList = [...content, ...state.orderList]
    },
    SET_TOTALNUM(state, content) {
      state.totalNum = content
    },
    SET_ORDER_LIST_INIT(state) {
      state.orderList = []
    },
    SET_CONFIRM_ORDER_LIST(state, content) {
      state.confirmOrderList = content
    },
    SET_CHECK_INFO_LIST(state, content) {
      state.checkInfoList = content
    }
  },
  actions: {
    getOrderList({ commit }, data) {
      return new Promise((resolve, reject) => {
        request
          .post('/order/getOrderList', data)
          .then(data => {
            commit('SET_ORDER_LIST', data.info)
            commit('SET_TOTALNUM', data.totalnum)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

import request from '../../utils/request'

export default {
  namespaced: true,
  state: {
    orderList: [],
    confirmOrderList: [],
    checkInfoList: {}
  },
  mutations: {
    SET_ORDER_LIST(state, content) {
      state.orderList = [...content, ...state.orderList]
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
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

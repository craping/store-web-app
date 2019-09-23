import request from '../../utils/request'

export default {
  namespaced: true,
  state: {
    orderList: [],
    confirmOrderList: []
  },
  mutations: {
    SET_ORDER_LIST(state, content) {
      state.orderList = content
    },
    SET_CONFIRM_ORDER_LIST(state, content) {
      state.confirmOrderList = content
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

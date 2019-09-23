import request from '../../utils/request'

export default {
  namespaced: true,
  state: {
    orderList: []
  },
  mutations: {
    SET_ORDER_LIST(state, content) {
      state.orderList = content
    }
  },
  actions: {
    getOrderList({ commit }) {
      return new Promise((resolve, reject) => {
        request
          .post('/order/getOrderList', {})
          .then(data => {
            commit('SET_ORDER_LIST', data.info)
            console.log(data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

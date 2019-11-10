import request from '../../utils/request'

export default {
  namespaced: true,
  state: {
    /* orderList: [], // 订单列表
    totalNum: 0, // 总条数
    totalPage: 0, // 总页数 */
    confirmOrderList: [],
    checkInfoList: {}
  },
  mutations: {
    /* SET_ORDER_LIST(state, content) {
      state.orderList = [...state.orderList, ...content]
    },
    SET_TOTALNUM(state, content) {
      state.totalNum = content
    },
    SET_ORDER_LIST_INIT(state) {
      state.orderList = []
    },*/
    SET_CONFIRM_ORDER_LIST(state, content) {
      state.confirmOrderList = content
    },
    SET_CHECK_INFO_LIST(state, content) {
      state.checkInfoList = content
    }
  },
  actions: {
    // 获取订单列表
    /* getOrderList({ commit }, data) {
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
    } */
  }
}

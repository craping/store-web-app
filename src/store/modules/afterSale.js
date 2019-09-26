import request from '../../utils/request'

export default {
  namespaced: true,
  state: {
    afterSaleList: []
  },
  mutations: {
    SET_AFTER_SALE_LIST(state, content) {
      state.afterSaleList = content
    }
  },
  actions: {
    getAfterSaleList({ commit }, data) {
      return new Promise((resolve, reject) => {
        request
          .post('/orderReturnApply/list', data)
          .then(data => {
            commit('SET_AFTER_SALE_LIST', data.info)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

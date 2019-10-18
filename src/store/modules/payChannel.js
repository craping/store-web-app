import request from '../../utils/request'

export default {
  namespaced: true,
  state: {
    payChannel: []
  },
  mutations: {
    SET_PAY_CHANNEL(state, content) {
      state.payChannel = content
    }
  },
  actions: {
    getPayChannel({ commit }) {
      return new Promise((resolve, reject) => {
        request
          .post('trade/channelList', {})
          .then(data => {
            commit('SET_PAY_CHANNEL', data.info)
            resolve(data.info)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

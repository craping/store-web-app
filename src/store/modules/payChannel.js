import request from '../../utils/request'
import { getClient } from '@/utils/util'

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
          .post('trade/channelList', {
            clientId: getClient()
          })
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

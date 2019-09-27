import request from '../../utils/request'

export default {
  namespaced: true,
  state: {
    addressInfo: {},
    addressList: []
  },
  mutations: {
    SET_ADDRESSINFO(state, data) {
      state.addressInfo = data
    },
    SET_ADDRESSLIST(state, data) {
      state.addressList = data
    }
  },
  actions: {
    setAddressInfo({ commit }, data) {
      commit('SET_ADDRESSINFO', data)
    },
    getAddressList({ commit }) {
      return new Promise((resolve, reject) => {
        request.post("/address/getUserInfoAddress", {}).then(data => {
          commit('SET_ADDRESSLIST', data.info)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}
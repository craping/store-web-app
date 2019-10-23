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
        request
          .post('/address/getUserInfoAddress', {})
          .then(data => {
            commit('SET_ADDRESSLIST', data.info)
            const defaultAddres = data.info.filter(item => {
              return item.isDefault == 1
            })
            commit('SET_ADDRESSINFO', defaultAddres[0])
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

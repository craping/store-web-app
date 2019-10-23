import request from '../../utils/request'

export default {
  namespaced: true,
  state: {
    addressInfo: {},
    addressList: [],
    isNeedDefault: true
  },
  mutations: {
    SET_ADDRESSINFO(state, data) {
      state.addressInfo = data
    },
    SET_ADDRESSLIST(state, data) {
      state.addressList = data
    },
    SET_IS_NEED_DEFAULT(state, data) {
      state.isNeedDefault = data
    }
  },
  actions: {
    setAddressInfo({ commit }, data) {
      commit('SET_ADDRESSINFO', data)
      commit('SET_IS_NEED_DEFAULT', false)
    },
    getAddressList({ commit, state }) {
      return new Promise((resolve, reject) => {
        request
          .post('/address/getUserInfoAddress', {})
          .then(data => {
            commit('SET_ADDRESSLIST', data.info)
            if (state.isNeedDefault) {
              const defaultAddres = data.info.filter(item => {
                return item.isDefault == 1
              })
              commit('SET_ADDRESSINFO', defaultAddres[0])
            }

            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

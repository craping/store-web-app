import request from '../../utils/request'

export default {
  namespaced: true,
  state: {
    adderssInfo:{},
  },
  mutations: {
    SET_ADDRESSINFO(state, data){
      state.adderssInfo = data
    }
  },
  actions: {
    setAddressInfo({ commit }, data) {
        commit('SET_ADDRESSINFO', data)
    }
  }
}
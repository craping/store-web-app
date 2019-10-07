import request from '@/utils/request'

export default {
  namespaced: true,
  state: {
    itemList: []
  },
  mutations: {
    SET_CARTLIST(state, data) {
      state.itemList = data
    }
  },
  actions: {
    getCartList({ commit }) {
      return new Promise((resolve, reject) => {
        request.post("/cartItem/getCartItemList", {}).then(data => {
          commit('SET_CARTLIST', data.info)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}
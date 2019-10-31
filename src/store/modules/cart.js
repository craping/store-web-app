import request from '@/utils/request'

export default {
  namespaced: true,
  state: {
    itemList: []
  },
  getters: {
    cartNum: state => {
      return state.itemList.length?state.itemList.length:"";
    },
    disableList: state => {
      return state.itemList.filter(ele => ele.publishStatus==0);
    },
    normalList: state => {
      return state.itemList.filter(ele => ele.publishStatus==1);
    },
  },
  mutations: {
    SET_CARTLIST(state, data) {
      state.itemList = data
    },
    ADD_CARTLIST(state, item) {
      state.itemList.push(item);
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
import request from '../../utils/request'

export default {
  namespaced: true,
  state: {
    content:{
      advertiseList:[],
      hotProductList:[]
    }
  },
  mutations: {
    SET_CONTENT(state, content){
      state.content = content;
    }
  },
  actions: {
    content({commit}){
      return new Promise((resolve, reject) => {
        request.get("/home/content", {}).then(response => {
          commit('SET_CONTENT', response.data.info)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
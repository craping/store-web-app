import request from '../../utils/request'

export default {
  namespaced: true,
  state: {
    platform:navigator.userAgent.includes("Html5Plus")?1:0,
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
        request.get("/home/content", {}).then(data => {
          commit('SET_CONTENT', data.info)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
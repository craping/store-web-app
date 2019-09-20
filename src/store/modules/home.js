import request from '../../utils/request'

export default {
  namespaced: true,
  state: {
    platform:navigator.userAgent.includes("Html5Plus")?1:0,
    content:{
      advertiseList:[],
      hotProductList:[]
    },
    search:{
      info:[]
    }
  },
  mutations: {
    SET_CONTENT(state, content){
      state.content = content;
    },
    SET_SEARCH(state, search){
      state.search = search;
    }
  },
  actions: {
    content({commit}){
      return new Promise((resolve, reject) => {
        request.get("home/content", {}).then(data => {
          commit('SET_CONTENT', data.info)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    search({commit}, params){
      return new Promise((resolve, reject) => {
        request.post("product/list", params).then(data => {
          commit('SET_SEARCH', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
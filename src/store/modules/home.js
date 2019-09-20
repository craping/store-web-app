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
      data:{
        info:[]
      },
      params:{
        keyword:"",
        pageNum:1,
        pageSize:5
      }
    }
  },
  mutations: {
    SET_CONTENT(state, content){
      state.content = content;
    },
    SET_SEARCH(state, data){
      state.search.data = data;
    },
    SET_SEARCH_KEYWORD(state, keyword){
      state.search.params.keyword = keyword;
      state.search.params.pageNum = 1;
      state.search.data = {info:[]};
    },
    SET_SEARCH_NEXT(state){
      state.search.params.pageNum++;
    }
  },
  actions: {
    content({commit}){
      return new Promise((resolve, reject) => {
        request.get("home/content", {}).then(data => {
          commit('SET_CONTENT', data.info)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    search({state, commit}){
      return new Promise((resolve, reject) => {
        request.post("product/list", {
          keyword:state.search.params.keyword,
          pageNum:state.search.params.pageNum,
          pageSize:state.search.params.pageSize
        }).then(data => {
          data.info = state.search.data.info.concat(data.info);
          commit('SET_SEARCH', data);
          if(data.totalpage > state.search.params.pageNum)
            commit('SET_SEARCH_NEXT');
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
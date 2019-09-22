import request from '../../utils/request'

export default {
  namespaced: true,
  state: {
    platform:navigator.userAgent.includes("Html5Plus")?1:0,
  },
  mutations: {
  },
  actions: {
  }
}
import Vue from 'vue'
import Vuex from 'vuex'
import home from './modules/home'
import address from './modules/address'
import bill from './modules/bill'
import bankCard from './modules/bankCard'
import order from './modules/order'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    home,
    address,
    bill,
    bankCard,
    order
  }
})

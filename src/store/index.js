import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import home from './modules/home'
import address from './modules/address'
import bill from './modules/bill'
import bankCard from './modules/bankCard'
import order from './modules/order'
import afterSale from './modules/afterSale'
import cart from './modules/cart'
import comments from './modules/comments'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    home,
    address,
    bill,
    bankCard,
    order,
    afterSale,
    cart,
    comments
  }
})

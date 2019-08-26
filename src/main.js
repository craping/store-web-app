import Vue from 'vue';
import App from './App';
import { Lazyload } from 'vant';
import router from './router';
import store from './store';
import VueScroller from './components/vue-scroller'
import request from './utils/request'

Vue.use(VueScroller);
Vue.use(Lazyload);
Vue.prototype.$http = request
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

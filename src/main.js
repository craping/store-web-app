import Vue from 'vue';
import App from './App';
import { Lazyload } from 'vant';
import router from './router';
import store from './store';
import VueScroller from './components/vue-scroller'

Vue.use(VueScroller);
Vue.use(Lazyload);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

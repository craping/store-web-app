import Vue from 'vue';
import App from './App';
import { Lazyload } from 'vant';

import {router} from './router';

Vue.use(Lazyload);

new Vue({
  router,
  el: '#app',
  render: h => h(App)
});

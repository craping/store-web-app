import Vue from 'vue';
import App from './App';
import { Lazyload } from 'vant';
import router from './router';
import store from './store';
import Icon from 'vue-svg-icon/Icon.vue';
import VueScroller from './components/vue-scroller'
import request from './utils/request'

Vue.component('icon', Icon);
Vue.use(VueScroller);
Vue.use(Lazyload);
Vue.prototype.$http = request

var onPlusReady = function (callback, context = this) {
  if (window.plus) {
    callback.call(context);
  } else {
    document.addEventListener('plusready', callback.bind(context));
  }
};
Vue.mixin({
  beforeCreate: function () {
    onPlusReady(function () {
      this.plusReady = true;
    }, this);
  },
  methods: {
    onPlusReady: onPlusReady
  }
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

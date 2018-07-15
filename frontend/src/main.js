import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import i18n from './lang/lang';

/* eslint-disable no-new */
export const app = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: {App},
  template: '<App/>'
});

import Vue from 'vue';
import axios from 'axios';
import App from '@/App.vue';
import store from '@/store';
import router from '@/router';
import './styles.less';

Vue.prototype.$http = axios;
const token = localStorage.getItem('token');
if (token) {
  Vue.prototype.$http.defaults.headers.common.Authorization = token;
}
Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');

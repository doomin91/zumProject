import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store';
import VueCookies from 'vue-cookies';

/* element ui */
import lang from 'element-ui/lib/locale/lang/ko';
import locale from 'element-ui/lib/locale';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { ElementTiptapPlugin } from 'element-tiptap';
import 'element-tiptap/lib/index.css';

/* web site style */
import './assets/css/main.css'

Vue.use(ElementUI);
Vue.use(ElementTiptapPlugin);
locale.use(lang);

Vue.use(VueCookies);
Vue.$cookies.config('60m');
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

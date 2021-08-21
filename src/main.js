import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import vueAxios from 'vue-axios'
import axios from 'axios'
import vueCoockies from 'vue-cookies';

Vue.config.performance = true
Vue.use(vueCoockies)
Vue.use(vueAxios, axios)
Vue.use(CoreuiVue)
Vue.prototype.$log = console.log.bind(console)

new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})

import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI, { Message, MessageBox } from 'element-ui'
import ZkTable from 'vue-table-with-tree-grid'

// import axios from 'axios'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.$confirm

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(ZkTable)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI, { Message, MessageBox } from 'element-ui'
import ZkTable from 'vue-table-with-tree-grid'

// import axios from 'axios'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

// 富文本编辑器插件
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.$confirm

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(ZkTable)
Vue.use(VueQuillEditor)
Vue.filter('dateFormate', function (originValue) {
  const date = new Date(originValue)
  const y = date.getFullYear()
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDay() + '').padStart(2, '0')

  const hh = (date.getHours() + '').padStart(2, '0')
  const mm = (date.getMinutes() + '').padStart(2, '0')
  const ss = (date.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App'
import api from './utils/api'
import { showErrorTips } from './utils'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$api = api
Vue.prototype.$showErrorTips = showErrorTips

const app = new Vue({
  ...App
})
app.$mount()

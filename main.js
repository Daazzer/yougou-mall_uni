import Vue from 'vue'
import App from './App'
import api from './utils/api'
import { showErrorTips } from './utils'
import yougou from './utils/storage'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$api = api
Vue.prototype.$showErrorTips = showErrorTips
Vue.prototype.$yougou = yougou

const app = new Vue({
  ...App
})
app.$mount()

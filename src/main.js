import Vue from 'vue'
import App from './App'
import { plug } from '@/utils/request'
Vue.config.productionTip = false
Vue.use(plug)
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()

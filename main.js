import Vue from 'vue'
import App from './App'

import store from './store'
import { http } from '@/config/common.js'

Vue.prototype.$http = http
Vue.prototype.$store = store
Vue.config.productionTip = false

import uView from 'uview-ui'
Vue.use(uView)

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()

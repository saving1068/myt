import 'babel-polyfill'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import './icons'

import ElementUI from 'element-ui'

import Echarts  from 'echarts'

import 'normalize.css/normalize.css'
// import 'element-ui/lib/theme-chalk/index.css'
import './styles/custom/index.css'
import './styles/custom/element.scss'
import './styles/index.scss'

import * as filters from './filters' // global filters
import './router/router_intercept'

import Loading from '@/components/Loading'


Vue.config.productionTip = false
Vue.prototype.$echarts = Echarts 

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})


Vue.use(ElementUI)
Vue.use(Loading)

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入moment
import moment from 'moment'
// 导入antdesign
import '../src/plugins/antdesign.js'

// 导入全局样式表
import './assets/css/global.less'

// 导入axios
import axios from 'axios'
//配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8080/api'
// 把axios挂载的VUE的原型对象上
Vue.prototype.$http = axios

// 定义全局时间戳过滤器
Vue.filter('dateformat', function(input, fmtstring) {
  // 使用momentjs这个日期格式化类库实现日期的格式化功能
  return moment(input).format(fmtstring)
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import './_theme/theme.scss'

import Vue from 'vue'
import Buefy from 'buefy'
import ShortKey from 'vue-shortkey'

import BaseIcon from './_common/BaseIcon'

import App from './App.vue'

Vue.component('base-icon', BaseIcon)

Vue.use(Buefy, {
  defaultIconComponent: 'base-icon',
  defaultIconPack: 'fas',
})
Vue.use(ShortKey)

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')

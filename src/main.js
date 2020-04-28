import "buefy/dist/buefy.css";

import Vue from "vue";
import Buefy from "buefy";
import ShortKey from "vue-shortkey";

import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(Buefy);
Vue.use(ShortKey);
new Vue({
  render: h => h(App)
}).$mount("#app");

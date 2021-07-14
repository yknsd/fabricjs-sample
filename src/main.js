import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./routes";
import { image, required, size } from 'vee-validate/dist/rules';
import {
  ValidationProvider,
  extend
} from 'vee-validate';

Vue.component('ValidationProvider', ValidationProvider);

extend('image', image);
extend('required', required);
extend('size', size);

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')

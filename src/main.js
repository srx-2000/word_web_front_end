// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import VueRouter from "vue-router"
import VueAxios from 'vue-axios'
import "bootstrap"

Vue.use(ElementUI);
Vue.use(VueRouter);

// axios.defaults.baseURL = 'http://127.0.0.1:5000';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

Vue.config.productionTip = false;
axios.defaults.baseURL = 'http://localhost:5656';
Vue.use(VueAxios, axios);
Vue.use(ElementUI, {
  size: 'small'
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | 单词本`;
  const role = localStorage.getItem('ms_uid');
  if (!role && to.path !== '/signIn' && to.path !== "/signUp") {
    next('/signIn');
  }else {
    next()
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})

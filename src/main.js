import Vue from 'vue'
import App from './App.vue'
import DataFuncPortfolio from './assets/data/dataFuncPortfolio.json';
Vue.prototype.$getdata = DataFuncPortfolio;
Vue.prototype.$nullmsg = '등록하지 않았습니다.';
console.log(DataFuncPortfolio);
new Vue({
  el: '#app',
  render: h => h(App)
})
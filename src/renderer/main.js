import Vue from 'vue'

import { ipcRenderer } from 'electron';

import App from './App';
import router from './router';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

Vue.use(Buefy);

// import FileBrowserTree from 'vue-file-tree'; // './FileBrowserTree.vue';
// Vue.component('file-browser-tree', FileBrowserTree);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

export const messageBus = new Vue({
});

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')


ipcRenderer.on('file', (event, fn, stat) => {
  messageBus.$emit('file', fn, stat);
});

ipcRenderer.on('directory', (event, fn, stat) => {
  messageBus.$emit('directory', fn, stat);
});

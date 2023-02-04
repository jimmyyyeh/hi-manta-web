import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router';
import App from './App.vue';
import '@/assets/css/app.scss';

const app = createApp(App);
app.use(VueAxios, axios);
app.use(router);
app.mount('#app');

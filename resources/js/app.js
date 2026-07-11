import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // <-- Vue otomatis mencari folder/router/index.js

createApp(App)
    .use(router)
    .mount('#app');

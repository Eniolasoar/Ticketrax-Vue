import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import './style.css'
import '../src/components/styles/dashboard.css'
import '../src/components/styles/ticket.css'

const app = createApp(App);
app.use(router);
app.mount("#app");

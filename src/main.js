import { createApp } from "vue";
// import "./style.css";
import "./index.css";
import App from "./App.vue";

// Element-plus imports
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// Overrite element-plus css
import "./styles/element-plus/custom.scss";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// Pinia import
import { createPinia } from "pinia";

import router from "./router";
import "./mock/index";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(ElementPlus);
app.use(pinia);

// pinia.use(
//   createPersistedState({
//     auto: true,
//     storage: localStorage,
//   })
// );

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");

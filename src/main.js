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

// MockJS is only loaded in development. Importing it in production would patch
// XMLHttpRequest globally and silently shadow real backend calls.
if (import.meta.env.DEV) {
  await import("./mock/index");
}

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(ElementPlus);
app.use(pinia);

// Hydrate Pinia from the persisted "myStore" entry in localStorage. We do this
// manually because pinia-plugin-persistedstate isn't installed in this project
// — apis.js writes to localStorage on login, and this block reads it back so
// store.role / store.isAdmin are correct after a page refresh.
import { myStore, usePermissionStore } from "./stores/index";
try {
  const raw = localStorage.getItem("myStore");
  if (raw) {
    const persisted = JSON.parse(raw);
    myStore().$patch(persisted);
    if (Array.isArray(persisted.permissions)) {
      usePermissionStore().setFromTokens(persisted.permissions);
    }
  }
} catch (e) {
  console.warn("Failed to hydrate Pinia from localStorage", e);
}

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");

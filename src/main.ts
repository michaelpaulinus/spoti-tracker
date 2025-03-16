import "./assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import mitt from "mitt";
import Toast, { type PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const vuetify = createVuetify({
	theme: {
		defaultTheme: "dark",
	},
	components,
	directives,
});

const emitter = mitt();
const pinia = createPinia().use(piniaPluginPersistedstate);

const app = createApp(App).use(vuetify).use(pinia).use(router).use(Toast);

app.config.globalProperties.$emitter = emitter;

app.mount("#app");

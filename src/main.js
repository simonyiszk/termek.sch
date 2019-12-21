import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import Main from "./components/Main.vue";
import Room from "./components/Room.vue";
import Item from "./components/Item.vue";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  { path: "/eszkoz", component: Item },
  { path: "/terem", component: Room },
  { path: "/", component: Main }
];

const router = new VueRouter({
  routes,
  mode: "history"
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");

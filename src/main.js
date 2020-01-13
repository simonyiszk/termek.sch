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

const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.';
// eslint-disable-next-line no-unused-vars
Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` is the component hierarchy trace
  if (msg === ignoreWarnMessage) {
    msg = null;
    vm = null;
    trace = null;
  }
}
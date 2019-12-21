import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import HelloWorld from "./components/HelloWorld.vue";
import Room from "./components/Room.vue";
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  { path: "/foo", component: HelloWorld },
  { path: "/bar", component: HelloWorld },
  { path: "/", component: Room }
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

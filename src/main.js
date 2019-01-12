import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";

import "@fortawesome/fontawesome-free/css/all.min.css";

const fb = require("./firebase-config.js");

Vue.config.productionTip = false;

let app = "";

fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount("#app");
  }
});

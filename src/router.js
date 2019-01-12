import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login.vue";
import PictureGrid from "@/views/PictureGrid.vue";
import UploadPictures from "@/views/UploadPictures.vue";

import firebase from "firebase/app";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "*",
      redirect: "/"
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/",
      name: "home",
      component: PictureGrid,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/upload",
      name: "upload",
      component: UploadPictures,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next("/login");
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router;

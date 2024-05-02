import { createRouter, createWebHistory } from "vue-router";
import Login from "@/components/Login.vue";
import Home from "@/components/Home.vue";
import Artists from "@/components/Artists.vue";
import Tracks from "@/components/Tracks.vue";
import tokenStore from "@/stores/tokenStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
    },
    {
      path: "/artists/:timeRange",
      name: "Artists",
      component: Artists,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/tracks/:timeRange",
      name: "Tracks",
      component: Tracks,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const store = tokenStore();

  if (
    to.matched.some((value) => value.meta.requiresAuth) &&
    !store.isAuthenticated
  ) {
    next("/");
  } else {
    next();
  }
});

export default router;

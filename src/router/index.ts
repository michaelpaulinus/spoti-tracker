import { createRouter, createWebHistory } from "vue-router";
import Login from "@/components/Login.vue";
import Home from "@/components/Home.vue";
import Artists from "@/components/Artists.vue";
import Tracks from "@/components/Tracks.vue";

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
    },
    {
      path: "/tracks/:timeRange",
      name: "Tracks",
      component: Tracks,
      props: true,
    },
  ],
});

export default router;

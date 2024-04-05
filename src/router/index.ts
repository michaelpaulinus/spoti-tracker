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
      path: "/artists",
      name: "Artists",
      component: Artists,
    },
    {
      path: "/tracks",
      name: "Tracks",
      component: Tracks,
    },
  ],
});

export default router;

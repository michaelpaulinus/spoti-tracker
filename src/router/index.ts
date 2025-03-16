import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import Artists from "@/views/Artists.vue";
import Tracks from "@/views/Tracks.vue";
import Recommendations from "@/views/Recommendations.vue";
import useTokenStore from "@/stores/token";

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
		{
			path: "/recommendations/:timeRange",
			name: "Recommendations",
			component: Recommendations,
			props: true,
			meta: {
				requiresAuth: true,
			},
		},
	],
});

router.beforeEach((to, _from, next) => {
	const store = useTokenStore();

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

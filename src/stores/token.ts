import { defineStore } from "pinia";

type State = {
	token: string;
	isAuthenticated: boolean;
};

const useTokenStore = defineStore("token", {
	persist: true,
	state: (): State => ({
		token: "",
		isAuthenticated: false,
	}),
	actions: {
		setToken(token: string) {
			this.token = token;
			this.isAuthenticated = true;
		},
		clearToken() {
			this.token = "";
			this.isAuthenticated = false;
		},
	},
	getters: {
		getToken(): string {
			return this.token;
		},
	},
});

export default useTokenStore;

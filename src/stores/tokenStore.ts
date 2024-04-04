import { defineStore } from "pinia";

type State = {
  token: string;
};

export const tokenStore = defineStore("tokenStore", {
  state: (): State => ({
    token: "",
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    clearToken() {
      this.token = "";
    },
  },
  getters: {
    getToken(): string {
      return this.token;
    },
  },
});

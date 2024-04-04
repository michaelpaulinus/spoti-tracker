import { defineStore } from "pinia";
import type User from "@/interfaces/User";

type State = {
  user: User;
};

export const userStore = defineStore("userStore", {
  state: (): State => ({
    user: {
      id: "",
      display_name: "",
      email: "",
      product: "",
      uri: "",
      token: "",
    },
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
    },
    clearUser() {
      this.user = {} as User;
    },
  },
  getters: {
    getUser(): User {
      return this.user;
    },
  },
});

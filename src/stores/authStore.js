// src/stores/authStore.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    async login(username, password) {
      // Replace this with your actual login logic
      if (username === "user" && password === "password") {
        this.user = { username };
        this.isAuthenticated = true;
        return true;
      } else {
        return false;
      }
    },
    logout() {
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});

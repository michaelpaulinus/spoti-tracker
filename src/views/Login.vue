<script lang="ts">
import getUserProfile from "@/helpers/getUserProfile";
import type User from "@/models/User";
import useTokenStore from "@/stores/token";
import useUserStore from "@/stores/user";

export default {
  data() {
    return {
      accessToken: "",
      user: {} as User,
    };
  },

  setup() {
    sessionStorage.clear();
    const store = useTokenStore();
    store.clearToken();
    const uStore = useUserStore();
    uStore.clearUser();

    return {
      store,
      uStore,
    };
  },

  methods: {
    async spotifyAuth() {
      const clientId = import.meta.env.VITE_CLIENT_ID;
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        redirectToAuthCodeFlow(clientId);
      } else {
        this.accessToken = await getAccessToken(clientId, code);
        this.store.setToken(this.accessToken);
        this.user = await getUserProfile(this.accessToken);
        this.uStore.setUser(this.user);
      }

      async function redirectToAuthCodeFlow(clientId: string) {
        const verifier = generateCodeVerifier(128);
        const challenge = await generateCodeChallenge(verifier);

        localStorage.setItem("verifier", verifier);

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
        params.append("scope", "user-top-read");
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);

        document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
      }

      function generateCodeVerifier(length: number) {
        let text = "";
        let possible =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

      async function generateCodeChallenge(codeVerifier: string) {
        const data = new TextEncoder().encode(codeVerifier);
        const digest = await window.crypto.subtle.digest("SHA-256", data);
        return btoa(
          String.fromCharCode.apply(null, [...new Uint8Array(digest)])
        )
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      }

      async function getAccessToken(
        clientId: string,
        code: string
      ): Promise<string> {
        const verifier = localStorage.getItem("verifier");

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
        params.append("code_verifier", verifier!);

        const result = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        });

        const { access_token } = await result.json();

        return access_token;
      }
    },
  },
};
</script>

<template>
  <div style="display: flex; justify-content: center; align-items: center">
    <v-btn
      rounded
      append-icon="mdi-spotify"
      color="green"
      size="large"
      @click="spotifyAuth()"
      >Login</v-btn
    >
  </div>
</template>

<template>
  <div style="display: flex; justify-content: center; align-items: center">
    <v-btn rounded @click="spotifyAuth()">Login</v-btn>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import { tokenStore } from "@/stores/tokenStore";

export default {
  data() {
    return {
      returnedAccessToken: "",
    };
  },

  setup() {},

  methods: {
    async spotifyAuth() {
      const clientId = "e466a474a3de4973ba5fa2b9e4cd9909";
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        redirectToAuthCodeFlow(clientId);
      } else {
        const accessToken = await getAccessToken(clientId, code);
        const store = tokenStore();
        store.setToken(accessToken);
        this.returnedAccessToken = accessToken;
        const profile = await fetchProfile(accessToken);
        console.log(accessToken);
        console.log(profile);
      }

      async function redirectToAuthCodeFlow(clientId: string) {
        const verifier = generateCodeVerifier(128);
        const challenge = await generateCodeChallenge(verifier);

        localStorage.setItem("verifier", verifier);

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", "http://localhost:5173/home");
        params.append("scope", "user-read-email user-top-read");
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
        params.append("redirect_uri", "http://localhost:5173/home");
        params.append("code_verifier", verifier!);

        const result = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        });

        const { access_token } = await result.json();

        return access_token;
      }

      async function fetchProfile(token: string): Promise<any> {
        const result = await fetch("https://api.spotify.com/v1/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        return await result.json();
      }
    },
  },
};
</script>

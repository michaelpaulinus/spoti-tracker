<template>
  <div style="display: flex; justify-content: center; align-items: center">
    <v-btn rounded @click="spotifyAuth()">Login</v-btn>
  </div>
  <div>
    <v-btn rounded @click="getTopArtists()">Display Artists</v-btn>
    <v-btn rounded @click="getTopTracks()">Display Tracks</v-btn>
  </div>

  <div>
    <h1>My Top Artists</h1>
    <v-row style="display: flex; justify-content: space-evenly">
      <v-col
        cols="2"
        v-for="(item, index) in myTopArtists"
        style="display: flex; justify-content: center"
      >
        <v-card width="200" rounded elevation="12">
          <v-img :src="item.images[0].url"></v-img>
          <v-card-title style="display: flex; justify-content: center">
            {{ item.name }}</v-card-title
          >
        </v-card>
      </v-col>
    </v-row>
  </div>

  <div>
    <h1>My Top Tracks</h1>
    <div>{{ myTopTracks }}</div>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import { tokenStore } from "@/stores/tokenStore";
import UserTopItems from "@/services/UserTopItems";
import type Artist from "@/interfaces/Artist";

export default {
  data() {
    return {
      returnedAccessToken: "",
      defaultTimeRange: "long_term",
      myTopArtists: [] as Artist[],
      myTopTracks: [] as Artist[],
    };
  },

  setup() {},

  methods: {
    getTopArtists() {
      UserTopItems.fetchTopArtists(
        this.returnedAccessToken,
        this.defaultTimeRange
      )
        .then((res) => {
          this.myTopArtists = res.data.items;
        })
        .catch((err) => console.log(err));
    },

    getTopTracks() {
      UserTopItems.fetchTopTracks(
        this.returnedAccessToken,
        this.defaultTimeRange
      )
        .then((res) => {
          this.myTopTracks = res.data;
        })
        .catch((err) => console.log(err));
    },

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
        params.append("redirect_uri", "http://localhost:5173/");
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
        params.append("redirect_uri", "http://localhost:5173/");
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

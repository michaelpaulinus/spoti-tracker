<template>
  <div style="display: flex; justify-content: center">
    <v-tabs v-model="tab">
      <v-tab value="short_term" @click="changeTimePeriod()">6 weeks</v-tab>
      <v-tab value="medium_term" @click="changeTimePeriod()">6 months</v-tab>
      <v-tab value="long_term" @click="changeTimePeriod()">1 year</v-tab>
    </v-tabs>
  </div>

  <br />

  <div style="margin: 0 auto">
    <h1>My Top Artists</h1>
    <br />
    <div>
      <v-row style="display: flex; justify-content: space-between">
        <v-col
          cols="2"
          v-for="(item, index) in myTopArtists"
          style="display: flex; justify-content: center"
        >
          <v-slide-x-transition>
            <v-card width="240" rounded elevation="12" :loading="isLoading">
              <v-img :src="item.images[1].url"></v-img>
              <v-card-title style="display: flex; justify-content: center">
                {{ item.name }}
              </v-card-title>
            </v-card>
          </v-slide-x-transition>
        </v-col>
      </v-row>
    </div>

    <br />

    <div>
      <v-data-table-virtual
        :items="myTopArtists"
        :headers="artistHeaders"
        fixed-header
        :loading="isLoading"
      >
      </v-data-table-virtual>
    </div>
  </div>
</template>

<script lang="ts">
import type Artist from "@/interfaces/Artist";
import UserTopItems from "@/services/UserTopItems";
import { tokenStore } from "@/stores/tokenStore";
import HeaderBar from "@/components/HeaderBar.vue";

export default {
  data() {
    return {
      defaultTimeRange: "long_term",
      myTopArtists: [] as Artist[],
      myTopTracks: [] as Artist[],
      returnedAccessToken: "",
      accessTokenStore: tokenStore(),
      clientId: "e466a474a3de4973ba5fa2b9e4cd9909",
      artistHeaders: [
        { title: "Name", value: "name" },
        { title: "Followers", value: "followers.total" },
        { title: "Popularity", value: "popularity" },
      ],
      tab: "long_term",
      isLoading: true,
    };
  },
  async mounted() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code") || "";
    this.returnedAccessToken = await this.getAccessToken(this.clientId, code);

    this.getTopArtists();
  },
  methods: {
    changeTimePeriod() {
      this.defaultTimeRange = this.tab;
      this.getTopArtists();
    },
    getTopArtists() {
      UserTopItems.fetchTopArtists(
        this.returnedAccessToken,
        this.defaultTimeRange
      )
        .then((res) => {
          this.myTopArtists = res.data.items;
          console.log(this.myTopArtists);
        })
        .catch((err) => console.log(err));

      this.isLoading = false;
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

    async getAccessToken(clientId: string, code: string): Promise<string> {
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
    },
  },
};
</script>

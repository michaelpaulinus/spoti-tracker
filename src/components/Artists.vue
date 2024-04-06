<template>
  <div style="display: flex; justify-content: center">
    <v-tabs v-model="tab" slider-color="green">
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
            <v-card
              width="240"
              rounded
              elevation="12"
              :loading="isLoading"
              :href="item.external_urls.spotify"
              target="_blank"
            >
              <v-img
                :src="item.images[1].url"
                cover
                height="140"
                width="220"
              ></v-img>
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

export default {
  data() {
    return {
      defaultTimeRange: "long_term",
      myTopArtists: [] as Artist[],
      accessToken: "",
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
    this.accessToken = this.accessTokenStore.getToken;
    this.getTopArtists();
  },
  methods: {
    changeTimePeriod() {
      this.defaultTimeRange = this.tab;
      this.getTopArtists();
    },

    getTopArtists() {
      UserTopItems.fetchTopArtists(this.accessToken, this.defaultTimeRange)
        .then((res) => {
          this.myTopArtists = res.data.items;
          console.log(this.myTopArtists);
        })
        .catch((err) => console.log(err));

      this.isLoading = false;
    },
  },
};
</script>

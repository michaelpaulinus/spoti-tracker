<template>
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

  <v-card></v-card>
</template>

<script lang="ts">
import type Artist from "@/interfaces/Artist";
import UserTopItems from "@/services/UserTopItems";

export default {
  data() {
    return {
      defaultTimeRange: "long_term",
      myTopArtists: [] as Artist[],
      myTopTracks: [] as Artist[],
      returnedAccessToken: "",
    };
  },
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
  },
};
</script>

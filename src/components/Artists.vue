<template>
  <div style="margin: 0 auto">
    <h1>My Top Artists</h1>
    <br />
    <div>
      <v-row style="display: flex; justify-content: space-between">
        <v-col
          cols="2"
          v-for="(item, index) in myTopArtists.slice(0, 5)"
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
                height="148"
                width="148"
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
    <br />

    <div>
      <h1>My Top 10 Artists</h1>
      <br />
      <v-data-table-virtual
        :items="myTopArtists"
        :headers="artistHeaders"
        fixed-header
        :loading="isLoading"
      >
        <template v-slot:item.followers.total="{ item }">
          {{ formatNumbers(item.followers.total) }}
        </template>
      </v-data-table-virtual>
    </div>
  </div>
</template>

<script lang="ts">
import type Artist from "@/interfaces/Artist";
import getTopArtists from "@/helpers/getTopArtists";
import { tokenStore } from "@/stores/tokenStore";

export default {
  data() {
    return {
      defaultTimeRange: "short_term",
      myTopArtists: [] as Artist[],
      accessToken: "",
      accessTokenStore: tokenStore(),
      artistHeaders: [
        { title: "Name", value: "name" },
        { title: "Genres", value: "genres[0]" },
        { title: "Followers", value: "followers.total" },
        { title: "Popularity", value: "popularity" },
      ],
      isLoading: true,
    };
  },

  created() {
    this.accessToken = this.accessTokenStore.getToken;
  },
  props: {
    timeRange: {
      type: String,
      required: true,
    },
  },

  mounted() {
    if (this.timeRange) {
      this.changeTimePeriod(this.timeRange);
    }
    (this as any).$emitter.on("new_time_range", (timeRange: string) =>
      this.changeTimePeriod(timeRange)
    );
  },

  methods: {
    async changeTimePeriod(time: string) {
      this.defaultTimeRange = time;
      this.isLoading = true;
      this.myTopArtists = await getTopArtists(this.accessToken, time);
      this.isLoading = false;
    },

    formatNumbers(num: number) {
      return num.toLocaleString("en-US");
    },
  },
};
</script>

<style>
tbody tr:nth-of-type(even) {
  background-color: #373535;
}
</style>

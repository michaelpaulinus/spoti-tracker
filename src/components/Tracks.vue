<template>
  <div style="margin: 0 auto">
    <h1>My Top Tracks</h1>
    <br />
    <div>
      <v-row style="display: flex; justify-content: space-between">
        <v-col
          cols="2"
          v-for="(item, index) in myTopTracks.slice(0, 5)"
          style="display: flex; justify-content: center"
        >
          <v-slide-x-transition>
            <v-card
              width="240"
              rounded
              elevation="12"
              :loading="isLoading"
              target="_blank"
              :href="item.external_urls.spotify"
              @mouseover="previewTrack(item.preview_url)"
              @mouseout="stopTrack()"
            >
              <v-img :src="item.album.images[0].url" cover></v-img>
              <v-card-title style="display: flex; justify-content: center">
                {{ item.name }}
              </v-card-title>
              <v-card-subtitle style="display: flex; justify-content: center">
                {{ getArtistNames(item.artists) }}</v-card-subtitle
              >
            </v-card>
          </v-slide-x-transition>
        </v-col>
      </v-row>
    </div>

    <br />

    <div>
      <v-data-table-virtual
        :items="myTopTracks"
        :headers="trackHeaders"
        fixed-header
        :loading="isLoading"
      >
        <template v-slot:item.artists="{ item }">
          <td>
            {{ getArtistNames(item.artists) }}
          </td>
        </template>
      </v-data-table-virtual>
    </div>
  </div>
</template>

<script lang="ts">
import type Artist from "@/interfaces/Artist";
import type Track from "@/interfaces/Track";
import getTopTracks from "@/helpers/getTopTracks";
import { tokenStore } from "@/stores/tokenStore";

export default {
  data() {
    return {
      defaultTimeRange: "long_term",
      myTopArtists: [] as Artist[],
      myTopTracks: [] as Track[],
      accessToken: "",
      accessTokenStore: tokenStore(),
      artistHeaders: [
        { title: "Name", value: "name" },
        { title: "Followers", value: "followers.total" },
        { title: "Popularity", value: "popularity" },
      ],
      trackHeaders: [
        { title: "Name", value: "name" },
        { title: "Artists", value: "artists" },
        { title: "Album", value: "album.name" },
        { title: "Popularity", value: "popularity" },
      ],
      isLoading: true,
      currentAudio: null as HTMLAudioElement | null,
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
      this.myTopTracks = await getTopTracks(this.accessToken, time);
      this.isLoading = false;
    },

    previewTrack(trackUrl: string | null) {
      this.stopTrack();

      if (trackUrl !== null) {
        this.currentAudio = new Audio(trackUrl);
        this.currentAudio.play();
      }
    },

    stopTrack() {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
    },

    getArtistNames(artists: Artist[]) {
      return artists.map((a) => a.name).join(", ");
    },
  },
};
</script>

<style>
tbody tr:nth-of-type(even) {
  background-color: #373535;
}
</style>

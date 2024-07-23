<script lang="ts">
import type Artist from "@/models/Artist";
import type Track from "@/models/Track";
import getRecommendations from "@/helpers/getRecommendations";
import useTokenStore from "@/stores/token";
import TrackCard from "@/components/TrackCard.vue";

export default {
  components: {
    TrackCard,
  },

  props: {
    timeRange: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      defaultTimeRange: "short_term",
      myRecommendedTracks: [] as Track[],
      accessToken: "",
      accessTokenStore: useTokenStore(),
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

  methods: {
    async changeTimePeriod(time: string) {
      this.defaultTimeRange = time;
      this.isLoading = true;
      this.myRecommendedTracks = await getRecommendations(
        this.accessToken,
        time
      );
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

  created() {
    this.accessToken = this.accessTokenStore.getToken;
  },

  mounted() {
    if (this.timeRange) {
      this.changeTimePeriod(this.timeRange);
    }
    (this as any).$emitter.on("new_time_range", (timeRange: string) =>
      this.changeTimePeriod(timeRange)
    );
  },
};
</script>

<template>
  <div class="container">
    <div>
      <h1>My Top Tracks</h1>
      <br />
      <div class="track-container">
        <TrackCard
          v-for="track in myRecommendedTracks.slice(0, 5)"
          :track="track"
          :is-loading="isLoading"
        />
      </div>
    </div>

    <br />
    <br />

    <div>
      <h1>My Top 10 Recommended Tracks</h1>
      <br />
      <v-data-table-virtual
        :items="myRecommendedTracks"
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

<style>
tbody tr:nth-of-type(even) {
  background-color: #373535;
}

.container {
  display: flex;
  flex-direction: column;
}

.track-container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

@media only screen and (max-width: 600px) {
  .track-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }
}
</style>

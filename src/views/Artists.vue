<script lang="ts">
import type Artist from "@/models/Artist";
import getTopArtists from "@/helpers/getTopArtists";
import tokenStore from "@/stores/tokenStore";
import ArtistCard from "@/components/ArtistCard.vue";

export default {
  components: {
    ArtistCard,
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
      <h1>My Top Artists</h1>
      <br />
      <div class="artist-container">
        <ArtistCard
          v-for="artist in myTopArtists.slice(0, 5)"
          :artist="artist"
          :is-loading="isLoading"
        />
      </div>
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

<style scoped>
tbody tr:nth-of-type(even) {
  background-color: #373535;
}

.container {
  display: flex;
  flex-direction: column;
}

.artist-container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
</style>

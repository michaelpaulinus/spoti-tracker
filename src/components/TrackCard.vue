<script lang="ts">
import type Track from "@/models/Track";
import type Artist from "@/models/Artist";
import type { PropType } from "vue";

export default {
  props: {
    track: {
      type: Object as PropType<Track>,
      required: true,
    },

    isLoading: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      currentAudio: null as HTMLAudioElement | null,
    };
  },

  methods: {
    getArtistNames(artists: Artist[]) {
      return artists.map((a) => a.name).join(", ");
    },

    stopTrack() {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
    },

    previewTrack(trackUrl: string | null) {
      this.stopTrack();

      if (trackUrl !== null) {
        this.currentAudio = new Audio(trackUrl);
        this.currentAudio.play();
      }
    },
  },
};
</script>

<template>
  <v-card
    width="240"
    rounded
    elevation="12"
    :loading="isLoading"
    :href="track.external_urls.spotify"
    target="_blank"
    @mouseover="previewTrack(track.preview_url)"
    @mouseout="stopTrack()"
  >
    <v-img :src="track.album.images[0].url" cover />
    <div class="text-truncate text-center">
      <v-card-title>
        {{ track.name }}
      </v-card-title>
      <v-card-subtitle>
        {{ getArtistNames(track.artists) }}
      </v-card-subtitle>
    </div>
  </v-card>
</template>

<script lang="ts">
import type Artist from "@/models/Artist";
import type { PropType } from "vue";

export default {
  props: {
    artist: {
      type: Object as PropType<Artist>,
      required: true,
    },

    isLoading: {
      type: Boolean,
      required: true,
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
    :href="artist.external_urls.spotify"
    target="_blank"
  >
    <v-img :src="artist.images[0].url" cover />
    <div class="text-truncate text-center">
      <v-card-title style="display: flex; justify-content: center">
        {{ artist.name }}
      </v-card-title>
    </div>
  </v-card>
</template>

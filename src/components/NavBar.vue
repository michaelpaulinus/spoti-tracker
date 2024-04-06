<template>
  <v-tabs v-model="tab">
    <v-tab value="short_term">6 weeks</v-tab>
    <v-tab value="medium_term">6 months</v-tab>
    <v-tab value="long_term">1 year</v-tab>
  </v-tabs>
</template>

<script lang="ts">
export default {
  data() {
    return {
      tab: "long_term",
    };
  },
};
</script>

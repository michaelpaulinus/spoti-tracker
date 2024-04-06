<template>
  <v-layout>
    <v-navigation-drawer>
      <v-list-item title="My Spotify Wrapped"></v-list-item>
      <v-divider></v-divider>
      <v-list-item link prepend-icon="mdi-home" @click="navigateToHome()"
        >Home</v-list-item
      >
      <v-list-item
        link
        prepend-icon="mdi-account-music"
        @click="navigateToArtists()"
        >Artists</v-list-item
      >
      <v-list-item link prepend-icon="mdi-music" @click="navigateToTracks()"
        >Tracks</v-list-item
      >

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="navigateToLogin()"> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar style="display: flex; justify-content: center">
      <v-tabs v-model="tab">
        <v-tab value="short_term" @click="changeTimePeriod()">6 weeks</v-tab>
        <v-tab value="medium_term" @click="changeTimePeriod()">6 months</v-tab>
        <v-tab value="long_term" @click="changeTimePeriod()">1 year</v-tab>
      </v-tabs>
    </v-app-bar>
  </v-layout>
</template>

<script lang="ts">
import router from "@/router";

export default {
  data() {
    return {
      tab: "long_term",
    };
  },

  methods: {
    navigateToLogin() {
      router.push("/");
    },

    navigateToHome() {
      router.push("/home");
    },

    navigateToArtists() {
      router.push("/artists");
    },

    navigateToTracks() {
      router.push("/tracks");
    },

    changeTimePeriod() {},
  },
};
</script>

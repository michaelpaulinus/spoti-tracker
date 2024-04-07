<template>
  <v-layout>
    <v-navigation-drawer v-if="isAuth()">
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
          <v-btn block variant="outlined" @click="navigateToLogin()">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar v-if="isAuth()">
      <v-tabs v-model="tab" style="margin: 0 auto" slider-color="green">
        <v-tab value="short_term" @click="changeTimePeriod()">6 weeks</v-tab>
        <v-tab value="medium_term" @click="changeTimePeriod()">6 months</v-tab>
        <v-tab value="long_term" @click="changeTimePeriod()">1 year</v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main>
      <RouterView></RouterView>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import router from "@/router";
import { RouterLink, RouterView } from "vue-router";
import { tokenStore } from "@/stores/tokenStore";

export default {
  data() {
    return {
      tab: "long_term",
      accessTokenStore: tokenStore(),
    };
  },

  created() {},

  methods: {
    isAuth() {
      return this.accessTokenStore.isAuthenticated;
    },

    navigateToLogin() {
      router.push("/");
      this.accessTokenStore.clearToken();
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

    changeTimePeriod() {
      (this as any).$emitter.emit("new_time_range", this.tab);
    },
  },
};
</script>

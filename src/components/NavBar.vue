<script lang="ts">
import router from "@/router";
import { RouterLink, RouterView } from "vue-router";
import tokenStore from "@/stores/tokenStore";
import userStore from "@/stores/userStore";

export default {
  data() {
    return {
      tab: "short_term",
      pageTab: "home",
      accessTokenStore: tokenStore(),
      userTokenStore: userStore(),
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
      this.userTokenStore.clearUser();
    },

    navigateToHome() {
      router.push({ name: "Home" });
      this.pageTab = "home";
    },

    navigateToArtists() {
      router.push({ name: "Artists", params: { timeRange: this.tab } });
      this.pageTab = "artists";
    },

    navigateToTracks() {
      router.push({ name: "Tracks", params: { timeRange: this.tab } });
      this.pageTab = "tracks";
    },

    changeTimePeriod() {
      (this as any).$emitter.emit("new_time_range", this.tab);
    },
  },
};
</script>

<template>
  <v-layout>
    <v-navigation-drawer v-if="isAuth()">
      <v-list-item
        prepend-icon="mdi-account-circle"
        :title="userTokenStore.getUser.display_name"
        lines="two"
      ></v-list-item>
      <v-divider></v-divider>
      <v-tabs v-model="pageTab" slider-color="green" direction="vertical">
        <v-tab value="home" prepend-icon="mdi-home" @click="navigateToHome()"
          >Home</v-tab
        >
        <v-tab
          value="artists"
          prepend-icon="mdi-account-music"
          @click="navigateToArtists()"
          >Artists</v-tab
        >
        <v-tab
          value="tracks"
          prepend-icon="mdi-music"
          @click="navigateToTracks()"
          >Tracks</v-tab
        >
      </v-tabs>

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
        <v-tab value="short_term" @click="changeTimePeriod()">4 weeks</v-tab>
        <v-tab value="medium_term" @click="changeTimePeriod()">6 months</v-tab>
        <v-tab value="long_term" @click="changeTimePeriod()">1 year</v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main>
      <RouterView></RouterView>
    </v-main>
  </v-layout>
</template>

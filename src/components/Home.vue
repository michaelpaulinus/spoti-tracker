<script lang="ts">
import type Artist from "@/interfaces/Artist";
import type Track from "@/interfaces/Track";
import tokenStore from "@/stores/tokenStore";
import userStore from "@/stores/userStore";
import type User from "@/interfaces/User";
import getTopArtists from "@/helpers/getTopArtists";
import getTopTracks from "@/helpers/getTopTracks";
import getUserProfile from "@/helpers/getUserProfile";
import router from "@/router";

export default {
  data() {
    return {
      defaultTimeRange: "short_term",
      myTopArtists: [] as Artist[],
      myTopTracks: [] as Track[],
      accessToken: "",
      accessTokenStore: tokenStore(),
      user: {} as User,
      userTokenStore: userStore(),
      clientId: import.meta.env.VITE_CLIENT_ID,
      artistHeaders: [
        { title: "Name", value: "name" },
        { title: "Followers", value: "followers.total" },
        { title: "Popularity", value: "popularity" },
      ],
      trackHeaders: [
        { title: "Name", value: "name" },
        { title: "Artists", value: "artists[0].name" },
        { title: "Album", value: "album.name" },
        { title: "Popularity", value: "popularity" },
      ],
      isLoading: true,
      currentAudio: null as HTMLAudioElement | null,
    };
  },

  setup() {
    const store = tokenStore();
    const uStore = userStore();

    return {
      store,
      uStore,
    };
  },

  async created() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code") || "";

    if (code !== "") {
      this.accessToken = await this.getAccessToken(this.clientId, code);
      this.store.setToken(this.accessToken);
      this.user = await getUserProfile(this.accessToken);
      this.uStore.setUser(this.user);
      router.push("/home");
    } else {
      this.accessToken = this.accessTokenStore.getToken;
      this.user = this.userTokenStore.getUser;
    }

    this.isLoading = true;

    this.myTopArtists = await getTopArtists(
      this.accessToken,
      this.defaultTimeRange
    );

    this.myTopTracks = await getTopTracks(
      this.accessToken,
      this.defaultTimeRange
    );

    this.isLoading = false;
  },

  mounted() {
    (this as any).$emitter.on("new_time_range", (timeRange: string) =>
      this.changeTimePeriod(timeRange)
    );
  },

  methods: {
    async changeTimePeriod(time: string) {
      this.defaultTimeRange = time;
      this.isLoading = true;

      this.myTopArtists = await getTopArtists(
        this.accessToken,
        this.defaultTimeRange
      );

      this.myTopTracks = await getTopTracks(
        this.accessToken,
        this.defaultTimeRange
      );

      this.isLoading = false;
    },

    getArtistNames(artists: Artist[]) {
      return artists.map((a) => a.name).join(", ");
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

    async getAccessToken(clientId: string, code: string): Promise<string> {
      const verifier = localStorage.getItem("verifier");

      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
      params.append("code_verifier", verifier!);

      const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });

      const { access_token } = await result.json();

      return access_token;
    },
  },
};
</script>

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
                :href="item.external_urls.spotify"
                target="_blank"
                @mouseover="previewTrack(item.preview_url)"
                @mouseout="stopTrack()"
              >
                <v-img
                  :src="item.album.images[0].url"
                  cover
                  height="148"
                  width="148"
                ></v-img>
                <v-card-title style="display: flex; justify-content: center">
                  {{ item.name }}
                </v-card-title>
                <v-card-subtitle style="display: flex; justify-content: center">
                  {{ getArtistNames(item.artists) }}
                </v-card-subtitle>
              </v-card>
            </v-slide-x-transition>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

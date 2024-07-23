<script lang="ts">
import type Artist from "@/models/Artist";
import type Track from "@/models/Track";
import tokenStore from "@/stores/tokenStore";
import userStore from "@/stores/userStore";
import type User from "@/models/User";
import getTopArtists from "@/helpers/getTopArtists";
import getTopTracks from "@/helpers/getTopTracks";
import getUserProfile from "@/helpers/getUserProfile";
import router from "@/router";
import TrackCard from "@/components/TrackCard.vue";
import ArtistCard from "@/components/ArtistCard.vue";

export default {
  components: {
    ArtistCard,
    TrackCard,
  },

  setup() {
    const store = tokenStore();
    const uStore = userStore();

    return {
      store,
      uStore,
    };
  },

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
    };
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
};
</script>

<template>
  <div>
    <h1>My Top Artists</h1>
    <br />
    <div class="artist-and-track-container">
      <ArtistCard
        v-for="artist in myTopArtists.slice(0, 5)"
        :artist="artist"
        :is-loading="isLoading"
      />
    </div>

    <br />
    <br />

    <div>
      <h1>My Top Tracks</h1>
      <br />
      <div class="artist-and-track-container">
        <TrackCard
          v-for="track in myTopTracks.slice(0, 5)"
          :track="track"
          :is-loading="isLoading"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.artist-and-track-container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

@media only screen and (max-width: 600px) {
  .artist-and-track-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }
}
</style>

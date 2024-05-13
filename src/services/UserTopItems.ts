import type User from "@/models/User";
import type TopArtistsResponse from "@/models/TopArtists";
import type TopTracksResponse from "@/models/TopTracks";
import type Recommendations from "@/models/Recommendations";
import httpClient from "@/services/BaseHttpClient";
import getTopTracks from "@/helpers/getTopTracks";
import getTopArtists from "@/helpers/getTopArtists";

const limit = 10;

class UserTopItems {
  async fetchProfile(token: string) {
    return await httpClient.get<User>(`me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async fetchTopArtists(token: string, time_range: string) {
    return await httpClient.get<TopArtistsResponse>(
      `me/top/artists?time_range=${time_range}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async fetchTopTracks(token: string, time_range: string) {
    return await httpClient.get<TopTracksResponse>(
      `me/top/tracks?time_range=${time_range}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async fetchRecommendations(token: string, time_range: string) {
    const topTracks = await getTopTracks(token, time_range);
    const topTracksIds = topTracks.map((track) => track.id);
    const topArtists = await getTopArtists(token, time_range);
    const topArtistsIds = topArtists.map((artist) => artist.id);

    return await httpClient.get<Recommendations>(
      `recommendations?seed_tracks=${topTracksIds
        .slice(0, 2)
        .join(",")}&seed_artists=${topArtistsIds
        .slice(0, 3)
        .join(",")}&limit=${limit}&target_popularity=90`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export default new UserTopItems();

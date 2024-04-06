import type { TopArtistsResponse } from "@/interfaces/TopArtists";
import type { TopTracksResponse } from "@/interfaces/TopTracks";
import axios from "axios";

const limit = 10;

class UserTopItems {
  async fetchTopArtists(token: string, time_range: string) {
    return await axios.get<TopArtistsResponse>(
      `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async fetchTopTracks(token: string, time_range: string) {
    return await axios.get<TopTracksResponse>(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export default new UserTopItems();

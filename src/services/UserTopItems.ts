import type { TopArtistsResponse } from "@/interfaces/TopArtists";
import axios from "axios";

class UserTopItems {
  async fetchTopArtists(token: string, time_range: string) {
    return await axios.get<TopArtistsResponse>(
      `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async fetchTopTracks(token: string, time_range: string) {
    return await axios.get(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export default new UserTopItems();

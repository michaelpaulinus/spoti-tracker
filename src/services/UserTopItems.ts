import type { TopArtistsResponse } from "@/interfaces/TopArtists";
import type { TopTracksResponse } from "@/interfaces/TopTracks";
import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import toast from "@/common/toast";
import router from "@/router";

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 2000;
  },
  onRetry: (retryCount, error, requestConfig) => {
    toast.warning(
      `Gateway timeout. Re-attempting in ${retryCount * 2} seconds`
    );
  },
});

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    toast.error(error.message);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    let errorMessage: string;

    switch (error.response?.status) {
      case 401:
        router.push("/");
        errorMessage =
          "Unauthorized: The request requires user authentication.";
        break;
      case 403:
        errorMessage =
          "Forbidden: The server understood the request but refuses to authorize it.";
        break;
      case 404:
        errorMessage =
          "Not Found: The requested resource could not be found on the server.";
        break;
      case 500:
        errorMessage =
          "Internal Server Error: The server encountered an unexpected condition that prevented it from fulfilling the request.";
        break;
      case 503:
        errorMessage =
          "Service Unavailable: The server is currently unable to handle the request due to temporary overloading or maintenance of the server.";
        break;
      case 504:
        errorMessage = `Gateway timeout.`;
        break;
      default:
        errorMessage = "An error occurred. Please try again later.";
        break;
    }

    toast.error(errorMessage);
  }
);

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

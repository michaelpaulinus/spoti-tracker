import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import toast from "@/common/toast";
import router from "@/router";

const config = {
  baseURL: "https://api.spotify.com/v1",
};

const httpClient = axios.create(config);

axiosRetry(httpClient, {
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

httpClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    toast.error(error.message);
  }
);

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    let errorMessage: string;

    switch (error.response?.status) {
      case 400:
        router.push("/");
        errorMessage =
          "Bad Request: The request was invalid. Please sign-in again.";
        break;
      case 401:
        router.push("/");
        errorMessage =
          "Unauthorized: The request requires user authentication. Please sign-in again.";
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
        errorMessage =
          "Gateway Timeout: The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server it accessed in attempting to complete the request.";
        break;
      default:
        errorMessage = "An error occurred. Please try again later.";
        break;
    }

    toast.error(errorMessage);
  }
);

export default httpClient;

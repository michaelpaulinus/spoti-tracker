import UserTopItems from "@/services/UserTopItems";

export default function getTopTracks(accessToken: string, time: string) {
  UserTopItems.fetchTopTracks(accessToken, time)
    .then((res) => {
      return res.data.items;
    })
    .catch((err) => console.log(err));
}

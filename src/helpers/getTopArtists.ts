import UserTopItems from "@/services/UserTopItems";

export default function getTopArtists(accessToken: string, time: string) {
  UserTopItems.fetchTopArtists(accessToken, time)
    .then((res) => {
      return res.data.items;
    })
    .catch((err) => console.log(err));
}

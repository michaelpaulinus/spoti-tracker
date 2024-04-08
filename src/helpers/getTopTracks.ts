import UserTopItems from "@/services/UserTopItems";
import type Track from "@/interfaces/Track";

export default async function getTopTracks(
  accessToken: string,
  time: string
): Promise<Track[]> {
  try {
    const res = await UserTopItems.fetchTopTracks(accessToken, time);
    return res.data.items;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

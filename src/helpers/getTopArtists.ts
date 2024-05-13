import UserTopItems from "@/services/UserTopItems";
import type Artist from "@/models/Artist";

export default async function getTopArtists(
  accessToken: string,
  time: string
): Promise<Artist[]> {
  try {
    const res = await UserTopItems.fetchTopArtists(accessToken, time);
    return res.data.items;
  } catch (err) {
    throw err;
  }
}

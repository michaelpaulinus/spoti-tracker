import UserTopItems from "@/services/UserTopItems";
import type Track from "@/models/Track";

export default async function getRecommendations(
  accessToken: string,
  time: string
): Promise<Track[]> {
  try {
    const res = await UserTopItems.fetchRecommendations(accessToken, time);
    return res.data.tracks;
  } catch (err) {
    throw err;
  }
}

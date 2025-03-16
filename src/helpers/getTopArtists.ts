import SpotifyService from "@/services/SpotifyService";
import type Artist from "@/models/Artist";

export default async function getTopArtists(
	accessToken: string,
	time: string,
): Promise<Artist[]> {
	try {
		const res = await SpotifyService.fetchTopArtists(accessToken, time);
		return res.data.items;
	} catch (err) {
		throw err;
	}
}

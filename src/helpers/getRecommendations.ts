import SpotifyService from '@/services/SpotifyService';
import type Track from '@/models/Track';

export default async function getRecommendations(
	accessToken: string,
	time: string
): Promise<Track[]> {
	try {
		const res = await SpotifyService.fetchRecommendations(accessToken, time);
		return res.data.tracks;
	} catch (err) {
		throw err;
	}
}

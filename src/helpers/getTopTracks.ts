import SpotifyService from '@/services/SpotifyService';
import type Track from '@/models/Track';

export default async function getTopTracks(
	accessToken: string,
	time: string
): Promise<Track[]> {
	try {
		const res = await SpotifyService.fetchTopTracks(accessToken, time);
		return res.data.items;
	} catch (err) {
		throw err;
	}
}

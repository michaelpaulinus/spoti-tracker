import SpotifyService from "@/services/SpotifyService";
import type User from "@/models/User";

export default async function getUserProfile(token: string): Promise<User> {
	try {
		const res = await SpotifyService.fetchProfile(token);
		return res.data;
	} catch (err) {
		throw err;
	}
}

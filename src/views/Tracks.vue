<script lang="ts">
import type Artist from "@/models/Artist";
import type Track from "@/models/Track";
import getTopTracks from "@/helpers/getTopTracks";
import useTokenStore from "@/stores/token";
import TrackCard from "@/components/TrackCard.vue";

export default {
	components: {
		TrackCard,
	},

	props: {
		timeRange: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			defaultTimeRange: "short_term",
			myTopTracks: [] as Track[],
			accessToken: "",
			accessTokenStore: useTokenStore(),
			artistHeaders: [
				{ title: "Name", value: "name" },
				{ title: "Followers", value: "followers.total" },
				{ title: "Popularity", value: "popularity" },
			],
			trackHeaders: [
				{ title: "Name", value: "name" },
				{ title: "Artists", value: "artists" },
				{ title: "Album", value: "album.name" },
				{ title: "Popularity", value: "popularity" },
			],
			isLoading: true,
		};
	},

	methods: {
		async changeTimePeriod(time: string) {
			try {
				this.isLoading = true;
				this.defaultTimeRange = time;
				this.myTopTracks = await getTopTracks(this.accessToken, time);
			} catch (error) {
				console.error("Unable to change time period: ", error);
			} finally {
				this.isLoading = false;
			}
		},

		getArtistNames(artists: Artist[]) {
			return artists.map((a) => a.name).join(", ");
		},
	},

	created() {
		this.accessToken = this.accessTokenStore.getToken;
	},

	async mounted() {
		if (this.timeRange) {
			await this.changeTimePeriod(this.timeRange);
		}
		(this as any).$emitter.on("new_time_range", (timeRange: string) =>
			this.changeTimePeriod(timeRange),
		);
	},
};
</script>

<template>
	<div class="container">
		<div>
			<h1>My Top Tracks</h1>
			<br />
			<div class="track-container">
				<TrackCard
					v-for="track in myTopTracks.slice(0, 5)"
					:track="track"
					:is-loading="isLoading"
				/>
			</div>
		</div>

		<br />
		<br />

		<div>
			<h1>My Top 10 Tracks</h1>
			<br />
			<v-data-table-virtual
				:items="myTopTracks"
				:headers="trackHeaders"
				fixed-header
				:loading="isLoading"
			>
				<template v-slot:item.artists="{ item }">
					<td>
						{{ getArtistNames(item.artists) }}
					</td>
				</template>
			</v-data-table-virtual>
		</div>
	</div>
</template>

<style scoped>
tbody tr:nth-of-type(even) {
	background-color: #373535;
}

.container {
	display: flex;
	flex-direction: column;
}

.track-container {
	display: flex;
	flex-direction: row;
	gap: 1rem;
}

@media only screen and (max-width: 600px) {
	.track-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}
}
</style>

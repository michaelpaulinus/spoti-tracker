import type Artist from "@/interfaces/Artist";

export default function getArtistNames(artists: Artist[]) {
  return artists.map((a) => a.name).join(", ");
}

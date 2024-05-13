import type Artist from "@/models/Artist";

export default interface TopArtistsResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: Artist[];
}

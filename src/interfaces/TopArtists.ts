import type Artist from "@/interfaces/Artist";

export interface TopArtistsResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: Artist[];
}

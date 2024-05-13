import type Track from "@/models/Track";

export default interface TopTracksResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: Track[];
}

import type Seed from "@/models/Seed";
import type Track from "@/models/Track";

export default interface Recommendations {
  seeds: Seed[];
  tracks: Track[];
}

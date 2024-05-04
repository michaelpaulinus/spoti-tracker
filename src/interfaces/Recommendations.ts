import type Seed from "@/interfaces/Seed";
import type Track from "@/interfaces/Track";

export default interface Recommendations {
  seeds: Seed[];
  tracks: Track[];
}

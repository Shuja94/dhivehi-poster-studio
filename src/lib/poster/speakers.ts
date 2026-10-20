import type { PosterState } from "./types";

/** Map only the second speaker's settings into the shared portrait renderer. */
export function secondSpeaker(s: PosterState): PosterState {
  return {
    ...s, photo: s.photo2,
    photoScale: s.photo2Scale, photoX: s.photo2X, photoY: s.photo2Y,
    photoTone: s.photo2Tone, photoOutline: s.photo2Outline,
    photoShadow: s.photo2Shadow, photoGhost: false,
  };
}
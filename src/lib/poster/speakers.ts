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

/** Ghost silhouette: same photo, but its own size/position — never tied to the main speaker sliders. */
export function ghostSpeaker(s: PosterState): PosterState {
  return { ...s, photoScale: s.ghostScale * 1.35, photoX: s.ghostX, photoY: s.ghostY, photoOutline: 0, photoShadow: false };
}

/** Background collage photo box (paper/archive), positioned independently of the speaker. */
export function backPhotoBox(s: PosterState) {
  const k = s.backPhotoScale / 100;
  return { width: `${72 * k}%`, height: `${72 * k}%`, transform: `translate(${s.backPhotoX}px, ${s.backPhotoY}px) rotate(-2deg)`, opacity: s.backPhotoOpacity };
}
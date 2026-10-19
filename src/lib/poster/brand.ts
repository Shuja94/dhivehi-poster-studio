import type { PosterState } from "./types";

/** Identity is always carried across preset changes. */
export const IDENTITY_KEYS = ["outlet", "outletFont", "logo", "logoSize", "showOutlet", "partners", "handle"] as const;
export const COLOR_KEYS = ["accent", "accent2", "highlightColor", "highlightText"] as const;
export const FONT_KEYS = ["headlineFont", "bodyFont", "nameFont", "latinFont"] as const;
export const IMAGE_KEYS = ["photo", "photo2", "backPhoto", "extraImage", "bgImage"] as const;

export type BrandKit = { name: string; data: Partial<PosterState> };
export type BrandLocks = { colors: boolean; fonts: boolean; footer: boolean };

const pick = (s: PosterState, keys: readonly (keyof PosterState)[]) =>
  Object.fromEntries(keys.map((k) => [k, s[k]])) as Partial<PosterState>;

export function brandOf(s: PosterState): Partial<PosterState> {
  return { ...pick(s, [...IDENTITY_KEYS, ...COLOR_KEYS, ...FONT_KEYS]), footer: s.footer };
}

/** Apply a preset on top of the current poster while keeping the user's brand. */
export function withPreset(cur: PosterState, base: PosterState, preset: Partial<PosterState>, locks: BrandLocks): PosterState {
  const next: PosterState = { ...cur, ...base, ...preset };
  Object.assign(next, pick(cur, [...IDENTITY_KEYS, ...IMAGE_KEYS]));
  if (locks.colors) Object.assign(next, pick(cur, COLOR_KEYS));
  if (locks.fonts) Object.assign(next, pick(cur, FONT_KEYS));
  next.footer = locks.footer
    ? cur.footer
    : next.footer.map((f) => ({ ...f, text: cur.footer.find((c) => c.kind === f.kind)?.text ?? f.text }));
  next.aspect = cur.aspect;
  next.customW = cur.customW;
  next.customH = cur.customH;
  return next;
}

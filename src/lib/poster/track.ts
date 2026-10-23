import type { PosterState } from "./types";

/** Override a few fields without copying (keeps read-tracking intact). */
export function over(s: PosterState, extra: Partial<PosterState>): PosterState {
  return new Proxy(s, {
    get: (t, k) => (k in extra ? (extra as Record<string | symbol, unknown>)[k] : Reflect.get(t, k)),
  });
}

/** Wrap state so every field the poster reads is recorded in `used`. */
export function tracked(s: PosterState, used: Set<string>): PosterState {
  return new Proxy(s, {
    get: (t, k) => {
      if (typeof k === "string") used.add(k);
      return Reflect.get(t, k);
    },
  });
}

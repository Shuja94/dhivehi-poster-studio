// Standard Dhivehi phonetic keyboard layout (Latin key -> Thaana character)
export const THAANA_MAP: Record<string, string> = {
  q: "ް", w: "އ", e: "ެ", r: "ރ", t: "ތ", y: "ޔ", u: "ު", i: "ި", o: "ޮ", p: "ޕ",
  a: "ަ", s: "ސ", d: "ދ", f: "ފ", g: "ގ", h: "ހ", j: "ޖ", k: "ކ", l: "ލ",
  z: "ޒ", x: "×", c: "ޗ", v: "ވ", b: "ބ", n: "ނ", m: "މ",
  Q: "ޤ", W: "ޢ", E: "ޭ", R: "ޜ", T: "ޓ", Y: "ޠ", U: "ޫ", I: "ީ", O: "ޯ", P: "÷",
  A: "ާ", S: "ށ", D: "ޑ", F: "ﷲ", G: "ޣ", H: "ޙ", J: "ޛ", K: "ޚ", L: "ޅ",
  Z: "ޡ", X: "ޘ", C: "ޝ", V: "ޥ", B: "ޞ", N: "ޏ", M: "ޟ",
  ",": "،", ";": "؛", "?": "؟",
};

export function transliterate(input: string): string {
  return [...input].map((ch) => THAANA_MAP[ch] ?? ch).join("");
}

type El = HTMLInputElement | HTMLTextAreaElement;

/** Keydown handler: when enabled, replaces Latin keystrokes with Thaana. */
export function thaanaKeyDown(
  e: React.KeyboardEvent<El>,
  enabled: boolean,
  onChange: (v: string) => void,
) {
  if (!enabled || e.ctrlKey || e.metaKey || e.altKey) return;
  const mapped = THAANA_MAP[e.key];
  if (!mapped) return;
  e.preventDefault();
  const el = e.currentTarget;
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  const next = el.value.slice(0, start) + mapped + el.value.slice(end);
  onChange(next);
  requestAnimationFrame(() => {
    const pos = start + mapped.length;
    el.setSelectionRange(pos, pos);
  });
}

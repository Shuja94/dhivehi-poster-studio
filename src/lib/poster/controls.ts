import type { Preset } from "./presets";
import type { PosterState } from "./types";

export type TabId = "quick" | "presets" | "text" | "photo" | "style" | "brand";
export type Key = keyof PosterState;

/** Which editor tab owns each poster setting. */
export const KEY_TAB: Partial<Record<Key, TabId>> = {
  // Text
  dir: "text", showHeadline: "text", headline: "text", headlineStyle: "text", translation: "text",
  showTranslation: "text", quote: "text", quoteAlign: "text", quoteBox: "text", quoteMark: "text",
  name: "text", designation: "text", category: "text", showCategory: "text", tagline: "text",
  cta: "text", dateBig: "text", date: "text", showDate: "text",
  // Images
  photo: "photo", photoScale: "photo", photoX: "photo", photoY: "photo", photoTone: "photo",
  photoOutline: "photo", photoShadow: "photo", photoGhost: "photo", photo2: "photo", backPhoto: "photo",
  extraImage: "photo", showExtra: "photo", extraScale: "photo", extraX: "photo", extraY: "photo",
  extraOpacity: "photo", extraTone: "photo",
  // Look
  bgType: "style", bgImage: "style", bgColor: "style", bgColor2: "style", textureOpacity: "style",
  showGrid: "style", tornEdges: "style", showDecor: "style", patternColor: "style", patternOpacity: "style",
  patternScale: "style", decorOpacity: "style", decorColor: "style", watermark: "style",
  watermarkOpacity: "style", watermarkSize: "style", watermarkColor: "style", accent: "style", accent2: "style",
  textColor: "style", cardColor: "style", cardText: "style", highlightColor: "style", highlightText: "style",
  headlineSize: "style", quoteSize: "style", lineHeight: "style", nameSize: "style",
  headlineOffset: "style", quoteOffset: "style", headlineFont: "style", bodyFont: "style",
  nameFont: "style", latinFont: "style",
  // Brand
  outlet: "brand", outletFont: "brand", logo: "brand", logoSize: "brand", showOutlet: "brand",
  partners: "brand", footer: "brand", showFooter: "brand", handle: "brand",
};

/** Short human label for the "key controls" chips. */
export const KEY_LABEL: Partial<Record<Key, string>> = {
  dir: "Direction", headline: "Headline", headlineStyle: "Headline look", quote: "Quote",
  quoteBox: "Quote card", quoteMark: "Quote marks", quoteAlign: "Text align", translation: "Translation",
  showTranslation: "Show translation", showHeadline: "Show headline", name: "Name", designation: "Role",
  category: "Badge", showCategory: "Show badge", tagline: "Tagline", cta: "Call to action",
  date: "Date", dateBig: "Big date", showDate: "Show date",
  photo: "Speaker photo", photoTone: "Photo tone", photoGhost: "Ghost silhouette", photoOutline: "Cutout outline",
  photoShadow: "Photo shadow", photoScale: "Photo size", photo2: "Second speaker", backPhoto: "Collage photo",
  extraImage: "Second image", showExtra: "Show second image", extraScale: "Second image size",
  extraOpacity: "Second image opacity", extraTone: "Second image tone",
  bgType: "Background", bgColor: "Background colour", bgColor2: "Background colour 2", bgImage: "Background image",
  textureOpacity: "Texture", showGrid: "Grid overlay", tornEdges: "Torn edges",
  showDecor: "Decorations", patternColor: "Pattern colour", patternOpacity: "Pattern strength",
  patternScale: "Pattern size", decorColor: "Shapes colour", decorOpacity: "Shapes strength",
  watermark: "Calligraphy", watermarkOpacity: "Calligraphy strength",
  watermarkSize: "Calligraphy size", watermarkColor: "Calligraphy colour", accent: "Accent", accent2: "Accent 2", cardColor: "Card colour",
  cardText: "Card text", textColor: "Text colour", highlightColor: "Highlight colour", highlightText: "Highlight text",
  headlineSize: "Headline size", quoteSize: "Quote size", lineHeight: "Line height", nameSize: "Name size",
  headlineOffset: "Headline nudge", quoteOffset: "Quote card nudge",
  latinFont: "English font", headlineFont: "Headline font", bodyFont: "Body font", nameFont: "Name font",
  footer: "Social footer", showFooter: "Show footer", handle: "Handle", partners: "Partner logos",
  logo: "Logo", outlet: "Outlet name", showOutlet: "Outlet branding", logoSize: "Logo size",
};

/** The controls that make each style what it is — shown (and jumped to) after picking it. */
const FOCUS: Record<string, Key[]> = {
  banner: ["bgType", "textureOpacity", "quoteSize", "footer"],
  arch: ["quoteBox", "accent2", "extraImage", "footer"],
  topo: ["photoTone", "photoGhost", "bgType", "headline"],
  paper: ["headlineStyle", "quoteBox", "showGrid"],
  archive: ["photoTone", "quoteBox", "cardColor"],
  torngreen: ["quoteBox", "bgColor", "highlightColor"],
  bubble: ["quoteBox", "dateBig", "partners", "bgType"],
  capsule: ["quoteAlign", "cardColor", "bgType"],
  glass: ["quoteBox", "bgType", "dateBig", "footer"],
  editorial: ["showTranslation", "headlineStyle", "highlightColor"],
  card: ["headlineStyle", "bgType", "category"],
  headline: ["category", "headlineSize", "highlightColor"],
  greencard: ["cardColor", "tagline", "date"],
  collage: ["photo2", "headlineStyle", "quoteAlign"],
  academy: ["cta", "handle", "showDecor"],
  midan: ["watermark", "watermarkOpacity", "accent2"],
  circletop: ["showDecor", "accent2", "quoteMark"],
  circleside: ["category", "highlightColor", "quoteAlign"],
  statement: ["showOutlet", "extraOpacity", "logo"],
  tanween: ["extraImage", "watermark", "tornEdges"],
  vintage: ["bgType", "photoTone", "cardColor"],
  tweet: ["handle", "date", "extraTone"],
  english: ["dir", "latinFont", "headline"],
};

/** Keys never worth jumping to (identity/size plumbing). */
const SKIP: Key[] = ["layout", "aspect", "customW", "customH", "wideAlign", "wideSide", "outlet", "outletFont"];

/** Fallback for a style with no curated list: its first few real changes. */
function derived(p: Preset): Key[] {
  return (Object.keys(p.apply) as Key[]).filter((k) => !SKIP.includes(k) && KEY_TAB[k]).slice(0, 3);
}

/** Where to land in the editor after picking a style. */
export function presetFocus(p: Preset): { tab: TabId; keys: Key[] } {
  const keys = FOCUS[p.id] ?? derived(p);
  return { tab: KEY_TAB[keys[0]] ?? "style", keys };
}

export type Layout =
  | "paper" | "archive" | "torngreen" | "bubble" | "headline" | "banner" | "arch"
  | "topo" | "capsule" | "glass" | "editorial" | "card"
  | "greencard" | "collage" | "academy" | "midan" | "circletop" | "circleside"
  | "statement" | "tanween" | "vintage" | "tweet"
  | "photonews" | "cutblue" | "didyouknow" | "breakcard" | "tabloid" | "mono" | "montage" | "redstory";
export type Aspect = "1:1" | "4:5" | "9:16" | "fb" | "x" | "yt" | "pin" | "li" | "custom";
export type BgType = "grid" | "paper" | "topo" | "dark" | "bokeh" | "solid" | "mesh" | "noise" | "image";
export type QuoteBox = "torn" | "frame" | "glass" | "speech" | "arch" | "none";
export type PhotoTone = "color" | "gray" | "duotone";
export type FooterKind = "whatsapp" | "x" | "instagram" | "facebook" | "youtube" | "tiktok" | "website" | "phone" | "email";

export interface FooterItem { kind: FooterKind; text: string; on: boolean }

export interface PosterState {
  layout: Layout;
  aspect: Aspect;
  dir: "rtl" | "ltr";
  bgType: BgType;
  bgColor: string;
  bgColor2: string;
  bgImage?: string | undefined;
  textureOpacity: number;
  showGrid: boolean;
  tornEdges: boolean;

  accent: string;
  accent2: string;
  textColor: string;
  cardColor: string;
  cardText: string;
  highlightColor: string;
  highlightText: string;

  headline: string;
  showHeadline: boolean;
  headlineSize: number;
  headlineFont: string;
  headlineStyle: "strip" | "plain" | "block";
  headlineOffset: number;
  translation: string;
  showTranslation: boolean;

  quote: string;
  quoteSize: number;
  bodyFont: string;
  lineHeight: number;
  quoteAlign: "start" | "center" | "justify";
  quoteMark: "box" | "big" | "none";
  quoteBox: QuoteBox;
  quoteOffset: number;

  name: string;
  designation: string;
  nameFont: string;
  nameSize: number;

  category: string;
  showCategory: boolean;

  outlet: string;
  outletFont: string;
  logo?: string | undefined;
  showOutlet: boolean;
  partners: string[];

  date: string;
  dateBig: string;
  showDate: boolean;

  handle: string;
  footer: FooterItem[];
  showFooter: boolean;

  photo?: string | undefined;
  photoScale: number;
  photoX: number;
  photoY: number;
  photoTone: PhotoTone;
  photoOutline: number;
  photoShadow: boolean;
  photoGhost: boolean;
  /* ghost silhouette has its own placement so it never follows the main speaker */
  ghostScale: number;
  ghostX: number;
  ghostY: number;
  ghostOpacity: number;
  backPhoto?: string | undefined;
  backPhotoScale: number;
  backPhotoX: number;
  backPhotoY: number;
  backPhotoOpacity: number;
  showDecor: boolean;

  latinFont: string;

  /* second speaker + secondary image (dome, books, building, emblem) */
  photo2?: string | undefined;
  photo2Scale: number;
  photo2X: number;
  photo2Y: number;
  photo2Tone: PhotoTone;
  photo2Outline: number;
  photo2Shadow: boolean;
  extraImage?: string | undefined;
  showExtra: boolean;
  extraScale: number;
  extraX: number;
  extraY: number;
  extraOpacity: number;
  extraTone: PhotoTone;

  tagline: string;
  cta: string;
  watermark: string;
  logoSize: number;
  customW: number;
  customH: number;

  /* background pattern + decoration controls */
  patternColor: string;
  patternOpacity: number;
  patternScale: number;
  decorOpacity: number;
  decorColor: string;
  watermarkOpacity: number;
  watermarkSize: number;
  watermarkColor: string;
  /* wide formats */
  wideAlign: "start" | "center" | "end";
  wideSide: boolean;
  /* finishing layer: vignette + film grain (0 = off) */
  finish: number;
}

export const ASPECTS: Record<Aspect, { w: number; h: number; label: string; group: string }> = {
  "1:1": { w: 1080, h: 1080, label: "Instagram / Facebook Square", group: "Feed" },
  "4:5": { w: 1080, h: 1350, label: "Instagram / Facebook Portrait", group: "Feed" },
  "9:16": { w: 1080, h: 1920, label: "Story · Reels · TikTok · WhatsApp Status", group: "Story" },
  fb: { w: 1200, h: 630, label: "Facebook Landscape / Link", group: "Landscape" },
  x: { w: 1600, h: 900, label: "X (Twitter) Post", group: "Landscape" },
  yt: { w: 1280, h: 720, label: "YouTube Thumbnail", group: "Landscape" },
  li: { w: 1200, h: 627, label: "LinkedIn Post", group: "Landscape" },
  pin: { w: 1000, h: 1500, label: "Pinterest Pin", group: "Tall" },
  custom: { w: 1080, h: 1080, label: "Custom size", group: "Custom" },
};

export const sizeOf = (s: Pick<PosterState, "aspect" | "customW" | "customH">) =>
  s.aspect === "custom" ? { w: s.customW, h: s.customH } : ASPECTS[s.aspect];

export const THAANA_FONTS = [
  "Faruma", "MV Waheed", "MV A Waheed", "MV Eamaan XP", "MV Amaan XP", "MV Faseyha",
  "MV Faseyha Bold", "MV Boli", "MV Iyyu Formal", "MV Iyyu Normal", "MV Utheemu",
  "MV Typewriter", "MV Thakurufaanu", "MV Ilham", "MV Aammu FK", "MV Elaaf",
  "MV Sehga Old", "MV Oswald", "MV Kelaa", "MV Izyan Bodu Akuru", "Noto Sans Thaana",
];

export const LATIN_FONTS = [
  "Plus Jakarta Sans", "Playfair Display", "Bebas Neue", "Oswald", "Roboto Slab", "Archivo Black", "Lora",
  "Space Grotesk", "IBM Plex Sans", "Poppins",
];

export const HIGHLIGHTS = [
  { name: "Amber", bg: "#f2a516", fg: "#1a1206" },
  { name: "Red", bg: "#d8343a", fg: "#ffffff" },
  { name: "Teal", bg: "#0f8b7d", fg: "#ffffff" },
  { name: "Gold", bg: "#c9992f", fg: "#ffffff" },
  { name: "Green", bg: "#1f6b45", fg: "#ffffff" },
  { name: "Blue", bg: "#2d5f9a", fg: "#ffffff" },
];

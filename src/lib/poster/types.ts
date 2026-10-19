export type Layout =
  | "paper" | "archive" | "torngreen" | "bubble" | "headline" | "banner" | "arch"
  | "topo" | "capsule" | "glass" | "editorial" | "card";
export type Aspect = "1:1" | "4:5" | "9:16";
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
  backPhoto?: string | undefined;
  showDecor: boolean;

  latinFont: string;
}

export const ASPECTS: Record<Aspect, { w: number; h: number; label: string }> = {
  "1:1": { w: 1080, h: 1080, label: "Square 1:1" },
  "4:5": { w: 1080, h: 1350, label: "Portrait 4:5" },
  "9:16": { w: 1080, h: 1920, label: "Story 9:16" },
};

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

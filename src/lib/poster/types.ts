export type Layout = "paper" | "archive" | "bubble" | "headline";
export type Aspect = "1:1" | "4:5" | "9:16";
export type BgType = "paper" | "solid" | "gradient" | "image";

export interface PosterState {
  layout: Layout;
  aspect: Aspect;
  dir: "rtl" | "ltr";
  bgType: BgType;
  bgColor: string;
  bgColor2: string;
  bgImage?: string;
  textureOpacity: number;
  showGrid: boolean;
  tornEdges: boolean;

  accent: string;
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

  quote: string;
  quoteSize: number;
  bodyFont: string;
  lineHeight: number;
  quoteAlign: "start" | "center" | "justify";
  quoteMark: "box" | "big" | "none";
  quoteOffset: number;

  name: string;
  designation: string;
  nameFont: string;
  nameSize: number;

  category: string;
  showCategory: boolean;

  outlet: string;
  outletFont: string;
  logo?: string;
  showOutlet: boolean;

  date: string;
  showDate: boolean;

  handle: string;
  socials: string[];
  showFooter: boolean;

  photo?: string;
  photoScale: number;
  photoX: number;
  photoY: number;
  photoGray: boolean;
  photoOutline: number;
  photoShadow: boolean;
  backPhoto?: string;

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
  "Playfair Display", "Bebas Neue", "Oswald", "Roboto Slab", "Archivo Black", "Lora",
  "Space Grotesk", "IBM Plex Sans",
];

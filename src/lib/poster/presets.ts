import type { PosterState } from "./types";

const DV_HEADLINE = "ރައީސް ވިދާޅުވަނީ *ޤައުމީ ދުވަހެއް* ކަމުގައި\nކޮންމެ ރަށެއްގައި ފާހަގަކުރަން";
const DV_QUOTE =
  "\"މިއީ އަހަރެމެންގެ ޤައުމުގެ ތާރީޚުގައި ވަރަށް މުހިންމު ދުވަހެއް. ކޮންމެ ރަށެއްގައި، ކޮންމެ ގޭގައި، *އެކުވެރިކަމާއެކު* މި ދުވަސް ފާހަގަކުރަން އަހަރެން ގޮވާލަން.\"";

export const BASE: PosterState = {
  layout: "paper",
  aspect: "4:5",
  dir: "rtl",
  bgType: "paper",
  bgColor: "#d9d4cb",
  bgColor2: "#0e2a26",
  textureOpacity: 0.9,
  showGrid: true,
  tornEdges: true,
  accent: "#d8343a",
  textColor: "#111111",
  cardColor: "#f4f2ee",
  cardText: "#111111",
  highlightColor: "#d8343a",
  highlightText: "#ffffff",
  headline: DV_HEADLINE,
  showHeadline: true,
  headlineSize: 58,
  headlineFont: "MV A Waheed",
  headlineStyle: "strip",
  headlineOffset: 0,
  quote: DV_QUOTE,
  quoteSize: 34,
  bodyFont: "Faruma",
  lineHeight: 1.8,
  quoteAlign: "justify",
  quoteMark: "box",
  quoteOffset: 0,
  name: "އަޙްމަދު ޙަސަން",
  designation: "ރައީސުލްޖުމްހޫރިއްޔާ",
  nameFont: "MV A Waheed",
  nameSize: 30,
  category: "ބަޔާން",
  showCategory: true,
  outlet: "ޚަބަރު",
  outletFont: "MV Izyan Bodu Akuru",
  showOutlet: true,
  date: "19 އޮކްޓޫބަރު 2026",
  showDate: false,
  handle: "@khabaru.mv",
  socials: ["x", "instagram", "facebook", "youtube"],
  showFooter: true,
  photoScale: 100,
  photoX: 0,
  photoY: 0,
  photoGray: false,
  photoOutline: 10,
  photoShadow: true,
  latinFont: "Playfair Display",
};

export interface Preset {
  id: string;
  name: string;
  description: string;
  swatch: string[];
  apply: Partial<PosterState>;
}

export const PRESETS: Preset[] = [
  {
    id: "paper",
    name: "Paper Statement",
    description: "Crumpled paper, torn headline strips, cutout speaker, quote card",
    swatch: ["#d9d4cb", "#d8343a", "#2f5a7a"],
    apply: { layout: "paper", bgType: "paper", bgColor: "#d9d4cb", accent: "#2f5a7a", highlightColor: "#d8343a", headlineStyle: "strip", quoteMark: "box", photoGray: false, textColor: "#111111", cardColor: "#f4f2ee", cardText: "#111111", showGrid: true, tornEdges: true },
  },
  {
    id: "archive",
    name: "Archive Portrait",
    description: "Sepia paper, framed B&W portrait, black name tag, big quote marks",
    swatch: ["#c9bba6", "#151515", "#f1ece3"],
    apply: { layout: "archive", bgType: "paper", bgColor: "#c4b49c", accent: "#151515", highlightColor: "#151515", headlineStyle: "plain", quoteMark: "big", photoGray: true, textColor: "#151515", cardColor: "#efebe4", cardText: "#151515", showGrid: false, tornEdges: true, showHeadline: false },
  },
  {
    id: "bubble",
    name: "Forum Speech Bubble",
    description: "Deep gradient, glass speech bubble, speaker at podium, partner footer",
    swatch: ["#0e2a26", "#e7b23c", "#ffffff"],
    apply: { layout: "bubble", bgType: "gradient", bgColor: "#2d5a52", bgColor2: "#071512", accent: "#e7b23c", highlightColor: "#e7b23c", highlightText: "#0a1f1b", textColor: "#ffffff", cardColor: "#ffffff", cardText: "#ffffff", quoteMark: "big", photoGray: false, photoOutline: 0, showGrid: false, tornEdges: false, showHeadline: false, showDate: true },
  },
  {
    id: "headline",
    name: "Breaking Headline",
    description: "Full-bleed photo, bold headline with highlighted keyword, category badge",
    swatch: ["#0b0b0f", "#e11d2a", "#ffffff"],
    apply: { layout: "headline", bgType: "solid", bgColor: "#0b0b0f", accent: "#e11d2a", highlightColor: "#e11d2a", highlightText: "#ffffff", textColor: "#ffffff", headlineStyle: "plain", headlineSize: 72, quoteMark: "none", photoOutline: 0, photoGray: false, showGrid: false, tornEdges: false, showHeadline: true, category: "ބްރޭކިންގް", showDate: true },
  },
  {
    id: "english",
    name: "English Editorial",
    description: "Left-to-right paper quote card for English posts",
    swatch: ["#e6e1d6", "#1d4ed8", "#111111"],
    apply: {
      layout: "paper", dir: "ltr", bgType: "paper", bgColor: "#e6e1d6", accent: "#1d4ed8", highlightColor: "#1d4ed8", headlineStyle: "strip", quoteMark: "box", latinFont: "Playfair Display",
      headline: "President calls for a *national day*\nof unity across every island",
      quote: "\u201CThis is a defining day in our nation's history. I call on every island and every home to mark it *together*.\u201D",
      name: "Ahmed Hassan", designation: "President", category: "Statement", outlet: "KHABARU", handle: "@khabaru.mv", headlineSize: 54, quoteSize: 32, lineHeight: 1.5, date: "19 October 2026",
    },
  },
];

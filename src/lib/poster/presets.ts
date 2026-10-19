import type { FooterItem, PosterState } from "./types";

const DV_HEADLINE = "ރައީސް ވިދާޅުވަނީ *ޤައުމީ ދުވަހެއް* ކަމުގައި\nކޮންމެ ރަށެއްގައި ފާހަގަކުރަން";
const DV_QUOTE =
  "ކޮންމެ ރަށެއްގައި، ކޮންމެ ގޭގައި، *އެކުވެރިކަމާއެކު* މި ދުވަސް ފާހަގަކުރަން އަހަރެން ގޮވާލަން. މިއީ އަހަރެމެންގެ ޤައުމުގެ ތާރީޚުގައި ވަރަށް މުހިންމު ދުވަހެއް.";

export const DEFAULT_FOOTER: FooterItem[] = [
  { kind: "x", text: "", on: true },
  { kind: "instagram", text: "", on: true },
  { kind: "facebook", text: "", on: true },
  { kind: "youtube", text: "", on: false },
  { kind: "whatsapp", text: "+960 777 0000", on: false },
  { kind: "phone", text: "+960 330 0000", on: false },
  { kind: "website", text: "khabaru.mv", on: false },
  { kind: "email", text: "news@khabaru.mv", on: false },
  { kind: "tiktok", text: "", on: false },
];

const foot = (on: string[], extra: Partial<Record<string, string>> = {}): FooterItem[] =>
  DEFAULT_FOOTER.map((f) => ({ ...f, on: on.includes(f.kind), text: extra[f.kind] ?? f.text }));

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
  accent: "#2f5a7a",
  accent2: "#c9992f",
  textColor: "#111111",
  cardColor: "#f4f2ee",
  cardText: "#111111",
  highlightColor: "#d8343a",
  highlightText: "#ffffff",
  headline: DV_HEADLINE,
  showHeadline: true,
  headlineSize: 56,
  headlineFont: "MV A Waheed",
  headlineStyle: "strip",
  headlineOffset: 0,
  translation: "President calls for a national day to be marked on every island",
  showTranslation: false,
  quote: DV_QUOTE,
  quoteSize: 34,
  bodyFont: "Faruma",
  lineHeight: 1.85,
  quoteAlign: "justify",
  quoteMark: "box",
  quoteBox: "torn",
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
  partners: [],
  date: "19 އޮކްޓޫބަރު 2026",
  dateBig: "19",
  showDate: false,
  handle: "@khabaru.mv",
  footer: foot(["x", "instagram", "facebook"]),
  showFooter: true,
  photoScale: 100,
  photoX: 0,
  photoY: 0,
  photoTone: "color",
  photoOutline: 10,
  photoShadow: true,
  photoGhost: false,
  showDecor: true,
  latinFont: "Plus Jakarta Sans",
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
    id: "banner", name: "Grid & Vertical Banner", description: "Grid paper, centre colour banner, line frame with notch, highlighted quote lines, URL bar",
    swatch: ["#f3f5f2", "#14532d", "#3aa04f"],
    apply: { layout: "banner", bgType: "grid", bgColor: "#f4f6f3", accent: "#14532d", accent2: "#3aa04f", highlightColor: "#2f9447", highlightText: "#ffffff", textColor: "#14532d", photoTone: "gray", photoOutline: 0, photoShadow: false, quoteMark: "box", quoteBox: "none", quoteSize: 40, lineHeight: 1.75, showHeadline: false, footer: foot(["website"]), nameSize: 40, showCategory: false },
  },
  {
    id: "arch", name: "Arch & Dome Kalam", description: "Emerald canvas, white quarter-arch card, mustard glow circle, dome, split footer",
    swatch: ["#0b4a35", "#ffffff", "#c9992f"],
    apply: { layout: "arch", bgType: "solid", bgColor: "#0b4a35", accent: "#0b4a35", accent2: "#c9992f", highlightColor: "#c9992f", highlightText: "#ffffff", textColor: "#ffffff", cardColor: "#ffffff", cardText: "#1c3b30", quoteMark: "big", quoteBox: "arch", photoTone: "gray", photoOutline: 0, photoShadow: false, showHeadline: false, quoteSize: 34, category: "#ކަލާމް", quoteAlign: "start", showDecor: true },
  },
  {
    id: "topo", name: "Topographic Duotone", description: "Contour lines, hanging badge, duotone cutout with ghost silhouette, social pill",
    swatch: ["#eef1f5", "#2f6aa6", "#ffffff"],
    apply: { layout: "topo", bgType: "topo", bgColor: "#eef1f4", accent: "#3a72ad", highlightColor: "#ffffff", highlightText: "#2a5d93", textColor: "#ffffff", cardText: "#ffffff", photoTone: "gray", photoGhost: true, photoOutline: 0, photoShadow: false, quoteMark: "big", quoteBox: "none", headline: "*ހަނދާން ކުރައްވާ!*", headlineStyle: "plain", headlineSize: 54, quoteSize: 32, quoteAlign: "start" },
  },
  {
    id: "paper", name: "Torn Paper Statement", description: "Crumpled newsprint, torn headline strips, white-outlined cutout, quote card",
    swatch: ["#d9d4cb", "#d8343a", "#2f5a7a"],
    apply: { layout: "paper", bgType: "paper", showGrid: true, quoteBox: "torn" },
  },
  {
    id: "archive", name: "Archive Portrait", description: "Sepia paper, framed B&W portrait, label-tape name badge, oversized quotes",
    swatch: ["#c4b49c", "#151515", "#efebe4"],
    apply: { layout: "archive", bgType: "paper", bgColor: "#c4b49c", accent: "#151515", highlightColor: "#151515", quoteMark: "big", quoteBox: "torn", photoTone: "gray", textColor: "#151515", cardColor: "#efebe4", cardText: "#151515", showGrid: false, showHeadline: false },
  },
  {
    id: "torngreen", name: "Green Torn Notes", description: "Textured green, torn label strips beside speaker, torn note with keyword highlights",
    swatch: ["#1e9a6c", "#ffffff", "#0d5c40"],
    apply: { layout: "torngreen", bgType: "noise", bgColor: "#1f9a6d", accent: "#0f5f43", highlightColor: "#0f5f43", highlightText: "#ffffff", textColor: "#ffffff", cardColor: "#f7f7f5", cardText: "#0f3d2c", quoteBox: "torn", quoteMark: "big", photoOutline: 0, photoShadow: true, showHeadline: false, quoteSize: 36, showGrid: false, footer: foot([]) },
  },
  {
    id: "bubble", name: "Dark Glow Speech Bubble", description: "Deep gradient, glass speech bubble aimed at speaker, date badge, partner logos",
    swatch: ["#0e2a26", "#e7b23c", "#ffffff"],
    apply: { layout: "bubble", bgType: "dark", bgColor: "#2d5a52", bgColor2: "#061310", accent: "#e7b23c", highlightColor: "#e7b23c", highlightText: "#0a1f1b", textColor: "#ffffff", cardText: "#ffffff", quoteMark: "big", quoteBox: "glass", photoOutline: 0, showGrid: false, showHeadline: false, showDate: true, dateBig: "23-25", date: "އޮކްޓޫބަރު 2026 · މާލެ", quoteSize: 31 },
  },
  {
    id: "capsule", name: "Rounded Capsule Split", description: "Textured backdrop, capsule with portrait on top, light card below, round quote emblem",
    swatch: ["#4b5a3e", "#22b363", "#dbf0dc"],
    apply: { layout: "capsule", bgType: "noise", bgColor: "#4d5b40", accent: "#20b262", highlightColor: "#20b262", highlightText: "#ffffff", textColor: "#ffffff", cardColor: "#d9eedb", cardText: "#1b2a1e", quoteBox: "none", quoteMark: "box", photoOutline: 0, photoShadow: false, showHeadline: false, quoteAlign: "center", quoteSize: 28, nameSize: 44, showGrid: false, footer: foot([]) },
  },
  {
    id: "glass", name: "Glass & Light Streak", description: "Soft bokeh, light curves, frosted glass card, glowing date block, contact strip",
    swatch: ["#e9e6ef", "#4b3c8f", "#e8a43c"],
    apply: { layout: "glass", bgType: "bokeh", bgColor: "#ecebef", bgColor2: "#5b2a86", accent: "#4b3c8f", accent2: "#7c5cd6", highlightColor: "#4b3c8f", highlightText: "#ffffff", textColor: "#2b2560", cardText: "#1d6b78", quoteBox: "glass", quoteMark: "big", photoOutline: 0, photoShadow: false, showHeadline: false, showDate: true, dateBig: "16", date: "އޮކްޓޫބަރު", category: "ވެރިންގެ ދުވަސް", quoteSize: 36, quoteAlign: "start", footer: foot(["x", "facebook", "instagram", "whatsapp", "website"]) },
  },
  {
    id: "editorial", name: "Cream Editorial", description: "Ivory paper, big headline with coloured lines, translation, name bubble, earth-tone shape",
    swatch: ["#f2efe6", "#7a2a1c", "#8a5a3c"],
    apply: { layout: "editorial", bgType: "paper", bgColor: "#f3f0e8", textureOpacity: 0.35, showGrid: false, accent: "#8a5a3c", highlightColor: "transparent", highlightText: "#7a2a1c", textColor: "#151515", headlineStyle: "plain", headlineSize: 52, showTranslation: true, quoteBox: "none", quoteMark: "none", photoTone: "gray", photoOutline: 0, photoShadow: false, headline: "ވަރަށް ގިނަ އަހަރުތަކެއްވަންދެން އަހަރެމެންގެ ރާއްޖެ ތަރައްޤީގެ މަގުގައި ހިނގަމުން ދިޔައީ\n*މިއަދު އަޅާ ފިޔަވަޅުތަކުން މުސްތަޤްބަލް ބިނާވާނެ*", translation: "For many years our country walked the path of development. The steps we take today will build our future.", designation: "Ahmed Hassan" },
  },
  {
    id: "card", name: "Soft Blue Card", description: "Blue bokeh, white rounded headline card, speaker centre, info block, split contact footer",
    swatch: ["#dfe6f2", "#1f4e7a", "#ffffff"],
    apply: { layout: "card", bgType: "bokeh", bgColor: "#e9edf3", bgColor2: "#2b6fe0", accent: "#1f4e7a", highlightColor: "#cfe0f5", highlightText: "#1f4e7a", textColor: "#1f4e7a", cardColor: "#ffffff", cardText: "#1f4e7a", headlineStyle: "plain", headlineSize: 46, quoteBox: "none", quoteMark: "big", photoOutline: 0, photoShadow: false, category: "ތަރައްޤީގެ\nޕްލެޓްފޯމެއް", headline: "*ރަށްރަށުގެ ޖަމްޢިއްޔާތައް* ވަރުގަދަ ކުރުމަށް ހިންގާ ޕްލެޓްފޯމެއް", footer: foot(["website", "whatsapp"]) },
  },
  {
    id: "headline", name: "Breaking Headline", description: "Full-bleed photo, bold headline with highlighted keyword, category badge",
    swatch: ["#0b0b0f", "#e11d2a", "#ffffff"],
    apply: { layout: "headline", bgType: "solid", bgColor: "#0b0b0f", accent: "#e11d2a", highlightColor: "#e11d2a", highlightText: "#ffffff", textColor: "#ffffff", headlineStyle: "plain", headlineSize: 70, quoteMark: "none", quoteBox: "none", photoOutline: 0, showGrid: false, category: "ބްރޭކިންގް", showDate: true, showTranslation: true },
  },
  {
    id: "english", name: "English Editorial", description: "Left-to-right paper quote card for English posts",
    swatch: ["#e6e1d6", "#1d4ed8", "#111111"],
    apply: {
      layout: "paper", dir: "ltr", bgType: "paper", bgColor: "#e6e1d6", accent: "#1d4ed8", highlightColor: "#1d4ed8", latinFont: "Playfair Display",
      headline: "President calls for a *national day*\nof unity across every island",
      quote: "\u201CThis is a defining day in our nation's history. I call on every island and every home to mark it *together*.\u201D",
      name: "Ahmed Hassan", designation: "President", category: "Statement", outlet: "KHABARU", headlineSize: 52, quoteSize: 32, lineHeight: 1.5, date: "19 October 2026",
    },
  },
];

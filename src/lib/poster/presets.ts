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
  patternColor: "",
  patternOpacity: 1,
  patternScale: 1,
  decorOpacity: 1,
  decorColor: "",
  watermarkOpacity: 1,
  watermarkSize: 100,
  watermarkColor: "",
  wideAlign: "start",
  wideSide: true,
  finish: 0.6,
  dir: "rtl",
  bgType: "paper",
  bgColor: "#d9d4cb",
  bgColor2: "#0e2a26",
  textureOpacity: 0.9,
  showGrid: false,
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
  ghostScale: 100,
  ghostX: -120,
  ghostY: -60,
  ghostOpacity: 0.22,
  backPhotoScale: 100,
  backPhotoX: 0,
  backPhotoY: 0,
  backPhotoOpacity: 0.6,
  photo2Scale: 100,
  photo2X: 0,
  photo2Y: 0,
  photo2Tone: "gray",
  photo2Outline: 0,
  photo2Shadow: true,
  showDecor: true,
  latinFont: "Plus Jakarta Sans",
  showExtra: true,
  extraScale: 100,
  extraX: 0,
  extraY: 0,
  extraOpacity: 1,
  extraTone: "color",
  tagline: "ޚަބަރު · ޚަބަރު · ޚަބަރު",
  cta: "",
  watermark: "ދިވެހި",
  logoSize: 100,
  customW: 1080,
  customH: 1080,
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
    id: "greencard", name: "Green Card Conference", description: "Blurred dark-green portrait, rounded gradient quote card, gold quote marks, event title + date pill, pattern strip",
    swatch: ["#2b3f2a", "#5f8a2a", "#f2b134"],
    apply: { layout: "greencard", bgType: "dark", bgColor: "#3d5a3a", bgColor2: "#142014", accent: "#4c7a26", accent2: "#8fbf4a", cardColor: "#6b9a30", cardText: "#ffffff", highlightColor: "#f2b134", highlightText: "#ffffff", textColor: "#ffffff", photoTone: "gray", photoOutline: 0, photoShadow: false, quoteMark: "big", quoteBox: "none", quoteSize: 34, quoteAlign: "start", showHeadline: false, category: "މީލާދު\nކޮންފަރެންސް", showDate: true, date: "31 އޮގަސްޓު 2026 · 4:30", tagline: "ޖާމިޢާ ނޫރިއްޔާ", footer: foot(["facebook", "instagram"]) },
  },
  {
    id: "collage", name: "Two-Speaker Collage", description: "Slate grain, cyan headline block, two cutouts with flag stripes, landmark image, justified story text",
    swatch: ["#33414f", "#1fb3d1", "#9c2a3c"],
    apply: { layout: "collage", bgType: "noise", bgColor: "#35434f", accent: "#1fb3d1", accent2: "#9c2a3c", highlightColor: "#1fb3d1", highlightText: "#ffffff", textColor: "#ffffff", headline: "*ކާކު* ފަހަތުގައި ތިބީ؟", headlineStyle: "plain", headlineSize: 54, photoTone: "gray", photoOutline: 0, photoShadow: true, quoteSize: 34, quoteAlign: "justify", quoteBox: "none", quoteMark: "none", footer: foot(["x", "instagram"]) },
  },
  {
    id: "academy", name: "Academy Glass Quote", description: "Textured green with glowing arrows, frosted quote card, ringed circle avatar, series title, CTA",
    swatch: ["#0f4d22", "#3ee07a", "#ffffff"],
    apply: { layout: "academy", bgType: "noise", bgColor: "#0f4d22", accent: "#0f4d22", accent2: "#3ee07a", cardColor: "#ffffff", textColor: "#ffffff", quoteSize: 46, quoteMark: "big", quoteAlign: "start", showHeadline: false, photoTone: "color", tagline: "ވިޔަފާރި ބިނާކުރުން", category: "ވިޔަފާރީގެ\nނަފްސާނީ ދިރާސާ", handle: "#ޚަބަރު_އެކެޑަމީ", cta: "*ސަބްސްކްރައިބް* ކުރައްވާ:\nkhabaru.mv/academy", footer: foot(["instagram", "youtube"]) },
  },
  {
    id: "midan", name: "Calligraphy Cutout", description: "Pale teal grain, calligraphy watermark, two-tone headline, slanted name tag, cutout on teal circle",
    swatch: ["#d6e4e3", "#2d8f8b", "#e7891f"],
    apply: { layout: "midan", bgType: "noise", bgColor: "#d6e4e3", accent: "#2d8f8b", accent2: "#e7891f", highlightColor: "transparent", highlightText: "#e7891f", textColor: "#2d8f8b", cardText: "#2c4a49", headline: "އަނބުރާ *ވިސްނާލަން*\nޖެހޭ ވަގުތެއް..", headlineStyle: "plain", headlineSize: 58, photoTone: "gray", photoOutline: 10, photoShadow: false, quoteBox: "none", quoteSize: 30, quoteAlign: "start", watermark: "ދިވެހި ބަސް", footer: foot(["facebook", "instagram", "x"]) },
  },
  {
    id: "circletop", name: "Circle Portrait · Top", description: "Airy light canvas, wave squiggles, portrait over a teal circle, orange quote marks, bold headline + body",
    swatch: ["#e3f1f2", "#2bb3b6", "#f0a01c"],
    apply: { layout: "circletop", bgType: "noise", bgColor: "#e6f2f3", accent: "#2bb3b6", accent2: "#f0a01c", textColor: "#1f8c8f", cardText: "#204a4c", highlightColor: "transparent", highlightText: "#f0a01c", headline: "*މިއަދު* ތިބާއަށް\nސަމާލުކަން ދީ", headlineStyle: "plain", headlineSize: 60, photoTone: "gray", photoOutline: 0, photoShadow: false, quoteMark: "big", quoteBox: "none", quoteSize: 30, quoteAlign: "start", footer: foot(["facebook", "x", "youtube", "website"]) },
  },
  {
    id: "circleside", name: "Circle Portrait · Side", description: "Portrait on a side circle with grey base, centred headline, orange question bar, justified body",
    swatch: ["#e6f2f3", "#2bb3b6", "#f0a01c"],
    apply: { layout: "circleside", bgType: "noise", bgColor: "#e6f2f3", accent: "#2bb3b6", accent2: "#f0a01c", textColor: "#1f8c8f", cardText: "#204a4c", highlightColor: "#f0a01c", highlightText: "#ffffff", headline: "މިއީ އެންމެ\nމުހިންމު ބައި", headlineStyle: "plain", headlineSize: 58, category: "ކީއްވެގެން ބަދަލަކަށް ބޭނުންވަނީ؟", photoTone: "gray", photoOutline: 0, photoShadow: false, quoteMark: "big", quoteBox: "none", quoteSize: 32, quoteAlign: "justify", footer: foot(["facebook", "x", "youtube", "website"]) },
  },
  {
    id: "statement", name: "Agency Statement", description: "Light newsprint, centred logo, faded emblem, speaker at podium, name block, tag rule, square social icons",
    swatch: ["#ecebe7", "#1f6b45", "#c9a227"],
    apply: { layout: "statement", bgType: "paper", bgColor: "#ecebe7", textureOpacity: 0.35, accent: "#1f6b45", accent2: "#c9a227", textColor: "#1b1b1b", highlightColor: "#1f6b45", highlightText: "#ffffff", photoTone: "color", photoOutline: 0, photoShadow: false, extraOpacity: 0.25, extraTone: "gray", category: "ބަޔާން", quoteBox: "none", quoteSize: 34, quoteAlign: "justify", showHeadline: false, footer: foot(["facebook", "x", "instagram"]) },
  },
  {
    id: "tanween", name: "Chalk Grid & Books", description: "Dark chalkboard grain, torn edges, red halo circle, B&W portrait, books with flower, torn note card",
    swatch: ["#2a2e2c", "#9b2a26", "#f2d21b"],
    apply: { layout: "tanween", bgType: "noise", bgColor: "#2b2f2d", textureOpacity: 1, accent: "#9b2a26", cardColor: "#e8e6e0", highlightColor: "#f2d21b", highlightText: "#111111", textColor: "#ffffff", photoTone: "gray", photoOutline: 0, photoShadow: true, quoteSize: 32, quoteAlign: "center", quoteBox: "none", watermark: "ތާރީޚު", showHeadline: false, tornEdges: true, footer: foot(["x", "instagram"]) },
  },
  {
    id: "vintage", name: "Paper Sheet on Sky", description: "Cyan sky clouds, crumpled paper sheet, faded B&W portrait over pale circle, corner ornaments, name rule",
    swatch: ["#9fe0e6", "#ecebe8", "#3d4a50"],
    apply: { layout: "vintage", bgType: "bokeh", bgColor: "#a8e3e8", bgColor2: "#22c3cf", accent: "#7fd3d8", accent2: "#ffffff", cardColor: "#ecebe8", cardText: "#3d4a50", textColor: "#ffffff", textureOpacity: 0.85, photoTone: "gray", photoShadow: false, quoteSize: 32, quoteAlign: "justify", quoteMark: "big", quoteBox: "none", showHeadline: false, footer: foot(["instagram"]) },
  },
  {
    id: "tweet", name: "Tweet on Torn Paper", description: "Tinted landmark photo on top, torn paper bottom, name + @handle tag, big teal quote marks, date, social circles",
    swatch: ["#22384f", "#efefed", "#1f9c8f"],
    apply: { layout: "tweet", bgType: "solid", bgColor: "#22384f", accent: "#1f9c8f", cardColor: "#efefed", cardText: "#203040", extraTone: "duotone", textureOpacity: 0.6, highlightColor: "transparent", highlightText: "#1f9c8f", quoteSize: 32, quoteAlign: "justify", quoteMark: "big", quoteBox: "none", showDate: true, date: "ހޯމަ · 19 އޮކްޓޫބަރު 2026", handle: "@khabaru", showHeadline: false, footer: foot(["youtube", "x", "facebook", "tiktok"]) },
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

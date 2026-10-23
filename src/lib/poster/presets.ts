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
    id: "photonews", name: "Tinted Photo Story", description: "Full-bleed photo with colour tint, yellow kicker headline, giant outline number, handle corner",
    swatch: ["#24484a", "#f6e27a", "#ffffff"],
    apply: { layout: "photonews", bgType: "solid", bgColor: "#1d3a3c", accent: "#3f8f8a", accent2: "#f6e27a", textColor: "#ffffff", highlightColor: "transparent", highlightText: "#f6e27a", headlineStyle: "plain", headlineSize: 64, quoteSize: 34, quoteAlign: "start", quoteBox: "none", quoteMark: "none", showHeadline: true, headline: "*ހުއްޓުމެއް ނެތް!*", quote: "ސާފުކުރާ މުވައްޒަފުން ކޮންމެ ދުވަހަކު 6 އިން 12 ކިލޯމީޓަރު ހިނގާ، ދުވާލަކު *800* ފަހަރު ބޯލަނބާ!", dateBig: "800", showCategory: false, showDecor: true, finish: 0.5, footer: foot([]) },
  },
  {
    id: "cutblue", name: "Blue Cut-out Collage", description: "Flat blue grain, bold lead text, B&W cut-out over yellow block, grid lines, doodles and !!",
    swatch: ["#2c6db5", "#f2d23b", "#f26b2a"],
    apply: { layout: "cutblue", bgType: "noise", bgColor: "#2f6fb6", textureOpacity: 0.7, accent: "#2f6fb6", accent2: "#f2d23b", highlightColor: "#f26b2a", highlightText: "#ffffff", textColor: "#ffffff", headlineStyle: "plain", headlineSize: 46, quoteSize: 34, quoteAlign: "start", quoteBox: "none", quoteMark: "none", photoTone: "gray", photoOutline: 0, photoShadow: false, photoScale: 90, showCategory: false, footer: foot(["tiktok", "instagram", "facebook"]) },
  },
  {
    id: "didyouknow", name: "Did You Know?", description: "Warm cream, glossy red label with yellow question mark, highlighted fact text, white social chip",
    swatch: ["#f8ecd6", "#c2361b", "#f2b417"],
    apply: { layout: "didyouknow", bgType: "bokeh", bgColor: "#f8eedc", bgColor2: "#f3c76b", accent: "#a8241a", accent2: "#f2b417", highlightColor: "transparent", highlightText: "#a8241a", textColor: "#6b4a1e", headlineSize: 72, headline: "ތިޔަބޭފުޅާ\nދަންނަވާތަ", quote: "ޓެކް ހުނަރެއް ދަސްކުރަން ރަނގަޅު ގޮތަކީ *ތިބާގެ ވަރުގަދަ ކަންކަމާ* ގުޅޭ ހުނަރެއް ހޮވުން. އޭރުން އަބަދުވެސް ކުރާ ކަމެއް *އާ ވަސީލަތްތަކާއެކު* ކުރާހެން ހީވާނެ.", quoteSize: 38, quoteAlign: "start", quoteBox: "none", quoteMark: "none", showCategory: false, footer: foot(["x", "instagram", "facebook", "youtube", "website"]) },
  },
  {
    id: "breakcard", name: "Breaking Card on Photo", description: "Photo background, white rounded card with red pill badge, centred story, rule and website",
    swatch: ["#7fa7d4", "#ffffff", "#c4161c"],
    apply: { layout: "breakcard", bgType: "solid", bgColor: "#1b3350", cardColor: "#ffffff", cardText: "#1a1a1a", highlightColor: "#c4161c", highlightText: "#ffffff", textColor: "#ffffff", headlineSize: 44, quoteSize: 32, quoteBox: "none", quoteMark: "none", showHeadline: false, category: "ބްރޭކިންގް ނިއުސް", showCategory: true, photoOutline: 0, photoShadow: false, footer: foot(["website"]) },
  },
  {
    id: "tabloid", name: "Black Tabloid", description: "Photo top fading to black, yellow topic pill, condensed headline with yellow highlight, Read-more button, source",
    swatch: ["#0a0a0a", "#ffe500", "#e11d2a"],
    apply: { layout: "tabloid", bgType: "solid", bgColor: "#0a0a0a", accent: "#e11d2a", accent2: "#ffe500", highlightColor: "#ffe500", highlightText: "#0a0a0a", textColor: "#ffffff", headlineStyle: "plain", headlineSize: 64, quoteSize: 32, quoteBox: "none", quoteMark: "none", category: "ސިޔާސީ", showCategory: true, cta: "ތަފްސީލު", photoOutline: 0, photoShadow: false, latinFont: "Bebas Neue", footer: foot([]) },
  },
  {
    id: "mono", name: "Mono Feature", description: "Black-and-white photo, mint masthead rule, spaced tagline, kicker label, giant two-tone headline, swipe line",
    swatch: ["#151817", "#98d4b9", "#ffffff"],
    apply: { layout: "mono", bgType: "solid", bgColor: "#121514", accent: "#98d4b9", textColor: "#ffffff", headlineSize: 96, headline: "އޭނާ ކިޔަވައިދިނީ\n*މެޝިނަށް ފެނުން*", quoteSize: 32, quoteAlign: "start", quoteBox: "none", quoteMark: "none", category: "ފަރާތްތައް", showCategory: true, showDate: true, date: "No. 043", tagline: "މާދަމާ ބިނާކުރާ މީހުންގެ ވާހަކަ", cta: "ކިޔުމަށް ސްވައިޕް ކުރޭ", photoTone: "gray", footer: foot([]) },
  },
  {
    id: "montage", name: "Investigation Montage", description: "Cream page, black centre with yellow + blue blocks, three portraits, black serif headline box",
    swatch: ["#fff1e5", "#0d0d0d", "#f2c200"],
    apply: { layout: "montage", bgType: "solid", bgColor: "#fff1e5", bgColor2: "#0d0d0d", cardColor: "#0d0d0d", accent: "#1f3f9a", accent2: "#f2c200", textColor: "#1a1a1a", highlightColor: "transparent", highlightText: "#f2c200", headlineSize: 52, quoteSize: 34, quoteBox: "none", quoteMark: "none", photoTone: "gray", photo2Tone: "gray", photoOutline: 0, photoShadow: false, extraTone: "duotone", category: "ކޮރަޕްޝަން", showCategory: true, latinFont: "Playfair Display", footer: foot(["x", "facebook"]) },
  },
  {
    id: "redstory", name: "Red Story Panel", description: "Story format: photo on top with 'Breaking' label, slanted red panel with topic, headline, date, swipe-up",
    swatch: ["#d11a1a", "#ffffff", "#1c1c1c"],
    apply: { layout: "redstory", aspect: "9:16", bgType: "solid", bgColor: "#d11a1a", accent: "#d11a1a", textColor: "#ffffff", highlightColor: "#ffffff", highlightText: "#d11a1a", headlineStyle: "plain", headlineSize: 64, tagline: "ބްރޭކިންގް\nނިއުސް", category: "ސިޔާސީ", showCategory: true, showDate: true, cta: "ތަފްސީލަށް މައްޗަށް", photoOutline: 0, photoShadow: false, footer: foot([]) },
  },
  {
    id: "wire", name: "Wire Service", description: "White newswire page, square brand mark, kicker, big headline, photo strip and rule footer",
    swatch: ["#ffffff", "#ff8000", "#1a1a1a"],
    apply: { layout: "wire", bgType: "solid", bgColor: "#ffffff", accent: "#ff8000", textColor: "#1a1a1a", highlightColor: "transparent", highlightText: "#ff8000", headlineSize: 58, quoteSize: 32, quoteBox: "none", quoteMark: "none", showDate: true, category: "ދުނިޔެ", showCategory: true, finish: 0.2, footer: foot(["x", "website"]) },
  },
  {
    id: "pullquote", name: "Red Pull Quote", description: "Solid red, giant white quote mark, bold quote with yellow marker, name under a short bar",
    swatch: ["#d7261e", "#ffffff", "#ffe14d"],
    apply: { layout: "pullquote", bgType: "solid", bgColor: "#d7261e", cardColor: "#ffffff", textColor: "#ffffff", highlightColor: "#ffe14d", highlightText: "#1a1a1a", quoteSize: 40, quoteBox: "none", quoteMark: "none", showHeadline: false, finish: 0.4, footer: foot(["x", "instagram", "facebook"]) },
  },
  {
    id: "splithalf", name: "Photo / Colour Split", description: "Photo on the top half, deep colour block with tab category and headline below",
    swatch: ["#0f2747", "#e63946", "#ffffff"],
    apply: { layout: "splithalf", bgType: "solid", bgColor2: "#0f2747", accent: "#e63946", accent2: "#ffffff", cardColor: "#ffffff", cardText: "#0f2747", textColor: "#ffffff", highlightColor: "#e63946", highlightText: "#ffffff", headlineSize: 56, quoteSize: 30, quoteBox: "none", quoteMark: "none", category: "ސިޔާސީ", showCategory: true, footer: foot(["x", "instagram", "facebook", "website"]) },
  },
  {
    id: "stacked", name: "Stacked Line Boxes", description: "Documentary style: each headline line in its own box over a darkened photo",
    swatch: ["#111111", "#ffffff", "#e11d48"],
    apply: { layout: "stacked", bgType: "solid", bgColor: "#0b0b0b", accent: "#e11d48", cardColor: "#ffffff", cardText: "#111111", textColor: "#ffffff", highlightColor: "#e11d48", highlightText: "#ffffff", headlineSize: 58, headline: "ރައީސް ވިދާޅުވަނީ\n*ޤައުމީ ދުވަހެއް*\nފާހަގަކުރަން", category: "ޚާއްޞަ", showCategory: true, footer: foot(["x", "instagram"]) },
  },
  {
    id: "circlequote", name: "Circle Portrait Quote", description: "Clean light card: ringed circle portrait, round quote badge, centred quote and name",
    swatch: ["#f6f4ef", "#1e6f5c", "#e9c46a"],
    apply: { layout: "circlequote", bgType: "solid", bgColor: "#f6f4ef", accent: "#1e6f5c", accent2: "#e9c46a", textColor: "#1f2a2a", highlightColor: "#e9c46a", highlightText: "#1f2a2a", quoteSize: 36, quoteAlign: "center", quoteBox: "none", showHeadline: false, finish: 0.2, footer: foot(["x", "instagram", "facebook"]) },
  },
  {
    id: "livebar", name: "Live Broadcast Bar", description: "TV lower-third: LIVE tag, red topic tab, white headline bar and running ticker",
    swatch: ["#c8102e", "#ffffff", "#0b2545"],
    apply: { layout: "livebar", bgType: "solid", bgColor: "#000000", accent: "#0b2545", cardColor: "#ffffff", cardText: "#0b2545", highlightColor: "#c8102e", highlightText: "#ffffff", textColor: "#ffffff", headlineSize: 50, category: "ބްރޭކިންގް", showCategory: true, tagline: "މާލެ · ހުޅުމާލެ · އައްޑޫ · ކުޅުދުއްފުށި", photoOutline: 0, photoShadow: false, footer: foot([]) },
  },
  {
    id: "magazine", name: "Magazine Cover", description: "Huge masthead, full-bleed photo, issue date and cover lines at the bottom",
    swatch: ["#111111", "#ffcc00", "#ffffff"],
    apply: { layout: "magazine", bgType: "solid", bgColor: "#111111", accent2: "#ffcc00", textColor: "#ffffff", highlightColor: "transparent", highlightText: "#ffcc00", headlineSize: 68, quoteSize: 30, quoteBox: "none", quoteMark: "none", showDate: true, category: "ޚާއްޞަ ރިޕޯޓު", showCategory: true, photoOutline: 0, footer: foot(["instagram"]) },
  },
  {
    id: "bignumber", name: "Big Number Stat", description: "One giant figure, heavy rule, headline and short explanation — data-led posts",
    swatch: ["#f2efe6", "#0a7f5a", "#111111"],
    apply: { layout: "bignumber", bgType: "noise", bgColor: "#f2efe6", accent: "#0a7f5a", textColor: "#111111", highlightColor: "#0a7f5a", highlightText: "#ffffff", dateBig: "72%", headline: "ރަށްރަށުގެ ގޭބިސީތަކުން *72 އިންސައްތަ*އަށް ސާފު ފެން", headlineSize: 52, quoteSize: 30, quoteBox: "none", quoteMark: "none", category: "ޑޭޓާ", showCategory: true, footer: foot(["x", "website"]) },
  },
  {
    id: "minimalquote", name: "Minimal Quote", description: "Lots of white space, short accent bar, large quote, tiny brand line",
    swatch: ["#fafafa", "#111111", "#2563eb"],
    apply: { layout: "minimalquote", bgType: "solid", bgColor: "#fafafa", accent: "#2563eb", textColor: "#111111", highlightColor: "transparent", highlightText: "#2563eb", quoteSize: 38, quoteBox: "none", quoteMark: "none", showHeadline: false, finish: 0, footer: foot([]) },
  },
  {
    id: "darkportrait", name: "Dark Portrait Quote", description: "Speaker cut-out fading into a dark side, big quote mark, quote and gold name",
    swatch: ["#0d1117", "#d4a72c", "#ffffff"],
    apply: { layout: "darkportrait", bgType: "dark", bgColor: "#0d1117", bgColor2: "#1f2937", accent: "#d4a72c", textColor: "#ffffff", highlightColor: "#d4a72c", highlightText: "#0d1117", quoteSize: 36, quoteBox: "none", showHeadline: false, photoOutline: 0, footer: foot(["x", "instagram", "facebook"]) },
  },
  {
    id: "thickframe", name: "Thick Colour Frame", description: "Bold coloured border around the photo, headline card overlapping the bottom edge",
    swatch: ["#ffd60a", "#111111", "#ffffff"],
    apply: { layout: "thickframe", bgType: "solid", bgColor: "#ffd60a", cardColor: "#111111", cardText: "#ffffff", textColor: "#111111", highlightColor: "#ffd60a", highlightText: "#111111", headlineSize: 50, category: "ޚަބަރު", showCategory: true, footer: foot(["x", "instagram", "facebook"]) },
  },
  {
    id: "notes", name: "Notes App Statement", description: "Phone notes screen for official statements and apologies, date, headline and text",
    swatch: ["#efe9dd", "#ffffff", "#e0a100"],
    apply: { layout: "notes", bgType: "solid", bgColor: "#efe9dd", cardColor: "#ffffff", cardText: "#1c1c1e", accent: "#e0a100", textColor: "#1c1c1e", highlightColor: "#ffe08a", highlightText: "#1c1c1e", headlineSize: 46, quoteSize: 30, quoteBox: "none", quoteMark: "none", showDate: true, footer: foot(["x", "instagram"]) },
  },
  {
    id: "polaroid", name: "Polaroid Snapshot", description: "Tilted instant photo with tape and caption, headline below — soft features",
    swatch: ["#c9dfe8", "#ffffff", "#f4a261"],
    apply: { layout: "polaroid", bgType: "paper", bgColor: "#c9dfe8", accent2: "#f4a261", textColor: "#1d3557", highlightColor: "#f4a261", highlightText: "#1d3557", headlineSize: 50, quoteSize: 28, quoteBox: "none", quoteMark: "none", category: "ފީޗަރ", photoOutline: 0, footer: foot(["instagram", "facebook"]) },
  },
  {
    id: "duoblast", name: "Duotone Blast", description: "Full photo in brand duotone, huge headline at the bottom, minimal chrome",
    swatch: ["#3a0ca3", "#f72585", "#ffffff"],
    apply: { layout: "duoblast", bgType: "solid", bgColor: "#240046", accent: "#f72585", textColor: "#ffffff", highlightColor: "#f72585", highlightText: "#ffffff", headlineSize: 64, category: "ޒުވާނުން", showCategory: true, photoOutline: 0, footer: foot(["instagram", "tiktok"]) },
  },
  {
    id: "bandnews", name: "Broadcaster Band", description: "Coloured top band with logo, thin accent bar, photo, headline and bottom social band",
    swatch: ["#1d4ed8", "#facc15", "#ffffff"],
    apply: { layout: "bandnews", bgType: "solid", bgColor: "#ffffff", accent: "#1d4ed8", accent2: "#facc15", textColor: "#0f172a", highlightColor: "#facc15", highlightText: "#0f172a", headlineSize: 52, quoteSize: 30, quoteBox: "none", quoteMark: "none", category: "ލޯކަލް", showCategory: true, footer: foot(["x", "instagram", "facebook", "website"]) },
  },
  {
    id: "sidebar", name: "Side Category Bar", description: "Tall colour bar with rotated topic, photo, headline and summary on a clean page",
    swatch: ["#f8fafc", "#0f766e", "#0f172a"],
    apply: { layout: "sidebar", bgType: "solid", bgColor: "#f8fafc", accent: "#0f766e", textColor: "#0f172a", highlightColor: "#0f766e", highlightText: "#ffffff", headlineSize: 50, quoteSize: 30, quoteBox: "none", quoteMark: "none", category: "އިޤްތިޞާދު", showCategory: true, footer: foot(["x", "website"]) },
  },
  {
    id: "marker", name: "Marker Explainer", description: "Explainer headline with thick yellow marker highlights, small round author photo",
    swatch: ["#ffffff", "#ffe600", "#111111"],
    apply: { layout: "marker", bgType: "grid", bgColor: "#ffffff", accent: "#6d28d9", accent2: "#ede9fe", textColor: "#111111", highlightColor: "#ffe600", highlightText: "#111111", headlineSize: 60, quoteSize: 30, quoteBox: "none", quoteMark: "none", category: "ހަމަޖެހުން", showCategory: true, patternOpacity: 0.5, footer: foot(["x", "instagram"]) },
  },
  {
    id: "photoquote", name: "Photo + Quote Block", description: "Black-and-white photo with a solid colour quote block and square quote badge",
    swatch: ["#2b2d42", "#ef233c", "#edf2f4"],
    apply: { layout: "photoquote", bgType: "solid", bgColor: "#2b2d42", accent: "#ef233c", accent2: "#edf2f4", textColor: "#ffffff", highlightColor: "#2b2d42", highlightText: "#ffffff", quoteSize: 34, quoteBox: "none", showHeadline: false, photoOutline: 0, footer: foot(["x", "instagram", "facebook"]) },
  },
  {
    id: "explainer", name: "What We Know", description: "Numbered key points (one per quote line) under a ruled headline — explainers & updates",
    swatch: ["#fffaf0", "#b91c1c", "#1f2937"],
    apply: { layout: "explainer", bgType: "paper", bgColor: "#fffaf0", accent: "#b91c1c", textColor: "#1f2937", highlightColor: "#fde68a", highlightText: "#1f2937", headline: "މިހާތަނަށް *އެނގިފައިވާ* ކަންކަން", headlineSize: 54, quoteSize: 32, lineHeight: 1.7, quote: "ހާދިސާ ހިނގީ ރޭގަނޑު 11:00 ހާއިރު\nއެއްވެސް މީހަކަށް *އަނިޔާއެއް ނުވޭ*\nފުލުހުން ތަޙުޤީޤު ކުރަމުން ދަނީ", quoteBox: "none", quoteMark: "none", category: "އަޕްޑޭޓް", showCategory: true, footer: foot(["x", "website"]) },
  },
  {
    id: "condolence", name: "Condolence Notice", description: "Respectful black card with double gold frame, grey round portrait, name and message",
    swatch: ["#0b0b0b", "#c9a227", "#f5f5f5"],
    apply: { layout: "condolence", bgType: "solid", bgColor: "#0b0b0b", accent2: "#c9a227", textColor: "#f5f5f5", headline: "ތަޢުޒިޔާ", headlineSize: 64, quote: "އިންނާ ލިއްލާހި ވައިންނާ އިލައިހި ރާޖިޢޫން. ވަރަށް ހިތާމައާއެކު ތަޢުޒިޔާ ދަންނަވަމެވެ.", quoteSize: 30, quoteBox: "none", quoteMark: "none", showCategory: false, photoTone: "gray", finish: 0.3, footer: foot([]) },
  },
  {
    id: "gradient", name: "Social Gradient Card", description: "Vivid two-colour gradient, white tag, oversized headline and pill social footer",
    swatch: ["#ff4d6d", "#7b2cbf", "#ffffff"],
    apply: { layout: "gradient", bgType: "solid", accent: "#7b2cbf", accent2: "#ff4d6d", textColor: "#ffffff", highlightColor: "#ffffff", highlightText: "#7b2cbf", headlineSize: 60, quoteSize: 30, quoteBox: "none", quoteMark: "none", category: "ވައިރަލް", showCategory: true, footer: foot(["instagram", "tiktok", "x"]) },
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

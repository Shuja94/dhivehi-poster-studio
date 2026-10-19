import type { FooterKind } from "./types";

export const FOOTER_LABELS: Record<FooterKind, string> = {
  whatsapp: "WhatsApp", x: "Twitter / X", instagram: "Instagram", facebook: "Facebook", youtube: "YouTube",
  tiktok: "TikTok", website: "Website", phone: "Phone", email: "Email",
};
export const FOOTER_PLACEHOLDERS: Record<FooterKind, string> = {
  whatsapp: "+960 7xx xxxx", x: "@youroutlet", instagram: "@youroutlet", facebook: "youroutlet", youtube: "@youroutlet",
  tiktok: "@youroutlet", website: "youroutlet.mv", phone: "+960 3xx xxxx", email: "news@youroutlet.mv",
};

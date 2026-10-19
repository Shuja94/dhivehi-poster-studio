import type { CSSProperties, ReactNode } from "react";
import { Facebook, Instagram, Youtube, Twitter, Music2, Globe, Phone, Mail, MessageCircle } from "lucide-react";
import paperTexture from "@/assets/paper-texture.jpg";
import type { FooterKind, PosterState } from "@/lib/poster/types";

/* Poster artwork is user-coloured: inline colour values here are intentional. */

export const fam = (latin: string, thaana: string) => `"${latin}", "${thaana}", "Faruma", sans-serif`;

/** Shaping-friendly settings so Thaana fili (vowel marks) sit cleanly. */
export const THAANA_TYPO: CSSProperties = {
  letterSpacing: 0,
  wordSpacing: "0.06em",
  fontKerning: "normal",
  textRendering: "optimizeLegibility",
  fontFeatureSettings: '"kern", "mark", "mkmk", "liga"',
  unicodeBidi: "plaintext",
};

export function Rich({ text, s, bg, fg }: { text: string; s: PosterState; bg?: string; fg?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") && p.length > 2 ? (
          <span key={i} style={{ background: bg ?? s.highlightColor, color: fg ?? s.highlightText, padding: "0 0.16em", borderRadius: 3, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", fontWeight: 700 }}>
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function torn(seed: number, amp = 1.2) {
  const pts: string[] = [];
  const r = (n: number) => {
    const x = Math.sin(seed * 999 + n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const steps = 48;
  for (let i = 0; i <= steps; i++) pts.push(`${(i / steps) * 100}% ${r(i) * amp}%`);
  for (let i = 0; i <= steps; i++) pts.push(`${100 - r(i + 50) * amp * 0.4}% ${(i / steps) * 100}%`);
  for (let i = steps; i >= 0; i--) pts.push(`${(i / steps) * 100}% ${100 - r(i + 100) * amp}%`);
  for (let i = steps; i >= 0; i--) pts.push(`${r(i + 150) * amp * 0.4}% ${(i / steps) * 100}%`);
  return `polygon(${pts.join(",")})`;
}

/* ---------- backgrounds ---------- */

function topoPaths(w: number, h: number) {
  const centers: [number, number, number][] = [[0.12, 0.18, 1], [0.88, 0.62, 2], [0.3, 0.95, 3], [0.95, 0.05, 4]];
  const out: string[] = [];
  for (const [cx, cy, seed] of centers) {
    for (let r = 30; r < 700; r += 42) {
      let d = "";
      for (let k = 0; k <= 64; k++) {
        const a = (k / 64) * Math.PI * 2;
        const rr = r * (1 + 0.14 * Math.sin(3 * a + seed) + 0.08 * Math.sin(5 * a + r * 0.013 + seed));
        d += `${k ? "L" : "M"}${(cx * w + Math.cos(a) * rr).toFixed(1)},${(cy * h + Math.sin(a) * rr * 0.85).toFixed(1)}`;
      }
      out.push(d + "Z");
    }
  }
  return out;
}

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`;

export function Background({ s, w, h }: { s: PosterState; w: number; h: number }) {
  const base: CSSProperties = { position: "absolute", inset: 0 };
  const t = s.bgType;
  const pc = s.patternColor || s.accent;
  const po = s.patternOpacity ?? 1;
  const ps = s.patternScale ?? 1;
  let bg = s.bgColor;
  if (t === "dark") bg = `radial-gradient(120% 90% at 70% 60%, ${s.bgColor}, ${s.bgColor2})`;
  if (t === "mesh") bg = `radial-gradient(60% 50% at 15% 10%, ${s.accent}88, transparent), radial-gradient(60% 60% at 90% 90%, ${s.bgColor2}aa, transparent), radial-gradient(50% 50% at 80% 20%, ${s.accent2}66, transparent), ${s.bgColor}`;
  if (t === "bokeh") bg = `linear-gradient(160deg, #ffffff 0%, ${s.bgColor} 45%, ${s.bgColor} 70%, ${s.bgColor2}66 100%)`;
  if (t === "grid") bg = `radial-gradient(70% 60% at 85% 60%, ${s.accent2}22, transparent), ${s.bgColor}`;
  return (
    <>
      <div style={{ ...base, background: bg }} />
      {t === "image" && s.bgImage && <img src={s.bgImage} alt="" style={{ ...base, width: "100%", height: "100%", objectFit: "cover" }} />}
      {t === "paper" && <img src={paperTexture} alt="" style={{ ...base, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: s.textureOpacity }} />}
      {t === "noise" && <div style={{ ...base, backgroundImage: NOISE, opacity: s.textureOpacity * 0.45, mixBlendMode: "overlay" }} />}
      {t === "grid" && (
        <div style={{ ...base, backgroundImage: `linear-gradient(${pc}14 2px, transparent 2px), linear-gradient(90deg, ${pc}14 2px, transparent 2px)`, backgroundSize: `${72 * ps}px ${72 * ps}px`, opacity: Math.min(1, po) }} />
      )}
      {t === "topo" && (
        <svg width={w} height={h} viewBox={`0 0 ${w / ps} ${h / ps}`} preserveAspectRatio="none" style={base}>
          {topoPaths(w / ps, h / ps).map((d, i) => <path key={i} d={d} fill="none" stroke={pc} strokeOpacity={Math.min(1, 0.35 * po)} strokeWidth={2} />)}
        </svg>
      )}
      {t === "bokeh" && (
        <>
          {[[12, 18, 260, "#ffffff", 0.9], [80, 12, 220, "#ffffff", 0.7], [88, 80, 380, s.bgColor2, 0.35], [6, 88, 300, s.accent2, 0.25], [50, 45, 180, "#ffffff", 0.5], [30, 60, 120, "#ffffff", 0.6]].map(([x, y, r, c, o], i) => (
            <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: r as number, height: r as number, marginLeft: -(r as number) / 2, marginTop: -(r as number) / 2, borderRadius: "50%", background: c as string, opacity: Math.min(1, (o as number) * po), filter: "blur(50px)" }} />
          ))}
          {s.showDecor && (
            <svg width={w} height={h} style={base}>
              <defs>
                <linearGradient id="streak" x1="0" x2="1">
                  <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset=".5" stopColor="#fff6d8" stopOpacity=".9" />
                  <stop offset="1" stopColor={s.accent2} stopOpacity=".7" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map((i) => (
                <path key={i} d={`M ${-100} ${h * 0.95 - i * 26} C ${w * 0.35} ${h * 0.9 - i * 30}, ${w * 0.7} ${h * 0.72 - i * 20}, ${w + 100} ${h * 0.55 - i * 40}`} fill="none" stroke="url(#streak)" strokeWidth={i === 1 ? 5 : 2} opacity={Math.min(1, (0.8 - i * 0.15) * po)} />
              ))}
            </svg>
          )}
        </>
      )}
      {s.showGrid && t !== "grid" && (
        <div style={{ ...base, backgroundImage: "linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px)", backgroundSize: `${36 * ps}px ${36 * ps}px`, opacity: Math.min(1, po) }} />
      )}
    </>
  );
}

/* ---------- photo ---------- */

export function Photo({ s, style, ghost, noFx, scale = 1 }: { s: PosterState; style?: CSSProperties; ghost?: boolean; noFx?: boolean; scale?: number }) {
  if (!s.photo) return null;
  const o = noFx || ghost ? 0 : s.photoOutline;
  const filters = [
    s.photoTone !== "color" ? "grayscale(1) contrast(1.08)" : "",
    o > 0 ? `drop-shadow(${o}px 0 0 #fff) drop-shadow(-${o}px 0 0 #fff) drop-shadow(0 ${o}px 0 #fff) drop-shadow(0 -${o}px 0 #fff)` : "",
    !noFx && !ghost && s.photoShadow ? "drop-shadow(0 18px 24px rgba(0,0,0,.35))" : "",
    ghost ? "blur(1px)" : "",
  ].join(" ");
  return (
    <div style={{ position: "absolute", bottom: 0, left: "50%", height: `${s.photoScale * scale}%`, transform: `translate(calc(-50% + ${s.photoX}px), ${s.photoY}px)`, opacity: ghost ? 0.22 : 1, ...style }}>
      <img src={s.photo} alt="" style={{ height: "100%", width: "auto", maxWidth: "none", display: "block", filter: filters }} />
      {s.photoTone === "duotone" && (
        <div style={{ position: "absolute", inset: 0, background: s.accent, mixBlendMode: "color", maskImage: `url(${s.photo})`, maskSize: "100% 100%" }} />
      )}
    </div>
  );
}

/* ---------- text bits ---------- */

export function QuoteGlyph({ s, size, color, bg, mode }: { s: PosterState; size: number; color: string; bg?: string; mode?: "box" | "big" | "circle" | "none" }) {
  const m = mode ?? s.quoteMark;
  if (m === "none") return null;
  const glyph = s.dir === "rtl" ? "\u201D" : "\u201C";
  const g: CSSProperties = { fontFamily: '"Archivo Black", Georgia, serif', lineHeight: 1 };
  if (m === "box" || m === "circle")
    return (
      <div style={{ width: size, height: size, background: bg ?? s.accent, color, display: "grid", placeItems: "center", borderRadius: m === "circle" ? "50%" : 6, ...g, fontSize: size * 0.9, paddingTop: size * 0.32 }}>
        {glyph}
      </div>
    );
  return <div style={{ ...g, fontSize: size * 1.5, color: bg ?? s.accent, height: size * 0.8 }}>{glyph}</div>;
}

export function QuoteText({ s, color, size, align, style }: { s: PosterState; color: string; size?: number; align?: PosterState["quoteAlign"]; style?: CSSProperties }) {
  const a = align ?? s.quoteAlign;
  return (
    <div style={{ fontFamily: fam(s.latinFont, s.bodyFont), fontSize: size ?? s.quoteSize, lineHeight: s.lineHeight, color, textAlign: a, textAlignLast: a === "justify" ? "start" : undefined, whiteSpace: "pre-wrap", ...THAANA_TYPO, ...style }}>
      <Rich text={s.quote} s={s} />
    </div>
  );
}

export function Translation({ s, color, size = 24, style }: { s: PosterState; color: string; size?: number; style?: CSSProperties }) {
  if (!s.showTranslation || !s.translation) return null;
  return (
    <div dir="ltr" style={{ fontFamily: `"${s.latinFont}", sans-serif`, fontSize: size, lineHeight: 1.55, color, opacity: 0.8, textAlign: s.dir === "rtl" ? "right" : "left", ...style }}>
      {s.translation}
    </div>
  );
}

export function Headline({ s, color, style }: { s: PosterState; color: string; style?: CSSProperties }) {
  if (!s.showHeadline) return null;
  const font = fam(s.latinFont, s.headlineFont);
  const lines = s.headline.split("\n");
  const wrap: CSSProperties = { transform: `translateY(${s.headlineOffset}px)`, ...style };
  if (s.headlineStyle === "strip")
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, ...wrap }}>
        {lines.map((l, i) => (
          <div key={i} style={{ filter: "drop-shadow(0 6px 8px rgba(0,0,0,.2))", transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)` }}>
            <div style={{ background: s.cardColor, color: s.cardText, fontFamily: font, fontSize: s.headlineSize, lineHeight: 1.55, padding: "6px 28px", clipPath: s.tornEdges ? torn(i + 3, 6) : undefined, ...THAANA_TYPO }}>
              <Rich text={l} s={s} />
            </div>
          </div>
        ))}
        <Translation s={s} color={color} style={{ marginTop: 8 }} />
      </div>
    );
  return (
    <div style={wrap}>
      <div style={{ fontFamily: font, fontSize: s.headlineSize, lineHeight: 1.5, color, whiteSpace: "pre-wrap", ...THAANA_TYPO, ...(s.headlineStyle === "block" ? { background: s.cardColor, color: s.cardText, padding: "16px 28px" } : {}) }}>
        <Rich text={s.headline} s={s} />
      </div>
      <Translation s={s} color={color} style={{ marginTop: 18 }} />
    </div>
  );
}

/* ---------- containers ---------- */

export function QuoteBox({ s, children, style, pad = "40px 48px", tail = true }: { s: PosterState; children: ReactNode; style?: CSSProperties; pad?: string; tail?: boolean }) {
  const outer: CSSProperties = { position: "relative", transform: `translateY(${s.quoteOffset}px)`, ...style };
  const Tail = ({ color, border }: { color: string; border?: string }) =>
    tail ? <div style={{ position: "absolute", bottom: -46, insetInlineEnd: "16%", width: 64, height: 48, background: color, clipPath: "polygon(0 0, 100% 0, 100% 100%)", borderTop: border }} /> : null;
  switch (s.quoteBox) {
    case "torn":
      return (
        <div style={{ ...outer, filter: "drop-shadow(0 12px 18px rgba(0,0,0,.28))" }}>
          <div style={{ background: s.cardColor, padding: pad, clipPath: s.tornEdges ? torn(4, 1.6) : undefined }}>{children}</div>
        </div>
      );
    case "frame":
      return (
        <div style={{ ...outer, border: `3px solid ${s.accent}`, padding: pad }}>
          {children}
          {tail && (
            <svg width="120" height="70" style={{ position: "absolute", bottom: -70, insetInlineStart: "8%", transform: s.dir === "rtl" ? "scaleX(-1)" : undefined }}>
              <polyline points="3,0 3,67 120,0" fill="none" stroke={s.accent} strokeWidth="3" />
            </svg>
          )}
        </div>
      );
    case "glass":
      return (
        <div style={{ ...outer, background: "rgba(255,255,255,.16)", border: "1.5px solid rgba(255,255,255,.4)", borderRadius: 48, padding: pad, backdropFilter: "blur(14px)", boxShadow: "0 20px 60px rgba(0,0,0,.15)" }}>
          {children}
          <Tail color="rgba(255,255,255,.28)" />
        </div>
      );
    case "speech":
      return (
        <div style={{ ...outer, background: s.cardColor, borderRadius: 36, padding: pad, boxShadow: "0 16px 40px rgba(0,0,0,.18)" }}>
          {children}
          <Tail color={s.cardColor} />
        </div>
      );
    case "arch":
      return <div style={{ ...outer, background: s.cardColor, borderStartEndRadius: "60% 45%", padding: pad }}>{children}</div>;
    default:
      return <div style={outer}>{children}</div>;
  }
}

/* ---------- branding / footer ---------- */

export function Outlet({ s, color, size = 56, style }: { s: PosterState; color: string; size?: number; style?: CSSProperties }) {
  if (!s.showOutlet) return null;
  const k = (s.logoSize ?? 100) / 100;
  return s.logo ? (
    <img src={s.logo} alt="" style={{ height: size * 1.9 * k, maxWidth: 300 * k, objectFit: "contain", ...style }} />
  ) : (
    <div style={{ fontFamily: fam(s.latinFont, s.outletFont), fontSize: size * k, color, lineHeight: 1.2, fontWeight: 700, ...THAANA_TYPO, ...style }}>{s.outlet}</div>
  );
}

/** Secondary image (dome, books, building, emblem) — fully user-adjustable. */
export function Extra({ s, fallback, style, cover }: { s: PosterState; fallback?: string; style?: CSSProperties; cover?: boolean }) {
  const src = s.extraImage ?? fallback;
  if (!src || !s.showExtra) return null;
  const tone = s.extraTone;
  return (
    <div style={{ position: "absolute", opacity: s.extraOpacity, transform: `translate(${s.extraX}px, ${s.extraY}px) scale(${s.extraScale / 100})`, transformOrigin: "center bottom", ...style }}>
      <img src={src} alt="" style={{ width: "100%", height: cover ? "100%" : "auto", objectFit: cover ? "cover" : "contain", display: "block", filter: tone !== "color" ? "grayscale(1) contrast(1.05)" : undefined }} />
      {tone === "duotone" && (
        <div style={{ position: "absolute", inset: 0, background: s.accent, mixBlendMode: "color", ...(cover ? {} : { maskImage: `url(${src})`, maskSize: "100% 100%" }) }} />
      )}
    </div>
  );
}

export function Watermark({ s, style }: { s: PosterState; style?: CSSProperties }) {
  if (!s.watermark || !s.showDecor) return null;
  const st = { ...style };
  if (typeof st.fontSize === "number") st.fontSize = st.fontSize * (s.watermarkSize / 100);
  st.opacity = Math.min(1, Number(st.opacity ?? 1) * s.watermarkOpacity);
  if (s.watermarkColor) st.color = s.watermarkColor;
  return <div style={{ position: "absolute", fontFamily: fam(s.latinFont, s.outletFont), whiteSpace: "nowrap", lineHeight: 1, pointerEvents: "none", ...st }}>{s.watermark}</div>;
}

export function Waves({ color, style, width = 260 }: { color: string; style?: CSSProperties; width?: number }) {
  const d = Array.from({ length: 6 }, (_, i) => `${i ? "" : "M0 20 "}Q ${i * 44 + 11} 0, ${i * 44 + 22} 20 T ${i * 44 + 44} 20`).join(" ");
  return (
    <svg width={width} height="90" viewBox="0 0 264 90" style={{ position: "absolute", ...style }}>
      <path d={d} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <path d={d} transform="translate(0 40)" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

export function Category({ s, style }: { s: PosterState; style?: CSSProperties }) {
  if (!s.showCategory || !s.category) return null;
  return (
    <span style={{ background: s.highlightColor, color: s.highlightText, fontFamily: fam(s.latinFont, s.nameFont), fontSize: 26, padding: "8px 22px", display: "inline-block", lineHeight: 1.5, ...THAANA_TYPO, ...style }}>
      {s.category}
    </span>
  );
}

const ICONS: Record<FooterKind, typeof Facebook> = {
  x: Twitter, instagram: Instagram, facebook: Facebook, youtube: Youtube, tiktok: Music2, website: Globe, phone: Phone, email: Mail, whatsapp: MessageCircle,
};

export type FooterVariant = "icons" | "bar" | "pill" | "split" | "line" | "stack" | "circles" | "squares";

export function Footer({ s, color, variant, bg, style }: { s: PosterState; color: string; variant: FooterVariant; bg?: string; style?: CSSProperties }) {
  if (!s.showFooter) return null;
  const items = s.footer.filter((f) => f.on);
  const iconOnly = items.filter((f) => !f.text);
  const withText = items.filter((f) => f.text);
  const txt: CSSProperties = { fontFamily: `"${s.latinFont}", "Faruma", sans-serif`, fontSize: 26, fontWeight: 600, whiteSpace: "nowrap" };
  const icon = (k: FooterKind, c: string, circle = false, size = 26) => {
    const I = ICONS[k];
    return circle ? (
      <span key={k} style={{ width: 46, height: 46, borderRadius: 999, background: c, display: "grid", placeItems: "center" }}><I size={24} color={bg ?? "#fff"} strokeWidth={2.4} /></span>
    ) : (
      <I key={k} size={size} color={c} strokeWidth={2.2} />
    );
  };
  const socialGroup = (c: string, circle = false) =>
    iconOnly.length > 0 && (
      <div style={{ display: "flex", alignItems: "center", gap: circle ? 12 : 14 }}>
        {iconOnly.map((f) => icon(f.kind, c, circle))}
        {s.handle && <span style={{ ...txt, color: c }}>{s.handle}</span>}
      </div>
    );
  const textItems = (c: string, column = false) =>
    withText.map((f) => (
      <div key={f.kind} style={{ display: "flex", alignItems: "center", gap: 10, color: c, ...(column ? {} : {}) }}>
        {icon(f.kind, c)} <span style={{ ...txt, color: c }}>{f.text}</span>
      </div>
    ));

  const row: CSSProperties = { display: "flex", alignItems: "center", direction: "ltr", ...style };

  if (variant === "circles" || variant === "squares")
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, ...style }}>
        <div style={{ display: "flex", gap: 10, direction: "ltr" }}>
          {items.map((f) => {
            const I = ICONS[f.kind];
            return <span key={f.kind} style={{ width: 46, height: 46, borderRadius: variant === "circles" ? 999 : 8, background: color, display: "grid", placeItems: "center" }}><I size={24} color={bg ?? "#fff"} strokeWidth={2.4} /></span>;
          })}
        </div>
        {s.handle && <span dir="ltr" style={{ ...txt, fontSize: 24, color }}>{s.handle}</span>}
      </div>
    );
  if (variant === "bar")
    return (
      <div style={{ ...row, justifyContent: "center", gap: 36, background: bg ?? s.accent, padding: "18px 40px" }}>
        {textItems(color)}
        {socialGroup(color)}
      </div>
    );
  if (variant === "pill")
    return (
      <div style={{ ...row, gap: 28, background: bg ?? "#ffffff", padding: "14px 34px", borderRadius: 999, boxShadow: "0 10px 30px rgba(0,0,0,.12)" }}>
        {socialGroup(color)}
        {textItems(color)}
      </div>
    );
  if (variant === "split")
    return (
      <div style={{ ...row, height: 76, direction: s.dir }}>
        <div style={{ flex: 1, height: "100%", background: s.accent2, display: "flex", alignItems: "center", padding: "0 36px", fontFamily: fam(s.latinFont, s.nameFont), fontSize: 30, color: "#fff", ...THAANA_TYPO }}>{s.category}</div>
        <div style={{ flex: 1.3, height: "100%", background: bg ?? "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 22, borderStartEndRadius: 38, borderEndEndRadius: 38, direction: "ltr", padding: "0 24px" }}>
          {socialGroup(color)}
          {textItems(color)}
        </div>
      </div>
    );
  if (variant === "line")
    return (
      <div style={{ ...row, justifyContent: "center", gap: 26, borderTop: `1.5px solid ${color}55`, paddingTop: 18, flexWrap: "wrap" }}>
        {socialGroup(color)}
        {textItems(color)}
      </div>
    );
  if (variant === "stack")
    return (
      <div style={{ ...row, justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{textItems(color, true)}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          {s.showCategory && <span style={{ fontFamily: fam(s.latinFont, s.nameFont), fontSize: 22, color, opacity: 0.8, ...THAANA_TYPO }}>{s.category.replace(/\n/g, " ")}</span>}
          {socialGroup(color)}
        </div>
      </div>
    );
  return (
    <div style={{ ...row, justifyContent: "space-between", gap: 20 }}>
      <div style={{ display: "flex", gap: 12 }}>{iconOnly.map((f) => icon(f.kind, color, true))}</div>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {textItems(color)}
        <span style={{ ...txt, fontSize: 30, color }}>{s.handle}</span>
      </div>
    </div>
  );
}

export function Partners({ s, style }: { s: PosterState; style?: CSSProperties }) {
  if (!s.partners.length) return null;
  return (
    <div style={{ display: "flex", gap: 30, alignItems: "center", ...style }}>
      {s.partners.map((p, i) => <img key={i} src={p} alt="" style={{ height: 64, maxWidth: 160, objectFit: "contain" }} />)}
    </div>
  );
}

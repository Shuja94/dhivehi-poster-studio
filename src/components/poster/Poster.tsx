import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { Facebook, Instagram, Youtube, Twitter, Music2, Send } from "lucide-react";
import paperTexture from "@/assets/paper-texture.jpg";
import type { PosterState } from "@/lib/poster/types";
import { ASPECTS } from "@/lib/poster/types";

/* Poster artwork uses user-chosen colours via inline styles; that is intended. */

const fam = (latin: string, thaana: string) => `"${latin}", "${thaana}", "Faruma", serif`;

function Rich({ text, s }: { text: string; s: PosterState }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") && p.length > 2 ? (
          <span
            key={i}
            style={{
              background: s.highlightColor,
              color: s.highlightText,
              padding: "0 0.18em",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
            }}
          >
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function torn(seed: number, amp = 1.2) {
  const pts: string[] = [];
  const r = (n: number) => {
    const x = Math.sin(seed * 999 + n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const steps = 40;
  for (let i = 0; i <= steps; i++) pts.push(`${(i / steps) * 100}% ${r(i) * amp}%`);
  for (let i = 0; i <= steps; i++) pts.push(`${100 - r(i + 50) * amp * 0.5}% ${(i / steps) * 100}%`);
  for (let i = steps; i >= 0; i--) pts.push(`${(i / steps) * 100}% ${100 - r(i + 100) * amp}%`);
  for (let i = steps; i >= 0; i--) pts.push(`${r(i + 150) * amp * 0.5}% ${(i / steps) * 100}%`);
  return `polygon(${pts.join(",")})`;
}

const ICONS: Record<string, typeof Facebook> = {
  x: Twitter, instagram: Instagram, facebook: Facebook, youtube: Youtube, tiktok: Music2, telegram: Send,
};

function Footer({ s, color }: { s: PosterState; color: string }) {
  if (!s.showFooter) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, color, direction: "ltr" }}>
      <div style={{ display: "flex", gap: 12 }}>
        {s.socials.map((k) => {
          const I = ICONS[k];
          return I ? (
            <span key={k} style={{ width: 44, height: 44, borderRadius: 999, background: color, display: "grid", placeItems: "center" }}>
              <I size={24} color={s.bgType === "gradient" || s.layout === "headline" ? "#0b0b0f" : s.bgColor} strokeWidth={2.4} />
            </span>
          ) : null;
        })}
      </div>
      <span style={{ fontFamily: `"Space Grotesk", sans-serif`, fontSize: 30, fontWeight: 600, letterSpacing: 0.5 }}>{s.handle}</span>
    </div>
  );
}

function Outlet({ s, color }: { s: PosterState; color: string }) {
  if (!s.showOutlet) return null;
  return s.logo ? (
    <img src={s.logo} alt="" style={{ height: 110, maxWidth: 260, objectFit: "contain" }} />
  ) : (
    <div style={{ fontFamily: fam(s.latinFont, s.outletFont), fontSize: 56, color, lineHeight: 1, fontWeight: 700 }}>{s.outlet}</div>
  );
}

function Category({ s }: { s: PosterState }) {
  if (!s.showCategory || !s.category) return null;
  return (
    <span style={{ background: s.highlightColor, color: s.highlightText, fontFamily: fam(s.latinFont, s.nameFont), fontSize: 26, padding: "8px 22px", display: "inline-block", lineHeight: 1.4 }}>
      {s.category}
    </span>
  );
}

function QuoteGlyph({ s, size, color, bg }: { s: PosterState; size: number; color: string; bg?: string }) {
  if (s.quoteMark === "none") return null;
  const glyph = s.dir === "rtl" ? "\u201D" : "\u201C";
  if (s.quoteMark === "box")
    return (
      <div style={{ width: size, height: size, background: bg ?? s.accent, color, display: "grid", placeItems: "center", fontFamily: "Georgia, serif", fontSize: size * 1.1, lineHeight: 1, paddingTop: size * 0.35, fontWeight: 700 }}>
        {glyph}
      </div>
    );
  return <div style={{ fontFamily: "Georgia, serif", fontSize: size * 1.6, color: bg ?? s.accent, lineHeight: 0.8, fontWeight: 700, height: size * 0.9 }}>{glyph}</div>;
}

function Photo({ s, style }: { s: PosterState; style?: CSSProperties }) {
  if (!s.photo) return null;
  const o = s.photoOutline;
  const filters = [
    s.photoGray ? "grayscale(1) contrast(1.05)" : "",
    o > 0 ? `drop-shadow(${o}px 0 0 #fff) drop-shadow(-${o}px 0 0 #fff) drop-shadow(0 ${o}px 0 #fff) drop-shadow(0 -${o}px 0 #fff)` : "",
    s.photoShadow ? "drop-shadow(0 18px 24px rgba(0,0,0,.35))" : "",
  ].join(" ");
  return (
    <img
      src={s.photo}
      alt=""
      crossOrigin="anonymous"
      style={{
        position: "absolute", bottom: 0, left: "50%", height: `${s.photoScale}%`, maxWidth: "none",
        transform: `translate(calc(-50% + ${s.photoX}px), ${s.photoY}px)`, filter: filters, ...style,
      }}
    />
  );
}

function Background({ s }: { s: PosterState }) {
  const base: CSSProperties = { position: "absolute", inset: 0 };
  return (
    <>
      <div style={{ ...base, background: s.bgType === "gradient" ? `radial-gradient(120% 90% at 70% 60%, ${s.bgColor}, ${s.bgColor2})` : s.bgColor }} />
      {s.bgType === "image" && s.bgImage && <img src={s.bgImage} alt="" style={{ ...base, width: "100%", height: "100%", objectFit: "cover" }} />}
      {s.bgType === "paper" && (
        <img src={paperTexture} alt="" style={{ ...base, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: s.textureOpacity }} />
      )}
      {s.showGrid && (
        <div style={{ ...base, backgroundImage: "linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      )}
    </>
  );
}

function Headline({ s, color }: { s: PosterState; color: string }) {
  if (!s.showHeadline) return null;
  const font = fam(s.latinFont, s.headlineFont);
  const lines = s.headline.split("\n");
  if (s.headlineStyle === "strip")
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, transform: `translateY(${s.headlineOffset}px)` }}>
        {lines.map((l, i) => (
          <div key={i} style={{ background: s.cardColor, color: s.cardText, fontFamily: font, fontSize: s.headlineSize, lineHeight: 1.45, padding: "4px 26px", clipPath: s.tornEdges ? torn(i + 3, 6) : undefined, transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)`, boxShadow: "0 6px 12px rgba(0,0,0,.18)" }}>
            <Rich text={l} s={s} />
          </div>
        ))}
      </div>
    );
  return (
    <div style={{ fontFamily: font, fontSize: s.headlineSize, lineHeight: 1.4, color, whiteSpace: "pre-wrap", transform: `translateY(${s.headlineOffset}px)`, ...(s.headlineStyle === "block" ? { background: s.cardColor, color: s.cardText, padding: "16px 28px" } : {}) }}>
      <Rich text={s.headline} s={s} />
    </div>
  );
}

function QuoteText({ s, color, children }: { s: PosterState; color: string; children?: ReactNode }) {
  return (
    <div style={{ fontFamily: fam(s.latinFont, s.bodyFont), fontSize: s.quoteSize, lineHeight: s.lineHeight, color, textAlign: s.quoteAlign, whiteSpace: "pre-wrap", textAlignLast: s.quoteAlign === "justify" ? "start" : undefined }}>
      <Rich text={s.quote} s={s} />
      {children}
    </div>
  );
}

export const Poster = forwardRef<HTMLDivElement, { s: PosterState }>(function Poster({ s }, ref) {
  const { w, h } = ASPECTS[s.aspect];
  const nameFont = fam(s.latinFont, s.nameFont);
  const root: CSSProperties = { width: w, height: h, position: "relative", overflow: "hidden", direction: s.dir, color: s.textColor };
  const pad = h > 1500 ? 80 : 64;

  if (s.layout === "headline") {
    return (
      <div ref={ref} style={root}>
        <Background s={s} />
        <div style={{ position: "absolute", inset: 0 }}>
          <Photo s={{ ...s, photoOutline: 0, photoShadow: false }} style={{ height: `${s.photoScale}%` }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 30%, ${s.bgColor}ee 68%, ${s.bgColor})` }} />
        <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Outlet s={s} color={s.textColor} />
            {s.showDate && <span style={{ fontFamily: nameFont, fontSize: 26, opacity: 0.85 }}>{s.date}</span>}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
            <Category s={s} />
            <Headline s={s} color={s.textColor} />
            {s.quote && s.quoteMark !== "none" && <QuoteText s={{ ...s, quoteSize: s.quoteSize * 0.8 }} color={s.textColor} />}
            {(s.name || s.designation) && (
              <div style={{ fontFamily: nameFont, fontSize: s.nameSize * 0.85, borderInlineStart: `6px solid ${s.accent}`, paddingInlineStart: 16, lineHeight: 1.5 }}>
                {s.name} {s.designation && <span style={{ opacity: 0.7 }}>· {s.designation}</span>}
              </div>
            )}
            <div style={{ height: 4, width: 140, background: s.accent }} />
          </div>
          <div style={{ marginTop: 36 }}><Footer s={s} color={s.textColor} /></div>
        </div>
      </div>
    );
  }

  if (s.layout === "bubble") {
    return (
      <div ref={ref} style={root}>
        <Background s={s} />
        <div style={{ position: "absolute", insetInlineStart: 0, bottom: 0, width: "58%", height: "62%" }}>
          <Photo s={s} />
        </div>
        <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Outlet s={s} color={s.textColor} />
            {s.showDate && (
              <div style={{ fontFamily: nameFont, fontSize: 30, color: s.accent, textAlign: "end", lineHeight: 1.3 }}>{s.date}</div>
            )}
          </div>
          <div style={{ marginTop: 50, transform: `translateY(${s.quoteOffset}px)`, position: "relative", background: "rgba(255,255,255,.08)", border: "1.5px solid rgba(255,255,255,.25)", borderRadius: 48, padding: "70px 56px 56px", backdropFilter: "blur(6px)" }}>
            <div style={{ position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)" }}><QuoteGlyph s={s} size={90} color={s.textColor} /></div>
            {s.showCategory && <div style={{ marginBottom: 20 }}><Category s={s} /></div>}
            <QuoteText s={s} color={s.cardText} />
            <div style={{ position: "absolute", bottom: -58, insetInlineEnd: 120, width: 0, height: 0, borderTop: "60px solid rgba(255,255,255,.25)", borderInlineStart: "60px solid transparent" }} />
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ alignSelf: "flex-end", textAlign: "end", marginBottom: 40, maxWidth: "50%" }}>
            <div style={{ fontFamily: nameFont, fontSize: s.nameSize * 1.25, color: s.accent, lineHeight: 1.5 }}>{s.name}</div>
            <div style={{ fontFamily: nameFont, fontSize: s.nameSize * 0.85, opacity: 0.85, lineHeight: 1.5 }}>{s.designation}</div>
          </div>
          <Footer s={s} color={s.textColor} />
        </div>
      </div>
    );
  }

  const archive = s.layout === "archive";
  return (
    <div ref={ref} style={root}>
      <Background s={s} />
      {s.tornEdges && <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 120px rgba(60,40,20,.35)" }} />}
      <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
          <div style={{ flex: 1 }}><Headline s={s} color={s.textColor} /></div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Outlet s={s} color={s.textColor} />
            {s.showCategory && !archive && <Category s={s} />}
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", minHeight: 200 }}>
          {archive ? (
            <div style={{ position: "absolute", inset: "0 12%", background: "#ece6da", padding: 14, boxShadow: "0 14px 30px rgba(0,0,0,.3)", transform: "rotate(-1.2deg)", overflow: "hidden" }}>
              {s.backPhoto && <img src={s.backPhoto} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) sepia(.3)", opacity: 0.6 }} />}
              <div style={{ position: "absolute", inset: 14, overflow: "hidden", background: s.backPhoto ? "transparent" : "#d8d2c6" }}>
                <Photo s={{ ...s, photoOutline: 0, photoShadow: false }} />
              </div>
            </div>
          ) : (
            <>
              {s.backPhoto && (
                <img src={s.backPhoto} alt="" style={{ position: "absolute", top: "8%", left: "14%", width: "72%", height: "72%", objectFit: "cover", clipPath: torn(9, 3), filter: "contrast(1.1)", transform: "rotate(-2deg)" }} />
              )}
              <Photo s={s} />
              <div style={{ position: "absolute", bottom: 4, left: "-4%", right: "-4%", height: 6, background: s.highlightColor, transform: "rotate(-0.8deg)" }} />
              <div style={{ position: "absolute", bottom: 18, left: "8%", right: "8%", height: 3, background: s.highlightColor, transform: "rotate(0.6deg)" }} />
            </>
          )}
          <div style={{ position: "absolute", bottom: archive ? -30 : -40, left: "50%", transform: "translateX(-50%)" }}>
            {!archive && <QuoteGlyph s={s} size={110} color="#fff" />}
          </div>
          {archive && (
            <div style={{ position: "absolute", bottom: -24, insetInlineStart: "6%", display: "flex", alignItems: "flex-end", gap: 24 }}>
              <div style={{ background: s.accent, color: "#fff", fontFamily: nameFont, fontSize: s.nameSize * 1.5, padding: "6px 34px", border: "4px solid #fff", lineHeight: 1.4 }}>{s.name}</div>
              <QuoteGlyph s={s} size={110} color="#fff" />
            </div>
          )}
        </div>

        {!archive && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, marginTop: 30 }}>
            {s.designation && <span style={{ background: s.highlightColor, color: s.highlightText, fontFamily: nameFont, fontSize: s.nameSize * 0.7, padding: "2px 14px", lineHeight: 1.6 }}>{s.designation}</span>}
            {s.name && <span style={{ background: s.accent, color: "#fff", fontFamily: nameFont, fontSize: s.nameSize, padding: "2px 18px", lineHeight: 1.6 }}>{s.name}</span>}
          </div>
        )}

        <div style={{ background: s.cardColor, padding: "36px 44px", clipPath: s.tornEdges ? torn(4, 1.4) : undefined, boxShadow: "0 10px 30px rgba(0,0,0,.2)", transform: `translateY(${s.quoteOffset}px)`, marginTop: archive ? 30 : 0 }}>
          {archive && s.designation && <div style={{ fontFamily: nameFont, fontSize: s.nameSize * 0.75, color: s.cardText, opacity: 0.7, marginBottom: 10 }}>{s.designation}</div>}
          <QuoteText s={s} color={s.cardText} />
        </div>
        <Footer s={s} color={s.textColor} />
      </div>
    </div>
  );
});

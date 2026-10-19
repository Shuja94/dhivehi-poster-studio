import { forwardRef, type CSSProperties, type ReactNode } from "react";
import dome from "@/assets/dome.png";
import type { PosterState } from "@/lib/poster/types";
import { ASPECTS } from "@/lib/poster/types";
import {
  Background, Category, Footer, Headline, Outlet, Partners, Photo, QuoteBox, QuoteGlyph, QuoteText,
  Rich, THAANA_TYPO, Translation, fam, torn,
} from "./parts";

/* Poster artwork is user-coloured: inline colour values here are intentional. */

const abs = (o: CSSProperties): CSSProperties => ({ position: "absolute", ...o });

function Layer({ children, style }: { children: ReactNode; style: CSSProperties }) {
  return <div style={abs(style)}>{children}</div>;
}

function body(s: PosterState, w: number, h: number): ReactNode {
  const nameFont = fam(s.latinFont, s.nameFont);
  const pad = h > 1500 ? 80 : 64;
  const nm: CSSProperties = { fontFamily: nameFont, ...THAANA_TYPO };

  switch (s.layout) {
    /* 1. Grid & vertical banner */
    case "banner":
      return (
        <>
          <div style={abs({ top: 0, left: "28.5%", width: "43%", height: "66%", background: s.accent, display: "flex", justifyContent: "center", paddingTop: 50 })}>
            <Outlet s={s} color="#ffffff" size={62} />
          </div>
          <div style={abs({ top: "17%", bottom: "21%", left: "21%", right: "21%", border: `3px solid ${s.accent2}` })} />
          <svg width="130" height="80" style={abs({ top: "79%", insetInlineStart: "27%", transform: s.dir === "rtl" ? "scaleX(-1)" : undefined })}>
            <rect x="2" y="0" width="128" height="4" fill={s.bgColor} />
            <polyline points="3,0 3,77 128,1" fill="none" stroke={s.accent2} strokeWidth="3" />
          </svg>
          <Layer style={{ top: "12%", bottom: "21%", left: "16%", right: "16%", maskImage: "linear-gradient(to bottom, #000 70%, transparent 99%)" }}>
            <Photo s={s} />
          </Layer>
          <div style={abs({ top: "40%", insetInlineEnd: "16.5%" })}><QuoteGlyph s={s} size={100} color="#fff" mode={s.quoteMark === "none" ? "none" : "box"} /></div>
          <div style={abs({ top: "57%", insetInlineStart: "27%", insetInlineEnd: "26%", transform: `translateY(${s.quoteOffset}px)` })}>
            <span style={{ fontFamily: fam(s.latinFont, s.bodyFont), fontSize: s.quoteSize, lineHeight: s.lineHeight, background: s.highlightColor, color: s.highlightText, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", padding: "0 .2em", fontWeight: 600, ...THAANA_TYPO }}>
              <Rich text={s.quote} s={s} bg={s.accent} fg="#fff" />
            </span>
          </div>
          <div style={abs({ top: "82%", insetInlineEnd: "18%", textAlign: "end" })}>
            <div style={{ ...nm, fontSize: s.nameSize * 1.6, color: s.accent, fontWeight: 800, lineHeight: 1.3 }}>{s.name}</div>
            {s.designation && <div style={{ ...nm, fontSize: s.nameSize * 0.7, color: s.accent, opacity: 0.75 }}>{s.designation}</div>}
          </div>
          <div style={abs({ bottom: 0, left: 0, right: 0 })}><Footer s={s} variant="bar" color="#fff" bg={s.accent2} /></div>
        </>
      );

    /* 2. Arch & dome */
    case "arch":
      return (
        <>
          <div style={abs({ top: pad, insetInlineStart: "6%" })}><Outlet s={s} color={s.textColor} size={52} /></div>
          <div style={abs({ top: "35%", insetInlineEnd: "5%", width: "46%", aspectRatio: "1", borderRadius: "50%", background: s.accent2, boxShadow: `0 0 120px ${s.accent2}88` })} />
          <Layer style={{ top: "22%", bottom: "16%", insetInlineEnd: "2%", width: "52%" }}><Photo s={s} /></Layer>
          <QuoteBox s={{ ...s, quoteBox: s.quoteBox === "none" ? "arch" : s.quoteBox }} tail={false} pad="0" style={abs({ top: "17%", bottom: "16%", insetInlineStart: "6%", width: "54%" })}>
            <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 26, padding: "60px 64px" }}>
              <QuoteGlyph s={s} size={80} color="#fff" bg={s.accent2} />
              <QuoteText s={s} color={s.cardText} />
              <div>
                <div style={{ ...nm, fontSize: s.nameSize * 1.35, color: s.accent, fontWeight: 800, lineHeight: 1.4 }}>{s.name}</div>
                <div style={{ ...nm, fontSize: s.nameSize * 0.65, color: s.cardText, opacity: 0.75, lineHeight: 1.6 }}>{s.designation}</div>
              </div>
            </div>
          </QuoteBox>
          {s.showDecor && <img src={dome} alt="" style={abs({ bottom: "14.5%", insetInlineStart: "5%", width: "36%" })} />}
          <div style={abs({ bottom: "6%", left: "6%", right: "6%" })}><Footer s={s} variant="split" color={s.accent} /></div>
        </>
      );

    /* 3. Topographic duotone */
    case "topo":
      return (
        <>
          <div style={abs({ top: "6%", bottom: "11%", left: "7%", right: "7%", background: s.accent, borderRadius: 44, overflow: "hidden", boxShadow: "0 30px 60px rgba(20,40,70,.25)", clipPath: "polygon(0 0, 100% 0, 100% 70%, 94% 74%, 94% 100%, 0 100%)" })}>
            {s.photoGhost && <Layer style={{ inset: 0 }}><Photo s={{ ...s, photoX: s.photoX - 120, photoY: s.photoY - 60 }} ghost scale={1.35} style={{ bottom: "8%" }} /></Layer>}
            <Layer style={{ bottom: 0, insetInlineEnd: 0, width: "62%", height: "72%" }}><Photo s={s} /></Layer>
            <div style={abs({ top: "30%", insetInlineStart: "7%", width: "50%", display: "flex", flexDirection: "column", gap: 18 })}>
              <QuoteGlyph s={s} size={80} color={s.accent} bg="#fff" />
              <Headline s={s} color={s.textColor} />
              <QuoteText s={s} color={s.cardText} />
              <div style={{ ...nm, fontSize: s.nameSize * 0.85, color: s.textColor, opacity: 0.9, marginTop: 10 }}>– {s.name} –</div>
            </div>
          </div>
          <div style={abs({ top: 0, left: "50%", transform: "translateX(-50%)", background: "#fff", padding: "18px 44px 22px", borderRadius: "0 0 32px 32px", boxShadow: "0 10px 24px rgba(0,0,0,.15)" })}>
            <Outlet s={s} color={s.accent} size={40} />
          </div>
          <div style={abs({ bottom: "3%", left: "50%", transform: "translateX(-50%)" })}><Footer s={s} variant="pill" color={s.accent} bg="rgba(255,255,255,.9)" /></div>
        </>
      );

    /* 4b. Green torn notes */
    case "torngreen":
      return (
        <>
          {s.showDecor && (
            <>
              <div style={abs({ top: "11%", insetInlineEnd: "14%", fontFamily: '"Archivo Black", serif', fontSize: 260, lineHeight: 1, color: "#fff", opacity: 0.55, filter: "blur(4px)" })}>{s.dir === "rtl" ? "\u201D" : "\u201C"}</div>
              <div style={abs({ top: 30, insetInlineEnd: 30, width: 160, height: 200, backgroundImage: "radial-gradient(rgba(255,255,255,.35) 3px, transparent 3.5px)", backgroundSize: "22px 22px" })} />
              <div style={abs({ bottom: 40, insetInlineStart: 30, width: 200, height: 140, backgroundImage: "radial-gradient(rgba(255,255,255,.3) 3px, transparent 3.5px)", backgroundSize: "22px 22px" })} />
            </>
          )}
          <div style={abs({ top: pad, insetInlineStart: pad })}><Outlet s={s} color={s.textColor} size={44} /></div>
          <Layer style={{ top: "14%", bottom: "46%", left: "30%", right: "30%" }}><Photo s={s} /></Layer>
          {s.designation && (
            <div style={abs({ top: "32%", insetInlineEnd: "18%", filter: "drop-shadow(0 6px 8px rgba(0,0,0,.25))" })}>
              <div style={{ background: s.cardColor, color: s.accent, ...nm, fontSize: s.nameSize * 0.85, padding: "6px 26px", clipPath: torn(7, 8), lineHeight: 1.6 }}>{s.designation}</div>
            </div>
          )}
          <div style={abs({ top: "41%", insetInlineStart: "12%", filter: "drop-shadow(0 6px 8px rgba(0,0,0,.25))" })}>
            <div style={{ background: s.cardColor, color: s.accent, ...nm, fontSize: s.nameSize, padding: "8px 30px", clipPath: torn(2, 8), lineHeight: 1.6, fontWeight: 700 }}>{s.name}</div>
          </div>
          <QuoteBox s={s} tail={false} style={abs({ top: "54%", left: "12%", right: "12%" })} pad="44px 50px">
            <QuoteText s={s} color={s.cardText} />
          </QuoteBox>
          <div style={abs({ bottom: pad * 0.6, left: pad, right: pad })}><Footer s={s} variant="icons" color={s.textColor} bg={s.bgColor} /></div>
        </>
      );

    /* 5. Dark glow speech bubble */
    case "bubble":
      return (
        <>
          <Layer style={{ insetInlineStart: 0, bottom: 0, width: "58%", height: "62%" }}><Photo s={s} /></Layer>
          <div style={abs({ inset: 0, padding: pad, display: "flex", flexDirection: "column" })}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Outlet s={s} color={s.textColor} />
              {s.showDate && (
                <div style={{ textAlign: "end" }}>
                  <div dir="ltr" style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 76, lineHeight: 1, color: s.textColor }}>{s.dateBig}</div>
                  <div style={{ ...nm, fontSize: 26, color: s.accent, lineHeight: 1.6 }}>{s.date}</div>
                </div>
              )}
            </div>
            <QuoteBox s={{ ...s, quoteBox: s.quoteBox === "none" ? "glass" : s.quoteBox }} style={{ marginTop: 70 }} pad="80px 56px 56px">
              <div style={abs({ top: -54, left: "50%", transform: "translateX(-50%)" })}><QuoteGlyph s={s} size={90} color={s.textColor} /></div>
              {s.showCategory && <div style={{ marginBottom: 20 }}><Category s={s} /></div>}
              <QuoteText s={s} color={s.quoteBox === "torn" || s.quoteBox === "speech" || s.quoteBox === "arch" ? "#111" : s.cardText} />
            </QuoteBox>
            <div style={{ flex: 1 }} />
            <div style={{ alignSelf: "flex-end", textAlign: "end", marginBottom: 40, maxWidth: "50%" }}>
              <div style={{ ...nm, fontSize: s.nameSize * 1.25, color: s.accent, lineHeight: 1.5 }}>{s.name}</div>
              <div style={{ ...nm, fontSize: s.nameSize * 0.85, color: s.textColor, opacity: 0.85, lineHeight: 1.6 }}>{s.designation}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20 }}>
              <Partners s={s} />
              <Footer s={s} variant="stack" color={s.textColor} />
            </div>
          </div>
        </>
      );

    /* 6. Capsule split */
    case "capsule": {
      const top = 14, ch = 77, split = top + ch * 0.45;
      return (
        <>
          <div style={abs({ top: `${top}%`, height: `${ch}%`, left: "16%", right: "16%", borderRadius: 90, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.3)" })}>
            <div style={abs({ inset: 0, bottom: "55%", background: s.accent, overflow: "hidden" })}>
              {s.showDecor && [[10, 20, 260], [70, 60, 300], [40, 90, 200], [90, 0, 180]].map(([x, y, r], i) => (
                <div key={i} style={abs({ left: `${x}%`, top: `${y}%`, width: r, height: r * 1.4, borderRadius: "48% 52% 60% 40%", border: "34px solid rgba(255,255,255,.1)", transform: "translate(-50%,-50%) rotate(25deg)" })} />
              ))}
            </div>
            <div style={abs({ inset: 0, top: "45%", background: s.cardColor })} />
          </div>
          <Layer style={{ top: "3%", bottom: `${100 - split}%`, left: "16%", right: "16%", clipPath: "inset(-100% 0 0 0)" }}><Photo s={s} /></Layer>
          <div style={abs({ top: `calc(${split}% - 58px)`, insetInlineStart: "22%", borderRadius: "50%", padding: 8, background: "#fff" })}>
            <QuoteGlyph s={s} size={100} color="#fff" mode={s.quoteMark === "none" ? "none" : "circle"} />
          </div>
          <div style={abs({ top: `${split + 6}%`, left: "21%", right: "21%", bottom: "12%", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" })}>
            <div style={{ ...nm, fontSize: s.nameSize, color: s.cardText, fontWeight: 800, lineHeight: 1.4 }}>{s.name}</div>
            {s.designation && <div style={{ ...nm, fontSize: s.nameSize * 0.55, color: s.accent, marginTop: -12 }}>{s.designation}</div>}
            <QuoteText s={s} color={s.cardText} />
          </div>
          <div style={abs({ top: pad * 0.6, left: "50%", transform: "translateX(-50%)" })}><Outlet s={s} color={s.textColor} size={36} /></div>
          <div style={abs({ bottom: "3%", left: "50%", transform: "translateX(-50%)" })}><Footer s={s} variant="line" color={s.textColor} /></div>
        </>
      );
    }

    /* 7. Glass & light streak */
    case "glass":
      return (
        <>
          <div style={abs({ top: "3.5%", left: "50%", transform: "translateX(-50%)" })}><Outlet s={s} color={s.textColor} size={48} /></div>
          <QuoteBox s={{ ...s, quoteBox: s.quoteBox === "none" ? "glass" : s.quoteBox }} tail={false} style={abs({ top: "14%", bottom: "33%", left: "22%", right: "22%", background: s.quoteBox === "glass" || s.quoteBox === "none" ? "rgba(255,255,255,.55)" : undefined })} pad="60px 64px">
            <QuoteText s={s} color={s.cardText} />
            <div style={{ marginTop: 20 }}><QuoteGlyph s={s} size={90} color="#fff" bg={s.accent} /></div>
          </QuoteBox>
          <Layer style={{ top: "38%", bottom: 0, left: "22%", right: "12%" }}><Photo s={s} /></Layer>
          {s.showDate && (
            <div style={abs({ top: "56%", insetInlineStart: "15%", width: 230, padding: "26px 28px", borderRadius: 44, background: `linear-gradient(150deg, ${s.accent2}, ${s.accent})`, boxShadow: `0 20px 60px ${s.accent}77`, color: "#fff", textAlign: "end" })}>
              {s.showCategory && <div style={{ ...nm, fontSize: 26, lineHeight: 1.5 }}>{s.category}</div>}
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: 10 }}>
                <span style={{ ...nm, fontSize: 24, lineHeight: 1.8 }}>{s.date}</span>
                <span dir="ltr" style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 92, lineHeight: 1 }}>{s.dateBig}</span>
              </div>
            </div>
          )}
          <div style={abs({ bottom: "2.5%", left: "18%", right: "18%" })}><Footer s={s} variant="line" color={s.textColor} /></div>
        </>
      );

    /* Cream editorial */
    case "editorial":
      return (
        <>
          <div style={abs({ top: "8%", insetInlineStart: "14%" })}>
            <div style={{ fontFamily: `"${s.latinFont}"`, fontSize: 18, letterSpacing: 2, color: s.highlightText, fontWeight: 700 }}>{s.date}</div>
            <Outlet s={s} color={s.textColor} size={34} />
          </div>
          <div style={abs({ top: "16%", left: "14%", right: "14%" })}><Headline s={s} color={s.textColor} /></div>
          <div style={abs({ bottom: 0, left: 0, right: 0, height: "19%", background: s.accent, clipPath: torn(5, 6) })} />
          <Layer style={{ bottom: 0, insetInlineEnd: 0, width: "68%", height: "48%" }}><Photo s={s} /></Layer>
          <div style={abs({ top: "58%", insetInlineStart: "22%", background: s.accent, color: "#fff", borderRadius: 18, padding: "12px 30px", textAlign: "center" })}>
            <div style={{ ...nm, fontSize: s.nameSize * 1.1, lineHeight: 1.5 }}>{s.name}</div>
            {s.designation && <div style={{ fontFamily: `"${s.latinFont}", "${s.nameFont}"`, fontSize: s.nameSize * 0.65, opacity: 0.9 }}>{s.designation}</div>}
            <div style={abs({ bottom: -34, insetInlineEnd: 40, width: 40, height: 36, background: s.accent, clipPath: "polygon(0 0,100% 0,100% 100%)" })} />
          </div>
          <div style={abs({ bottom: "2.5%", insetInlineStart: "5%" })}><Footer s={s} variant="line" color="#fff" style={{ borderTop: "none" }} /></div>
        </>
      );

    /* Soft blue card */
    case "card":
      return (
        <>
          <div style={abs({ top: "2.5%", left: "50%", transform: "translateX(-50%)" })}><Outlet s={s} color={s.accent} size={46} /></div>
          {s.showDecor && <img src={dome} alt="" style={abs({ bottom: "22%", insetInlineEnd: "-6%", width: "48%", opacity: 0.55, filter: "saturate(.4)" })} />}
          <div style={abs({ top: "15%", left: "17%", right: "17%", height: "56%", borderRadius: 40, background: `linear-gradient(to bottom, ${s.cardColor} 55%, ${s.cardColor}00)`, padding: "44px 50px" })}>
            <Headline s={s} color={s.cardText} />
          </div>
          <div style={abs({ top: "37%", insetInlineEnd: "21%" })}><QuoteGlyph s={s} size={80} color="#fff" /></div>
          <Layer style={{ top: "31%", bottom: "11%", left: "18%", right: "18%" }}><Photo s={s} /></Layer>
          {s.showCategory && (
            <div style={abs({ top: "63%", insetInlineEnd: "7%", minWidth: "27%", padding: "34px 36px", background: s.accent, color: "#fff", borderStartStartRadius: 0, borderStartEndRadius: 56, borderEndStartRadius: 56, borderEndEndRadius: 56, ...nm, fontSize: 34, lineHeight: 1.6, whiteSpace: "pre-wrap" })}>{s.category}</div>
          )}
          <div style={abs({ top: "35%", insetInlineEnd: "3%", writingMode: "vertical-rl", ...nm, fontSize: 22, color: "#fff", opacity: 0.85 })}>{s.designation}</div>
          <div style={abs({ bottom: "3%", left: "6%", right: "6%" })}><Footer s={s} variant="stack" color={s.accent} /></div>
        </>
      );

    /* Breaking headline */
    case "headline":
      return (
        <>
          <Layer style={{ inset: 0 }}><Photo s={{ ...s, photoOutline: 0, photoShadow: false }} /></Layer>
          <div style={abs({ inset: 0, background: `linear-gradient(to bottom, transparent 30%, ${s.bgColor}ee 66%, ${s.bgColor})` })} />
          <div style={abs({ inset: 0, padding: pad, display: "flex", flexDirection: "column" })}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Outlet s={s} color={s.textColor} />
              {s.showDate && <span style={{ ...nm, fontSize: 26, color: s.textColor, opacity: 0.85 }}>{s.date}</span>}
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
              <Category s={s} />
              <Headline s={s} color={s.textColor} />
              {s.quoteBox !== "none" && <QuoteText s={s} color={s.textColor} size={s.quoteSize * 0.8} />}
              {(s.name || s.designation) && (
                <div style={{ ...nm, fontSize: s.nameSize * 0.85, color: s.textColor, borderInlineStart: `6px solid ${s.accent}`, paddingInlineStart: 16, lineHeight: 1.6 }}>
                  {s.name} {s.designation && <span style={{ opacity: 0.7 }}>· {s.designation}</span>}
                </div>
              )}
              <div style={{ height: 4, width: 140, background: s.accent }} />
            </div>
            <div style={{ marginTop: 36 }}><Footer s={s} variant="icons" color={s.textColor} bg={s.bgColor} /></div>
          </div>
        </>
      );

    /* 4. Torn paper statement + archive */
    default: {
      const archive = s.layout === "archive";
      return (
        <>
          {s.tornEdges && <div style={abs({ inset: 0, boxShadow: "inset 0 0 120px rgba(60,40,20,.35)" })} />}
          <div style={abs({ inset: 0, padding: pad, display: "flex", flexDirection: "column", gap: 24 })}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
              <div style={{ flex: 1 }}><Headline s={s} color={s.textColor} /></div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <Outlet s={s} color={s.textColor} />
                {!archive && <Category s={s} />}
              </div>
            </div>
            <div style={{ flex: 1, position: "relative", minHeight: 200 }}>
              {archive ? (
                <div style={abs({ inset: "0 12%", background: "#ece6da", padding: 14, boxShadow: "0 14px 30px rgba(0,0,0,.3)", transform: "rotate(-1.2deg)", overflow: "hidden" })}>
                  {s.backPhoto && <img src={s.backPhoto} alt="" style={abs({ inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) sepia(.3)", opacity: 0.6 })} />}
                  <div style={abs({ inset: 14, overflow: "hidden", background: s.backPhoto ? "transparent" : "#d8d2c6" })}>
                    <Photo s={s} noFx />
                  </div>
                </div>
              ) : (
                <>
                  {s.backPhoto && <img src={s.backPhoto} alt="" style={abs({ top: "8%", left: "14%", width: "72%", height: "72%", objectFit: "cover", clipPath: torn(9, 3), filter: "contrast(1.1)", transform: "rotate(-2deg)" })} />}
                  <Photo s={s} />
                  <div style={abs({ bottom: 4, left: "-4%", right: "-4%", height: 6, background: s.highlightColor, transform: "rotate(-0.8deg)" })} />
                  <div style={abs({ bottom: 18, left: "8%", right: "8%", height: 3, background: s.highlightColor, transform: "rotate(0.6deg)" })} />
                </>
              )}
              {!archive && <div style={abs({ bottom: -40, left: "50%", transform: "translateX(-50%)" })}><QuoteGlyph s={s} size={110} color="#fff" /></div>}
              {archive && (
                <div style={abs({ bottom: -24, insetInlineStart: "6%", display: "flex", alignItems: "flex-end", gap: 24 })}>
                  <div style={{ background: s.accent, color: "#fff", ...nm, fontSize: s.nameSize * 1.5, padding: "6px 34px", border: "4px solid #fff", lineHeight: 1.5, transform: "rotate(-1deg)" }}>{s.name}</div>
                  <QuoteGlyph s={s} size={110} color="#fff" />
                </div>
              )}
            </div>
            {!archive && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, marginTop: 30 }}>
                {s.designation && <span style={{ background: s.highlightColor, color: s.highlightText, ...nm, fontSize: s.nameSize * 0.7, padding: "2px 14px", lineHeight: 1.7 }}>{s.designation}</span>}
                {s.name && <span style={{ background: s.accent, color: "#fff", ...nm, fontSize: s.nameSize, padding: "2px 18px", lineHeight: 1.7 }}>{s.name}</span>}
              </div>
            )}
            <QuoteBox s={s} tail={s.quoteBox !== "torn"} style={{ marginTop: archive ? 30 : 0 }} pad="36px 44px">
              {archive && s.designation && <div style={{ ...nm, fontSize: s.nameSize * 0.75, color: s.cardText, opacity: 0.7, marginBottom: 10 }}>{s.designation}</div>}
              <QuoteText s={s} color={s.quoteBox === "glass" || s.quoteBox === "frame" || s.quoteBox === "none" ? s.textColor : s.cardText} />
            </QuoteBox>
            <Footer s={s} variant="icons" color={s.textColor} bg={s.bgColor} />
          </div>
        </>
      );
    }
  }
}

export const Poster = forwardRef<HTMLDivElement, { s: PosterState }>(function Poster({ s }, ref) {
  const { w, h } = ASPECTS[s.aspect];
  return (
    <div ref={ref} lang={s.dir === "rtl" ? "dv" : "en"} style={{ width: w, height: h, position: "relative", overflow: "hidden", direction: s.dir, color: s.textColor }}>
      <Background s={s} w={w} h={h} />
      {body(s, w, h)}
    </div>
  );
});

export { Translation };

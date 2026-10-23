import type { CSSProperties, ReactNode } from "react";
import minaret from "@/assets/minaret.jpg";
import type { PosterState } from "@/lib/poster/types";
import { Category, Footer, Headline, Outlet, Photo, QuoteGlyph, QuoteText, Rich, THAANA_TYPO, fam } from "./parts";

/* Second batch of news / quote layouts, researched from wire-service, broadcaster and magazine social templates.
 * Designed on a 1080-wide canvas (height 1080–1920). Poster artwork is user-coloured: inline colour values are intentional. */

const abs = (o: CSSProperties): CSSProperties => ({ position: "absolute", ...o });
const plain = (s: PosterState, extra: Partial<PosterState> = {}): PosterState => ({ ...s, headlineStyle: "plain", ...extra });

function Cover({ s, style, tone }: { s: PosterState; style: CSSProperties; tone?: PosterState["photoTone"] }) {
  const t = tone ?? s.photoTone;
  return (
    <div style={abs({ overflow: "hidden", ...style })}>
      <img src={s.photo ?? minaret} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%", transform: `translate(${s.photoX}px, ${s.photoY}px) scale(${s.photoScale / 100})`, filter: t !== "color" ? "grayscale(1) contrast(1.1)" : undefined, display: "block" }} />
      {t === "duotone" && <div style={abs({ inset: 0, background: s.accent, mixBlendMode: "color" })} />}
    </div>
  );
}

export function body2(s: PosterState, w: number, h: number): ReactNode | null {
  const pad = h > 1500 ? 80 : 64;
  const nm: CSSProperties = { fontFamily: fam(s.latinFont, s.nameFont), ...THAANA_TYPO };
  const lat = (f = s.latinFont): CSSProperties => ({ fontFamily: fam(f, s.nameFont), ...THAANA_TYPO });
  const Name = ({ color, size = 1, style }: { color: string; size?: number; style?: CSSProperties }) =>
    s.name ? (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
        <div data-el="name" style={{ ...nm, fontSize: s.nameSize * size, color, fontWeight: 700, lineHeight: 1.5 }}>{s.name}</div>
        {s.designation && <div style={{ ...nm, fontSize: s.nameSize * size * 0.72, color, opacity: 0.7, lineHeight: 1.5 }}>{s.designation}</div>}
      </div>
    ) : null;
  const col = (o: CSSProperties): CSSProperties => ({ display: "flex", flexDirection: "column", ...o });

  switch (s.layout) {
    /* Wire service: white page, square brand mark, kicker, big headline, rules, photo strip */
    case "wire":
      return (
        <div style={abs({ inset: pad, ...col({ gap: 28 }) })}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, paddingBottom: 18, borderBottom: `2px solid ${s.textColor}` }}>
            <div style={{ width: 34, height: 34, background: s.accent }} />
            <Outlet s={s} color={s.textColor} size={38} />
            <div style={{ flex: 1 }} />
            {s.showDate && <span style={{ ...lat(), fontSize: 22, opacity: 0.6 }}>{s.date}</span>}
          </div>
          {s.showCategory && <div style={{ ...nm, color: s.accent, fontSize: 30, fontWeight: 700 }}>{s.category}</div>}
          <Headline s={plain(s)} color={s.textColor} />
          <Cover s={s} style={{ position: "relative", flex: 1, minHeight: 260 }} />
          <QuoteText s={s} color={s.textColor} size={s.quoteSize * 0.8} style={{ opacity: 0.8 }} />
          <Footer s={s} variant="line" color={s.textColor} bg={s.bgColor} />
        </div>
      );

    /* Bold red pull-quote: giant white mark, quote with yellow marker highlight */
    case "pullquote":
      return (
        <div style={abs({ inset: pad, ...col({ justifyContent: "center", gap: 34 }) })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ ...lat("Archivo Black"), fontSize: 260, lineHeight: 0.8, color: s.cardColor }}>{s.dir === "rtl" ? "\u201D" : "\u201C"}</div>
            <Outlet s={s} color={s.cardColor} size={36} />
          </div>
          <QuoteText s={s} color={s.textColor} size={s.quoteSize * 1.35} align="start" style={{ fontWeight: 700 }} />
          <div style={{ width: 120, height: 6, background: s.highlightColor }} />
          <Name color={s.textColor} size={1.1} />
          <div style={{ flex: 1 }} />
          <Footer s={s} variant="icons" color={s.textColor} bg={s.bgColor} />
        </div>
      );

    /* Split: photo top half, solid block with headline below */
    case "splithalf":
      return (
        <>
          <Cover s={s} style={{ top: 0, left: 0, right: 0, height: "52%" }} />
          <div style={abs({ top: pad * 0.6, insetInlineStart: pad * 0.6, background: s.cardColor, padding: "10px 22px" })}><Outlet s={s} color={s.cardText} size={30} /></div>
          <div style={abs({ top: "52%", left: 0, right: 0, bottom: 0, background: s.bgColor2, padding: pad, ...col({ gap: 24 }) })}>
            {s.showCategory && <div style={{ ...nm, color: s.accent2, fontSize: 28, fontWeight: 700, marginTop: -pad - 26, background: s.accent, alignSelf: "flex-start", padding: "8px 24px" }}>{s.category}</div>}
            <Headline s={plain(s)} color={s.textColor} />
            <QuoteText s={s} color={s.textColor} size={s.quoteSize * 0.85} style={{ opacity: 0.85 }} />
            <div style={{ flex: 1 }} />
            <Footer s={s} variant="split" color={s.textColor} bg={s.bgColor2} />
          </div>
        </>
      );

    /* Documentary stacked lines: each headline line as a solid box over photo */
    case "stacked":
      return (
        <>
          <Cover s={s} style={{ inset: 0 }} />
          <div style={abs({ inset: 0, background: `linear-gradient(to top, ${s.bgColor}ee 10%, ${s.bgColor}55 55%, transparent)` })} />
          <div style={abs({ top: pad, insetInlineStart: pad })}><Outlet s={s} color={s.textColor} size={40} /></div>
          <div style={abs({ bottom: pad * 1.8, left: pad, right: pad, ...col({ alignItems: "flex-start", gap: 12 }) })}>
            {s.showCategory && <Category s={s} style={{ marginBottom: 14 }} />}
            {s.headline.split("\n").map((l, i) => (
              <div key={i} data-el="headline" style={{ background: i % 2 ? s.accent : s.cardColor, color: i % 2 ? "#fff" : s.cardText, fontFamily: fam(s.latinFont, s.headlineFont), fontSize: s.headlineSize, lineHeight: 1.45, padding: "4px 26px", ...THAANA_TYPO }}>
                <Rich text={l} s={s} />
              </div>
            ))}
          </div>
          <div style={abs({ bottom: pad * 0.6, left: pad, right: pad })}><Footer s={s} variant="icons" color={s.textColor} bg={s.bgColor} /></div>
        </>
      );

    /* Circle portrait on top, centred quote, clean */
    case "circlequote":
      return (
        <div style={abs({ inset: pad, ...col({ alignItems: "center", gap: 30, textAlign: "center" }) })}>
          <Outlet s={s} color={s.textColor} size={36} />
          <div style={{ width: 360, height: 360, borderRadius: "50%", overflow: "hidden", position: "relative", border: `10px solid ${s.accent}`, background: s.accent2, flexShrink: 0 }}>
            <Photo s={s} noFx style={{ height: `${s.photoScale}%` }} />
          </div>
          <QuoteGlyph s={s} size={70} color="#fff" mode="circle" />
          <QuoteText s={s} color={s.textColor} align="center" />
          <Name color={s.accent} style={{ alignItems: "center" }} />
          <div style={{ flex: 1 }} />
          <Footer s={s} variant="icons" color={s.textColor} bg={s.bgColor} />
        </div>
      );

    /* Broadcast LIVE lower-third with ticker */
    case "livebar":
      return (
        <>
          <Cover s={s} style={{ inset: 0 }} />
          <div style={abs({ inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.75), transparent 55%)" })} />
          <div style={abs({ top: pad, insetInlineStart: pad, display: "flex", gap: 14, alignItems: "center" })}>
            <span style={{ background: s.highlightColor, color: s.highlightText, ...lat("Space Grotesk"), fontWeight: 800, fontSize: 30, padding: "6px 18px", letterSpacing: 3 }}>● LIVE</span>
            <Outlet s={s} color="#fff" size={34} />
          </div>
          <div style={abs({ bottom: pad * 2, left: 0, right: pad })}>
            {s.showCategory && <div style={{ background: s.highlightColor, color: s.highlightText, ...nm, fontSize: 30, padding: "8px 30px", display: "inline-block", paddingInlineStart: pad }}>{s.category}</div>}
            <div style={{ background: s.cardColor, padding: `22px 34px 22px ${pad}px`, paddingInlineStart: pad }}>
              <Headline s={plain(s)} color={s.cardText} />
            </div>
          </div>
          <div style={abs({ bottom: pad * 0.8, left: 0, right: 0, height: 56, background: s.accent, display: "flex", alignItems: "center", gap: 24, paddingInline: pad, overflow: "hidden" })}>
            <span style={{ ...nm, color: "#fff", fontSize: 24, whiteSpace: "nowrap" }}>{s.tagline}</span>
            <div style={{ flex: 1 }} />
            <span style={{ ...lat(), color: "#fff", fontSize: 22 }}>{s.handle}</span>
          </div>
        </>
      );

    /* Magazine cover: masthead, full photo, cover lines */
    case "magazine":
      return (
        <>
          <Cover s={s} style={{ inset: 0 }} />
          <div style={abs({ inset: 0, background: `linear-gradient(to bottom, ${s.bgColor}aa, transparent 30%, transparent 55%, ${s.bgColor}dd)` })} />
          <div style={abs({ top: pad * 0.6, left: pad, right: pad, textAlign: "center" })}><Outlet s={s} color={s.accent2} size={120} style={{ margin: "0 auto", letterSpacing: 2 }} /></div>
          {s.showDate && <div style={abs({ top: pad * 0.6 + 170, left: pad, right: pad, textAlign: "center", ...lat(), color: s.textColor, fontSize: 22, letterSpacing: 6 })}>{s.date}</div>}
          <div style={abs({ bottom: pad * 1.6, left: pad, right: pad, ...col({ gap: 18 }) })}>
            {s.showCategory && <div style={{ ...nm, color: s.accent2, fontSize: 34, fontWeight: 700 }}>{s.category}</div>}
            <Headline s={plain(s)} color={s.textColor} />
            <QuoteText s={s} color={s.textColor} size={s.quoteSize * 0.8} style={{ opacity: 0.9 }} />
          </div>
          <div style={abs({ bottom: pad * 0.6, left: pad, right: pad })}><Footer s={s} variant="icons" color={s.textColor} bg={s.bgColor} /></div>
        </>
      );

    /* Big number stat card */
    case "bignumber":
      return (
        <div style={abs({ inset: pad, ...col({ gap: 20 }) })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Outlet s={s} color={s.textColor} size={36} />
            {s.showCategory && <Category s={s} />}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ ...lat("Archivo Black"), fontSize: 300, lineHeight: 0.9, color: s.accent, direction: "ltr", textAlign: s.dir === "rtl" ? "right" : "left" }}>{s.dateBig}</div>
          <div style={{ width: "100%", height: 4, background: s.textColor }} />
          <Headline s={plain(s)} color={s.textColor} />
          <QuoteText s={s} color={s.textColor} size={s.quoteSize * 0.8} style={{ opacity: 0.75 }} />
          <div style={{ flex: 1 }} />
          <Footer s={s} variant="line" color={s.textColor} bg={s.bgColor} />
        </div>
      );

    /* Ultra-minimal quote, lots of air */
    case "minimalquote":
      return (
        <div style={abs({ inset: pad * 1.4, ...col({ justifyContent: "center", gap: 40 }) })}>
          <div style={{ width: 70, height: 4, background: s.accent }} />
          <QuoteText s={s} color={s.textColor} size={s.quoteSize * 1.2} align="start" />
          <Name color={s.textColor} size={0.85} />
          <div style={abs({ bottom: -pad * 0.6, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center" })}>
            <Outlet s={s} color={s.textColor} size={28} />
            <span style={{ ...lat(), fontSize: 22, opacity: 0.6 }}>{s.handle}</span>
          </div>
        </div>
      );

    /* Dark portrait quote: cutout at side fading into dark */
    case "darkportrait":
      return (
        <>
          <div style={abs({ top: 0, bottom: 0, insetInlineEnd: 0, width: "62%" })}><Photo s={s} noFx /></div>
          <div style={abs({ inset: 0, background: `linear-gradient(${s.dir === "rtl" ? "to right" : "to left"}, transparent 20%, ${s.bgColor} 62%)` })} />
          <div style={abs({ top: pad, insetInlineStart: pad })}><Outlet s={s} color={s.textColor} size={36} /></div>
          <div style={abs({ top: "26%", insetInlineStart: pad, width: "58%", ...col({ gap: 26 }) })}>
            <QuoteGlyph s={s} size={90} color="#fff" mode="big" />
            <QuoteText s={s} color={s.textColor} align="start" />
            <div style={{ width: 80, height: 4, background: s.accent }} />
            <Name color={s.accent} />
          </div>
          <div style={abs({ bottom: pad * 0.7, left: pad, right: pad })}><Footer s={s} variant="icons" color={s.textColor} bg={s.bgColor} /></div>
        </>
      );

    /* Thick colour frame, photo inside, headline banner overlapping */
    case "thickframe":
      return (
        <>
          <Cover s={s} style={{ top: 40, left: 40, right: 40, bottom: "34%" }} />
          <div style={abs({ top: 70, insetInlineEnd: 70, background: s.bgColor, padding: "8px 20px" })}><Outlet s={s} color={s.textColor} size={30} /></div>
          <div style={abs({ top: "60%", left: 90, right: 90, background: s.cardColor, padding: "30px 40px", boxShadow: "0 20px 40px rgba(0,0,0,.25)", ...col({ gap: 14 }) })}>
            {s.showCategory && <Category s={s} style={{ alignSelf: "flex-start" }} />}
            <Headline s={plain(s)} color={s.cardText} />
          </div>
          <div style={abs({ bottom: 50, left: pad, right: pad })}><Footer s={s} variant="icons" color={s.textColor} bg={s.bgColor} /></div>
        </>
      );

    /* Phone notes-app quote */
    case "notes":
      return (
        <div style={abs({ inset: pad * 0.8, ...col({ gap: 0 }) })}>
          <div style={{ flex: 1, background: s.cardColor, borderRadius: 40, boxShadow: "0 30px 60px rgba(0,0,0,.18)", overflow: "hidden", ...col({}) }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 36px", color: s.accent, ...lat("Space Grotesk"), fontSize: 26, fontWeight: 600 }}>
              <span>‹ Notes</span><span>•••</span>
            </div>
            <div style={{ padding: "0 44px", ...col({ gap: 26, flex: 1 }) }}>
              {s.showDate && <div style={{ ...lat(), fontSize: 20, color: s.cardText, opacity: 0.5, textAlign: "center" }}>{s.date}</div>}
              <Headline s={plain(s)} color={s.cardText} />
              <QuoteText s={s} color={s.cardText} />
              <Name color={s.cardText} size={0.85} />
            </div>
            <div style={{ height: 8, background: `repeating-linear-gradient(90deg, ${s.accent} 0 40px, transparent 40px 60px)`, opacity: 0.5 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 26 }}>
            <Outlet s={s} color={s.textColor} size={30} />
            <Footer s={s} variant="icons" color={s.textColor} bg={s.bgColor} />
          </div>
        </div>
      );

    /* Tilted polaroid with handwritten-style caption */
    case "polaroid":
      return (
        <>
          <div style={abs({ top: pad, insetInlineStart: pad })}><Outlet s={s} color={s.textColor} size={36} /></div>
          <div style={abs({ top: "13%", left: "13%", right: "13%", height: "50%", background: "#fff", padding: "24px 24px 90px", transform: "rotate(-3deg)", boxShadow: "0 30px 50px rgba(0,0,0,.3)" })}>
            <Cover s={s} style={{ top: 24, left: 24, right: 24, bottom: 90 }} />
            <div style={abs({ bottom: 22, left: 30, right: 30, ...nm, color: "#222", fontSize: 30, textAlign: "center" })}>{s.category}</div>
            <div style={abs({ top: -26, left: "40%", width: 160, height: 46, background: `${s.accent2}cc`, transform: "rotate(4deg)" })} />
          </div>
          <div style={abs({ top: "68%", left: pad, right: pad, ...col({ gap: 18 }) })}>
            <Headline s={plain(s)} color={s.textColor} />
            <QuoteText s={s} color={s.textColor} size={s.quoteSize * 0.8} />
          </div>
          <div style={abs({ bottom: pad * 0.6, left: pad, right: pad })}><Footer s={s} variant="icons" color={s.textColor} bg={s.bgColor} /></div>
        </>
      );

    /* Duotone full bleed with huge bottom headline */
    case "duoblast":
      return (
        <>
          <Cover s={s} tone="duotone" style={{ inset: 0 }} />
          <div style={abs({ inset: 0, background: `linear-gradient(to top, ${s.bgColor} 8%, transparent 60%)` })} />
          <div style={abs({ top: pad, left: pad, right: pad, display: "flex", justifyContent: "space-between" })}>
            <Outlet s={s} color={s.textColor} size={36} />
            {s.showCategory && <Category s={s} />}
          </div>
          <div style={abs({ bottom: pad * 1.6, left: pad, right: pad })}>
            <Headline s={plain(s, { headlineSize: s.headlineSize * 1.25 })} color={s.textColor} style={{ lineHeight: 1.1 }} />
          </div>
          <div style={abs({ bottom: pad * 0.6, left: pad, right: pad })}><Footer s={s} variant="icons" color={s.textColor} bg={s.bgColor} /></div>
        </>
      );

    /* Broadcaster band: coloured top band, white body, thin accent bars */
    case "bandnews":
      return (
        <>
          <div style={abs({ top: 0, left: 0, right: 0, height: 150, background: s.accent, display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: pad })}>
            <Outlet s={s} color="#fff" size={44} />
            {s.showCategory && <span style={{ ...nm, color: s.accent, background: "#fff", fontSize: 28, padding: "6px 22px" }}>{s.category}</span>}
          </div>
          <div style={abs({ top: 150, left: 0, right: 0, height: 10, background: s.accent2 })} />
          <Cover s={s} style={{ top: 160, left: 0, right: 0, height: "38%" }} />
          <div style={abs({ top: "calc(38% + 190px)", left: pad, right: pad, bottom: pad * 1.6, ...col({ gap: 20 }) })}>
            <Headline s={plain(s)} color={s.textColor} />
            <QuoteText s={s} color={s.textColor} size={s.quoteSize * 0.85} style={{ opacity: 0.8 }} />
          </div>
          <div style={abs({ bottom: 0, left: 0, right: 0, height: 90, background: s.accent, display: "flex", alignItems: "center", paddingInline: pad })}>
            <Footer s={s} variant="icons" color="#fff" bg={s.accent} style={{ flex: 1 }} />
          </div>
        </>
      );

    /* Vertical side bar with rotated category */
    case "sidebar":
      return (
        <>
          <div style={abs({ top: 0, bottom: 0, insetInlineStart: 0, width: 130, background: s.accent, display: "flex", alignItems: "center", justifyContent: "center" })}>
            <div style={{ transform: "rotate(-90deg)", whiteSpace: "nowrap", ...nm, color: "#fff", fontSize: 44, fontWeight: 700 }}>{s.category}</div>
          </div>
          <div style={abs({ top: pad, bottom: pad, insetInlineStart: 130 + pad * 0.8, insetInlineEnd: pad, ...col({ gap: 26 }) })}>
            <Outlet s={s} color={s.textColor} size={36} />
            <Cover s={s} style={{ position: "relative", height: "42%" }} />
            <Headline s={plain(s)} color={s.textColor} />
            <QuoteText s={s} color={s.textColor} size={s.quoteSize * 0.85} style={{ opacity: 0.8 }} />
            <div style={{ flex: 1 }} />
            <Footer s={s} variant="line" color={s.textColor} bg={s.bgColor} />
          </div>
        </>
      );

    /* Explainer marker headline on white */
    case "marker":
      return (
        <div style={abs({ inset: pad, ...col({ gap: 30 }) })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Outlet s={s} color={s.textColor} size={36} />
            {s.showCategory && <span style={{ ...nm, fontSize: 26, color: s.accent, border: `2px solid ${s.accent}`, borderRadius: 999, padding: "4px 20px" }}>{s.category}</span>}
          </div>
          <div style={{ flex: 1 }} />
          <Headline s={plain(s, { headlineSize: s.headlineSize * 1.15 })} color={s.textColor} />
          <QuoteText s={s} color={s.textColor} size={s.quoteSize * 0.85} style={{ opacity: 0.75 }} />
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden", position: "relative", background: s.accent2, flexShrink: 0 }}><Photo s={s} noFx /></div>
            <Name color={s.textColor} size={0.9} />
          </div>
          <Footer s={s} variant="line" color={s.textColor} bg={s.bgColor} />
        </div>
      );

    /* B&W photo with coloured bottom quote card */
    case "photoquote":
      return (
        <>
          <Cover s={s} tone="gray" style={{ inset: 0 }} />
          <div style={abs({ top: pad, insetInlineStart: pad })}><Outlet s={s} color="#fff" size={36} /></div>
          <div style={abs({ bottom: pad * 1.5, left: pad, right: pad, background: s.accent, padding: "60px 48px 40px", ...col({ gap: 20 }) })}>
            <div style={abs({ top: -50, insetInlineStart: 40 })}><QuoteGlyph s={s} size={100} color={s.accent} bg={s.accent2} mode="box" /></div>
            <QuoteText s={s} color="#fff" />
            <Name color={s.accent2} />
          </div>
          <div style={abs({ bottom: pad * 0.5, left: pad, right: pad })}><Footer s={s} variant="icons" color={s.textColor} bg={s.bgColor} /></div>
        </>
      );

    /* What we know: numbered points from quote lines */
    case "explainer": {
      const pts = s.quote.split("\n").filter((x) => x.trim());
      return (
        <div style={abs({ inset: pad, ...col({ gap: 28 }) })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Outlet s={s} color={s.textColor} size={34} />
            {s.showCategory && <Category s={s} />}
          </div>
          <Headline s={plain(s)} color={s.textColor} style={{ borderBottom: `4px solid ${s.accent}`, paddingBottom: 20 }} />
          <div data-el="quote" style={col({ gap: 22 })}>
            {pts.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
                <span style={{ ...lat("Archivo Black"), flexShrink: 0, width: 64, height: 64, borderRadius: 12, background: s.accent, color: "#fff", display: "grid", placeItems: "center", fontSize: 32 }}>{i + 1}</span>
                <div style={{ fontFamily: fam(s.latinFont, s.bodyFont), fontSize: s.quoteSize * 0.9, lineHeight: s.lineHeight, color: s.textColor, ...THAANA_TYPO }}><Rich text={p} s={s} /></div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <Footer s={s} variant="line" color={s.textColor} bg={s.bgColor} />
        </div>
      );
    }

    /* Condolence / obituary: black, gold frame, round grey portrait */
    case "condolence":
      return (
        <>
          <div style={abs({ inset: 36, border: `2px solid ${s.accent2}`, borderRadius: 4 })} />
          <div style={abs({ inset: 50, border: `1px solid ${s.accent2}66` })} />
          <div style={abs({ inset: pad * 1.2, ...col({ alignItems: "center", justifyContent: "center", gap: 28, textAlign: "center" }) })}>
            <Headline s={plain(s, { highlightColor: "transparent", highlightText: s.accent2 })} color={s.textColor} style={{ textAlign: "center" }} />
            <div style={{ width: 300, height: 300, borderRadius: "50%", overflow: "hidden", position: "relative", border: `6px solid ${s.accent2}`, background: "#222", flexShrink: 0 }}>
              <Photo s={{ ...s, photoTone: "gray" }} noFx />
            </div>
            <Name color={s.accent2} size={1.3} style={{ alignItems: "center" }} />
            <QuoteText s={s} color={s.textColor} align="center" size={s.quoteSize * 0.85} style={{ opacity: 0.85 }} />
            <Outlet s={s} color={s.textColor} size={30} style={{ marginTop: 20 }} />
          </div>
        </>
      );

    /* Gradient headline card, social-first (AJ+ style) */
    case "gradient":
      return (
        <>
          <div style={abs({ inset: 0, background: `linear-gradient(135deg, ${s.accent}, ${s.accent2})` })} />
          <div style={abs({ inset: pad, ...col({ gap: 30 }) })}>
            <Outlet s={s} color="#fff" size={40} />
            <div style={{ flex: 1 }} />
            {s.showCategory && <div style={{ alignSelf: "flex-start", background: "#fff", color: s.accent, ...nm, fontSize: 28, padding: "6px 22px", borderRadius: 8 }}>{s.category}</div>}
            <Headline s={plain(s, { headlineSize: s.headlineSize * 1.2 })} color="#fff" />
            <QuoteText s={s} color="#fff" size={s.quoteSize * 0.85} style={{ opacity: 0.9 }} />
            <div style={{ flex: 1 }} />
            <Footer s={s} variant="pill" color={s.accent} bg="#ffffff" />
          </div>
        </>
      );

    default:
      return null;
  }
}

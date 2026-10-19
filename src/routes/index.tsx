import { createFileRoute } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toJpeg, toPng } from "html-to-image";
import { Download, Keyboard, Upload, RotateCcw, Type, Image as ImageIcon, Palette, LayoutTemplate, Share2, Zap, Sparkles, Shuffle, Check } from "lucide-react";
import { Poster } from "@/components/poster/Poster";
import { FOOTER_LABELS, FOOTER_PLACEHOLDERS } from "@/lib/poster/footer-labels";
import { BASE, PRESETS } from "@/lib/poster/presets";
import { ASPECTS, HIGHLIGHTS, LATIN_FONTS, THAANA_FONTS, sizeOf, type Aspect, type PosterState } from "@/lib/poster/types";
import { brandOf, withPreset, type BrandKit, type BrandLocks } from "@/lib/poster/brand";
import { KEY_LABEL, KEY_TAB, presetFocus, type Key as PosterKey, type TabId } from "@/lib/poster/controls";
import { thaanaKeyDown } from "@/lib/poster/thaana";
import sampleSpeaker from "@/assets/sample-speaker.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Akuru Poster Studio — Dhivehi news poster maker" },
      { name: "description", content: "Design Dhivehi and English news quote posters with Thaana fonts, phonetic typing and high-res export." },
      { property: "og:title", content: "Akuru Poster Studio" },
      { property: "og:description", content: "Dhivehi-first social media news poster maker with RTL Thaana support." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Studio,
});

const readFile = (f: File) =>
  new Promise<string>((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.readAsDataURL(f);
  });

function Field({ label, children, ctl }: { label: string; children: ReactNode; ctl?: string }) {
  return (
    <div className="space-y-1.5" data-ctl={ctl}>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Section({ title, children, ctl }: { title: string; children: ReactNode; ctl?: string }) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-card/40 p-3" data-ctl={ctl}>
      <p className="text-sm font-semibold">{title}</p>
      {children}
    </div>
  );
}

const THUMB_W = 160;
const PresetThumb = memo(function PresetThumb({ state, active, name, onPick }: { state: PosterState; active: boolean; name: string; onPick: () => void }) {
  const { w, h } = sizeOf(state);
  const z = THUMB_W / w;
  return (
    <button onClick={onPick} title={name} className={`group relative overflow-hidden rounded-lg border-2 text-start transition hover:border-primary ${active ? "border-primary" : "border-transparent"}`}>
      <div style={{ width: THUMB_W, height: h * z }} className="pointer-events-none overflow-hidden">
        <div style={{ width: w, height: h, transform: `scale(${z})`, transformOrigin: "top left" }}><Poster s={state} /></div>
      </div>
      <span className="absolute inset-x-0 bottom-0 bg-background/85 px-2 py-1 text-[11px] font-medium leading-tight">{name}</span>
      {active && <Check className="absolute end-1.5 top-1.5 h-5 w-5 rounded-full bg-primary p-0.5 text-primary-foreground" />}
    </button>
  );
});

const QUICK_SIZES: Aspect[] = ["4:5", "1:1", "9:16", "fb", "x", "yt"];
const SIZE_NAMES: Partial<Record<Aspect, string>> = { "4:5": "Insta / FB post", "1:1": "Square post", "9:16": "Story / Status", fb: "Facebook wide", x: "X post", yt: "YouTube" };

function Studio() {
  const [s, setS] = useState<PosterState>({ ...BASE, photo: sampleSpeaker });
  const [thaanaKb, setThaanaKb] = useState(true);
  const [exportScale, setExportScale] = useState(2);
  const [format, setFormat] = useState<"png" | "jpg">("png");
  const [busy, setBusy] = useState(false);
  const [customFonts, setCustomFonts] = useState<string[]>([]);
  const [zoom, setZoom] = useState(0.4);
  const posterRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const set = <K extends keyof PosterState>(k: K, v: PosterState[K]) => setS((p) => ({ ...p, [k]: v }));
  const { w, h } = sizeOf(s);
  const [locks, setLocks] = useState<BrandLocks>({ colors: false, fonts: false, footer: true });
  const [kits, setKits] = useState<BrandKit[]>([]);
  const [kitName, setKitName] = useState("");
  const [kitMsg, setKitMsg] = useState("");
  useEffect(() => {
    try {
      const k = localStorage.getItem("akuru-brand-kits");
      if (k) setKits(JSON.parse(k));
      const l = localStorage.getItem("akuru-brand-locks");
      if (l) setLocks(JSON.parse(l));
    } catch { /* ignore */ }
  }, []);
  const saveKits = (k: BrandKit[]) => {
    try { localStorage.setItem("akuru-brand-kits", JSON.stringify(k)); setKitMsg(""); } catch { setKitMsg("Saved for this session only — the logo is too large to store in the browser."); }
    setKits(k);
  };
  const setLock = (k: keyof BrandLocks, v: boolean) => {
    const n = { ...locks, [k]: v };
    setLocks(n);
    try { localStorage.setItem("akuru-brand-locks", JSON.stringify(n)); } catch { /* ignore */ }
  };
  const [brandReady, setBrandReady] = useState(false);
  useEffect(() => {
    try {
      const b = localStorage.getItem("akuru-current-brand");
      if (b) setS((c) => ({ ...c, ...JSON.parse(b) }));
    } catch { /* ignore */ }
    setBrandReady(true);
  }, []);
  const brandJson = JSON.stringify(brandOf(s));
  const [brandSaveNote, setBrandSaveNote] = useState("");
  useEffect(() => {
    if (!brandReady) return;
    try { localStorage.setItem("akuru-current-brand", brandJson); setBrandSaveNote(""); }
    catch { setBrandSaveNote("Your logo is too large to remember automatically — use “Download kit” to keep it."); }
  }, [brandJson, brandReady]);
  const hasBrand = s.outlet !== BASE.outlet || !!s.logo;
  const [tab, setTab] = useState<TabId>("quick");
  const [focus, setFocus] = useState<{ id: string; name: string; tab: TabId; keys: PosterKey[] } | null>(null);
  const [flash, setFlash] = useState<{ k: string; n: number } | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const thumbBase = useMemo(() => ({ photo: s.photo, logo: s.logo, outlet: s.outlet, partners: s.partners }), [s.photo, s.logo, s.outlet, s.partners]);
  const thumbs = useMemo(() => PRESETS.map((p) => ({ p, state: { ...withPreset({ ...s, ...thumbBase }, BASE, p.apply, { colors: false, fonts: false, footer: true }), aspect: "4:5" as Aspect } })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [thumbBase]);
  const pickPreset = (p: (typeof PRESETS)[number]) => {
    setS((c) => withPreset(c, BASE, p.apply, locks));
    const f = presetFocus(p);
    setFocus({ id: p.id, name: p.name, tab: f.tab, keys: f.keys });
    setTab(f.tab);
    setFlash((x) => ({ k: String(f.keys[0]), n: (x?.n ?? 0) + 1 }));
  };
  const gotoKey = (k: PosterKey) => {
    const t = KEY_TAB[k];
    if (t) setTab(t);
    setFlash((x) => ({ k: String(k), n: (x?.n ?? 0) + 1 }));
  };
  const activeId = PRESETS.find((p) => p.apply.layout === s.layout && p.apply.bgColor === s.bgColor)?.id ?? PRESETS.find((p) => p.apply.layout === s.layout)?.id;
  const shuffle = () => { const o = PRESETS.filter((p) => p.id !== activeId); const p = o[Math.floor(Math.random() * o.length)]; if (p) pickPreset(p); };
  const applyKit = (k: BrandKit) => setS((c) => ({ ...c, ...k.data }));
  const exportKit = () => {
    const blob = new Blob([JSON.stringify({ name: kitName || s.outlet, data: brandOf(s) })], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `brand-${(kitName || "kit").replace(/\s+/g, "_")}.json`;
    a.click();
  };
  const thaanaFonts = [...THAANA_FONTS, ...customFonts];

  useEffect(() => {
    const fit = () => {
      const el = stageRef.current;
      if (!el) return;
      setZoom(Math.min((el.clientWidth - 48) / w, (el.clientHeight - 48) / h));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [w, h]);

  // After picking a style: scroll its key control into view and flash it.
  useEffect(() => {
    if (!flash) return;
    let el: HTMLElement | null = null;
    const show = window.setTimeout(() => {
      el = panelRef.current?.querySelector<HTMLElement>(`[data-ctl="${flash.k}"]`) ?? null;
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ctl-flash");
      window.setTimeout(() => el?.classList.remove("ctl-flash"), 1800);
    }, 90);
    return () => { window.clearTimeout(show); el?.classList.remove("ctl-flash"); };
  }, [flash]);

  const kb = (k: keyof PosterState) => ({
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      thaanaKeyDown(e, thaanaKb, (v) => set(k, v as never)),
    dir: "auto" as const,
    style: { fontFamily: `"Faruma", "Space Grotesk", sans-serif` },
  });

  const txt = (k: keyof PosterState, area = false, rows = 3) =>
    area ? (
      <Textarea rows={rows} value={s[k] as string} onChange={(e) => set(k, e.target.value as never)} {...kb(k)} />
    ) : (
      <Input value={s[k] as string} onChange={(e) => set(k, e.target.value as never)} {...kb(k)} />
    );

  const slider = (label: string, k: keyof PosterState, min: number, max: number, step = 1) => (
    <Field label={`${label} · ${s[k]}`} ctl={k}>
      <Slider min={min} max={max} step={step} value={[s[k] as number]} onValueChange={([v]) => set(k, v as never)} />
    </Field>
  );

  const toggle = (label: string, k: keyof PosterState) => (
    <label className="flex items-center justify-between gap-2 text-sm" data-ctl={k}>
      {label}
      <Switch checked={s[k] as boolean} onCheckedChange={(v) => set(k, v as never)} />
    </label>
  );

  const color = (label: string, k: keyof PosterState) => (
    <label className="flex items-center gap-2 text-sm" data-ctl={k}>
      <input type="color" value={s[k] as string} onChange={(e) => set(k, e.target.value as never)} className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent" />
      {label}
    </label>
  );

  const optColor = (label: string, k: "patternColor" | "decorColor" | "watermarkColor", fallback: string) => (
    <div className="flex items-center gap-2 text-sm" data-ctl={k}>
      <input type="color" value={s[k] || fallback} onChange={(e) => set(k, e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent" />
      <span className="flex-1">{label}</span>
      {s[k] ? <Button size="sm" variant="ghost" onClick={() => set(k, "")}>Auto</Button> : <span className="text-xs text-muted-foreground">auto</span>}
    </div>
  );

  const fontSel = (label: string, k: keyof PosterState, list: string[]) => (
    <Field label={label} ctl={k}>
      <Select value={s[k] as string} onValueChange={(v) => set(k, v as never)}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {list.map((f) => (
            <SelectItem key={f} value={f}><span style={{ fontFamily: `"${f}"` }}>{f} — ދިވެހި Aa</span></SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );

  const upload = (k: "photo" | "logo" | "bgImage" | "backPhoto" | "photo2" | "extraImage") => (
    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-sm hover:bg-accent" data-ctl={k}>
      <Upload className="h-4 w-4" /> Upload
      <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) set(k, await readFile(f)); }} />
    </label>
  );

  const addFont = async (f: File) => {
    const url = await readFile(f);
    const name = f.name.replace(/\.[^.]+$/, "");
    const st = document.createElement("style");
    st.textContent = `@font-face { font-family: "${name}"; src: url("${url}"); }`;
    document.head.appendChild(st);
    setCustomFonts((c) => [...c, name]);
  };

  const exportImg = async () => {
    if (!posterRef.current) return;
    setBusy(true);
    try {
      await document.fonts.ready;
      const opts = { width: w, height: h, pixelRatio: exportScale, cacheBust: true };
      const url = format === "png" ? await toPng(posterRef.current, opts) : await toJpeg(posterRef.current, { ...opts, quality: 0.95 });
      const a = document.createElement("a");
      a.href = url;
      a.download = `poster-${s.aspect.replace(":", "x")}-${w * exportScale}x${h * exportScale}.${format}`;
      a.click();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded bg-primary text-lg font-bold text-primary-foreground" style={{ fontFamily: '"MV A Waheed"' }}>އ</div>
          <div>
            <h1 className="text-base font-bold leading-tight">Akuru Poster Studio</h1>
            <p className="text-xs text-muted-foreground">ދިވެހި ޚަބަރު ޕޯސްޓަރު · News poster maker</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant={thaanaKb ? "default" : "secondary"} size="sm" onClick={() => setThaanaKb((v) => !v)}>
            <Keyboard className="h-4 w-4" /> {thaanaKb ? "ތާނަ Phonetic ON" : "English typing"}
          </Button>
          <Select value={s.aspect} onValueChange={(v) => set("aspect", v as Aspect)}>
            <SelectTrigger className="h-9 w-[260px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(ASPECTS) as Aspect[]).map((a) => (
                <SelectItem key={a} value={a}>
                  {ASPECTS[a].label}{a !== "custom" && <span className="text-muted-foreground"> · {ASPECTS[a].w}×{ASPECTS[a].h}</span>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {s.aspect === "custom" && (
            <div className="flex items-center gap-1">
              <Input className="h-9 w-20" type="number" min={400} max={4000} value={s.customW} onChange={(e) => set("customW", Math.max(400, Math.min(4000, Number(e.target.value) || 1080)))} />
              <span className="text-xs text-muted-foreground">×</span>
              <Input className="h-9 w-20" type="number" min={400} max={4000} value={s.customH} onChange={(e) => set("customH", Math.max(400, Math.min(4000, Number(e.target.value) || 1080)))} />
            </div>
          )}
          <Select value={String(exportScale)} onValueChange={(v) => setExportScale(Number(v))}>
            <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((x) => <SelectItem key={x} value={String(x)}>{x}× · {w * x}×{h * x}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={format} onValueChange={(v) => setFormat(v as "png" | "jpg")}>
            <SelectTrigger className="h-9 w-[80px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="png">PNG</SelectItem><SelectItem value="jpg">JPG</SelectItem></SelectContent>
          </Select>
          <Button size="sm" onClick={exportImg} disabled={busy}><Download className="h-4 w-4" /> {busy ? "Exporting…" : "Export"}</Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside ref={panelRef} className="w-[380px] shrink-0 overflow-y-auto border-e border-border">
          <Tabs value={tab} onValueChange={setTab} className="p-4">
            <TabsList className="grid h-auto w-full grid-cols-6">
              {[["quick", Zap, "Quick"], ["presets", LayoutTemplate, "Styles"], ["text", Type, "Text"], ["photo", ImageIcon, "Images"], ["style", Palette, "Look"], ["brand", Share2, "Brand"]].map(([v, I, l]) => {
                const Icon = I as typeof Zap;
                return <TabsTrigger key={v as string} value={v as string} className="flex flex-col gap-0.5 px-1 py-1.5 text-[10px]"><Icon className="h-4 w-4" />{l as string}</TabsTrigger>;
              })}
            </TabsList>

            {focus && tab !== "presets" && tab !== "quick" && (
              <div className="mt-3 rounded-lg border border-primary/40 bg-primary/5 p-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                  <p className="flex-1 text-xs font-semibold leading-tight">{focus.name} — its key controls</p>
                  <Button size="sm" variant="ghost" className="h-7 shrink-0 px-2 text-xs" onClick={() => setTab("presets")}>
                    <LayoutTemplate className="h-3.5 w-3.5" /> Styles
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {focus.keys.map((k) => (
                    <button
                      key={k}
                      onClick={() => gotoKey(k)}
                      className={`rounded-full border px-2.5 py-1 text-[11px] transition hover:border-primary ${flash?.k === k ? "border-primary bg-primary/15" : "border-border bg-background"}`}
                    >
                      {KEY_LABEL[k] ?? k}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <TabsContent value="quick" className="mt-4 space-y-4">
              {!hasBrand && (
                <button onClick={() => setTab("brand")} className="flex w-full items-center gap-3 rounded-lg border border-primary bg-primary/10 p-3 text-start text-sm">
                  <Sparkles className="h-5 w-5 shrink-0 text-primary" />
                  <span><b>Set up your outlet once.</b> Add your logo, name and social accounts — they appear on every poster.</span>
                </button>
              )}
              <Section title="1 · Choose a style">
                <div className="grid grid-cols-3 gap-1.5">
                  {thumbs.slice(0, 6).map(({ p, state }) => (
                    <button key={p.id} onClick={() => pickPreset(p)} className={`rounded-md border px-1.5 py-2 text-[11px] leading-tight ${activeId === p.id ? "border-primary bg-primary/10" : "border-border hover:border-primary"}`}>
                      <span className="mb-1 flex justify-center gap-0.5">{p.swatch.map((c) => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}</span>
                      {p.name}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setTab("presets")}><LayoutTemplate className="h-4 w-4" /> All {PRESETS.length} styles</Button>
                  <Button size="sm" variant="secondary" onClick={shuffle}><Shuffle className="h-4 w-4" /> Surprise me</Button>
                </div>
              </Section>
              <Section title="2 · Write">
                <Field label="Headline">{txt("headline", true, 2)}</Field>
                <Field label="Quote">{txt("quote", true, 4)}</Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Name">{txt("name")}</Field>
                  <Field label="Title / role">{txt("designation")}</Field>
                </div>
                <p className="text-xs text-muted-foreground">Tip: put *stars* around words to colour them.</p>
              </Section>
              <Section title="3 · Speaker photo">
                <div className="flex items-center gap-3">
                  {s.photo && <img src={s.photo} alt="" className="h-14 w-14 rounded-md bg-muted object-contain" />}
                  <div className="flex-1">{upload("photo")}</div>
                </div>
                {slider("Photo size", "photoScale", 30, 200)}
              </Section>
              <Section title="4 · Size & download">
                <div className="grid grid-cols-3 gap-1.5">
                  {QUICK_SIZES.map((a) => (
                    <button key={a} onClick={() => set("aspect", a)} className={`rounded-md border px-1.5 py-1.5 text-[11px] leading-tight ${s.aspect === a ? "border-primary bg-primary/10" : "border-border hover:border-primary"}`}>
                      {SIZE_NAMES[a]}<br /><span className="text-muted-foreground">{ASPECTS[a].w}×{ASPECTS[a].h}</span>
                    </button>
                  ))}
                </div>
                <Button className="w-full" onClick={exportImg} disabled={busy}><Download className="h-4 w-4" /> {busy ? "Preparing…" : `Download ${format.toUpperCase()} · ${w * exportScale}×${h * exportScale}`}</Button>
              </Section>
            </TabsContent>

            <TabsContent value="presets" className="mt-4 space-y-3">
              <p className="text-xs text-muted-foreground">Tap a style. Your text, photos and brand stay the same.</p>
              <div className="grid grid-cols-2 gap-2">
                {thumbs.map(({ p, state }) => <PresetThumb key={p.id} state={state} name={p.name} active={activeId === p.id} onPick={() => pickPreset(p)} />)}
              </div>
              <Field label="Layout">
                <Select value={s.layout} onValueChange={(v) => set("layout", v as PosterState["layout"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRESETS.filter((p) => p.apply.layout && p.id !== "english").map((p) => (
                      <SelectItem key={p.id} value={p.apply.layout as string}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Button variant="secondary" className="w-full" onClick={() => setS((c) => withPreset(c, { ...BASE, photo: sampleSpeaker }, {}, locks))}><RotateCcw className="h-4 w-4" /> Reset</Button>
            </TabsContent>

            <TabsContent value="text" className="mt-4 space-y-4">
              <p className="rounded-md bg-muted p-2 text-xs text-muted-foreground">Wrap words in *asterisks* to highlight them. Phonetic keyboard: type "dhivehi" → ދހިވެހި.</p>
              <Field label="Direction" ctl="dir">
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant={s.dir === "rtl" ? "default" : "secondary"} onClick={() => set("dir", "rtl")}>ދިވެހި RTL</Button>
                  <Button size="sm" variant={s.dir === "ltr" ? "default" : "secondary"} onClick={() => set("dir", "ltr")}>English LTR</Button>
                </div>
              </Field>
              {toggle("Show headline", "showHeadline")}
              <Field label="Headline (new line = new strip)" ctl="headline">{txt("headline", true, 3)}</Field>
              <Field label="English translation (under headline)" ctl="translation">
                <Textarea rows={2} dir="ltr" value={s.translation} onChange={(e) => set("translation", e.target.value)} />
              </Field>
              {toggle("Show translation", "showTranslation")}
              <Field label="Headline style" ctl="headlineStyle">
                <Select value={s.headlineStyle} onValueChange={(v) => set("headlineStyle", v as PosterState["headlineStyle"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="strip">Torn paper strips</SelectItem><SelectItem value="plain">Plain</SelectItem><SelectItem value="block">Solid block</SelectItem></SelectContent>
                </Select>
              </Field>
              <Field label="Quote / body" ctl="quote">{txt("quote", true, 6)}</Field>
              <Field label="Quote container" ctl="quoteBox">
                <Select value={s.quoteBox} onValueChange={(v) => set("quoteBox", v as PosterState["quoteBox"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="torn">Torn paper</SelectItem>
                    <SelectItem value="frame">Framed box</SelectItem>
                    <SelectItem value="glass">Frosted glass</SelectItem>
                    <SelectItem value="speech">Clean speech bubble</SelectItem>
                    <SelectItem value="arch">Solid arch</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Speaker name" ctl="name">{txt("name")}</Field>
              <Field label="Designation" ctl="designation">{txt("designation")}</Field>
              <Field label="Category / #tag badge" ctl="category">{txt("category", true, 2)}</Field>
              {toggle("Show category", "showCategory")}
              <Field label="Tagline (top of poster, some styles)" ctl="tagline">{txt("tagline")}</Field>
              <Field label="Call to action (academy style)" ctl="cta">{txt("cta", true, 2)}</Field>
              <Field label="Big date (e.g. 23-25)" ctl="dateBig"><Input dir="ltr" value={s.dateBig} onChange={(e) => set("dateBig", e.target.value)} /></Field>
              <Field label="Date text" ctl="date">{txt("date")}</Field>
              {toggle("Show date", "showDate")}
              <Field label="Quote alignment" ctl="quoteAlign">
                <Select value={s.quoteAlign} onValueChange={(v) => set("quoteAlign", v as PosterState["quoteAlign"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="start">Start</SelectItem><SelectItem value="center">Center</SelectItem><SelectItem value="justify">Justify</SelectItem></SelectContent>
                </Select>
              </Field>
              <Field label="Quote mark" ctl="quoteMark">
                <Select value={s.quoteMark} onValueChange={(v) => set("quoteMark", v as PosterState["quoteMark"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="box">Boxed</SelectItem><SelectItem value="big">Large</SelectItem><SelectItem value="none">None</SelectItem></SelectContent>
                </Select>
              </Field>
            </TabsContent>

            <TabsContent value="photo" className="mt-4 space-y-4">
              <p className="rounded-md bg-muted p-2 text-xs text-muted-foreground">For the cutout look, upload a PNG with the background removed.</p>
              <Field label="Speaker photo">{upload("photo")}</Field>
              {s.photo && <Button size="sm" variant="secondary" onClick={() => set("photo", undefined)}>Remove photo</Button>}
              {slider("Size %", "photoScale", 30, 200)}
              {slider("Move sideways", "photoX", -600, 600)}
              {slider("Move up/down", "photoY", -600, 600)}
              {slider("White cutout outline", "photoOutline", 0, 20)}
              <Field label="Photo tone" ctl="photoTone">
                <Select value={s.photoTone} onValueChange={(v) => set("photoTone", v as PosterState["photoTone"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="color">Full colour</SelectItem><SelectItem value="gray">Black & white</SelectItem><SelectItem value="duotone">Duotone (accent tint)</SelectItem></SelectContent>
                </Select>
              </Field>
              {toggle("Ghost silhouette behind (topographic)", "photoGhost")}
              {toggle("Drop shadow", "photoShadow")}
              <Field label="Second speaker photo (collage style)">{upload("photo2")}</Field>
              {s.photo2 && <Button size="sm" variant="secondary" onClick={() => set("photo2", undefined)}>Remove second photo</Button>}
              <div className="space-y-4 rounded-lg border border-border p-3">
                <p className="text-sm font-semibold">Secondary image</p>
                <p className="text-xs text-muted-foreground">The dome, books, building or emblem in a style. Upload your own to replace it.</p>
                {toggle("Show secondary image", "showExtra")}
                {upload("extraImage")}
                {s.extraImage && <Button size="sm" variant="secondary" onClick={() => set("extraImage", undefined)}>Use default image</Button>}
                {slider("Size %", "extraScale", 20, 250)}
                {slider("Move sideways", "extraX", -600, 600)}
                {slider("Move up/down", "extraY", -600, 600)}
                {slider("Opacity", "extraOpacity", 0, 1, 0.05)}
                <Field label="Tone" ctl="extraTone">
                  <Select value={s.extraTone} onValueChange={(v) => set("extraTone", v as PosterState["extraTone"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="color">Full colour</SelectItem><SelectItem value="gray">Black & white</SelectItem><SelectItem value="duotone">Tinted with accent</SelectItem></SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Background collage photo (paper / archive)">{upload("backPhoto")}</Field>
              {s.backPhoto && <Button size="sm" variant="secondary" onClick={() => set("backPhoto", undefined)}>Remove collage photo</Button>}
            </TabsContent>

            <TabsContent value="style" className="mt-4 space-y-4">
              <Field label="Background" ctl="bgType">
                <Select value={s.bgType} onValueChange={(v) => set("bgType", v as PosterState["bgType"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid paper</SelectItem>
                    <SelectItem value="paper">Parchment / newsprint</SelectItem>
                    <SelectItem value="topo">Topographic contours</SelectItem>
                    <SelectItem value="dark">Dark gradient</SelectItem>
                    <SelectItem value="bokeh">Soft bokeh + light streaks</SelectItem>
                    <SelectItem value="mesh">Mesh gradient</SelectItem>
                    <SelectItem value="noise">Textured (grain)</SelectItem>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              {s.bgType === "image" && upload("bgImage")}
              {(s.bgType === "paper" || s.bgType === "noise") && slider("Texture strength", "textureOpacity", 0, 1, 0.05)}
              {toggle("Extra grid overlay", "showGrid")}
              {toggle("Torn paper edges", "tornEdges")}
              {toggle("Decorations (shapes, streaks, stripes)", "showDecor")}
              <Section title="Background pattern & faint shapes">
                <p className="text-xs text-muted-foreground">Change the light lines, grid, glows, shapes and calligraphy behind the poster.</p>
                {slider("Pattern strength", "patternOpacity", 0, 2, 0.05)}
                {slider("Pattern size", "patternScale", 0.5, 2.5, 0.05)}
                {optColor("Pattern colour", "patternColor", s.accent)}
                {s.showDecor && slider("Shapes strength", "decorOpacity", 0, 1, 0.05)}
                {s.showDecor && optColor("Shapes colour", "decorColor", s.accent2)}
                <Field label="Calligraphy / watermark text" ctl="watermark">{txt("watermark")}</Field>
                {slider("Watermark strength", "watermarkOpacity", 0, 6, 0.1)}
                {slider("Watermark size %", "watermarkSize", 30, 200)}
                {optColor("Watermark colour", "watermarkColor", s.accent)}
                <Button size="sm" variant="secondary" onClick={() => setS((c) => ({ ...c, patternColor: "", patternOpacity: 1, patternScale: 1, decorOpacity: 1, decorColor: "", watermarkOpacity: 1, watermarkSize: 100, watermarkColor: "" }))}><RotateCcw className="h-4 w-4" /> Reset background details</Button>
              </Section>
              <Field label="Keyword highlight colour" ctl="highlightColor">
                <div className="flex flex-wrap gap-2">
                  {HIGHLIGHTS.map((c) => (
                    <button key={c.name} title={c.name} onClick={() => setS((p) => ({ ...p, highlightColor: c.bg, highlightText: c.fg }))} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${s.highlightColor === c.bg ? "border-primary" : "border-border"}`}>
                      <span className="h-3.5 w-3.5 rounded-full" style={{ background: c.bg }} /> {c.name}
                    </button>
                  ))}
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                {color("Background", "bgColor")}
                {color("Background 2", "bgColor2")}
                {color("Accent", "accent")}
                {color("Accent 2", "accent2")}
                {color("Text", "textColor")}
                {color("Card", "cardColor")}
                {color("Card text", "cardText")}
                {color("Highlight", "highlightColor")}
                {color("Highlight text", "highlightText")}
              </div>
              {fontSel("Headline font (Thaana)", "headlineFont", thaanaFonts)}
              {fontSel("Body font (Thaana)", "bodyFont", thaanaFonts)}
              {fontSel("Name tag font (Thaana)", "nameFont", thaanaFonts)}
              {fontSel("English font", "latinFont", LATIN_FONTS)}
              <Field label="Add your own font (e.g. A-Kalaa .ttf/.otf)">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-sm hover:bg-accent">
                  <Upload className="h-4 w-4" /> Upload font
                  <input type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) addFont(f); }} />
                </label>
              </Field>
              {slider("Headline size", "headlineSize", 24, 120)}
              {slider("Quote size", "quoteSize", 18, 70)}
              {slider("Line height", "lineHeight", 1, 2.6, 0.05)}
              {slider("Name size", "nameSize", 16, 60)}
              {slider("Headline nudge", "headlineOffset", -200, 200)}
              {slider("Quote card nudge", "quoteOffset", -300, 300)}
            </TabsContent>

            <TabsContent value="brand" className="mt-4 space-y-4">
              <Section title="Your outlet">
                <p className="text-xs text-muted-foreground">Set this once — it's remembered on this device and kept on every style.</p>
                <div className="flex items-center gap-3">
                  <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-muted">
                    {s.logo ? <img src={s.logo} alt="Logo" className="max-h-full max-w-full object-contain" /> : <span className="text-[10px] text-muted-foreground">No logo</span>}
                  </div>
                  <div className="flex-1 space-y-2">
                    {upload("logo")}
                    {s.logo && <Button size="sm" variant="ghost" className="w-full" onClick={() => set("logo", undefined)}>Remove logo</Button>}
                  </div>
                </div>
                  {slider("Logo / name size %", "logoSize", 40, 250)}
                <div className="grid grid-cols-2 gap-3">
                  {color("Brand colour", "accent")}
                  {color("Brand colour 2", "accent2")}
                </div>
                {brandSaveNote && <p className="text-xs text-destructive">{brandSaveNote}</p>}
              </Section>
              <Section title="Your social accounts">
                <p className="text-xs text-muted-foreground">Switch on the ones to show in the footer. Leave a box empty to show only the icon.</p>
                {toggle("Show social footer", "showFooter")}
                <Field label="Main handle" ctl="handle"><Input dir="ltr" placeholder="@youroutlet" value={s.handle} onChange={(e) => set("handle", e.target.value)} /></Field>
                <div className="space-y-2" data-ctl="footer">
                  {s.footer.map((f, i) => (
                    <div key={f.kind} className="flex items-center gap-2">
                      <Switch checked={f.on} onCheckedChange={(v) => set("footer", s.footer.map((x, j) => (j === i ? { ...x, on: v } : x)))} />
                      <span className="w-20 text-xs text-muted-foreground">{FOOTER_LABELS[f.kind]}</span>
                      <Input className="h-8" dir="ltr" value={f.text} placeholder={FOOTER_PLACEHOLDERS[f.kind]} onChange={(e) => set("footer", s.footer.map((x, j) => (j === i ? { ...x, text: e.target.value, on: e.target.value ? true : x.on } : x)))} />
                    </div>
                  ))}
                </div>
              </Section>
              <div className="space-y-3 rounded-lg border border-primary/40 bg-card p-3">
                <p className="text-sm font-semibold">Saved brand kits (for several outlets)</p>
                <p className="text-xs text-muted-foreground">Your logo, name, handle and contact details stay on every style. Choose what else to keep when switching styles.</p>
                <label className="flex items-center justify-between text-sm">Keep my brand colours<Switch checked={locks.colors} onCheckedChange={(v) => setLock("colors", v)} /></label>
                <label className="flex items-center justify-between text-sm">Keep my fonts<Switch checked={locks.fonts} onCheckedChange={(v) => setLock("fonts", v)} /></label>
                <label className="flex items-center justify-between text-sm">Keep my footer icons<Switch checked={locks.footer} onCheckedChange={(v) => setLock("footer", v)} /></label>
                <div className="flex gap-2">
                  <Input className="h-8" placeholder="Brand name" value={kitName} onChange={(e) => setKitName(e.target.value)} />
                  <Button size="sm" onClick={() => { const name = kitName.trim() || s.outlet || "My brand"; saveKits([...kits.filter((k) => k.name !== name), { name, data: brandOf(s) }]); }}>Save</Button>
                </div>
                {kitMsg && <p className="text-xs text-destructive">{kitMsg}</p>}
                {kits.map((k) => (
                  <div key={k.name} className="flex items-center gap-2 text-sm">
                    <span className="flex gap-1">{[k.data.accent, k.data.accent2, k.data.highlightColor].map((c, i) => <span key={i} className="h-3.5 w-3.5 rounded-full border border-border" style={{ background: c }} />)}</span>
                    <span className="flex-1 truncate">{k.name}</span>
                    <Button size="sm" variant="secondary" onClick={() => applyKit(k)}>Apply</Button>
                    <Button size="sm" variant="ghost" onClick={() => saveKits(kits.filter((x) => x.name !== k.name))}>✕</Button>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="secondary" onClick={exportKit}>Download kit</Button>
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-md bg-secondary px-3 text-sm hover:bg-accent">
                    Load kit file
                    <input type="file" accept="application/json" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { const k = JSON.parse(await f.text()) as BrandKit; if (k?.data) { applyKit(k); saveKits([...kits.filter((x) => x.name !== k.name), k]); } } catch { setKitMsg("That file is not a brand kit."); } }} />
                  </label>
                </div>
              </div>
              {toggle("Show outlet branding", "showOutlet")}
              <Field label="Outlet name" ctl="outlet">{txt("outlet")}</Field>
              {fontSel("Outlet font", "outletFont", thaanaFonts)}
              <Field label="Partner / sponsor logos (footer row)" ctl="partners">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-sm hover:bg-accent">
                  <Upload className="h-4 w-4" /> Add partner logo
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const u = await readFile(f); set("partners", [...s.partners, u]); } }} />
                </label>
                {s.partners.length > 0 && <Button size="sm" variant="secondary" onClick={() => set("partners", [])}>Clear {s.partners.length} partner logo(s)</Button>}
              </Field>
            </TabsContent>
          </Tabs>
        </aside>

        <main ref={stageRef} className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-canvas">
          <div style={{ width: w * zoom, height: h * zoom }} className="shadow-2xl">
            <div style={{ width: w, height: h, transform: `scale(${zoom})`, transformOrigin: "top left" }}>
              <Poster ref={posterRef} s={s} />
            </div>
          </div>
          {w / h > 1 && (
            <div className="absolute start-4 top-3 flex items-center gap-2 rounded-md border border-border bg-background/90 p-1.5 text-xs">
              <span className="px-1 text-muted-foreground">Wide layout:</span>
              {(["start", "center", "end"] as const).map((v) => (
                <Button key={v} size="sm" variant={s.wideAlign === v ? "default" : "ghost"} className="h-7 px-2" onClick={() => set("wideAlign", v)}>{v === "start" ? "Design first" : v === "center" ? "Centre" : "Design last"}</Button>
              ))}
              <label className="flex items-center gap-1.5 px-1">Brand panel <Switch checked={s.wideSide} onCheckedChange={(v) => set("wideSide", v)} /></label>
            </div>
          )}
          <span className="absolute bottom-3 end-4 text-xs text-muted-foreground">{w}×{h} · {Math.round(zoom * 100)}%</span>
        </main>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toJpeg, toPng } from "html-to-image";
import { Download, Keyboard, Upload, RotateCcw, Type, Image as ImageIcon, Palette, LayoutTemplate, Share2, Zap, Sparkles, Shuffle, Check, Undo2, Redo2, Cloud, Loader2, Hand, MousePointer2, Minus, Plus, Maximize, X, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Poster } from "@/components/poster/Poster";
import { tracked } from "@/lib/poster/track"; // records which settings the shown template reads
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

type El = "headline" | "quote" | "translation" | "name" | "category" | "photo" | "outlet" | "footer" | "background" | null;
const EL_NAME: Record<NonNullable<El>, string> = { headline: "Headline", quote: "Quote", translation: "Translation", name: "Name", category: "Category", photo: "Photo", outlet: "Logo", footer: "Socials", background: "Background" };
const CATS = ["All", "News", "Quotes", "Portrait", "Editorial", "Minimal"];
const CAT_RX: Record<string, RegExp> = {
  News: /wire|live|band|split|magazine|sidebar|break|tabloid|news|red|photo|card|story|conference|agency|statement|blue/i,
  Quotes: /pullquote|notes|condolence|quote|speech|kalam|arch|note|tweet|torn|bubble|glass|calligraph/i,
  Portrait: /cutout|portrait|capsule|circle|speaker|collage|duotone|grid|montage/i,
  Editorial: /explainer|marker|polaroid|number|editorial|investigation|montage|feature|mono|paper|chalk|archive|did you/i,
  Minimal: /minimal|gradient|duo|clean|mono|soft|paper|cream|sheet/i,
};
const catsOf = (p: { id: string; name: string }) => Object.keys(CAT_RX).filter((c) => CAT_RX[c]!.test(`${p.id} ${p.name}`));

const THUMB_W = 136;
const PresetThumb = memo(function PresetThumb({ state, active, name, onPick }: { state: PosterState; active: boolean; name: string; onPick: () => void }) {
  const { w, h } = sizeOf(state);
  const z = THUMB_W / w;
  return (
    <button
      onClick={onPick}
      title={name}
      aria-pressed={active}
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-card text-start shadow-md ring-1 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? "ring-2 ring-primary" : "ring-border"}`}
    >
      <div style={{ width: THUMB_W, height: h * z }} className="pointer-events-none relative overflow-hidden">
        <div style={{ width: w, height: h, transform: `scale(${z})`, transformOrigin: "top left" }} className="transition duration-300 group-hover:scale-[1.0]"><Poster s={state} /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
      <span className={`flex items-center gap-1.5 border-t px-2.5 py-2 text-[11px] font-semibold leading-tight ${active ? "text-primary" : "text-card-foreground"}`}>
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-primary" : "bg-muted-foreground/40"}`} />
        <span className="truncate">{name}</span>
      </span>
      {active && <Check className="absolute end-1.5 top-1.5 h-5 w-5 rounded-full bg-primary p-0.5 text-primary-foreground shadow" />}
    </button>
  );
});

const QUICK_SIZES: Aspect[] = ["4:5", "1:1", "9:16", "fb", "x", "yt"];
const SIZE_NAMES: Partial<Record<Aspect, string>> = { "4:5": "Insta / FB post", "1:1": "Square post", "9:16": "Story / Status", fb: "Facebook wide", x: "X post", yt: "YouTube" };

/** Controls every template keeps, even when its layout doesn't read them directly. */
const UNIVERSAL = new Set(["dir", "headline", "quote", "name", "photo", "headlineFont", "bodyFont", "nameFont", "latinFont", "accent", "textColor", "finish", "bgType", "bgColor", "bgImage", "outlet", "outletFont", "logo", "logoSize", "showOutlet", "footer", "showFooter", "handle", "headlineSize", "quoteSize", "nameSize"]);

function Studio() {
  const [raw, setS] = useState<PosterState>({ ...BASE, photo: sampleSpeaker });
  // Fill any setting missing from older saved/loaded state with its default, so sliders never show "undefined".
  const s = useMemo(() => {
    const out = { ...raw } as Record<string, unknown>;
    for (const [k, v] of Object.entries(BASE)) if (out[k] === undefined && v !== undefined) out[k] = v;
    return out as unknown as PosterState;
  }, [raw]);
  const [used, setUsed] = useState<Record<string, string[]>>({});
  const readRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const now = readRef.current, prev = used[s.layout] ?? [];
    const all = new Set([...prev, ...now]);
    if (all.size > prev.length) setUsed((u) => ({ ...u, [s.layout]: [...all] }));
  });
  const hideCss = useMemo(() => {
    const seen = new Set(used[s.layout] ?? []);
    if (!seen.size) return "";
    return Object.keys(KEY_TAB).filter((k) => !UNIVERSAL.has(k) && !seen.has(k)).map((k) => `#ctl-panel [data-ctl="${k}"]`).join(",") + (seen.size ? "{display:none}" : "");
  }, [used, s.layout]);
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
      const d = localStorage.getItem("akuru-doc");
      if (d) setS((c) => ({ ...c, ...JSON.parse(d) }));
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
  const [tab, setTab] = useState<TabId>("presets");
  const [panelOpen, setPanelOpen] = useState(true);
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
      setZoom(Math.min((el.clientWidth - 64) / w, (el.clientHeight - 110) / h));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [w, h, panelOpen]);

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
      <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) set(k, await readFile(f)); }} />
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

  // ---------- Canva-style shell state ----------
  const [docName, setDocName] = useState("Untitled poster");
  const [saved, setSaved] = useState<"saved" | "saving" | "session">("saved");
  const [sel, setSel] = useState<El>(null);
  const [hand, setHand] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [exportOpen, setExportOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const hist = useRef<{ past: PosterState[]; future: PosterState[]; last: PosterState | null; skip: boolean }>({ past: [], future: [], last: null, skip: false });
  const [, bump] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => {
      const hs = hist.current;
      if (hs.skip) { hs.skip = false; hs.last = raw; bump((v) => v + 1); return; }
      if (hs.last && hs.last !== raw) { hs.past.push(hs.last); if (hs.past.length > 80) hs.past.shift(); hs.future = []; }
      hs.last = raw; bump((v) => v + 1);
    }, 350);
    return () => window.clearTimeout(t);
  }, [raw]);
  const undo = () => { const hs = hist.current; const prev = hs.past.pop(); if (!prev) return; hs.future.push(raw); hs.skip = true; setS(prev); };
  const redo = () => { const hs = hist.current; const nx = hs.future.pop(); if (!nx) return; hs.past.push(raw); hs.skip = true; setS(nx); };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input,textarea,[contenteditable]")) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") { e.preventDefault(); redo(); }
      else if (e.key === "Escape") setSel(null);
      else if (e.key.toLowerCase() === "h") setHand((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  // Name + autosave of the current design (photos can be too big for the browser; then it's kept for this session).
  useEffect(() => { try { const n = localStorage.getItem("akuru-doc-name"); if (n) setDocName(n); } catch { /* ignore */ } }, []);
  useEffect(() => {
    setSaved("saving");
    const t = window.setTimeout(() => {
      try { localStorage.setItem("akuru-doc-name", docName); localStorage.setItem("akuru-doc", JSON.stringify(raw)); setSaved("saved"); }
      catch { setSaved("session"); }
    }, 600);
    return () => window.clearTimeout(t);
  }, [raw, docName]);
  // Selection outline on the canvas.
  useLayoutEffect(() => {
    if (!sel || sel === "background" || !posterRef.current || !stageRef.current) { setBox(null); return; }
    const el = posterRef.current.querySelector<HTMLElement>(`[data-el="${sel}"]`);
    if (!el) { setBox(null); return; }
    const r = el.getBoundingClientRect(), st = stageRef.current.getBoundingClientRect();
    setBox({ x: r.left - st.left, y: r.top - st.top, w: r.width, h: r.height });
  }, [sel, s, zoom, pan, w, h]);
  const onPosterClick = (e: React.MouseEvent) => {
    if (hand) return;
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-el]");
    setSel(((t?.dataset["el"] as El) ?? "background"));
  };
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const fitView = () => {
    const el = stageRef.current;
    if (!el) return;
    setPan({ x: 0, y: 0 });
    setZoom(Math.max(0.05, Math.min((el.clientWidth - 64) / w, (el.clientHeight - 110) / h)));
  };
  const shown = thumbs.filter(({ p }) => (cat === "All" || catsOf(p).includes(cat)) && p.name.toLowerCase().includes(q.trim().toLowerCase()));

  const readNow = new Set<string>();
  readRef.current = readNow;
  const RAIL: [TabId, typeof Zap, string][] = [
    ["presets", LayoutTemplate, "Templates"], ["quick", Zap, "Quick"], ["text", Type, "Text"], ["photo", ImageIcon, "Images"],
    ["style", Palette, "Styles"], ["brand", Share2, "Brand"],
  ];
  const isText = sel === "headline" || sel === "quote" || sel === "translation" || sel === "name" || sel === "category" || sel === "outlet";
  const textKey: Partial<Record<NonNullable<El>, keyof PosterState>> = { headline: "headline", quote: "quote", translation: "translation", name: "name", category: "category", outlet: "outlet" };
  const sizeKey: Partial<Record<NonNullable<El>, [keyof PosterState, number, number]>> = { headline: ["headlineSize", 24, 120], quote: ["quoteSize", 18, 70], name: ["nameSize", 16, 60], outlet: ["logoSize", 40, 250] };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-foreground text-base font-bold text-primary-foreground" style={{ fontFamily: '"MV A Waheed"' }}>އ</div>
        <div className="hidden min-w-0 flex-col md:flex">
          <input aria-label="Poster name" value={docName} onChange={(e) => setDocName(e.target.value)} className="w-48 truncate rounded bg-transparent px-1 text-sm font-semibold outline-none hover:bg-accent focus:bg-accent" />
          <span className="flex items-center gap-1 px-1 text-[11px] text-muted-foreground">
            {saved === "saving" ? <><Loader2 className="h-3 w-3 animate-spin" /> Saving…</> : saved === "saved" ? <><Cloud className="h-3 w-3" /> Saved</> : <><Cloud className="h-3 w-3" /> Kept for this session</>}
          </span>
        </div>
        <div className="flex items-center gap-0.5 border-s border-border ps-2">
          <Button size="icon" variant="ghost" aria-label="Undo" title="Undo (Ctrl+Z)" disabled={!hist.current.past.length} onClick={undo}><Undo2 className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" aria-label="Redo" title="Redo (Ctrl+Shift+Z)" disabled={!hist.current.future.length} onClick={redo}><Redo2 className="h-4 w-4" /></Button>
        </div>
        <div className="flex-1" />
        <Button variant={thaanaKb ? "secondary" : "ghost"} size="sm" onClick={() => setThaanaKb((v) => !v)} title="Phonetic Thaana keyboard">
          <Keyboard className="h-4 w-4" /> <span className="hidden lg:inline">{thaanaKb ? "ތާނަ ON" : "English"}</span>
        </Button>
        <Select value={s.aspect} onValueChange={(v) => set("aspect", v as Aspect)}>
          <SelectTrigger className="h-8 w-[200px] border-transparent bg-secondary shadow-none"><SelectValue /></SelectTrigger>
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
        <Button size="sm" onClick={() => setExportOpen(true)}><Download className="h-4 w-4" /> Export</Button>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <nav aria-label="Editor tools" className="flex w-[64px] shrink-0 flex-col items-center gap-0.5 overflow-y-auto border-e border-border py-2">
          {RAIL.map(([v, Icon, l]) => (
            <button key={v} onClick={() => { if (tab === v) setPanelOpen((o) => !o); else { setTab(v); setPanelOpen(true); } }} aria-pressed={tab === v && panelOpen}
              className={`flex w-[56px] flex-col items-center gap-1 rounded-md py-2 text-[10px] transition ${tab === v && panelOpen ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
              <Icon className="h-5 w-5" />{l}
            </button>
          ))}
        </nav>

        <style>{hideCss}</style>
        <aside id="ctl-panel" ref={panelRef} className={`w-[300px] shrink-0 overflow-y-auto border-e border-border ${panelOpen ? "" : "hidden"}`}>
          <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)} className="p-4">
            <div className="sticky top-0 z-30 -mx-4 -mt-4 border-b border-border/60 bg-background/95 px-4 pb-2 pt-3 backdrop-blur">
              <div className="flex items-center justify-between"><p className="text-sm font-semibold">{RAIL.find(([v]) => v === tab)?.[2]}</p><Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Hide panel" onClick={() => setPanelOpen(false)}><X className="h-4 w-4" /></Button></div>
            {focus && !["presets", "quick", "news", "cutout"].includes(tab) && (
              <div className="mt-2 rounded-lg border border-primary/40 bg-primary/5 p-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                  <p className="flex-1 text-xs font-semibold leading-tight">{focus.name} — its key controls</p>
                  <Button size="sm" variant="ghost" className="h-7 shrink-0 px-2 text-xs" onClick={() => setTab("presets")}>
                    <LayoutTemplate className="h-3.5 w-3.5" /> Templates
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {focus.keys.map((k) => (
                    <button key={k} onClick={() => gotoKey(k)}
                      className={`rounded-full border px-2.5 py-1 text-[11px] transition hover:border-primary ${flash?.k === k ? "border-primary bg-primary/15" : "border-border bg-background"}`}>
                      {KEY_LABEL[k] ?? k}
                    </button>
                  ))}
                </div>
              </div>
            )}
            </div>
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
              <div className="relative"><Search className="pointer-events-none absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="ps-8" placeholder="Search templates" value={q} onChange={(e) => setQ(e.target.value)} /></div>
              <div className="flex flex-wrap gap-1.5">
                {CATS.map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-2.5 py-1 text-xs ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>{c}</button>)}
              </div>
              <p className="text-xs text-muted-foreground">{shown.length} templates · your text, photos and brand stay the same.</p>
              <div className="grid grid-cols-2 gap-2">
                {shown.map(({ p, state }) => <PresetThumb key={p.id} state={state} name={p.name} active={activeId === p.id} onPick={() => pickPreset(p)} />)}
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
              {s.photoGhost && (
                <div className="space-y-4 rounded-lg border border-border p-3">
                  <p className="text-sm font-semibold">Ghost silhouette (moves on its own)</p>
                  {slider("Ghost size %", "ghostScale", 30, 200)}
                  {slider("Ghost sideways", "ghostX", -600, 600)}
                  {slider("Ghost up/down", "ghostY", -600, 600)}
                  {slider("Ghost strength", "ghostOpacity", 0, 1, 0.05)}
                </div>
              )}
              {toggle("Drop shadow", "photoShadow")}
              <Field label="Second speaker photo (collage style)">{upload("photo2")}</Field>
              {s.photo2 && <Button size="sm" variant="secondary" onClick={() => set("photo2", undefined)}>Remove second photo</Button>}
              {slider("Second speaker size %", "photo2Scale", 30, 200)}
              {slider("Second speaker sideways", "photo2X", -600, 600)}
              {slider("Second speaker up/down", "photo2Y", -600, 600)}
              {slider("Second speaker outline", "photo2Outline", 0, 20)}
              <Field label="Second speaker tone" ctl="photo2Tone">
                <Select value={s.photo2Tone} onValueChange={(v) => set("photo2Tone", v as PosterState["photo2Tone"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="color">Full colour</SelectItem><SelectItem value="gray">Black &amp; white</SelectItem><SelectItem value="duotone">Duotone (accent tint)</SelectItem></SelectContent>
                </Select>
              </Field>
              {toggle("Second speaker shadow", "photo2Shadow")}
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
              <div className="space-y-4 rounded-lg border border-border p-3">
                <p className="text-sm font-semibold">Background collage photo (paper / archive)</p>
                <p className="text-xs text-muted-foreground">The photo behind the speaker. It has its own controls.</p>
                {upload("backPhoto")}
                {s.backPhoto && (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => set("backPhoto", undefined)}>Remove collage photo</Button>
                    {slider("Collage photo size %", "backPhotoScale", 30, 200)}
                    {slider("Collage photo sideways", "backPhotoX", -600, 600)}
                    {slider("Collage photo up/down", "backPhotoY", -600, 600)}
                    {slider("Collage photo strength", "backPhotoOpacity", 0, 1, 0.05)}
                  </>
                )}
              </div>
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
                {slider("Pro finish (vignette + grain)", "finish", 0, 1, 0.05)}
                <Button size="sm" variant="secondary" onClick={() => setS((c) => ({ ...c, finish: 0.6, patternColor: "", patternOpacity: 1, patternScale: 1, decorOpacity: 1, decorColor: "", watermarkOpacity: 1, watermarkSize: 100, watermarkColor: "" }))}><RotateCcw className="h-4 w-4" /> Reset background details</Button>
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
                  <input type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) addFont(f); }} />
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
                      <Switch aria-label={`Show ${f.kind}`} checked={f.on} onCheckedChange={(v) => set("footer", s.footer.map((x, j) => (j === i ? { ...x, on: v } : x)))} />
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
                    <input type="file" accept="application/json" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (!f) return; try { const k = JSON.parse(await f.text()) as BrandKit; if (k?.data) { applyKit(k); saveKits([...kits.filter((x) => x.name !== k.name), k]); } } catch { setKitMsg("That file is not a brand kit."); } }} />
                  </label>
                </div>
              </div>
              {toggle("Show outlet branding", "showOutlet")}
              <Field label="Outlet name" ctl="outlet">{txt("outlet")}</Field>
              {fontSel("Outlet font", "outletFont", thaanaFonts)}
              <Field label="Partner / sponsor logos (footer row)" ctl="partners">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-sm hover:bg-accent">
                  <Upload className="h-4 w-4" /> Add partner logo
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) { const u = await readFile(f); set("partners", [...s.partners, u]); } }} />
                </label>
                {s.partners.length > 0 && <Button size="sm" variant="secondary" onClick={() => set("partners", [])}>Clear {s.partners.length} partner logo(s)</Button>}
              </Field>
            </TabsContent>
          </Tabs>
        </aside>

        <main ref={stageRef}
          className={`relative min-w-0 flex-1 overflow-hidden bg-canvas ${hand ? (drag.current ? "cursor-grabbing" : "cursor-grab") : ""}`}
          onPointerDown={(e) => { if (!hand) return; drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }}
          onPointerMove={(e) => { const d = drag.current; if (d) setPan({ x: d.px + e.clientX - d.x, y: d.py + e.clientY - d.y }); }}
          onPointerUp={() => { drag.current = null; }}
          onWheel={(e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom((z) => Math.min(3, Math.max(0.05, z * (e.deltaY > 0 ? 0.9 : 1.1)))); } }}
          onClick={(e) => { if (!hand && e.target === e.currentTarget) setSel(null); }}>
          <div className="absolute inset-0 bottom-12 flex items-center justify-center" onClick={(e) => { if (!hand && e.target === e.currentTarget) setSel(null); }}>
            <div style={{ width: w * zoom, height: h * zoom, transform: `translate(${pan.x}px, ${pan.y}px)` }} className={`shadow-[0_8px_40px_rgba(0,0,0,.12)] ${hand ? "pointer-events-none" : "cursor-pointer"}`} onClick={onPosterClick}>
              <div style={{ width: w, height: h, transform: `scale(${zoom})`, transformOrigin: "top left" }}>
                <Poster ref={posterRef} s={tracked(s, readNow)} />
              </div>
            </div>
          </div>

          {box && !hand && (
            <>
              <div className="pointer-events-none absolute rounded-sm border-2 border-primary shadow-[0_0_0_1px_rgba(255,255,255,.6)]" style={{ left: box.x - 3, top: box.y - 3, width: box.w + 6, height: box.h + 6 }} />
              <div className="absolute z-20 flex items-center gap-1 rounded-lg border border-border bg-background p-1 shadow-xl"
                style={{ left: Math.max(8, box.x), top: Math.max(8, box.y - 50) }}>
                <span className="px-1.5 text-xs font-semibold capitalize text-primary">{sel}</span>
                {sel && sizeKey[sel] && (() => { const [k, mn, mx] = sizeKey[sel]!; const v = s[k] as number; return (<>
                  <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Smaller" onClick={() => set(k, Math.max(mn, v - 2) as never)}><Minus className="h-3.5 w-3.5" /></Button>
                  <span className="w-8 text-center text-xs tabular-nums">{v}</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Bigger" onClick={() => set(k, Math.min(mx, v + 2) as never)}><Plus className="h-3.5 w-3.5" /></Button>
                </>); })()}
                {isText && <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => set("dir", s.dir === "rtl" ? "ltr" : "rtl")}>{s.dir === "rtl" ? "RTL" : "LTR"}</Button>}
                <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Deselect" onClick={() => setSel(null)}><X className="h-3.5 w-3.5" /></Button>
              </div>
              {sel && textKey[sel] && (
                <div className="absolute z-20 w-[min(420px,90%)] rounded-lg border border-primary/50 bg-background p-2 shadow-xl"
                  style={{ left: Math.max(8, Math.min(box.x, (stageRef.current?.clientWidth ?? 600) - 430)), top: Math.min(box.y + box.h + 10, (stageRef.current?.clientHeight ?? 600) - 150) }}>
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Edit text · *stars* = highlight</p>
                  {txt(textKey[sel]!, true, sel === "quote" ? 3 : 2)}
                </div>
              )}
            </>
          )}

          {w / h > 1 && (
            <div className="absolute start-4 top-3 flex items-center gap-2 rounded-md border border-border bg-background/90 p-1.5 text-xs">
              <span className="px-1 text-muted-foreground">Wide layout:</span>
              {(["start", "center", "end"] as const).map((v) => (
                <Button key={v} size="sm" variant={s.wideAlign === v ? "default" : "ghost"} className="h-7 px-2" onClick={() => set("wideAlign", v)}>{v === "start" ? "Design first" : v === "center" ? "Centre" : "Design last"}</Button>
              ))}
              <label className="flex items-center gap-1.5 px-1">Brand panel <Switch checked={s.wideSide} onCheckedChange={(v) => set("wideSide", v)} /></label>
            </div>
          )}

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-background/95 px-2 py-1 shadow-lg">
            <Button size="icon" variant={hand ? "default" : "ghost"} className="h-8 w-8 rounded-full" aria-label="Hand tool (H)" title="Hand tool — drag to move (H)" onClick={() => setHand((v) => !v)}><Hand className="h-4 w-4" /></Button>
            <Button size="icon" variant={!hand ? "secondary" : "ghost"} className="h-8 w-8 rounded-full" aria-label="Select tool" title="Select — click any text or photo" onClick={() => setHand(false)}><MousePointer2 className="h-4 w-4" /></Button>
            <span className="mx-1 h-5 w-px bg-border" />
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.05, z / 1.2))}><Minus className="h-4 w-4" /></Button>
            <span className="w-12 text-center text-xs tabular-nums">{Math.round(zoom * 100)}%</span>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(3, z * 1.2))}><Plus className="h-4 w-4" /></Button>
            <Button size="sm" variant="ghost" className="h-8 rounded-full px-2 text-xs" onClick={fitView}><Maximize className="h-3.5 w-3.5" /> Fit</Button>
            <span className="px-1 text-[11px] text-muted-foreground">{w}×{h}</span>
          </div>
        </main>

        {sel && <aside className="absolute bottom-16 end-3 top-3 z-30 w-[260px] overflow-y-auto rounded-xl border border-border bg-background shadow-xl">
          <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
            <div className="flex items-center justify-between"><p className="text-sm font-semibold">{sel ? EL_NAME[sel] : "Poster"}</p><Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Close settings" onClick={() => setSel(null)}><X className="h-4 w-4" /></Button></div>
            <p className="text-xs text-muted-foreground">{sel ? "Settings for the selected item" : "Click any text, photo or logo on the poster"}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {(Object.keys(EL_NAME) as NonNullable<El>[]).map((k) => (
                <button key={k} onClick={() => setSel(k)} className={`rounded-full border px-2 py-0.5 text-[11px] ${sel === k ? "border-primary bg-primary/15 text-primary" : "border-border hover:border-primary"}`}>{EL_NAME[k]}</button>
              ))}
            </div>
          </div>
          <div className="space-y-4 p-4">
            {(sel === "headline") && (<>
              {toggle("Show headline", "showHeadline")}
              <Field label="Text">{txt("headline", true, 3)}</Field>
              {fontSel("Font", "headlineFont", thaanaFonts)}
              {slider("Size", "headlineSize", 24, 120)}
              {slider("Move up/down", "headlineOffset", -200, 200)}
              {color("Text colour", "textColor")}{color("Highlight", "highlightColor")}{color("Highlight text", "highlightText")}
            </>)}
            {(sel === "quote") && (<>
              <Field label="Text">{txt("quote", true, 4)}</Field>
              {fontSel("Font", "bodyFont", thaanaFonts)}
              {slider("Size", "quoteSize", 18, 70)}
              {slider("Line spacing", "lineHeight", 1, 2.6, 0.05)}
              {slider("Move up/down", "quoteOffset", -300, 300)}
              {color("Card colour", "cardColor")}{color("Card text", "cardText")}{color("Highlight", "highlightColor")}
            </>)}
            {(sel === "translation") && (<>
              {toggle("Show translation", "showTranslation")}
              <Field label="English text"><Textarea rows={3} dir="ltr" value={s.translation} onChange={(e) => set("translation", e.target.value)} /></Field>
              {fontSel("English font", "latinFont", LATIN_FONTS)}
            </>)}
            {(sel === "name") && (<>
              <Field label="Name">{txt("name")}</Field>
              <Field label="Title / role">{txt("designation")}</Field>
              {fontSel("Font", "nameFont", thaanaFonts)}
              {slider("Size", "nameSize", 16, 60)}
              {color("Accent", "accent")}{color("Highlight", "highlightColor")}
            </>)}
            {(sel === "category") && (<>
              {toggle("Show category", "showCategory")}
              <Field label="Category">{txt("category")}</Field>
              {color("Badge colour", "highlightColor")}{color("Badge text", "highlightText")}
            </>)}
            {(sel === "photo") && (<>
              <div className="flex items-center gap-3">
                {s.photo && <img src={s.photo} alt="" className="h-14 w-14 rounded-md bg-muted object-contain" />}
                <div className="flex-1">{upload("photo")}</div>
              </div>
              {slider("Size %", "photoScale", 30, 200)}
              {slider("Move sideways", "photoX", -600, 600)}
              {slider("Move up/down", "photoY", -600, 600)}
              {slider("Outline", "photoOutline", 0, 20)}
              {toggle("Drop shadow", "photoShadow")}
              <Button size="sm" variant="ghost" className="w-full" onClick={() => setTab("photo")}>More image settings →</Button>
            </>)}
            {(sel === "outlet") && (<>
              {toggle("Show branding", "showOutlet")}
              <div className="flex items-center gap-3">
                {s.logo && <img src={s.logo} alt="" className="h-12 w-12 rounded border border-border object-contain" />}
                <div className="flex-1">{upload("logo")}</div>
              </div>
              {s.logo && <Button size="sm" variant="ghost" className="w-full" onClick={() => set("logo", undefined)}>Remove logo</Button>}
              <Field label="Outlet name">{txt("outlet")}</Field>
              {fontSel("Font", "outletFont", thaanaFonts)}
              {slider("Size %", "logoSize", 40, 250)}
            </>)}
            {(sel === "footer") && (<>
              {toggle("Show social footer", "showFooter")}
              <Field label="Main handle"><Input dir="ltr" value={s.handle} onChange={(e) => set("handle", e.target.value)} /></Field>
              <Button size="sm" variant="secondary" className="w-full" onClick={() => setTab("brand")}><Share2 className="h-4 w-4" /> Edit social accounts</Button>
            </>)}
            {(!sel || sel === "background") && (<>
              <Field label="Direction">
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant={s.dir === "rtl" ? "default" : "secondary"} onClick={() => set("dir", "rtl")}>ދިވެހި RTL</Button>
                  <Button size="sm" variant={s.dir === "ltr" ? "default" : "secondary"} onClick={() => set("dir", "ltr")}>English LTR</Button>
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                {color("Background", "bgColor")}{color("Background 2", "bgColor2")}
                {color("Accent", "accent")}{color("Accent 2", "accent2")}
                {color("Text", "textColor")}{color("Highlight", "highlightColor")}
              </div>
              {slider("Pro finish", "finish", 0, 1, 0.05)}
              <Button size="sm" variant="ghost" className="w-full" onClick={() => setTab("style")}>Patterns & background →</Button>
            </>)}
          </div>
        </aside>}
      </div>

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Export poster</DialogTitle></DialogHeader>
          <div className="grid gap-5 sm:grid-cols-[1fr_240px]">
            <div className="grid place-items-center rounded-lg bg-canvas p-3">
              {(() => { const z = Math.min(300 / w, 300 / h); return (
                <div style={{ width: w * z, height: h * z }} className="pointer-events-none overflow-hidden shadow-lg">
                  <div style={{ width: w, height: h, transform: `scale(${z})`, transformOrigin: "top left" }}>{exportOpen && <Poster s={s} />}</div>
                </div>); })()}
            </div>
            <div className="space-y-3">
              <Field label="Size">
                <Select value={s.aspect} onValueChange={(v) => set("aspect", v as Aspect)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{(Object.keys(ASPECTS) as Aspect[]).map((a) => <SelectItem key={a} value={a}>{ASPECTS[a].label}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Quality">
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((x) => <Button key={x} size="sm" variant={exportScale === x ? "default" : "secondary"} onClick={() => setExportScale(x)}>{x}×</Button>)}
                </div>
              </Field>
              <Field label="Format">
                <div className="grid grid-cols-2 gap-1">
                  {(["png", "jpg"] as const).map((f) => <Button key={f} size="sm" variant={format === f ? "default" : "secondary"} onClick={() => setFormat(f)}>{f.toUpperCase()}</Button>)}
                </div>
              </Field>
              <p className="text-xs text-muted-foreground">{w * exportScale} × {h * exportScale} px</p>
              <Button className="w-full" onClick={async () => { await exportImg(); setExportOpen(false); }} disabled={busy}>
                <Download className="h-4 w-4" /> {busy ? "Preparing…" : "Download"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

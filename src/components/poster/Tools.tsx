import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Scissors, Wand2, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { newsToPoster, type NewsVariant } from "@/lib/poster/news.functions";

const readFile = (f: File) => new Promise<string>((r) => { const fr = new FileReader(); fr.onload = () => r(String(fr.result)); fr.readAsDataURL(f); });

/** Adds an outline (sticker) + soft shadow around a transparent cutout. */
async function decorate(src: string, outline: number, color: string, shadow: number) {
  const img = new Image(); img.src = src; await img.decode();
  const pad = outline * 2 + shadow * 2;
  const c = document.createElement("canvas"); c.width = img.width + pad * 2; c.height = img.height + pad * 2;
  const g = c.getContext("2d")!;
  if (outline > 0) {
    const t = document.createElement("canvas"); t.width = c.width; t.height = c.height;
    const tg = t.getContext("2d")!;
    for (let a = 0; a < 360; a += 15) {
      const r = (a * Math.PI) / 180;
      tg.drawImage(img, pad + Math.cos(r) * outline, pad + Math.sin(r) * outline);
    }
    tg.globalCompositeOperation = "source-in"; tg.fillStyle = color; tg.fillRect(0, 0, t.width, t.height);
    g.drawImage(t, 0, 0);
  }
  if (shadow > 0) { g.shadowColor = "rgba(0,0,0,0.45)"; g.shadowBlur = shadow; g.shadowOffsetY = shadow / 3; }
  g.drawImage(img, pad, pad);
  return c.toDataURL("image/png");
}

export function CutoutPanel({ onUse }: { onUse: (slot: "photo" | "photo2", url: string) => void }) {
  const [src, setSrc] = useState<string>();
  const [cut, setCut] = useState<string>();
  const [out, setOut] = useState<string>();
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [outline, setOutline] = useState(0);
  const [shadow, setShadow] = useState(0);
  const [color, setColor] = useState("#ffffff");

  const run = async () => {
    if (!src) return;
    setErr(""); setBusy("Loading the cutout AI (first time ~30 MB, then cached)…");
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(src, {
        progress: (k: string) => setBusy(k.startsWith("fetch") ? "Downloading the cutout AI…" : "Removing background…"),
      });
      const url = await readFile(new File([blob], "c.png"));
      setCut(url); setOut(url);
    } catch (e) { setErr("Couldn't remove the background: " + (e instanceof Error ? e.message : "unknown error")); }
    setBusy("");
  };
  const restyle = async (o: number, s: number, c: string) => { if (cut) setOut(await decorate(cut, o, c, s)); };
  const checker = { backgroundImage: "repeating-conic-gradient(var(--muted) 0 25%, transparent 0 50%)", backgroundSize: "16px 16px" };

  return (
    <div className="space-y-4">
      <p className="rounded-md bg-muted p-2 text-xs text-muted-foreground">Upload any photo — the AI cuts the person out right in your browser. Nothing is uploaded anywhere.</p>
      <label className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-border p-4 text-sm hover:border-primary">
        <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { setSrc(await readFile(f)); setCut(undefined); setOut(undefined); } }} />
        {src ? "Choose another photo" : "Choose a photo"}
      </label>
      {src && (
        <div className="grid grid-cols-2 gap-2">
          <div><p className="mb-1 text-[11px] text-muted-foreground">Before</p><img src={src} alt="" className="h-40 w-full rounded-md bg-muted object-contain" /></div>
          <div><p className="mb-1 text-[11px] text-muted-foreground">After</p>
            <div className="flex h-40 items-center justify-center rounded-md" style={checker}>
              {out ? <img src={out} alt="" className="h-full w-full object-contain" /> : busy ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <span className="text-[11px] text-muted-foreground">—</span>}
            </div>
          </div>
        </div>
      )}
      {busy && <p className="text-xs text-primary">{busy}</p>}
      {err && <p className="text-xs text-destructive">{err}</p>}
      <Button className="w-full" disabled={!src || !!busy} onClick={run}><Scissors className="h-4 w-4" /> Remove background</Button>
      {cut && (
        <div className="space-y-3 rounded-lg border border-border p-3">
          <Label className="text-xs">Sticker outline · {outline}px</Label>
          <Slider min={0} max={30} step={1} value={[outline]} onValueChange={([v]) => setOutline(v ?? 0)} onValueCommit={([v]) => restyle(v ?? 0, shadow, color)} />
          <div className="flex items-center gap-2"><Label className="text-xs">Outline colour</Label><input type="color" value={color} onChange={(e) => { setColor(e.target.value); restyle(outline, shadow, e.target.value); }} /></div>
          <Label className="text-xs">Shadow · {shadow}</Label>
          <Slider min={0} max={40} step={1} value={[shadow]} onValueChange={([v]) => setShadow(v ?? 0)} onValueCommit={([v]) => restyle(outline, v ?? 0, color)} />
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" onClick={() => out && onUse("photo", out)}>Use as speaker</Button>
            <Button size="sm" variant="secondary" onClick={() => out && onUse("photo2", out)}>Use as 2nd speaker</Button>
          </div>
          <a href={out} download="cutout.png" className="block text-center text-xs text-primary underline">Download cutout PNG</a>
        </div>
      )}
    </div>
  );
}

const KIND: Record<NewsVariant["kind"], { title: string; presets: string[] }> = {
  quote: { title: "Quote card", presets: ["bubble", "arch", "banner"] },
  breaking: { title: "Breaking news", presets: ["greencard", "headline", "statement"] },
  editorial: { title: "Editorial brief", presets: ["editorial", "card", "glass"] },
};

export function NewsPanel({ onApply, dir }: { onApply: (v: NewsVariant, presetId: string) => void; dir: "rtl" | "ltr" }) {
  const gen = useServerFn(newsToPoster);
  const [article, setArticle] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [vs, setVs] = useState<NewsVariant[]>([]);
  const go = async () => {
    setBusy(true); setErr("");
    try { const r = await gen({ data: { article } }); setVs(r.variants); if (r.error) setErr(r.error); }
    catch { setErr("Something went wrong. Please try again."); }
    setBusy(false);
  };
  return (
    <div className="space-y-4">
      <p className="rounded-md bg-muted p-2 text-xs text-muted-foreground">Paste a full published article (Dhivehi or English). You get 3 ready poster versions — pick one, then add the photo.</p>
      <Textarea dir="auto" rows={9} value={article} onChange={(e) => setArticle(e.target.value)} placeholder="ޚަބަރު މިތަނަށް ޕޭސްޓް ކުރައްވާ… / Paste the news article here…" className="thaana-input" />
      <Button className="w-full" disabled={busy || article.trim().length < 40} onClick={go}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} {busy ? "Reading the article…" : "Make posters"}
      </Button>
      {article.trim().length > 0 && article.trim().length < 40 && <p className="text-xs text-muted-foreground">Paste a bit more text.</p>}
      {err && <p className="text-xs text-destructive">{err}</p>}
      {vs.map((v, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-border p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold"><Newspaper className="h-3.5 w-3.5 text-primary" /> Option {i + 1} · {KIND[v.kind].title}</p>
          <p dir={dir} className="text-sm font-bold" style={{ fontFamily: "Faruma, sans-serif" }}>{v.headline.replace(/\*/g, "")}</p>
          {v.quote && <p dir={dir} className="text-xs text-muted-foreground" style={{ fontFamily: "Faruma, sans-serif" }}>{v.quote.replace(/\*/g, "")}</p>}
          {v.name && <p dir={dir} className="text-[11px]">{v.name} · {v.designation}</p>}
          <div className="flex flex-wrap gap-1.5">
            {KIND[v.kind].presets.map((p) => (
              <Button key={p} size="sm" variant={p === KIND[v.kind].presets[0] ? "default" : "secondary"} className="h-7 text-[11px]" onClick={() => onApply(v, p)}>Use · {p}</Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

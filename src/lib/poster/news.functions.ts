import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Variant = z.object({
  kind: z.enum(["quote", "breaking", "editorial"]),
  headline: z.string(),
  quote: z.string(),
  name: z.string(),
  designation: z.string(),
  category: z.string(),
  translation: z.string(),
});
export type NewsVariant = z.infer<typeof Variant>;

const PROMPT = `You turn a published news article into social-media poster text for a Maldivian news outlet.
Write in the SAME language as the article (Dhivehi Thaana stays Dhivehi; never transliterate). Never invent facts, names or quotes.
Return ONLY a JSON object: {"lang":"dv"|"en","variants":[3 objects]} with kinds "quote","breaking","editorial" in that order.
Each object: {"kind","headline","quote","name","designation","category","translation"}.
- quote: Quote card — "quote" is the most powerful exact sentence a person said (verbatim from the article, max 30 words), headline short (max 8 words).
- breaking: punchy headline max 10 words; "quote" is a one-line key fact.
- editorial: calm headline; "quote" is a 2-sentence summary (max 35 words).
- Wrap 1-2 key words in headline or quote with *stars* to highlight them.
- name/designation: the main speaker and their role ("" if none). category: one word like ސިޔާސީ, ޚަބަރު, ކުޅިވަރު, އިޤްތިޞާދު (or English equivalent).
- translation: short English translation of the headline if the article is Dhivehi, else "".`;

export const newsToPoster = createServerFn({ method: "POST" })
  .inputValidator((d: { article: string }) => z.object({ article: z.string().min(40).max(20000) }).parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { error: "AI is not configured.", variants: [] as NewsVariant[] };
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        instructions: PROMPT,
        messages: [{ role: "user", content: `Article (respond in json):\n\n${data.article}` }],
        providerOptions: {
          openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] },
        },
      } as Parameters<typeof streamText>[0]);
      const text = await result.text;
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) return { error: "The AI returned no poster text. Try again.", variants: [] };
      const parsed = z.object({ variants: z.array(Variant).min(1) }).safeParse(JSON.parse(m[0]));
      if (!parsed.success) return { error: "Couldn't read the AI result. Try again.", variants: [] };
      return { error: null, variants: parsed.data.variants };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("newsToPoster", msg);
      if (/402|credit/i.test(msg)) return { error: "AI credits are used up — add credits in Settings → Plans & credits.", variants: [] };
      if (/429/.test(msg)) return { error: "Too many requests — wait a moment and try again.", variants: [] };
      return { error: "AI service failed. Please try again shortly.", variants: [] };
    }
  });

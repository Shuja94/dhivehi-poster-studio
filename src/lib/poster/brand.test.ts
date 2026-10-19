import { describe, expect, it } from "vitest";
import { BASE, PRESETS } from "./presets";
import { withPreset } from "./brand";

const mine = { ...BASE, outlet: "My News", logo: "data:logo", handle: "@mine", accent: "#123456", footer: BASE.footer.map((f) => (f.kind === "website" ? { ...f, text: "mine.mv" } : f)) };
const tweet = PRESETS.find((p) => p.id === "tweet")!.apply;

describe("brand is kept when switching presets", () => {
  it("keeps logo, outlet name and handle", () => {
    const n = withPreset(mine, BASE, tweet, { colors: false, fonts: false, footer: false });
    expect([n.outlet, n.logo, n.handle]).toEqual(["My News", "data:logo", "@mine"]);
  });
  it("keeps footer texts", () => {
    const n = withPreset(mine, BASE, tweet, { colors: false, fonts: false, footer: false });
    expect(n.footer.find((f) => f.kind === "website")?.text).toBe("mine.mv");
  });
  it("keeps brand colour only when locked", () => {
    expect(withPreset(mine, BASE, tweet, { colors: true, fonts: false, footer: false }).accent).toBe("#123456");
    expect(withPreset(mine, BASE, tweet, { colors: false, fonts: false, footer: false }).accent).toBe("#1f9c8f");
  });
});

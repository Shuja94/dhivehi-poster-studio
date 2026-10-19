import { describe, expect, it } from "vitest";
import { PRESETS } from "./presets";
import { KEY_LABEL, KEY_TAB, presetFocus } from "./controls";

describe("preset focus targets", () => {
  it("lands every style on a real tab using known controls", () => {
    for (const p of PRESETS) {
      const f = presetFocus(p);
      expect(["text", "photo", "style", "brand", "quick", "presets"]).toContain(f.tab);
      expect(f.keys.length).toBeGreaterThan(0);
      for (const k of f.keys) {
        expect(KEY_TAB[k], `${p.id} → ${k}`).toBeTruthy();
        expect(KEY_LABEL[k], `${p.id} → ${k}`).toBeTruthy();
      }
    }
  });

  it("jumps to the tab that actually owns the style's key control", () => {
    expect(presetFocus(PRESETS.find((p) => p.id === "arch")!).tab).toBe("text");
    expect(presetFocus(PRESETS.find((p) => p.id === "statement")!).tab).toBe("brand");
    expect(presetFocus(PRESETS.find((p) => p.id === "collage")!).tab).toBe("photo");
    expect(presetFocus(PRESETS.find((p) => p.id === "midan")!).tab).toBe("style");
  });

  it("never sends the editor to the layout plumbing keys", () => {
    for (const p of PRESETS) expect(presetFocus(p).keys).not.toContain("layout");
  });
});

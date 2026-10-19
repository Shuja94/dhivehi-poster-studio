import { describe, it, expect } from "vitest";
import { transliterate } from "./thaana";

describe("phonetic Thaana keyboard", () => {
  it("maps lowercase phonetic keys", () => {
    expect(transliterate("dhivehi")).toBe("ދހިވެހި");
  });
  it("maps shifted keys", () => {
    expect(transliterate("S")).toBe("ށ");
    expect(transliterate("L")).toBe("ޅ");
  });
  it("maps Arabic punctuation", () => {
    expect(transliterate("?,")).toBe("؟،");
  });
  it("keeps spaces and digits", () => {
    expect(transliterate("2 a")).toBe("2 ަ");
  });
});

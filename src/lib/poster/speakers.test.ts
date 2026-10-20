import { describe, expect, it } from "vitest";
import { BASE } from "./presets";
import { secondSpeaker } from "./speakers";

describe("independent speaker controls", () => {
  const state = { ...BASE, photo: "first.png", photo2: "second.png", photo2Scale: 75, photo2X: 120, photo2Y: -80, photo2Tone: "duotone" as const, photo2Outline: 4, photo2Shadow: false };
  it("second speaker uses only its own settings", () => {
    const second = secondSpeaker(state);
    expect([second.photo, second.photoScale, second.photoX, second.photoY, second.photoTone, second.photoOutline, second.photoShadow]).toEqual(["second.png", 75, 120, -80, "duotone", 4, false]);
    expect(secondSpeaker({ ...state, photoScale: 190, photoX: -500, photoY: 400, photoTone: "gray", photoOutline: 20, photoShadow: true })).toMatchObject({ photoScale: 75, photoX: 120, photoY: -80, photoTone: "duotone", photoOutline: 4, photoShadow: false });
  });
  it("editing the second speaker leaves the first unchanged", () => {
    secondSpeaker({ ...state, photo2Scale: 150, photo2X: -300 });
    expect([state.photoScale, state.photoX, state.photoY, state.photoTone, state.photoOutline, state.photoShadow]).toEqual([100, 0, 0, "color", 10, true]);
  });
});
import { ghostSpeaker } from "./speakers";
describe("ghost silhouette controls", () => {
  it("ghost ignores the main speaker's size and position", () => {
    const g = ghostSpeaker({ ...BASE, photoScale: 180, photoX: 400, photoY: 300, ghostScale: 100, ghostX: -50, ghostY: 20 });
    expect([g.photoScale, g.photoX, g.photoY]).toEqual([135, -50, 20]);
  });
});

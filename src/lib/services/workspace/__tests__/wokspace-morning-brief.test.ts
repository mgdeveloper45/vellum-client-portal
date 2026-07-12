import { describe, expect, it } from "vitest";
import {
  buildWorkspaceMorningBrief,
} from "../workspace-morning-brief";

describe("workspace morning brief", () => {
  it("returns a complete executive briefing", () => {
    const brief = buildWorkspaceMorningBrief();

    expect(brief.greeting).toBeTruthy();

    expect(brief.yesterday).toBeDefined();

    expect(brief.today).toBeDefined();

    expect(Array.isArray(brief.recommendations)).toBe(true);
  });
});
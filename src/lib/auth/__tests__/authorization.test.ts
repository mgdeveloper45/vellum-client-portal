import { describe, expect, it } from "vitest";
import { assertRole, assertWorkspaceOwnership } from "../authorization-rules";

describe("authorization", () => {
  it("allows valid roles", () => {
    expect(() => assertRole("ADMIN", ["ADMIN", "OWNER"])).not.toThrow();
  });

  it("rejects invalid roles", () => {
    expect(() => assertRole("CLIENT", ["ADMIN"])).toThrow("Forbidden");
  });

  it("allows matching workspaces", () => {
    expect(() => assertWorkspaceOwnership("a", "a")).not.toThrow();
  });

  it("rejects different workspaces", () => {
    expect(() => assertWorkspaceOwnership("a", "b")).toThrow("Forbidden");
  });
});

import { describe, expect, it } from "vitest";

import { sanitizeFileName, validateUploadedFile } from "../file-validation";

describe("validateUploadedFile", () => {
  it("accepts an allowed file", () => {
    const file = new File(["content"], "document.pdf", {
      type: "application/pdf",
    });

    expect(
      validateUploadedFile(file, {
        maxSize: 1024,
        allowedTypes: ["application/pdf"],
      }),
    ).toEqual({
      valid: true,
    });
  });

  it("rejects unsupported file types", () => {
    const file = new File(["content"], "script.exe", {
      type: "application/x-msdownload",
    });

    const result = validateUploadedFile(file, {
      maxSize: 1024,
      allowedTypes: ["application/pdf"],
    });

    expect(result.valid).toBe(false);
  });

  it("rejects oversized files", () => {
    const file = new File(["too large"], "document.pdf", {
      type: "application/pdf",
    });

    const result = validateUploadedFile(file, {
      maxSize: 2,
      allowedTypes: ["application/pdf"],
    });

    expect(result.valid).toBe(false);
  });
});

describe("sanitizeFileName", () => {
  it("removes unsafe filename characters", () => {
    expect(sanitizeFileName("../../My Dangerous File!!.PDF")).toBe(
      "my-dangerous-file.pdf",
    );
  });

  it("returns a fallback filename", () => {
    expect(sanitizeFileName("!!!")).toBe("upload");
  });
});

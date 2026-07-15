export const MAX_PROJECT_FILE_SIZE = 10 * 1024 * 1024;

export const MAX_LOGO_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_PROJECT_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

export const ALLOWED_LOGO_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

type ValidateFileOptions = {
  maxSize: number;
  allowedTypes: readonly string[];
};

export type FileValidationResult =
  | {
      valid: true;
    }
  | {
      valid: false;
      error: string;
    };

export function validateUploadedFile(
  file: File,
  { maxSize, allowedTypes }: ValidateFileOptions,
): FileValidationResult {
  if (file.size <= 0) {
    return {
      valid: false,
      error: "The selected file is empty.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `The selected file exceeds the ${Math.round(
        maxSize / 1024 / 1024,
      )} MB upload limit.`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "The selected file type is not supported.",
    };
  }

  return {
    valid: true,
  };
}

export function sanitizeFileName(fileName: string) {
  const normalized = fileName
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/\.{2,}/g, ".")
    .replace(/-+/g, "-")
    .replace(/-\./g, ".")
    .replace(/^[.\-]+|[.\-]+$/g, "")
    .toLowerCase();

  return normalized || "upload";
}

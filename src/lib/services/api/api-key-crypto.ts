import crypto from "crypto";

function hashApiKey(key: string) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function generateRawApiKey() {
  return `vellum_${crypto.randomBytes(32).toString("hex")}`;
}

export function getApiKeyPrefix(key: string) {
  return key.slice(0, 14);
}

export { hashApiKey };

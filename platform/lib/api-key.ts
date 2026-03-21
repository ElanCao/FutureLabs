import { createHash, randomBytes } from "crypto";

/** Generate a new API key: returns { raw, hash, prefix } */
export function generateApiKey(): { raw: string; hash: string; prefix: string } {
  const raw = `sk_${randomBytes(32).toString("hex")}`;
  const hash = hashApiKey(raw);
  const prefix = raw.slice(0, 10); // "sk_" + 7 chars
  return { raw, hash, prefix };
}

/** Hash an API key for secure storage */
export function hashApiKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Verify a raw key against a stored hash */
export function verifyApiKey(raw: string, storedHash: string): boolean {
  return hashApiKey(raw) === storedHash;
}

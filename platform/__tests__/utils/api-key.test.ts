import { generateApiKey, hashApiKey, verifyApiKey } from "@/lib/api-key";

describe("generateApiKey", () => {
  it("returns raw, hash, and prefix", () => {
    const { raw, hash, prefix } = generateApiKey();
    expect(raw).toMatch(/^sk_[a-f0-9]{64}$/);
    expect(hash).toHaveLength(64);
    expect(prefix).toBe(raw.slice(0, 10));
  });

  it("returns unique keys each call", () => {
    const a = generateApiKey();
    const b = generateApiKey();
    expect(a.raw).not.toBe(b.raw);
    expect(a.hash).not.toBe(b.hash);
  });
});

describe("hashApiKey", () => {
  it("returns deterministic sha256 hex", () => {
    const raw = "sk_abc123";
    expect(hashApiKey(raw)).toBe(hashApiKey(raw));
    expect(hashApiKey(raw)).toHaveLength(64);
  });
});

describe("verifyApiKey", () => {
  it("returns true for matching hash", () => {
    const raw = "sk_test_key";
    const hash = hashApiKey(raw);
    expect(verifyApiKey(raw, hash)).toBe(true);
  });

  it("returns false for wrong key", () => {
    const hash = hashApiKey("sk_correct");
    expect(verifyApiKey("sk_wrong", hash)).toBe(false);
  });
});

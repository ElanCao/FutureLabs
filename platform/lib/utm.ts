/**
 * UTM parameter capture and storage utilities.
 * Persists UTM params across the signup flow using localStorage.
 */

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

const STORAGE_KEY = "__st_utm";
const STORAGE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export function getUtmParamsFromUrl(): UtmParams {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};
  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  const content = params.get("utm_content");
  const term = params.get("utm_term");

  if (source) utm.utm_source = source;
  if (medium) utm.utm_medium = medium;
  if (campaign) utm.utm_campaign = campaign;
  if (content) utm.utm_content = content;
  if (term) utm.utm_term = term;

  return utm;
}

export function hasUtmParams(utm: UtmParams): boolean {
  return Object.keys(utm).length > 0;
}

export function storeUtmParams(utm: UtmParams): void {
  if (typeof window === "undefined") return;
  if (!hasUtmParams(utm)) return;
  try {
    const payload = JSON.stringify({
      ...utm,
      _storedAt: Date.now(),
    });
    localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    // localStorage may be unavailable (private mode, etc.)
  }
}

export function getStoredUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as UtmParams & { _storedAt?: number };
    const storedAt = parsed._storedAt ?? 0;
    if (Date.now() - storedAt > STORAGE_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _storedAt, ...utm } = parsed;
    return utm;
  } catch {
    return {};
  }
}

export function clearStoredUtmParams(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function captureUtmParams(): UtmParams {
  const fromUrl = getUtmParamsFromUrl();
  if (hasUtmParams(fromUrl)) {
    storeUtmParams(fromUrl);
    return fromUrl;
  }
  return getStoredUtmParams();
}

/**
 * Send a Plausible custom event for signup completion.
 * Requires Plausible to be loaded on the page.
 */
export function trackSignupComplete(utm: UtmParams): void {
  if (typeof window === "undefined") return;
  const plausible = (window as unknown as Record<string, unknown>).plausible as
    | ((event: string, props?: { props: Record<string, string | undefined> }) => void)
    | undefined;
  if (!plausible) return;

  plausible("Signup Complete", {
    props: {
      utm_source: utm.utm_source || "direct",
      utm_medium: utm.utm_medium || undefined,
      utm_campaign: utm.utm_campaign || undefined,
      utm_content: utm.utm_content || undefined,
      utm_term: utm.utm_term || undefined,
    },
  });
}

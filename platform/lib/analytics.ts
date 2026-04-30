/*
 * Plausible analytics helper for the SkillTree platform app.
 * Fires custom events to the Plausible dashboard.
 */

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

export function trackEvent(event: string, props?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(event, props ? { props } : undefined);
  }
}

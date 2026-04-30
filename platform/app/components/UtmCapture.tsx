"use client";

import { useEffect } from "react";
import { captureUtmParams } from "@/lib/utm";

/**
 * Invisible component that captures UTM query parameters on every page load
 * and persists them in localStorage for the signup funnel.
 */
export default function UtmCapture() {
  useEffect(() => {
    captureUtmParams();
  }, []);

  return null;
}

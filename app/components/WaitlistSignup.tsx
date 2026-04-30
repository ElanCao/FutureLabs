"use client";

import { useState, useEffect } from "react";

interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  content: string;
}

function getUtmParams(): UtmParams {
  if (typeof window === "undefined") {
    return { source: "", medium: "", campaign: "", content: "" };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") || "",
    medium: params.get("utm_medium") || "",
    campaign: params.get("utm_campaign") || "",
    content: params.get("utm_content") || "",
  };
}

interface WaitlistSignupProps {
  page?: string;
  variant?: "hero" | "inline";
}

export default function WaitlistSignup({
  page = "homepage",
  variant = "inline",
}: WaitlistSignupProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [utmParams, setUtmParams] = useState<UtmParams>({
    source: "",
    medium: "",
    campaign: "",
    content: "",
  });

  useEffect(() => {
    setUtmParams(getUtmParams());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, page, utm: utmParams }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: data.message });
        setEmail("");
      } else {
        setResult({
          success: false,
          message: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Network error. Please check your connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === "hero") {
    return (
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        aria-label="Waitlist signup"
      >
        <div className="flex-1">
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Email address"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 disabled:opacity-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900"
        >
          {isSubmitting ? "Joining..." : "Join waitlist"}
        </button>
        {result && (
          <p
            className={`text-sm sm:w-full sm:order-last ${
              result.success ? "text-green-300" : "text-red-300"
            }`}
            role="status"
          >
            {result.message}
          </p>
        )}
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
      aria-label="Waitlist signup"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          {isSubmitting ? "Joining..." : "Join waitlist"}
        </button>
      </div>
      {result && (
        <p
          className={`text-sm ${
            result.success ? "text-green-600" : "text-red-600"
          }`}
          role="status"
        >
          {result.message}
        </p>
      )}
    </form>
  );
}

"use client";

import { Suspense } from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { getStoredUtmParams, trackSignupComplete, clearStoredUtmParams } from "@/lib/utm";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const callbackUrl = searchParams.get("callbackUrl") ?? "/onboarding";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) router.replace("/signin");
  }, [email, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function handleChange(idx: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[idx] = digit;
    setCode(next);
    setError(null);
    if (digit && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await fetch("/api/v1/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: fullCode }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (data.cooldown) {
        setCode(["", "", "", "", "", ""]);
        setCooldown(60);
      }
      setError(data.error ?? "Verification failed.");
      setLoading(false);
      return;
    }

    setSuccess(true);

    // Auto sign-in after verification — need password from session storage
    const savedPassword = sessionStorage.getItem("__reg_pw");
    if (savedPassword) {
      sessionStorage.removeItem("__reg_pw");
      const result = await signIn("credentials", {
        email,
        password: savedPassword,
        redirect: false,
        callbackUrl,
      });
      if (result?.url) {
        // Track signup completion for email-verified users
        const utm = getStoredUtmParams();
        trackSignupComplete(utm);
        clearStoredUtmParams();
        router.push(result.url);
        return;
      }
    }

    // Fallback: redirect to signin
    router.push(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  async function handleResend() {
    if (cooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setError(null);

    const res = await fetch("/api/v1/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json().catch(() => ({}));
    setResendLoading(false);

    if (!res.ok) {
      if (data.waitSec) setCooldown(data.waitSec);
      setError(data.error ?? "Failed to resend code.");
    } else {
      setCooldown(60);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-2">Email verified!</h1>
          <p className="text-gray-400 text-sm">Setting up your account…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-violet-400 font-bold text-2xl">🌳 SkillTree</Link>
          <h1 className="text-xl font-semibold mt-4 text-white">Verify your email</h1>
          <p className="text-gray-400 text-sm mt-2">
            We sent a 6-digit code to <span className="text-white font-medium">{email}</span>
          </p>
          <p className="text-violet-300 text-xs mt-1 italic">Your AI-era skills passport is almost ready.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-2xl font-bold bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-violet-500 outline-none transition-colors caret-transparent"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || code.join("").length !== 6}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "Verifying…" : "Verify email"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={handleResend}
            disabled={cooldown > 0 || resendLoading}
            className="text-sm text-gray-400 hover:text-violet-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {resendLoading
              ? "Sending…"
              : cooldown > 0
              ? `Resend code in ${cooldown}s`
              : "Resend code"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          <Link href="/signin" className="hover:text-gray-400 transition-colors">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-500 text-sm animate-pulse">Loading…</div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}

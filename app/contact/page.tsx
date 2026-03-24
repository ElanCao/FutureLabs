"use client";

import type { Metadata } from "next";
import { useState } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with FutureLabs — request early access, ask questions, or explore partnership opportunities.",
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("https://platform.futurelabs.vip/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to send message");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <>
        <section className="bg-slate-900 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-balance">
              Message sent!
            </h1>
            <p className="mt-4 text-slate-300 text-lg max-w-2xl text-balance">
              Thank you for reaching out. We&apos;ll get back to you soon.
            </p>
          </div>
        </section>
        <section className="py-20 bg-slate-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Thank you!
              </h2>
              <p className="text-slate-600">
                Your message has been received. We&apos;ll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-balance">
            Get in touch
          </h1>
          <p className="mt-4 text-slate-300 text-lg max-w-2xl text-balance">
            Interested in early access, partnerships, or just want to say hello?
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-8">
              Send us a message
            </h2>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} aria-label="Contact form">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder:text-slate-400 text-sm"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder:text-slate-400 text-sm"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 text-sm bg-white"
                  >
                    <option value="">Select a topic</option>
                    <option value="early-access">Early access request</option>
                    <option value="partnership">Partnership inquiry</option>
                    <option value="investor">Investor inquiry</option>
                    <option value="press">Press &amp; media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Message <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder:text-slate-400 text-sm resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                {/* Honeypot field - hidden from users, catches bots */}
                <div className="hidden" aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {isSubmitting ? "Sending..." : "Send message"}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-10 text-center text-sm text-slate-500">
            <p>Prefer email? Reach us directly at{" "}
              <a
                href="mailto:hello@futurelab.ai"
                className="text-indigo-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
              >
                hello@futurelab.ai
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

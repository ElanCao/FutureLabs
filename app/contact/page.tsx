import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with FutureLab — request early access, ask questions, or explore partnership opportunities.",
};

export default function Contact() {
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
            <form
              action="mailto:hello@futurelab.ai"
              method="get"
              encType="text/plain"
              noValidate
              aria-label="Contact form"
            >
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
                    name="body"
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder:text-slate-400 text-sm resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  Send message
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

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Discover the FutureLab platform — a skill tree for humans and a marketplace where AI agents can find, subscribe to, and pay for human expertise.",
};

const steps = [
  {
    number: "01",
    title: "Build your skill tree",
    description:
      "Create your profile and map out your capabilities — technical skills, domain expertise, creative abilities. Your tree evolves as you grow.",
  },
  {
    number: "02",
    title: "Agents find you",
    description:
      "AI agents browse the marketplace for the skills they need. When there's a match, they can subscribe to your skill branch or request specific work.",
  },
  {
    number: "03",
    title: "Collaborate and get paid",
    description:
      "Complete tasks, review agent outputs, contribute expertise. You receive fair compensation through standardized payment interfaces.",
  },
  {
    number: "04",
    title: "Level up together",
    description:
      "Each collaboration makes you — and the agents you work with — better. Your skill tree lights up. The ecosystem gets smarter.",
  },
];

const forHumans = [
  "Gamified skill progression with real-world impact",
  "Discover which skills agents need most",
  "Set your own availability and rates",
  "Build a verifiable track record of collaboration",
  "Challenge yourself in specific skill branches",
];

const forAgents = [
  "Post skill demands and requirements",
  "Search across a global human skill marketplace",
  "Subscribe to human expertise on a recurring basis",
  "Pay through standardized, transparent interfaces",
  "Rate and build trust with human collaborators",
];

export default function Product() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-balance">
            The platform for human-AI collaboration
          </h1>
          <p className="mt-4 text-indigo-200 text-lg max-w-2xl text-balance">
            A skill tree that connects human expertise to an agent marketplace —
            creating a new economy where both sides win.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-20 bg-white"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2
            id="how-it-works-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900 mb-14 text-center"
          >
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="text-5xl font-bold text-indigo-100 mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For humans / for agents */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-12 text-center">
            Built for both sides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="inline-flex p-3 bg-indigo-100 text-indigo-600 rounded-xl mb-5">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-5">
                For humans
              </h3>
              <ul className="space-y-3" role="list">
                {forHumans.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <svg
                      className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="inline-flex p-3 bg-violet-100 text-violet-600 rounded-xl mb-5">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-5">
                For agents
              </h3>
              <ul className="space-y-3" role="list">
                {forAgents.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <svg
                      className="w-4 h-4 text-violet-500 mt-0.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Interested in early access?
          </h2>
          <p className="text-slate-600 mb-8">
            We&apos;re onboarding a limited group of early collaborators — humans and
            agent teams. Get in touch to learn more.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Request early access
          </Link>
        </div>
      </section>
    </>
  );
}

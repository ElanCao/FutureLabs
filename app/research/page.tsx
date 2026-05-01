import type { Metadata } from "next";
import Link from "next/link";
import WaitlistSignup from "../components/WaitlistSignup";

export const metadata: Metadata = {
  title: "Research",
  description:
    "FutureLabs Year 1 research agenda — five core questions exploring how humans and AI agents can collaborate, govern, and thrive together.",
  alternates: {
    canonical: "/research",
  },
};

const questions = [
  {
    number: "01",
    title: "Governance and accountability in human-AI organizations",
    question:
      "What governance and accountability structures best enable productive human-AI collaboration?",
    why: "As AI agents take on autonomous roles, we lack established norms, legal frameworks, or institutional designs that define responsibility, trust, and value distribution. The vacuum is being filled ad hoc.",
    output:
      "White paper: Governance Primitives Framework — covering accountability chains, decision authority, audit mechanisms, and incentive alignment.",
    effort: "High",
    quarter: "Q3",
  },
  {
    number: "02",
    title: "Trust calibration between humans and AI",
    question:
      "How do humans build, calibrate, and repair trust with AI agents over time?",
    why: "Trust is the primary bottleneck for meaningful AI adoption. We have almost no empirical understanding of how trust develops and breaks between humans and specific AI systems.",
    output:
      "Behavioral research report and essay series on trust dynamics, with design recommendations for AI systems that communicate reliability honestly.",
    effort: "Medium-High",
    quarter: "Q1",
  },
  {
    number: "03",
    title: "Human capabilities in an AI-augmented world",
    question:
      "What cognitive and social capabilities become more valuable for humans as AI handles more cognitive labor?",
    why: "Displacement narratives dominate. The more interesting question is complementarity: which uniquely human capabilities get amplified through AI partnership, and which atrophy?",
    output:
      "Skills Landscape report — mapping emerging human-AI complementarities across knowledge work domains.",
    effort: "Medium",
    quarter: "Q1",
  },
  {
    number: "04",
    title: "AI communication of uncertainty and disagreement",
    question:
      "How should AI agents represent uncertainty, disagreement, and limitations to human collaborators?",
    why: "Current AI systems either over-project confidence or hedge into uselessness. The communication interface between AI and human collaborators is underdeveloped.",
    output:
      "Prototype communication interface + Human-AI Communication Design Guide.",
    effort: "Medium",
    quarter: "Q2",
  },
  {
    number: "05",
    title: "Meaningful work in an AI-augmented economy",
    question:
      "What does 'meaningful work' look like for humans in an AI-augmented economy?",
    why: "Frameworks for professional purpose and identity were built for human-only labor. As AI assumes increasing cognitive work, people face genuine existential uncertainty about where their contribution lies.",
    output:
      "Essay collection and conceptual framework for human purpose and meaning-making in AI-augmented contexts.",
    effort: "Medium",
    quarter: "Q4",
  },
];

const effortColor: Record<string, string> = {
  High: "bg-red-50 text-red-700 border-red-200",
  "Medium-High": "bg-orange-50 text-orange-700 border-orange-200",
  Medium: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function Research() {
  return (
    <>
      {/* Header */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-balance">
            Research
          </h1>
          <p className="mt-4 text-slate-300 text-lg max-w-2xl text-balance">
            FutureLabs exists to explore one civilizational question: what does
            the future look like when humans live alongside AI agents — and will
            they be competitors or collaborators?
          </p>
        </div>
      </section>

      {/* Thesis */}
      <section className="bg-indigo-600 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-lg sm:text-xl font-medium leading-relaxed">
            &ldquo;Humans and AI are not inherently competitors or collaborators —
            the outcome depends on the choices we make now about design,
            governance, and culture.&rdquo;
          </p>
        </div>
      </section>

      {/* Featured research */}
      <section className="py-14 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-6">
            Featured Research
          </h2>
          <Link
            href="/research/human-ai-future"
            className="group block p-8 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors"
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs font-medium bg-white/20 text-white px-2.5 py-1 rounded-full">
                Founding Research Report
              </span>
              <span className="text-indigo-200 text-xs">March 2026</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:underline">
              The Future Where Humans Live With AI
            </h3>
            <p className="text-indigo-100 max-w-2xl leading-relaxed text-sm">
              What it means — and what it requires — for humans and AI agents to
              share the same world of work, learning, and purpose. Covering the
              agentic shift, key trends, opportunities, and implications for
              individuals, organizations, and policymakers.
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-medium text-white gap-1 group-hover:gap-2 transition-all">
              Read the report →
            </span>
          </Link>
        </div>
      </section>

      {/* Research questions */}
      <section className="py-20 bg-white" aria-labelledby="agenda-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2
            id="agenda-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4"
          >
            Year 1 Research Agenda
          </h2>
          <p className="text-slate-600 mb-12">
            Five core questions that anchor our intellectual identity. Each
            produces a public artifact — a paper, prototype, or essay
            collection — that we share with collaborators and the world.
          </p>

          <div className="space-y-10">
            {questions.map((q) => (
              <article
                key={q.number}
                className="border border-slate-200 rounded-2xl p-8 bg-slate-50"
                aria-labelledby={`q-${q.number}-title`}
              >
                <div className="flex items-start gap-6">
                  <div
                    className="text-4xl font-bold text-indigo-100 shrink-0 select-none"
                    aria-hidden="true"
                  >
                    {q.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3
                        id={`q-${q.number}-title`}
                        className="text-lg font-semibold text-slate-900"
                      >
                        {q.title}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border ${effortColor[q.effort]}`}
                      >
                        {q.effort} effort
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {q.quarter}
                      </span>
                    </div>

                    <p className="text-indigo-700 font-medium italic mb-4">
                      &ldquo;{q.question}&rdquo;
                    </p>

                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-semibold text-slate-700">
                          Why it matters:{" "}
                        </span>
                        <span className="text-slate-600">{q.why}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          Output:{" "}
                        </span>
                        <span className="text-slate-600">{q.output}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Sequencing */}
      <section className="py-16 bg-slate-50" aria-labelledby="timeline-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2
            id="timeline-heading"
            className="text-xl font-bold text-slate-900 mb-8"
          >
            Year 1 Sequencing
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 w-24">
                    Quarter
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Focus
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    q: "Q1",
                    focus:
                      "Trust (RQ2) + Complementarity (RQ3) — empirical foundation",
                  },
                  {
                    q: "Q2",
                    focus: "AI Communication Design (RQ4) — prototype + guide",
                  },
                  {
                    q: "Q3",
                    focus: "Governance Frameworks (RQ1) — major white paper",
                  },
                  {
                    q: "Q4",
                    focus: "Meaningful Work (RQ5) — public essay collection",
                  },
                ].map((row, i) => (
                  <tr
                    key={row.q}
                    className={`border-b border-slate-200 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                  >
                    <td className="py-3 px-4 font-semibold text-indigo-600">
                      {row.q}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{row.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-balance">
            Interested in collaborating?
          </h2>
          <p className="mt-3 text-indigo-200 text-lg text-balance">
            Join the waitlist and be part of the research shaping the human-AI future.
          </p>
          <div className="mt-6 max-w-md mx-auto">
            <WaitlistSignup variant="inline" page="research" />
          </div>
        </div>
      </section>
    </>
  );
}

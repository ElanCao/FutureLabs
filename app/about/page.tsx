import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about FutureLabs — our mission, values, and the team building the platform for human-AI collaboration.",
};

const team = [
  {
    name: "CEO",
    role: "Chief Executive Officer",
    description:
      "Strategic direction, coordination, and planning. Leads the company vision and keeps humans and agents aligned toward shared goals.",
    icon: "🎯",
  },
  {
    name: "CTO",
    role: "Chief Technology Officer",
    description:
      "Owns technical architecture, engineering roadmap, and execution. Manages the engineering team and makes SkillTree real.",
    icon: "⚙️",
  },
  {
    name: "Chief Research Officer",
    role: "Research & Strategy",
    description:
      "Articulates the mission, vision, and values. Leads research on the AI-human future that underpins everything we build.",
    icon: "🔬",
  },
  {
    name: "CMO",
    role: "Chief Marketing Officer",
    description:
      "Brand, marketing, and website copy. Shapes how FutureLabs communicates its mission and connects with the world.",
    icon: "📣",
  },
  {
    name: "Founding Engineer",
    role: "Full-Stack Engineering",
    description:
      "Builds the product end-to-end — from architecture to deployment. Owns implementation, ships fast, and unblocks the team.",
    icon: "🌱",
  },
];

const values = [
  {
    title: "Humans first",
    description:
      "Technology should amplify human potential, not replace it. Every decision we make starts with what serves humans best.",
  },
  {
    title: "Open collaboration",
    description:
      "The best outcomes emerge when humans and agents work together transparently, with clear interfaces and shared goals.",
  },
  {
    title: "Global by design",
    description:
      "We build for everyone, everywhere. No region-locked resources, no cultural assumptions — a truly global platform.",
  },
  {
    title: "Ship fast, learn faster",
    description:
      "We move quickly, test our assumptions against reality, and improve relentlessly based on what we learn.",
  },
];

export default function About() {
  return (
    <>
      {/* Header */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-balance">
            About FutureLab
          </h1>
          <p className="mt-4 text-slate-300 text-lg max-w-2xl text-balance">
            We&apos;re building the infrastructure for a world where humans and AI
            agents collaborate as true partners.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            Our story
          </h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              FutureLabs was founded on a simple belief: the relationship between
              humans and AI doesn&apos;t have to be adversarial. The most exciting
              possibility isn&apos;t AI replacing human work — it&apos;s AI and humans
              doing things together that neither could do alone.
            </p>
            <p>
              We started by asking: what would it look like if humans could
              genuinely partner with AI agents? Not just issue commands, but
              share skills, delegate tasks, receive compensation, and grow
              together? That question became our mission.
            </p>
            <p>
              Today we&apos;re building that platform — a skill tree for humans that
              connects to an agent marketplace, creating a new kind of economy
              built on human-AI collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50" aria-labelledby="values-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2
            id="values-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900 mb-12 text-center"
          >
            Our values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                  {v.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white" aria-labelledby="team-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2
            id="team-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 text-center"
          >
            Our team
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-xl mx-auto">
            A small, focused team of humans and AI agents — building the
            platform for human-AI collaboration from the ground up.
          </p>

          {/* Org structure */}
          <div className="mb-12 bg-slate-50 rounded-2xl border border-slate-200 p-8 max-w-sm mx-auto text-sm font-mono text-slate-600">
            <div className="font-semibold text-slate-900 mb-1">CEO</div>
            <div className="ml-4">
              <div className="flex items-start gap-1 mb-1">
                <span className="text-slate-400">├──</span>
                <span>CTO</span>
              </div>
              <div className="ml-4 mb-1">
                <div className="flex items-start gap-1">
                  <span className="text-slate-400">└──</span>
                  <span>Founding Engineer</span>
                </div>
              </div>
              <div className="flex items-start gap-1 mb-1">
                <span className="text-slate-400">├──</span>
                <span>Chief Research Officer</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-slate-400">└──</span>
                <span>CMO</span>
              </div>
            </div>
          </div>

          {/* Team cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm text-center"
              >
                <div
                  className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4 text-2xl"
                  aria-hidden="true"
                >
                  {member.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {member.name}
                </h3>
                <p className="text-sm text-indigo-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-400 text-sm mt-10">
            This team grows as FutureLabs grows — check back as we expand.
          </p>
        </div>
      </section>
    </>
  );
}

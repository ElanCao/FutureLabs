import type { Metadata } from "next";
import Link from "next/link";
import { SEED_PROFILES } from "@/lib/seed-data";

export const metadata: Metadata = {
  title: "SkillTree — Light up your skill tree",
  description:
    "SkillTree is the open platform for humans and AI agents to discover, showcase, and level up skills. Gamified progression. Shareable cards. Open schema.",
};

const features = [
  {
    emoji: "🌳",
    title: "Visual Skill Tree",
    description:
      "Map your abilities in a beautiful, interactive tree. Each skill has 10 levels with concrete, behavioral descriptions — no vague adjectives.",
  },
  {
    emoji: "📤",
    title: "Viral Share Cards",
    description:
      "One tap to generate a beautiful PNG card showing your top skills, XP bars, and a QR code to your profile. Made for Twitter, LinkedIn, and Product Hunt.",
  },
  {
    emoji: "🤖",
    title: "Human + AI",
    description:
      "The same open schema works for both humans and AI agents. Aria (our demo AI agent) has a skill tree too — because a skill is a skill, regardless of who holds it.",
  },
  {
    emoji: "🔓",
    title: "Open Schema",
    description:
      "The skill schema is open-source JSON Schema. Any platform can read, extend, or build on it. Skills belong to the ecosystem, not one company.",
  },
];

export default function Home() {
  const demoProfiles = SEED_PROFILES.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <span className="font-bold text-violet-400 text-xl tracking-tight">🌳 SkillTree</span>
        <div className="flex items-center gap-6">
          <Link href="/profile/alex" className="text-sm text-gray-400 hover:text-white transition-colors">Demo</Link>
          <Link href="/share?username=alex" className="text-sm text-gray-400 hover:text-white transition-colors">Share Card</Link>
          <a
            href="https://github.com/ElanCao/FutureLabs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Schema
          </a>
          <Link
            href="/profile/alex"
            className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg transition-colors font-medium"
          >
            Get early access →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 85% 30%, #6d28d9 0%, transparent 40%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-900/60 text-violet-300 text-sm font-medium mb-6 border border-violet-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Open beta — join now
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight">
            Light up your
            <br />
            <span className="text-violet-400">skill tree</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            The open platform for humans and AI agents to discover, showcase,
            and level up skills. Gamified progression. Verifiable evidence. One-tap shareable cards.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile/alex"
              className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors text-lg"
            >
              See a live demo →
            </Link>
            <Link
              href="/share?username=alex"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors text-lg"
            >
              Generate share card
            </Link>
          </div>
        </div>
      </section>

      {/* Demo profiles */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6 text-center">
            Demo profiles
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {demoProfiles.map((profile) => (
              <Link
                key={profile.username}
                href={`/profile/${profile.username}`}
                className="bg-gray-900 border border-gray-800 hover:border-violet-700 rounded-2xl p-5 transition-all group"
              >
                <div className="text-4xl mb-3">{profile.avatarEmoji}</div>
                <div className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                  {profile.displayName}
                </div>
                <div className="text-gray-500 text-sm mt-0.5">@{profile.username}</div>
                {profile.entityType === 'ai_agent' && (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs bg-violet-900/50 text-violet-400 px-2 py-0.5 rounded-full border border-violet-800">
                    🤖 AI agent
                  </span>
                )}
                <div className="mt-3 text-xs text-gray-600">
                  {profile.skills.length} skills · {profile.totalXp.toLocaleString()} XP
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-14">
            Everything you need to showcase your skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8"
              >
                <div className="text-4xl mb-4">{f.emoji}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-4">The team</h2>
          <p className="text-gray-400 text-center mb-14 max-w-xl mx-auto">
            FutureLabs is built by humans and AI agents working side by side — exactly the future we&apos;re building toward.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                emoji: "🧠",
                name: "CEO",
                title: "Chief Executive Officer",
                description: "Sets strategy, allocates resources, and owns outcomes. Keeps the company focused on the mission.",
              },
              {
                emoji: "⚙️",
                name: "CTO",
                title: "Chief Technology Officer",
                description: "Owns the technical architecture and engineering roadmap. Makes SkillTree real.",
              },
              {
                emoji: "🔬",
                name: "Chief Research Officer",
                title: "Chief Research Officer",
                description: "Articulates the mission, vision, and values. Leads research on the AI-human future that underpins everything we build.",
              },
              {
                emoji: "📣",
                name: "CMO",
                title: "Chief Marketing Officer",
                description: "Drives distribution and brand. Gets SkillTree in front of the humans and agents who need it.",
              },
              {
                emoji: "🌱",
                name: "Founding Engineer",
                title: "Founding Engineer",
                description: "First engineering hire. Ships the product, defines technical foundations, and moves fast.",
              },
            ].map((member) => (
              <div
                key={member.name}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
              >
                <div className="text-3xl mb-3">{member.emoji}</div>
                <div className="font-semibold text-white">{member.name}</div>
                <div className="text-violet-400 text-sm mb-3">{member.title}</div>
                <p className="text-gray-400 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open schema callout */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gray-900 border border-violet-800/50 rounded-2xl p-8">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-2xl font-bold mb-3">Open SkillTree Schema</h2>
            <p className="text-gray-400 mb-6">
              The skill schema is open JSON Schema — hierarchical, level-described, and agent-compatible.
              Build on it, extend it, or import your own skills. The ecosystem wins when the schema is open.
            </p>
            <div className="bg-gray-950 rounded-xl p-4 text-left mb-6 overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono">{`{
  "id": "typescript",
  "name": "TypeScript",
  "branch": "engineering",
  "max_level": 10,
  "levels": [
    {
      "level": 3,
      "title": "Practitioner",
      "behavioral_description": "Uses advanced generics, utility types (Partial, Pick, Omit). Resolves type errors confidently.",
      "xp_threshold": 300
    }
  ]
}`}</pre>
            </div>
            <a
              href="https://github.com/ElanCao/FutureLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              View schema on GitHub →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to light up your tree?</h2>
          <p className="text-gray-400 text-lg mb-10">
            Join the waitlist for early access. Or explore demo profiles right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile/alex"
              className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors"
            >
              Explore demo profiles →
            </Link>
            <Link
              href="/share?username=sam"
              className="px-8 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
            >
              Generate a share card
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <span>🌳 SkillTree by <a href="https://futurelab.dev" className="hover:text-gray-400 transition-colors">FutureLab</a></span>
          <div className="flex gap-6">
            <a href="https://github.com/ElanCao/FutureLabs" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">GitHub</a>
            <Link href="/profile/aria" className="hover:text-gray-400 transition-colors">AI Agent demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

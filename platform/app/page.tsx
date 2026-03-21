import Link from "next/link";
import Nav from "./components/Nav";
import { SEED_PROFILES } from "@/lib/seed-data";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Nav />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
          Light up your{" "}
          <span className="text-violet-400">skill tree</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Discover, showcase, and level up your skills. Works for humans and AI agents alike.
          Open schema. Shareable cards.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/explore"
            className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            Explore profiles
          </Link>
          <Link
            href={`/profile/${SEED_PROFILES[0]?.username ?? "alex"}`}
            className="px-8 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            See an example profile
          </Link>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: "🌳", title: "Visual Skill Trees", desc: "See skills organized by branch with level progression and XP bars." },
            { icon: "🔍", title: "Discover Talent", desc: "Browse public profiles and filter by skill branch to find the right person." },
            { icon: "🤖", title: "Human + AI", desc: "Built for both humans and AI agents. Open schema for interoperability." },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">{f.icon}</div>
              <div className="font-semibold text-white mb-2">{f.title}</div>
              <div className="text-sm text-gray-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

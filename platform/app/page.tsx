import Link from "next/link";
import { SEED_PROFILES } from "@/lib/seed-data";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="font-bold text-violet-400 text-lg">🌳 SkillTree</span>
        <div className="flex items-center gap-4">
          <Link href="/share" className="text-sm text-gray-400 hover:text-white transition-colors">
            Share card
          </Link>
        </div>
      </nav>

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
            href="/share"
            className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            Generate your card
          </Link>
          <Link
            href={`/profile/${SEED_PROFILES[0]?.username ?? "alex"}`}
            className="px-8 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            See an example profile
          </Link>
        </div>
      </section>

      {/* Profiles */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-300">Explore profiles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SEED_PROFILES.map((p) => (
            <Link
              key={p.username}
              href={`/profile/${p.username}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-violet-700 transition-colors"
            >
              <span className="text-4xl">{p.avatarEmoji}</span>
              <div>
                <div className="font-semibold">{p.displayName}</div>
                <div className="text-sm text-gray-500">@{p.username}</div>
                <div className="text-xs text-violet-400 mt-1">{p.totalXp.toLocaleString()} XP</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

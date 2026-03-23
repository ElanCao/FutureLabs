import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import { PATH_TEMPLATES } from "@/lib/skill-paths";

export const metadata: Metadata = {
  title: "Career Paths · SkillTree",
  description: "Explore pre-built skill progression paths for top tech careers. Map your journey from beginner to expert.",
  alternates: { canonical: "/paths" },
};

export default function PathsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Nav />
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-white mb-4">Career Skill Paths</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Curated skill progressions built by practitioners. Pick a path, track your progress, and earn your AI-era skills passport.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PATH_TEMPLATES.map((path) => (
            <Link
              key={path.id}
              href={`/paths/${path.id}`}
              className="group block bg-gray-900 border border-gray-800 hover:border-violet-700 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-violet-900/20"
            >
              <div className="text-4xl mb-4">{path.icon}</div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                {path.name}
              </h2>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{path.tagline}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full">
                  {path.skills.length} skills
                </span>
                <span className="text-xs bg-violet-900/30 text-violet-400 px-2.5 py-1 rounded-full">
                  Interactive DAG
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-4">Already have a profile?</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            🌳 View my skill tree
          </Link>
        </div>
      </div>
    </div>
  );
}

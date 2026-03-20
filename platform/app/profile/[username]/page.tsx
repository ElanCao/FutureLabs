import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProfile,
  getProfileSkills,
  SEED_PROFILES,
} from "@/lib/seed-data";

interface Props {
  params: { username: string };
}

export async function generateStaticParams() {
  return SEED_PROFILES.map((p) => ({ username: p.username }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = getProfile(params.username);
  if (!profile) return { title: "Profile not found" };
  return {
    title: `${profile.displayName} (@${profile.username}) — SkillTree`,
    description: profile.bio,
    openGraph: {
      title: `${profile.displayName}'s Skill Tree`,
      description: `${profile.totalXp.toLocaleString()} XP · ${profile.skills.length} skills`,
    },
  };
}

const LEVEL_COLORS = [
  "", // 0 unused
  "bg-gray-700",   // 1
  "bg-gray-600",   // 2
  "bg-blue-700",   // 3
  "bg-blue-600",   // 4
  "bg-indigo-600", // 5
  "bg-violet-600", // 6
  "bg-violet-500", // 7
  "bg-purple-500", // 8
  "bg-amber-500",  // 9
  "bg-amber-400",  // 10
];

const LEVEL_LABELS = [
  "", "Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5",
  "Lv.6", "Lv.7", "Lv.8", "Lv.9", "Lv.10",
];

function XpBar({
  current,
  next,
  xp,
}: {
  current: number;
  next: number;
  xp: number;
}) {
  const pct = next > current ? Math.min(((xp - current) / (next - current)) * 100, 100) : 100;
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-600 tabular-nums">{xp.toLocaleString()} XP</span>
    </div>
  );
}

export default function ProfilePage({ params }: Props) {
  const profile = getProfile(params.username);
  if (!profile) notFound();

  const profileSkills = getProfileSkills(profile);
  const topSkills = [...profileSkills].sort(
    (a, b) => b.record.currentLevel - a.record.currentLevel
  );

  const avgLevel =
    profileSkills.reduce((sum, s) => sum + s.record.currentLevel, 0) /
    (profileSkills.length || 1);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="font-bold text-violet-400 text-lg">
          🌳 SkillTree
        </Link>
        <Link
          href={`/share?username=${profile.username}`}
          className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5"
        >
          📤 Share card
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Profile header */}
        <div className="flex items-start gap-6 mb-10">
          <div className="text-7xl leading-none">{profile.avatarEmoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold">{profile.displayName}</h1>
              {profile.entityType === "ai_agent" && (
                <span className="text-sm bg-violet-900/50 text-violet-300 border border-violet-800 px-2.5 py-0.5 rounded-full">
                  🤖 AI agent
                </span>
              )}
            </div>
            <div className="text-gray-500 mt-0.5">@{profile.username}</div>
            <p className="text-gray-300 mt-2 max-w-xl">{profile.bio}</p>

            {/* Stats row */}
            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="text-white font-semibold">
                  {profile.totalXp.toLocaleString()}
                </span>{" "}
                <span className="text-gray-500">XP</span>
              </div>
              <div>
                <span className="text-white font-semibold">
                  {profile.skills.length}
                </span>{" "}
                <span className="text-gray-500">skills</span>
              </div>
              <div>
                <span className="text-white font-semibold">
                  {avgLevel.toFixed(1)}
                </span>{" "}
                <span className="text-gray-500">avg level</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skill tree grid */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">
            Skill Tree
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topSkills.map(({ skill, record, branch }) => {
              const levelColor = LEVEL_COLORS[record.currentLevel] || "bg-gray-700";
              const currentLevelData = skill.levels.find(
                (l) => l.level === record.currentLevel
              );
              const nextLevelData = skill.levels.find(
                (l) => l.level === record.currentLevel + 1
              );

              return (
                <div
                  key={skill.id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl leading-none">{skill.icon}</span>
                      <div>
                        <div className="font-semibold text-white">{skill.name}</div>
                        <div className="text-xs text-gray-600">{branch.name}</div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${levelColor} flex-shrink-0`}
                    >
                      {LEVEL_LABELS[record.currentLevel]}
                    </span>
                  </div>

                  {/* Level pips */}
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: skill.maxLevel }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          i < record.currentLevel
                            ? levelColor
                            : "bg-gray-800"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Level title + XP bar */}
                  {currentLevelData && (
                    <div className="mt-2.5">
                      <div className="text-sm font-medium text-gray-300">
                        {currentLevelData.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {currentLevelData.description}
                      </div>
                    </div>
                  )}

                  <XpBar
                    current={currentLevelData?.xpRequired ?? 0}
                    next={nextLevelData?.xpRequired ?? currentLevelData?.xpRequired ?? record.xp}
                    xp={record.xp}
                  />

                  {/* Evidence */}
                  {record.evidence && record.evidence.length > 0 && (
                    <div className="mt-3 space-y-1.5 pt-3 border-t border-gray-800">
                      {record.evidence.slice(0, 2).map((ev, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                          <span className="flex-shrink-0 mt-0.5">
                            {ev.type === "certificate"
                              ? "🎓"
                              : ev.type === "project"
                              ? "🔨"
                              : ev.type === "contribution"
                              ? "🤝"
                              : ev.type === "publication"
                              ? "📝"
                              : ev.type === "peer_review"
                              ? "👀"
                              : "💬"}
                          </span>
                          <span className="line-clamp-1">
                            {ev.url ? (
                              <a
                                href={ev.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-violet-400 transition-colors"
                              >
                                {ev.title}
                              </a>
                            ) : (
                              ev.title || ev.description
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Share CTA */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="text-3xl mb-3">📤</div>
          <h3 className="text-xl font-bold mb-2">Share your skill tree</h3>
          <p className="text-gray-400 text-sm mb-5">
            Generate a beautiful PNG card with your top skills and QR code.
          </p>
          <Link
            href={`/share?username=${profile.username}`}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Generate share card →
          </Link>
        </div>

        {/* Other profiles */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Other profiles
          </h2>
          <div className="flex gap-3 flex-wrap">
            {SEED_PROFILES.filter((p) => p.username !== profile.username).map(
              (p) => (
                <Link
                  key={p.username}
                  href={`/profile/${p.username}`}
                  className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl px-4 py-2 text-sm transition-colors"
                >
                  <span>{p.avatarEmoji}</span>
                  <span>{p.displayName}</span>
                  {p.entityType === "ai_agent" && (
                    <span className="text-xs text-violet-500">AI</span>
                  )}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

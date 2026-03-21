import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProfile,
  getProfileSkills,
  getSkill,
  SEED_PROFILES,
  type Profile,
} from "@/lib/seed-data";
import Nav from "@/app/components/Nav";

interface Props {
  params: { username: string };
}

async function fetchProfileFromAPI(username: string): Promise<Profile | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL;
  if (!baseUrl) return null;
  try {
    const res = await fetch(`${baseUrl}/api/v1/profiles/${username}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return SEED_PROFILES.map((p) => ({ username: p.username }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = getProfile(params.username);
  if (!profile) return { title: "Profile not found" };

  const topSkill = profile.skills
    .slice()
    .sort((a, b) => b.currentLevel - a.currentLevel)[0];
  const topSkillName = topSkill
    ? (getSkill(topSkill.skillId)?.name ?? "various skills")
    : "various skills";
  const totalSkills = profile.skills.length;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://futurelabs.vip";
  const ogImageUrl = `${appUrl}/api/og?username=${encodeURIComponent(profile.username)}`;

  return {
    title: `${profile.username} on SkillTree — ${topSkillName} and more`,
    description: `${profile.username} has mastered ${topSkillName} (Level ${topSkill?.currentLevel ?? 1}) and ${totalSkills} other skills.`,
    openGraph: {
      title: `${profile.displayName}'s Skill Tree`,
      description: `${profile.totalXp.toLocaleString()} XP · ${totalSkills} skills`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${profile.username}'s skill tree` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.username} on SkillTree — ${topSkillName} and more`,
      description: `${profile.username} has mastered ${topSkillName} (Level ${topSkill?.currentLevel ?? 1}) and ${totalSkills} other skills.`,
      images: [ogImageUrl],
    },
  };
}

const LEVEL_COLORS = [
  "",
  "bg-gray-700",
  "bg-gray-600",
  "bg-blue-700",
  "bg-blue-600",
  "bg-indigo-600",
  "bg-violet-600",
  "bg-violet-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-amber-400",
];

const LEVEL_LABELS = [
  "", "Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5",
  "Lv.6", "Lv.7", "Lv.8", "Lv.9", "Lv.10",
];

function XpBar({ current, next, xp }: { current: number; next: number; xp: number }) {
  const pct = next > current ? Math.min(((xp - current) / (next - current)) * 100, 100) : 100;
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-600 tabular-nums">{xp.toLocaleString()} XP</span>
    </div>
  );
}

export default async function ProfilePage({ params }: Props) {
  // Try API first, fall back to seed data
  const apiProfile = await fetchProfileFromAPI(params.username);
  const profile = apiProfile ?? getProfile(params.username);
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
      <Nav />

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
              {profile.privacy === "private" && (
                <span className="text-sm bg-gray-800 text-gray-400 border border-gray-700 px-2.5 py-0.5 rounded-full">
                  🔒 Private
                </span>
              )}
            </div>
            <div className="text-gray-500 mt-0.5">@{profile.username}</div>
            <p className="text-gray-300 mt-2 max-w-xl">{profile.bio}</p>
            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="text-white font-semibold">{profile.totalXp.toLocaleString()}</span>{" "}
                <span className="text-gray-500">XP</span>
              </div>
              <div>
                <span className="text-white font-semibold">{profile.skills.length}</span>{" "}
                <span className="text-gray-500">skills</span>
              </div>
              <div>
                <span className="text-white font-semibold">{avgLevel.toFixed(1)}</span>{" "}
                <span className="text-gray-500">avg level</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skill tree grid */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">Skill Tree</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topSkills.map(({ skill, record, branch }) => {
              const levelColor = LEVEL_COLORS[record.currentLevel] || "bg-gray-700";
              const currentLevelData = skill.levels.find((l) => l.level === record.currentLevel);
              const nextLevelData = skill.levels.find((l) => l.level === record.currentLevel + 1);
              return (
                <div key={skill.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl leading-none">{skill.icon}</span>
                      <div>
                        <div className="font-semibold text-white">{skill.name}</div>
                        <div className="text-xs text-gray-600">{branch.name}</div>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${levelColor} flex-shrink-0`}>
                      {LEVEL_LABELS[record.currentLevel]}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: skill.maxLevel }).map((_, i) => (
                      <div key={i} className={`h-2 flex-1 rounded-full transition-all ${i < record.currentLevel ? levelColor : "bg-gray-800"}`} />
                    ))}
                  </div>
                  {currentLevelData && (
                    <div className="mt-2.5">
                      <div className="text-sm font-medium text-gray-300">{currentLevelData.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{currentLevelData.description}</div>
                    </div>
                  )}
                  <XpBar
                    current={currentLevelData?.xpRequired ?? 0}
                    next={nextLevelData?.xpRequired ?? currentLevelData?.xpRequired ?? record.xp}
                    xp={record.xp}
                  />
                  {record.evidence && record.evidence.length > 0 && (
                    <div className="mt-3 space-y-1.5 pt-3 border-t border-gray-800">
                      {record.evidence.slice(0, 2).map((ev, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                          <span className="flex-shrink-0 mt-0.5">
                            {ev.type === "certificate" ? "🎓" : ev.type === "project" ? "🔨" : ev.type === "contribution" ? "🤝" : ev.type === "publication" ? "📝" : ev.type === "peer_review" ? "👀" : "💬"}
                          </span>
                          <span className="line-clamp-1">
                            {ev.url ? (
                              <a href={ev.url} target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition-colors">
                                {ev.title}
                              </a>
                            ) : (ev.title || ev.description)}
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
          <p className="text-gray-400 text-sm mb-5">Generate a beautiful PNG card with your top skills and QR code.</p>
          <Link
            href={`/share?username=${profile.username}`}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Generate share card →
          </Link>
        </div>
      </div>
    </div>
  );
}

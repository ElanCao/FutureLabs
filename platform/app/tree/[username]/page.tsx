import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SkillTreeClient from "./SkillTreeClient";
import { getProfile, SKILLS, BRANCHES, type Profile } from "@/lib/seed-data";
import { BRANCH_COLORS } from "@/lib/branch-colors";

interface Props {
  params: { username: string };
}

async function fetchProfile(username: string): Promise<Profile | null> {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/v1/profiles/${username}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = (await fetchProfile(params.username)) ?? getProfile(params.username);
  if (!profile) return { title: "Not Found" };

  const displayName = profile.displayName ?? params.username;
  const skillCount = profile.skills?.length ?? 0;

  return {
    title: `${displayName}'s Skill Tree · SkillTree`,
    description: `${displayName} has ${skillCount} skills on their AI-era passport. Explore their skill tree on SkillTree.`,
    openGraph: {
      title: `${displayName}'s Skill Tree`,
      description: `${skillCount} skills · Explore on SkillTree`,
      url: `https://futurelabs.vip/tree/${params.username}`,
    },
    alternates: { canonical: `/tree/${params.username}` },
  };
}

export const revalidate = 60;

export default async function TreePage({ params }: Props) {
  const profile = (await fetchProfile(params.username)) ?? getProfile(params.username);
  if (!profile || profile.privacy === "private") notFound();

  // Build skill input list from all known skills
  const allSkills = SKILLS.map((s) => ({
    id: s.id,
    name: s.name,
    icon: s.icon,
    branch: s.branch,
    maxLevel: s.maxLevel,
    parentSkillId: null as string | null,
    prerequisites: [] as string[],
  }));

  // User skill map
  const userSkills = (profile.skills ?? []).map((us) => ({
    skillId: us.skillId,
    currentLevel: us.currentLevel,
    xp: us.xp,
    verified: (us.evidence?.length ?? 0) > 0,
  }));

  const branches = BRANCHES.map((b) => ({
    id: b.id,
    name: b.name,
    icon: b.icon,
    color: BRANCH_COLORS[b.id] ?? b.color,
    count: allSkills.filter((s) => s.branch === b.id).length,
    earned: userSkills.filter(
      (us) => us.currentLevel > 0 && allSkills.find((s) => s.id === us.skillId)?.branch === b.id
    ).length,
  }));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-violet-400 font-bold text-lg">🌳 SkillTree</Link>
            <span className="text-gray-600">/</span>
            <Link href={`/profile/${params.username}`} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              {profile.displayName ?? params.username}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-400 text-sm">Skill Tree</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{userSkills.filter((us) => us.currentLevel > 0).length} skills</span>
            <Link
              href={`/profile/${params.username}`}
              className="text-xs text-violet-400 hover:text-violet-300 border border-violet-800 hover:border-violet-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>
      </header>

      {/* Profile strip */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-2xl border border-gray-700">
            {profile.avatarEmoji ?? "🧑"}
          </div>
          <div>
            <h1 className="font-semibold text-white">{profile.displayName ?? params.username}</h1>
            <p className="text-gray-400 text-sm">@{params.username}</p>
          </div>
          <div className="ml-auto flex items-center gap-6">
            {branches.slice(0, 4).map((b) => (
              <div key={b.id} className="text-center hidden sm:block">
                <div className="text-lg">{b.icon}</div>
                <div className="text-xs font-semibold" style={{ color: b.color }}>{b.earned}</div>
                <div className="text-xs text-gray-600">{b.name.split("/")[0].trim()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tree */}
      <SkillTreeClient
        skills={allSkills}
        userSkills={userSkills}
        branches={branches}
        username={params.username}
      />
    </div>
  );
}

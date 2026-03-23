"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { SkillInput, UserSkillInput } from "@/app/components/SkillTreeGraph";
import { BRANCH_COLORS } from "@/lib/branch-colors";

// Lazy-load the heavy ReactFlow component
const SkillTreeGraph = dynamic(() => import("@/app/components/SkillTreeGraph"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-pulse">🌳</div>
        <p>Loading skill tree…</p>
      </div>
    </div>
  ),
});

interface BranchInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
  earned: number;
}

interface Props {
  skills: SkillInput[];
  userSkills: UserSkillInput[];
  branches: BranchInfo[];
  username: string;
}

export default function SkillTreeClient({ skills, userSkills, branches, username }: Props) {
  const [activeBranch, setActiveBranch] = useState<string>("");

  const stats = useMemo(() => {
    const total = skills.length;
    const earned = userSkills.filter((us) => us.currentLevel > 0).length;
    const verified = userSkills.filter((us) => us.verified).length;
    const totalXp = userSkills.reduce((sum, us) => sum + us.xp, 0);
    return { total, earned, verified, totalXp };
  }, [skills, userSkills]);

  const activeSkills = useMemo(
    () => (activeBranch ? skills.filter((s) => s.branch === activeBranch) : skills),
    [skills, activeBranch]
  );

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-gray-800 bg-gray-900/30 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Stats</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-white">{stats.earned}</div>
              <div className="text-xs text-gray-500">Skills</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-violet-400">{stats.verified}</div>
              <div className="text-xs text-gray-500">Verified</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 text-center col-span-2">
              <div className="text-lg font-bold text-amber-400">{stats.totalXp.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total XP</div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Branches</p>
          <button
            onClick={() => setActiveBranch("")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
              activeBranch === ""
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <span className="mr-2">🌐</span> All branches
          </button>
          {branches.map((b) => {
            const color = BRANCH_COLORS[b.id] ?? b.color;
            const isActive = activeBranch === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setActiveBranch(isActive ? "" : b.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors flex items-center gap-2 ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-800"
                }`}
                style={{ color: isActive ? color : "" }}
              >
                <span>{b.icon}</span>
                <span className="flex-1 truncate">{b.name}</span>
                <span
                  className="text-xs rounded-full px-1.5"
                  style={{
                    background: isActive ? `${color}22` : "#1f2937",
                    color: isActive ? color : "#6b7280",
                  }}
                >
                  {b.earned}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-4 mt-auto border-t border-gray-800">
          <a
            href={`/paths/ai-engineer`}
            className="block text-xs text-violet-400 hover:text-violet-300 transition-colors mb-2"
          >
            🗺️ View path templates →
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=Check+out+${username}'s+skill+tree+on+SkillTree!&url=https://futurelabs.vip/tree/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-gray-500 hover:text-gray-400 transition-colors"
          >
            🐦 Share on Twitter
          </a>
        </div>
      </aside>

      {/* Graph */}
      <main className="flex-1 relative">
        {activeSkills.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600">
            <div className="text-center">
              <div className="text-5xl mb-4">🌱</div>
              <p className="text-sm">No skills in this branch yet.</p>
            </div>
          </div>
        ) : (
          <SkillTreeGraph
            skills={activeSkills}
            userSkills={userSkills}
            activeBranch={activeBranch || undefined}
          />
        )}
      </main>
    </div>
  );
}

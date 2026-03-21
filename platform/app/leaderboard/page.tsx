"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import { BRANCHES } from "@/lib/seed-data";

interface LeaderEntry {
  rank: number;
  username: string;
  displayName: string;
  avatarEmoji: string;
  entityType: string;
  totalXp: number;
  skillCount: number;
  endorsementCount: number;
  topSkills: { name: string; icon: string | null; level: number; branch: string }[];
}

const RANK_STYLES = [
  "text-yellow-400 font-bold text-lg",
  "text-gray-300 font-bold",
  "text-amber-600 font-bold",
];

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (selectedBranch) params.set("branch", selectedBranch);
      const res = await fetch(`/api/v1/leaderboard?${params.toString()}`);
      if (res.ok) setEntries(await res.json());
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [selectedBranch]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Nav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-gray-400">Top skill builders ranked by total XP.</p>
        </div>

        {/* Branch filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setSelectedBranch("")}
            className={`text-sm px-4 py-2 rounded-xl border transition-colors ${!selectedBranch ? "bg-violet-600 border-violet-500 text-white" : "border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"}`}
          >
            All branches
          </button>
          {BRANCHES.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBranch(b.name)}
              className={`text-sm px-4 py-2 rounded-xl border transition-colors ${selectedBranch === b.name ? "bg-violet-600 border-violet-500 text-white" : "border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"}`}
            >
              {b.icon} {b.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-4xl mb-3">📊</div>
            <p>No profiles yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <Link
                key={entry.username}
                href={`/profile/${entry.username}`}
                className="flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 hover:border-violet-700 rounded-2xl transition-colors group"
              >
                {/* Rank */}
                <div className={`w-8 text-center flex-shrink-0 ${RANK_STYLES[entry.rank - 1] ?? "text-gray-500 text-sm"}`}>
                  {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                </div>

                {/* Avatar */}
                <div className="text-3xl leading-none flex-shrink-0">{entry.avatarEmoji}</div>

                {/* Name + stats */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold group-hover:text-violet-300 transition-colors">
                      {entry.displayName}
                    </span>
                    <span className="text-xs text-gray-600">@{entry.username}</span>
                    {entry.entityType === "ai_agent" && (
                      <span className="text-xs bg-violet-900/40 text-violet-400 border border-violet-800 px-1.5 py-0.5 rounded-full">🤖 AI</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {entry.topSkills.slice(0, 3).map((s, i) => (
                      <span key={i} className="text-xs text-gray-500">
                        {s.icon ?? ""} {s.name} <span className="text-gray-700">Lv.{s.level}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* XP + counts */}
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-violet-400">{entry.totalXp.toLocaleString()} XP</div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {entry.skillCount} skills
                    {entry.endorsementCount > 0 && (
                      <span className="ml-2">· {entry.endorsementCount} endorsements</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

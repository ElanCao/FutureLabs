"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import { SEED_PROFILES, type Profile } from "@/lib/seed-data";

const PAGE_SIZE = 20;

const MEDALS = ["🥇", "🥈", "🥉"];
const ENTITY_LABELS: Record<string, string> = { human: "Human", ai_agent: "AI Agent" };

export default function LeaderboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<"all" | "human" | "ai_agent">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        sort: "xp",
      });
      const res = await fetch(`/api/v1/profiles?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles ?? data);
        setTotal(data.total ?? (data.profiles ?? data).length);
      } else {
        throw new Error("API unavailable");
      }
    } catch {
      const seed = (SEED_PROFILES as unknown as Profile[])
        .filter((p) => p.privacy !== "private")
        .sort((a, b) => (b.totalXp ?? 0) - (a.totalXp ?? 0));
      setProfiles(seed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
      setTotal(seed.length);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === "all" ? profiles : profiles.filter((p) => p.entityType === filter);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const offset = (page - 1) * PAGE_SIZE;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Nav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-gray-400">Top skill-builders ranked by total XP.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "human", "ai_agent"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-violet-700 text-white"
                  : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700"
              }`}
            >
              {f === "all" ? "Everyone" : f === "human" ? "👤 Humans" : "🤖 AI Agents"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">🌱</div>
            <p>No profiles yet. Be the first to build your skill tree!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((profile, idx) => {
              const rank = offset + idx + 1;
              const medal = rank <= 3 ? MEDALS[rank - 1] : null;
              const xp = profile.totalXp ?? 0;
              const skillCount = profile.skills?.length ?? 0;

              return (
                <Link
                  key={profile.username}
                  href={`/profile/${profile.username}`}
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all hover:scale-[1.01] ${
                    rank === 1
                      ? "bg-yellow-950/30 border-yellow-700/40 hover:border-yellow-600/60"
                      : rank === 2
                      ? "bg-gray-900/60 border-gray-600/40 hover:border-gray-500/60"
                      : rank === 3
                      ? "bg-orange-950/20 border-orange-800/30 hover:border-orange-700/50"
                      : "bg-gray-900/40 border-gray-800 hover:border-gray-700"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-10 text-center font-bold text-lg flex-shrink-0">
                    {medal ?? <span className="text-gray-500 text-base">#{rank}</span>}
                  </div>

                  {/* Avatar */}
                  <div className="text-3xl leading-none flex-shrink-0">{profile.avatarEmoji ?? "🧑"}</div>

                  {/* Name + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">
                      {profile.displayName ?? profile.username}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <span>@{profile.username}</span>
                      {profile.entityType && (
                        <span className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">
                          {ENTITY_LABELS[profile.entityType] ?? profile.entityType}
                        </span>
                      )}
                      <span>{skillCount} skill{skillCount !== 1 ? "s" : ""}</span>
                    </div>
                  </div>

                  {/* XP badge */}
                  <div className="flex-shrink-0 text-right">
                    <div className={`font-bold text-lg ${rank === 1 ? "text-yellow-400" : "text-violet-400"}`}>
                      {xp.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">XP</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-400 disabled:opacity-40 hover:border-gray-700 transition-colors"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-400 disabled:opacity-40 hover:border-gray-700 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

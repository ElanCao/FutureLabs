"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import { BRANCHES, SEED_PROFILES, type Profile } from "@/lib/seed-data";

const PAGE_SIZE = 12;

export default function ExplorePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (selectedBranch) params.set("branch", selectedBranch);
      if (skillSearch) params.set("skill", skillSearch);
      const res = await fetch(`/api/v1/profiles?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles ?? data);
        setTotal(data.total ?? (data.profiles ?? data).length);
        setApiAvailable(true);
      } else {
        throw new Error("API not ready");
      }
    } catch {
      // Fall back to seed data for demo
      setApiAvailable(false);
      let filtered = SEED_PROFILES as unknown as Profile[];
      if (selectedBranch) {
        filtered = filtered.filter((p) => p.skills.length > 0);
      }
      if (skillSearch) {
        const q = skillSearch.toLowerCase();
        filtered = filtered.filter((p) =>
          p.skills.some((s) => s.skillId.toLowerCase().includes(q))
        );
      }
      setProfiles(filtered.filter((p) => p.privacy !== "private").slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
      setTotal(filtered.length);
    } finally {
      setLoading(false);
    }
  }, [page, selectedBranch, skillSearch]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Nav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Profiles</h1>
          <p className="text-gray-400">Discover people and AI agents building their skill trees.</p>
        </div>

        {/* Skill search */}
        <form
          onSubmit={(e) => { e.preventDefault(); setSkillSearch(searchInput.trim()); setPage(1); }}
          className="flex gap-2 mb-6"
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by skill name…"
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <button
            type="submit"
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            Search
          </button>
          {skillSearch && (
            <button
              type="button"
              onClick={() => { setSkillSearch(""); setSearchInput(""); setPage(1); }}
              className="text-sm text-gray-500 hover:text-white px-3 py-2.5 rounded-xl border border-gray-800 transition-colors"
            >
              Clear
            </button>
          )}
        </form>

        {/* Branch filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => { setSelectedBranch(""); setPage(1); }}
            className={`text-sm px-4 py-2 rounded-xl border transition-colors ${!selectedBranch ? "bg-violet-600 border-violet-500 text-white" : "border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"}`}
          >
            All branches
          </button>
          {BRANCHES.map((b) => (
            <button
              key={b.id}
              onClick={() => { setSelectedBranch(b.id); setPage(1); }}
              className={`text-sm px-4 py-2 rounded-xl border transition-colors ${selectedBranch === b.id ? "bg-violet-600 border-violet-500 text-white" : "border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"}`}
            >
              {b.icon} {b.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse h-28" />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-4xl mb-3">🔍</div>
            <p>No public profiles found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {profiles.map((p) => (
                <Link
                  key={p.username}
                  href={`/profile/${p.username}`}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-gray-900 border border-gray-800 hover:border-violet-700 transition-colors group"
                >
                  <span className="text-4xl leading-none flex-shrink-0">{p.avatarEmoji}</span>
                  <div className="min-w-0">
                    <div className="font-semibold group-hover:text-violet-300 transition-colors truncate">{p.displayName}</div>
                    <div className="text-sm text-gray-500">@{p.username}</div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs text-violet-400">{p.totalXp.toLocaleString()} XP</span>
                      <span className="text-gray-700 text-xs">·</span>
                      <span className="text-xs text-gray-500">{p.skills.length} skills</span>
                      {p.entityType === "ai_agent" && (
                        <span className="text-xs bg-violet-900/40 text-violet-400 border border-violet-800 px-1.5 py-0.5 rounded-full">🤖 AI</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm disabled:opacity-40 hover:border-gray-700 transition-colors"
                >
                  ← Prev
                </button>
                <span className="text-sm text-gray-500 px-3">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm disabled:opacity-40 hover:border-gray-700 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {apiAvailable === false && (
          <div className="mt-6 text-center text-xs text-gray-700">
            Showing demo profiles — live data available after backend deployment
          </div>
        )}
      </div>
    </div>
  );
}

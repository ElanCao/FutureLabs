"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SKILLS, BRANCHES } from "@/lib/seed-data";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  const filteredSkills = selectedBranch
    ? SKILLS.filter((s) => s.branch === selectedBranch)
    : SKILLS;

  const selectedSkill = SKILLS.find((s) => s.id === selectedSkillId);
  const levelData = selectedSkill?.levels.find((l) => l.level === selectedLevel);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) { setError("Username is required."); return; }
    if (!/^[a-z0-9_-]{3,32}$/.test(username)) {
      setError("Username must be 3–32 chars: lowercase letters, numbers, _ or -");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      // Create profile via API
      const res = await fetch("/api/v1/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          displayName: session?.user?.name ?? username,
          bio: "",
          avatarEmoji: "🧑",
          entityType: "human",
          privacy: "public",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to create profile. Username may be taken.");
        setSubmitting(false);
        return;
      }

      // Add first skill if selected
      if (selectedSkillId) {
        await fetch(`/api/v1/profiles/${username}/skills/${selectedSkillId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentLevel: selectedLevel, xp: 0 }),
        });
      }

      router.push(`/dashboard`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-500 text-sm animate-pulse">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link href="/" className="font-bold text-violet-400 text-lg">🌳 SkillTree</Link>
      </nav>

      <div className="flex-1 flex items-start justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🌱</div>
            <h1 className="text-3xl font-bold mb-2">Welcome to SkillTree</h1>
            <p className="text-gray-400">Let's set up your profile and add your first skill.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Choose a username
              </label>
              <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus-within:border-violet-500 transition-colors">
                <span className="text-gray-600 text-sm">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  placeholder="your-username"
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-600 text-sm"
                  maxLength={32}
                  required
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">Lowercase, 3–32 chars. Letters, numbers, _ or -</p>
            </div>

            {/* First skill */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Add your first skill <span className="text-gray-600 font-normal">(optional)</span>
              </label>

              {/* Branch filter */}
              <div className="flex gap-2 flex-wrap mb-3">
                <button
                  type="button"
                  onClick={() => { setSelectedBranch(""); setSelectedSkillId(""); }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!selectedBranch ? "bg-violet-600 border-violet-500 text-white" : "border-gray-700 text-gray-400 hover:text-white"}`}
                >
                  All
                </button>
                {BRANCHES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => { setSelectedBranch(b.id); setSelectedSkillId(""); }}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedBranch === b.id ? "bg-violet-600 border-violet-500 text-white" : "border-gray-700 text-gray-400 hover:text-white"}`}
                  >
                    {b.icon} {b.name}
                  </button>
                ))}
              </div>

              {/* Skill select */}
              <select
                value={selectedSkillId}
                onChange={(e) => { setSelectedSkillId(e.target.value); setSelectedLevel(1); }}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500 outline-none transition-colors"
              >
                <option value="">— Pick a skill —</option>
                {filteredSkills.map((s) => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                ))}
              </select>
            </div>

            {/* Level picker */}
            {selectedSkillId && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Starting level: <span className="text-violet-400">{selectedLevel}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={selectedSkill?.maxLevel ?? 10}
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                  className="w-full accent-violet-500"
                />
                {levelData && (
                  <div className="mt-2 bg-gray-900 border border-gray-800 rounded-xl p-3">
                    <div className="text-sm font-medium text-white">{levelData.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{levelData.description}</div>
                  </div>
                )}
              </div>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !username}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              {submitting ? "Creating profile…" : "Create my profile →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

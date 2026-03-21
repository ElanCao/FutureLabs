"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import { SKILLS, BRANCHES, type UserSkillRecord, type EvidenceRecord } from "@/lib/seed-data";

interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  avatarEmoji: string;
  privacy: "public" | "private" | "friends";
  skills: UserSkillRecord[];
  totalXp: number;
}

const LEVEL_COLORS = [
  "", "bg-gray-700", "bg-gray-600", "bg-blue-700", "bg-blue-600",
  "bg-indigo-600", "bg-violet-600", "bg-violet-500", "bg-purple-500",
  "bg-amber-500", "bg-amber-400",
];

// Evidence form modal
function EvidenceModal({
  skillId,
  existing,
  onClose,
  onSave,
}: {
  skillId: string;
  existing: EvidenceRecord[];
  onClose: () => void;
  onSave: (records: EvidenceRecord[]) => void;
}) {
  const [records, setRecords] = useState<EvidenceRecord[]>(existing.length ? existing : [{ type: "project", title: "", url: "", description: "" }]);

  const addRecord = () => setRecords((r) => [...r, { type: "project", title: "", url: "", description: "" }]);
  const removeRecord = (i: number) => setRecords((r) => r.filter((_, idx) => idx !== i));
  const updateRecord = (i: number, patch: Partial<EvidenceRecord>) =>
    setRecords((r) => r.map((rec, idx) => (idx === i ? { ...rec, ...patch } : rec)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Evidence Records</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="space-y-4">
          {records.map((rec, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <select
                  value={rec.type}
                  onChange={(e) => updateRecord(i, { type: e.target.value as EvidenceRecord["type"] })}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white outline-none"
                >
                  <option value="project">🔨 Project</option>
                  <option value="certificate">🎓 Certificate</option>
                  <option value="contribution">🤝 Contribution</option>
                  <option value="publication">📝 Publication</option>
                  <option value="peer_review">👀 Peer Review</option>
                  <option value="self_assessment">💬 Self Assessment</option>
                </select>
                {records.length > 1 && (
                  <button onClick={() => removeRecord(i)} className="text-red-500 hover:text-red-400 text-sm">Remove</button>
                )}
              </div>
              <input
                type="text"
                placeholder="Title"
                value={rec.title ?? ""}
                onChange={(e) => updateRecord(i, { title: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition-colors"
              />
              <input
                type="url"
                placeholder="URL (optional)"
                value={rec.url ?? ""}
                onChange={(e) => updateRecord(i, { url: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition-colors"
              />
              <textarea
                placeholder="Description (optional)"
                value={rec.description ?? ""}
                onChange={(e) => updateRecord(i, { description: e.target.value })}
                rows={2}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition-colors resize-none"
              />
            </div>
          ))}
        </div>

        <button
          onClick={addRecord}
          className="mt-4 w-full py-2 border border-dashed border-gray-700 hover:border-violet-500 text-gray-500 hover:text-violet-400 rounded-xl text-sm transition-colors"
        >
          + Add evidence
        </button>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(records.filter((r) => r.title || r.url || r.description))}
            className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Save evidence
          </button>
        </div>
      </div>
    </div>
  );
}

// Add skill modal
function AddSkillModal({
  existingIds,
  onClose,
  onAdd,
}: {
  existingIds: Set<string>;
  onClose: () => void;
  onAdd: (skillId: string, level: number) => void;
}) {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [level, setLevel] = useState(1);

  const filteredSkills = (selectedBranch ? SKILLS.filter((s) => s.branch === selectedBranch) : SKILLS).filter(
    (s) => !existingIds.has(s.id)
  );
  const selectedSkill = SKILLS.find((s) => s.id === selectedSkillId);
  const levelData = selectedSkill?.levels.find((l) => l.level === level);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Add a Skill</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
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

          <select
            value={selectedSkillId}
            onChange={(e) => { setSelectedSkillId(e.target.value); setLevel(1); }}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500 outline-none"
          >
            <option value="">— Select a skill —</option>
            {filteredSkills.map((s) => (
              <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
            ))}
          </select>

          {selectedSkillId && (
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Starting level: <span className="text-violet-400 font-semibold">{level}</span>
              </label>
              <input
                type="range"
                min={1}
                max={selectedSkill?.maxLevel ?? 10}
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full accent-violet-500"
              />
              {levelData && (
                <div className="mt-2 bg-gray-800 rounded-xl p-3">
                  <div className="text-sm font-medium">{levelData.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{levelData.description}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm">Cancel</button>
          <button
            disabled={!selectedSkillId}
            onClick={() => selectedSkillId && onAdd(selectedSkillId, level)}
            className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium"
          >
            Add skill
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [evidenceSkillId, setEvidenceSkillId] = useState<string | null>(null);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [privacyUpdating, setPrivacyUpdating] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  const loadProfile = useCallback(async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/v1/profiles/me");
      if (res.status === 404) { setHasProfile(false); setLoading(false); return; }
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setProfile(data);
      setHasProfile(true);
    } catch {
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === "authenticated") loadProfile();
    else if (status === "unauthenticated") setLoading(false);
  }, [status, loadProfile]);

  async function updateSkillLevel(skillId: string, newLevel: number) {
    if (!profile) return;
    setSaving(skillId);
    const current = profile.skills.find((s) => s.skillId === skillId);
    const res = await fetch(`/api/v1/profiles/${profile.username}/skills/${skillId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentLevel: newLevel, xp: current?.xp ?? 0, evidence: current?.evidence }),
    });
    if (res.ok) {
      setProfile((p) => p ? {
        ...p,
        skills: p.skills.map((s) => s.skillId === skillId ? { ...s, currentLevel: newLevel } : s),
      } : p);
    }
    setSaving(null);
  }

  async function deleteSkill(skillId: string) {
    if (!profile || !confirm("Remove this skill?")) return;
    setSaving(skillId);
    const res = await fetch(`/api/v1/profiles/${profile.username}/skills/${skillId}`, { method: "DELETE" });
    if (res.ok) {
      setProfile((p) => p ? { ...p, skills: p.skills.filter((s) => s.skillId !== skillId) } : p);
    }
    setSaving(null);
  }

  async function addSkill(skillId: string, level: number) {
    if (!profile) return;
    setShowAddSkill(false);
    setSaving(skillId);
    const res = await fetch(`/api/v1/profiles/${profile.username}/skills/${skillId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentLevel: level, xp: 0 }),
    });
    if (res.ok) {
      setProfile((p) => p ? {
        ...p,
        skills: [...p.skills, { skillId, currentLevel: level, xp: 0 }],
      } : p);
    }
    setSaving(null);
  }

  async function saveEvidence(skillId: string, records: EvidenceRecord[]) {
    if (!profile) return;
    setEvidenceSkillId(null);
    const current = profile.skills.find((s) => s.skillId === skillId);
    await fetch(`/api/v1/profiles/${profile.username}/skills/${skillId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentLevel: current?.currentLevel ?? 1, xp: current?.xp ?? 0, evidence: records }),
    });
    setProfile((p) => p ? {
      ...p,
      skills: p.skills.map((s) => s.skillId === skillId ? { ...s, evidence: records } : s),
    } : p);
  }

  async function togglePrivacy() {
    if (!profile) return;
    setPrivacyUpdating(true);
    const newPrivacy = profile.privacy === "public" ? "private" : "public";
    const res = await fetch(`/api/v1/profiles/${profile.username}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ privacy: newPrivacy }),
    });
    if (res.ok) {
      setProfile((p) => p ? { ...p, privacy: newPrivacy } : p);
    }
    setPrivacyUpdating(false);
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl mb-2">🌳</div>
          <h1 className="text-2xl font-bold">Sign in to manage your skill tree</h1>
          <button
            onClick={() => signIn()}
            className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 animate-pulse">Loading your skill tree…</div>
        </div>
      </div>
    );
  }

  if (hasProfile === false) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl mb-2">🌱</div>
          <h1 className="text-2xl font-bold">No profile yet</h1>
          <p className="text-gray-400">Set up your profile to start building your skill tree.</p>
          <Link
            href="/onboarding"
            className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Get started →
          </Link>
        </div>
      </div>
    );
  }

  const skillsWithData = (profile?.skills ?? []).map((rec) => ({
    rec,
    skill: SKILLS.find((s) => s.id === rec.skillId),
    branch: BRANCHES.find((b) => b.id === SKILLS.find((s) => s.id === rec.skillId)?.branch),
  })).filter((x) => x.skill);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Nav />

      {evidenceSkillId && profile && (
        <EvidenceModal
          skillId={evidenceSkillId}
          existing={profile.skills.find((s) => s.skillId === evidenceSkillId)?.evidence ?? []}
          onClose={() => setEvidenceSkillId(null)}
          onSave={(records) => saveEvidence(evidenceSkillId, records)}
        />
      )}

      {showAddSkill && profile && (
        <AddSkillModal
          existingIds={new Set(profile.skills.map((s) => s.skillId))}
          onClose={() => setShowAddSkill(false)}
          onAdd={addSkill}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">My Skill Tree</h1>
            {profile && (
              <div className="flex items-center gap-3 mt-1">
                <Link href={`/profile/${profile.username}`} className="text-sm text-violet-400 hover:underline">
                  @{profile.username}
                </Link>
                <span className="text-gray-600 text-sm">·</span>
                <span className="text-sm text-gray-500">{profile.totalXp.toLocaleString()} XP</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Privacy toggle */}
            {profile && (
              <button
                onClick={togglePrivacy}
                disabled={privacyUpdating}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl border transition-colors ${
                  profile.privacy === "public"
                    ? "border-green-700 text-green-400 hover:bg-green-900/20"
                    : "border-gray-700 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {profile.privacy === "public" ? "🌐 Public" : "🔒 Private"}
              </button>
            )}
            <button
              onClick={() => setShowAddSkill(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors"
            >
              + Add skill
            </button>
          </div>
        </div>

        {/* Skills grid */}
        {skillsWithData.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 border border-dashed border-gray-800 rounded-2xl">
            <div className="text-4xl mb-3">🌿</div>
            <h2 className="text-lg font-semibold mb-2">No skills yet</h2>
            <p className="text-gray-500 text-sm mb-5">Add your first skill to start your tree.</p>
            <button
              onClick={() => setShowAddSkill(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              + Add skill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillsWithData.map(({ rec, skill, branch }) => {
              if (!skill) return null;
              const levelColor = LEVEL_COLORS[rec.currentLevel] || "bg-gray-700";
              const currentLevelData = skill.levels.find((l) => l.level === rec.currentLevel);
              const isSaving = saving === rec.skillId;

              return (
                <div key={skill.id} className={`bg-gray-900 border border-gray-800 rounded-2xl p-5 transition-opacity ${isSaving ? "opacity-60" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{skill.icon}</span>
                      <div>
                        <div className="font-semibold">{skill.name}</div>
                        <div className="text-xs text-gray-600">{branch?.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${levelColor}`}>
                        Lv.{rec.currentLevel}
                      </span>
                      <button
                        onClick={() => deleteSkill(skill.id)}
                        disabled={isSaving}
                        className="text-gray-700 hover:text-red-500 transition-colors text-lg leading-none"
                        title="Remove skill"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Level pips */}
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: skill.maxLevel }).map((_, i) => (
                      <div key={i} className={`h-2 flex-1 rounded-full ${i < rec.currentLevel ? levelColor : "bg-gray-800"}`} />
                    ))}
                  </div>

                  {/* Level slider */}
                  <div className="mt-3">
                    <label className="text-xs text-gray-500 mb-1 block">Level: {rec.currentLevel} / {skill.maxLevel}</label>
                    <input
                      type="range"
                      min={1}
                      max={skill.maxLevel}
                      value={rec.currentLevel}
                      onChange={(e) => updateSkillLevel(skill.id, Number(e.target.value))}
                      disabled={isSaving}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                  </div>

                  {currentLevelData && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-gray-300">{currentLevelData.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{currentLevelData.description}</div>
                    </div>
                  )}

                  {/* Evidence */}
                  <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      {rec.evidence?.length ? `${rec.evidence.length} evidence record${rec.evidence.length !== 1 ? "s" : ""}` : "No evidence"}
                    </span>
                    <button
                      onClick={() => setEvidenceSkillId(skill.id)}
                      className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      {rec.evidence?.length ? "Edit evidence" : "Add evidence"} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

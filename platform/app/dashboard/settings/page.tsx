"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";

const AVATAR_EMOJIS = [
  "🧑", "👩", "👨", "🧑‍💻", "👩‍💻", "👨‍💻", "🧑‍🎨", "👩‍🎨", "👨‍🎨",
  "🧑‍🚀", "👩‍🚀", "👨‍🚀", "🧑‍🔬", "👩‍🔬", "👨‍🔬", "🧑‍🏫", "👩‍🏫", "👨‍🏫",
  "🦸", "🦸‍♀️", "🦸‍♂️", "🧙", "🧙‍♀️", "🧙‍♂️", "🤖", "👾", "🐱",
  "🦊", "🐼", "🦁", "🐸", "🐧", "🦄", "🐉", "⚡", "🌟",
];

interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  avatarEmoji: string;
  privacy: "public" | "private" | "friends";
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarEmoji, setAvatarEmoji] = useState("🧑");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");

  const loadProfile = useCallback(async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/v1/profiles/me");
      if (res.status === 404) { setHasProfile(false); setLoading(false); return; }
      if (!res.ok) throw new Error("Failed");
      const data: ProfileData = await res.json();
      setProfile(data);
      setDisplayName(data.displayName);
      setBio(data.bio ?? "");
      setAvatarEmoji(data.avatarEmoji ?? "🧑");
      setPrivacy(data.privacy === "private" ? "private" : "public");
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    if (!displayName.trim()) { setError("Display name is required."); return; }
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch(`/api/v1/profiles/${profile.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: displayName.trim(), bio: bio.trim(), avatarEmoji, privacy }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Sign in to edit your profile</h1>
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
          <div className="text-gray-500 animate-pulse">Loading…</div>
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-white">Settings</span>
        </div>

        <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Avatar picker */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Avatar</label>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl leading-none bg-gray-900 border border-gray-700 rounded-2xl w-20 h-20 flex items-center justify-center">
                {avatarEmoji}
              </div>
              <p className="text-sm text-gray-500">Choose an emoji to represent you.</p>
            </div>
            <div className="grid grid-cols-9 gap-2">
              {AVATAR_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatarEmoji(emoji)}
                  className={`text-2xl leading-none w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                    avatarEmoji === emoji
                      ? "bg-violet-700 border-2 border-violet-400 scale-110"
                      : "bg-gray-900 border border-gray-800 hover:border-gray-600 hover:bg-gray-800"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Display name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={64}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="Your display name"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={300}
              rows={3}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              placeholder="Tell the world what you build…"
            />
            <div className="text-xs text-gray-600 text-right mt-1">{bio.length}/300</div>
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Profile Visibility</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPrivacy("public")}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${
                  privacy === "public"
                    ? "bg-green-900/40 border-green-700 text-green-400"
                    : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                🌐 Public
              </button>
              <button
                type="button"
                onClick={() => setPrivacy("private")}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${
                  privacy === "private"
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                🔒 Private
              </button>
            </div>
          </div>

          {/* Username (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <div className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-500 text-sm">
              @{profile?.username}
              <span className="ml-2 text-xs text-gray-700">(cannot be changed)</span>
            </div>
          </div>

          {/* Error / save feedback */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Save button */}
          <div className="flex items-center justify-between pt-2">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-white transition-colors">
              ← Back to dashboard
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              {saved ? "✅ Saved!" : saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

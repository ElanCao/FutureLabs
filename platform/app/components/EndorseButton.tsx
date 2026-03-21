"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface Endorser {
  username: string;
  displayName: string;
  avatarEmoji: string;
}

interface Props {
  username: string;
  skillId: string;
  initialCount: number;
  initialEndorsers: Endorser[];
  isOwner: boolean;
}

export default function EndorseButton({ username, skillId, initialCount, initialEndorsers, isOwner }: Props) {
  const { data: session } = useSession();
  const [count, setCount] = useState(initialCount);
  const [endorsers, setEndorsers] = useState<Endorser[]>(initialEndorsers);
  const [endorsed, setEndorsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Don't show to owners or on seed-data profiles (no real skillId)
  if (isOwner) return null;

  async function handleEndorse() {
    if (!session?.user || endorsed || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/profiles/${username}/endorsements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCount((c) => c + 1);
        setEndorsed(true);
        setEndorsers((prev) => [
          ...prev,
          {
            username: data.endorser.username,
            displayName: data.endorser.displayName,
            avatarEmoji: "🧑",
          },
        ]);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-3">
      {/* Endorsement count + avatars */}
      {count > 0 && (
        <div
          className="relative flex items-center gap-1 cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex -space-x-1">
            {endorsers.slice(0, 3).map((e, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-violet-900 border border-gray-800 flex items-center justify-center text-xs leading-none">
                {e.avatarEmoji}
              </div>
            ))}
          </div>
          <span className="text-xs text-gray-500">{count} endorsement{count !== 1 ? "s" : ""}</span>
          {showTooltip && endorsers.length > 0 && (
            <div className="absolute bottom-full left-0 mb-1 bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-gray-300 whitespace-nowrap z-10 shadow-xl">
              {endorsers.slice(0, 5).map((e) => e.displayName || e.username).join(", ")}
              {endorsers.length > 5 && ` +${endorsers.length - 5} more`}
            </div>
          )}
        </div>
      )}

      {/* Endorse button (only for logged-in non-owners) */}
      {session?.user && (
        <button
          onClick={handleEndorse}
          disabled={endorsed || loading}
          className={`ml-auto text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            endorsed
              ? "border-violet-700 text-violet-400 bg-violet-900/20"
              : "border-gray-700 text-gray-400 hover:border-violet-600 hover:text-violet-300"
          }`}
        >
          {endorsed ? "✓ Endorsed" : loading ? "…" : "Endorse"}
        </button>
      )}
    </div>
  );
}

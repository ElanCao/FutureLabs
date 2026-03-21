"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface EndorseButtonProps {
  username: string;
  skillId: string;
  initialCount: number;
  initialEndorsers: { username: string; displayName: string; avatarEmoji: string }[];
  isOwner: boolean;
}

export default function EndorseButton({
  username,
  skillId,
  initialCount,
  initialEndorsers,
  isOwner,
}: EndorseButtonProps) {
  const { data: session } = useSession();
  const [count, setCount] = useState(initialCount);
  const [endorsers, setEndorsers] = useState(initialEndorsers);
  const [hasEndorsed, setHasEndorsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Don't show endorse button for profile owner or unauthenticated users
  const canEndorse = session?.user && !isOwner;

  async function handleEndorse() {
    if (!canEndorse || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/profiles/${username}/skills/${skillId}/endorse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json();
        setCount((c) => c + 1);
        setEndorsers((prev) => {
          if (prev.length < 5) {
            return [data.endorser, ...prev];
          }
          return prev;
        });
        setHasEndorsed(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (count === 0 && !canEndorse) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-800">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Endorser emoji avatars */}
        {endorsers.length > 0 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            title="View endorsers"
          >
            <span className="flex -space-x-1">
              {endorsers.slice(0, 5).map((e, i) => (
                <span
                  key={i}
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-800 border border-gray-700 text-xs leading-none"
                  title={e.displayName}
                >
                  {e.avatarEmoji}
                </span>
              ))}
            </span>
            <span className="font-medium text-gray-400">
              {count} endorsement{count !== 1 ? "s" : ""}
            </span>
          </button>
        )}

        {/* Endorse button */}
        {canEndorse && !hasEndorsed && (
          <button
            onClick={handleEndorse}
            disabled={loading}
            className="ml-auto text-xs px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-violet-900/50 border border-gray-700 hover:border-violet-700 text-gray-400 hover:text-violet-300 transition-all disabled:opacity-50"
          >
            {loading ? "Endorsing…" : "👍 Endorse"}
          </button>
        )}

        {canEndorse && hasEndorsed && (
          <span className="ml-auto text-xs text-violet-400">✓ Endorsed</span>
        )}
      </div>

      {/* Expanded endorser list */}
      {expanded && endorsers.length > 0 && (
        <div className="mt-2 space-y-1">
          {endorsers.map((e, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>{e.avatarEmoji}</span>
              <span className="text-gray-400">{e.displayName}</span>
              <span className="text-gray-700">@{e.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

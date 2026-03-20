'use client';

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProfile, getProfileSkills, SEED_PROFILES } from "@/lib/seed-data";

const LEVEL_COLORS_HEX: Record<number, string> = {
  0: "#374151",
  1: "#4b5563",
  2: "#6b7280",
  3: "#1d4ed8",
  4: "#2563eb",
  5: "#4f46e5",
  6: "#7c3aed",
  7: "#8b5cf6",
  8: "#a855f7",
  9: "#f59e0b",
  10: "#fbbf24",
};

function drawCard(canvas: HTMLCanvasElement, username: string): void {
  const profile = getProfile(username);
  if (!profile) return;

  const profileSkills = getProfileSkills(profile);
  const topSkills = [...profileSkills]
    .sort((a, b) => b.record.currentLevel - a.record.currentLevel)
    .slice(0, 5);

  const W = 1200;
  const H = 630;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d")!;

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0f0a1e");
  bg.addColorStop(0.5, "#0d0d1a");
  bg.addColorStop(1, "#0a0a14");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid
  ctx.strokeStyle = "rgba(139,92,246,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Glow accent top-left
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 400);
  glow.addColorStop(0, "rgba(124,58,237,0.25)");
  glow.addColorStop(1, "rgba(124,58,237,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Brand label
  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.fillStyle = "#7c3aed";
  ctx.fillText("🌳 SkillTree", 48, 52);

  // Avatar
  const avatarX = 48;
  const avatarY = 80;
  ctx.font = "80px serif";
  ctx.fillText(profile.avatarEmoji, avatarX, avatarY + 80);

  // Name + username
  ctx.font = "bold 48px system-ui, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(profile.displayName, avatarX + 120, avatarY + 52);

  ctx.font = "24px system-ui, sans-serif";
  ctx.fillStyle = "#6b7280";
  ctx.fillText(`@${profile.username}`, avatarX + 120, avatarY + 86);

  if (profile.entityType === "ai_agent") {
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.fillStyle = "#a78bfa";
    ctx.fillText("🤖 AI Agent", avatarX + 120, avatarY + 116);
  }

  // Stats row
  const statsY = avatarY + 150;
  const stats = [
    { label: "Total XP", value: profile.totalXp.toLocaleString() },
    { label: "Skills", value: profile.skills.length.toString() },
    {
      label: "Avg Level",
      value: (
        profileSkills.reduce((s, p) => s + p.record.currentLevel, 0) /
        (profileSkills.length || 1)
      ).toFixed(1),
    },
  ];
  stats.forEach((stat, i) => {
    const x = 48 + i * 200;
    ctx.font = "bold 36px system-ui, sans-serif";
    ctx.fillStyle = "#8b5cf6";
    ctx.fillText(stat.value, x, statsY);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText(stat.label, x, statsY + 24);
  });

  // Divider
  ctx.strokeStyle = "rgba(139,92,246,0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, statsY + 46);
  ctx.lineTo(W - 200, statsY + 46);
  ctx.stroke();

  // Top skills
  const skillsStartY = statsY + 72;
  topSkills.forEach((item, idx) => {
    const y = skillsStartY + idx * 76;
    const barStartX = 48;
    const barW = W - 300;
    const levelColor = LEVEL_COLORS_HEX[item.record.currentLevel] || "#4b5563";

    ctx.font = "bold 20px system-ui, sans-serif";
    ctx.fillStyle = "#e5e7eb";
    ctx.fillText(`${item.skill.icon}  ${item.skill.name}`, barStartX, y + 18);

    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.fillStyle = levelColor;
    ctx.fillText(`Lv.${item.record.currentLevel}`, barStartX + 280, y + 18);

    const levelData = item.skill.levels.find((l) => l.level === item.record.currentLevel);
    if (levelData) {
      ctx.font = "14px system-ui, sans-serif";
      ctx.fillStyle = "#9ca3af";
      const desc =
        levelData.description.length > 70
          ? levelData.description.slice(0, 67) + "…"
          : levelData.description;
      ctx.fillText(desc, barStartX + 340, y + 18);
    }

    const pipY = y + 32;
    const pipW = (barW - 340) / item.skill.maxLevel;
    for (let i = 0; i < item.skill.maxLevel; i++) {
      const pipX = barStartX + 340 + i * (pipW + 3);
      ctx.fillStyle = i < item.record.currentLevel ? levelColor : "#1f2937";
      ctx.beginPath();
      ctx.roundRect(pipX, pipY, pipW - 1, 6, 3);
      ctx.fill();
    }
  });

  // URL footer right
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillStyle = "#4b5563";
  ctx.textAlign = "right";
  ctx.fillText(`skilltree.futurelab.dev/profile/${profile.username}`, W - 48, H - 24);
  ctx.textAlign = "left";

  // Footer left
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillStyle = "#374151";
  ctx.fillText("skilltree.futurelab.dev", 48, H - 24);
}

function ShareCardContent() {
  const searchParams = useSearchParams();
  const usernameParam = searchParams.get("username") || "alex";
  const [username, setUsername] = useState(usernameParam);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      drawCard(canvasRef.current, username);
    }
    setDownloaded(false);
  }, [username]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `skilltree-${username}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    setDownloaded(true);
  }

  const profile = getProfile(username);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="font-bold text-violet-400 text-lg">
          🌳 SkillTree
        </Link>
        {profile && (
          <Link
            href={`/profile/${username}`}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to profile
          </Link>
        )}
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Share your skill tree</h1>
          <p className="text-gray-400">
            Generate a beautiful card — perfect for Twitter, LinkedIn, or Product
            Hunt.
          </p>
        </div>

        {/* Profile selector */}
        <div className="flex gap-3 flex-wrap justify-center mb-8">
          {SEED_PROFILES.map((p) => (
            <button
              key={p.username}
              onClick={() => setUsername(p.username)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                username === p.username
                  ? "bg-violet-700 border-violet-600 text-white"
                  : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
              }`}
            >
              <span>{p.avatarEmoji}</span>
              <span>{p.displayName}</span>
            </button>
          ))}
        </div>

        {/* Canvas preview */}
        <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-violet-900/20 w-full mb-8">
          <canvas
            ref={canvasRef}
            className="w-full h-auto block"
            style={{ aspectRatio: "1200/630" }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg"
          >
            {downloaded ? "✅ Downloaded!" : "⬇️ Download PNG"}
          </button>
          {profile && (
            <Link
              href={`/profile/${username}`}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg"
            >
              👤 View full profile
            </Link>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          1200 × 630px — optimized for Twitter, LinkedIn, and Open Graph
        </p>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Loading…</div>}>
      <ShareCardContent />
    </Suspense>
  );
}

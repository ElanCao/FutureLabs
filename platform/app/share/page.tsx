'use client';

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { getProfile, getProfileSkills, SEED_PROFILES } from "@/lib/seed-data";

// Color palette: deep navy + electric blue + white
const PALETTE = {
  bgDeep: "#050d1a",
  bgMid: "#071428",
  bgLight: "#0a1a35",
  navyBorder: "#0e2040",
  electricBlue: "#0ea5e9",
  electricBlueGlow: "rgba(14,165,233,0.18)",
  electricBlueDim: "#0369a1",
  accentPurple: "#7c3aed",
  white: "#ffffff",
  offWhite: "#e2e8f0",
  gray400: "#94a3b8",
  gray600: "#475569",
  gray800: "#1e293b",
};

const LEVEL_COLORS: Record<number, string> = {
  0: "#334155",
  1: "#475569",
  2: "#64748b",
  3: "#0ea5e9",
  4: "#0284c7",
  5: "#7c3aed",
  6: "#6d28d9",
  7: "#8b5cf6",
  8: "#a78bfa",
  9: "#f59e0b",
  10: "#fbbf24",
};

async function drawCard(canvas: HTMLCanvasElement, username: string): Promise<void> {
  const profile = getProfile(username);
  if (!profile) return;

  const profileSkills = getProfileSkills(profile);
  const topSkills = [...profileSkills]
    .sort((a, b) => b.record.currentLevel - a.record.currentLevel)
    .slice(0, 6);

  const W = 1200;
  const H = 630;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d")!;

  // ── Background ──────────────────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, PALETTE.bgDeep);
  bg.addColorStop(0.6, PALETTE.bgMid);
  bg.addColorStop(1, PALETTE.bgLight);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid
  ctx.strokeStyle = "rgba(14,165,233,0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 48) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 48) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Electric blue glow top-right
  const glowTR = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
  glowTR.addColorStop(0, "rgba(14,165,233,0.12)");
  glowTR.addColorStop(1, "rgba(14,165,233,0)");
  ctx.fillStyle = glowTR;
  ctx.fillRect(0, 0, W, H);

  // Purple glow bottom-left
  const glowBL = ctx.createRadialGradient(0, H, 0, 0, H, 350);
  glowBL.addColorStop(0, "rgba(124,58,237,0.12)");
  glowBL.addColorStop(1, "rgba(124,58,237,0)");
  ctx.fillStyle = glowBL;
  ctx.fillRect(0, 0, W, H);

  // ── Header bar ──────────────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(14,165,233,0.06)";
  ctx.fillRect(0, 0, W, 70);
  ctx.strokeStyle = "rgba(14,165,233,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 70); ctx.lineTo(W, 70); ctx.stroke();

  // Brand label
  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.electricBlue;
  ctx.textAlign = "left";
  ctx.fillText("🌳 SkillTree", 44, 44);

  // futurelabs.vip badge top-right
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.gray400;
  ctx.textAlign = "right";
  ctx.fillText("futurelabs.vip", W - 44, 44);
  ctx.textAlign = "left";

  // ── Left column: avatar + stats ─────────────────────────────────────────────
  const COL_LEFT = 44;
  const COL_RIGHT = 820; // QR code column starts here
  const SECTION_TOP = 96;

  // Avatar circle background
  ctx.fillStyle = "rgba(14,165,233,0.08)";
  ctx.beginPath();
  ctx.arc(COL_LEFT + 52, SECTION_TOP + 52, 56, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(14,165,233,0.3)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Avatar emoji
  ctx.font = "72px serif";
  ctx.textAlign = "center";
  ctx.fillText(profile.avatarEmoji, COL_LEFT + 52, SECTION_TOP + 78);
  ctx.textAlign = "left";

  // Name + username
  const nameX = COL_LEFT + 120;
  ctx.font = "bold 38px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.white;
  ctx.fillText(profile.displayName, nameX, SECTION_TOP + 40);

  ctx.font = "18px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.electricBlue;
  ctx.fillText(`@${profile.username}`, nameX, SECTION_TOP + 68);

  if (profile.entityType === "ai_agent") {
    ctx.font = "bold 14px system-ui, sans-serif";
    ctx.fillStyle = "#a78bfa";
    ctx.fillText("🤖 AI Agent", nameX, SECTION_TOP + 96);
  }

  // ── Stats row ──────────────────────────────────────────────────────────────
  const STATS_Y = SECTION_TOP + 130;
  const avgLevel = (
    profileSkills.reduce((s, p) => s + p.record.currentLevel, 0) /
    (profileSkills.length || 1)
  ).toFixed(1);

  const stats = [
    { label: "Total XP", value: profile.totalXp.toLocaleString() },
    { label: "Skills", value: profile.skills.length.toString() },
    { label: "Avg Level", value: avgLevel },
  ];

  stats.forEach((stat, i) => {
    const x = COL_LEFT + i * 220;
    // Value
    ctx.font = "bold 30px system-ui, sans-serif";
    ctx.fillStyle = PALETTE.electricBlue;
    ctx.fillText(stat.value, x, STATS_Y);
    // Label
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillStyle = PALETTE.gray400;
    ctx.fillText(stat.label, x, STATS_Y + 22);
  });

  // XP bar (under stats)
  const XP_BAR_Y = STATS_Y + 48;
  const XP_BAR_W = COL_RIGHT - COL_LEFT - 20;
  const maxXp = 10000;
  const xpRatio = Math.min(profile.totalXp / maxXp, 1);

  ctx.fillStyle = PALETTE.navyBorder;
  ctx.beginPath();
  ctx.roundRect(COL_LEFT, XP_BAR_Y, XP_BAR_W, 8, 4);
  ctx.fill();

  const xpGrad = ctx.createLinearGradient(COL_LEFT, 0, COL_LEFT + XP_BAR_W * xpRatio, 0);
  xpGrad.addColorStop(0, PALETTE.electricBlueDim);
  xpGrad.addColorStop(1, PALETTE.electricBlue);
  ctx.fillStyle = xpGrad;
  ctx.beginPath();
  ctx.roundRect(COL_LEFT, XP_BAR_Y, XP_BAR_W * xpRatio, 8, 4);
  ctx.fill();

  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.gray600;
  ctx.fillText(`${profile.totalXp.toLocaleString()} / ${maxXp.toLocaleString()} XP`, COL_LEFT, XP_BAR_Y + 22);

  // ── Divider ─────────────────────────────────────────────────────────────────
  const DIV_Y = XP_BAR_Y + 38;
  ctx.strokeStyle = "rgba(14,165,233,0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(COL_LEFT, DIV_Y); ctx.lineTo(COL_RIGHT - 20, DIV_Y); ctx.stroke();

  // ── Skill badges grid (max 6, 3 per row) ────────────────────────────────────
  const SKILLS_Y = DIV_Y + 18;
  const BADGE_W = 238;
  const BADGE_H = 56;
  const BADGE_GAP_X = 12;
  const BADGE_GAP_Y = 10;
  const COLS = 3;

  topSkills.forEach((item, idx) => {
    const col = idx % COLS;
    const row = Math.floor(idx / COLS);
    const bx = COL_LEFT + col * (BADGE_W + BADGE_GAP_X);
    const by = SKILLS_Y + row * (BADGE_H + BADGE_GAP_Y);
    const levelColor = LEVEL_COLORS[item.record.currentLevel] || "#475569";

    // Badge bg
    ctx.fillStyle = "rgba(14,165,233,0.05)";
    ctx.beginPath();
    ctx.roundRect(bx, by, BADGE_W, BADGE_H, 8);
    ctx.fill();
    ctx.strokeStyle = levelColor + "55";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Level color left accent
    ctx.fillStyle = levelColor;
    ctx.beginPath();
    ctx.roundRect(bx, by, 4, BADGE_H, [8, 0, 0, 8]);
    ctx.fill();

    // Skill icon + name
    ctx.font = "bold 15px system-ui, sans-serif";
    ctx.fillStyle = PALETTE.offWhite;
    ctx.textAlign = "left";
    ctx.fillText(`${item.skill.icon} ${item.skill.name}`, bx + 14, by + 22);

    // Level badge
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.fillStyle = levelColor;
    ctx.fillText(`Lv.${item.record.currentLevel}`, bx + 14, by + 42);

    // XP pips
    const PIP_X = bx + 68;
    const PIP_Y = by + 36;
    const pipW = (BADGE_W - 82) / item.skill.maxLevel;
    for (let i = 0; i < item.skill.maxLevel; i++) {
      ctx.fillStyle = i < item.record.currentLevel ? levelColor : PALETTE.gray800;
      ctx.beginPath();
      ctx.roundRect(PIP_X + i * (pipW + 1), PIP_Y, pipW - 0.5, 5, 2);
      ctx.fill();
    }
  });

  // ── Right column: QR code ───────────────────────────────────────────────────
  const QR_SIZE = 160;
  const QR_X = COL_RIGHT + 40;
  const QR_Y = SECTION_TOP + 10;
  const profileUrl = `https://futurelabs.vip/@${profile.username}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(profileUrl, {
      width: QR_SIZE,
      margin: 1,
      color: { dark: "#ffffff", light: "#071428" },
      errorCorrectionLevel: "M",
    });

    // QR container
    ctx.fillStyle = PALETTE.bgMid;
    ctx.strokeStyle = "rgba(14,165,233,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(QR_X - 10, QR_Y - 10, QR_SIZE + 20, QR_SIZE + 60, 12);
    ctx.fill();
    ctx.stroke();

    const img = new Image();
    await new Promise<void>((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, QR_X, QR_Y, QR_SIZE, QR_SIZE);
        resolve();
      };
      img.src = qrDataUrl;
    });

    // QR label
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.fillStyle = PALETTE.electricBlue;
    ctx.textAlign = "center";
    ctx.fillText("Scan to view profile", QR_X + QR_SIZE / 2, QR_Y + QR_SIZE + 20);

    ctx.font = "11px system-ui, sans-serif";
    ctx.fillStyle = PALETTE.gray400;
    ctx.fillText(`@${profile.username}`, QR_X + QR_SIZE / 2, QR_Y + QR_SIZE + 38);
    ctx.textAlign = "left";
  } catch {
    // QR fallback: text URL
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillStyle = PALETTE.gray400;
    ctx.textAlign = "center";
    ctx.fillText(profileUrl, QR_X + QR_SIZE / 2, QR_Y + QR_SIZE / 2);
    ctx.textAlign = "left";
  }

  // ── CTA text under QR ───────────────────────────────────────────────────────
  const CTA_Y = QR_Y + QR_SIZE + 80;
  ctx.font = "bold 16px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.offWhite;
  ctx.textAlign = "center";
  ctx.fillText("Build your own", QR_X + QR_SIZE / 2, CTA_Y);
  ctx.font = "bold 18px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.electricBlue;
  ctx.fillText("futurelabs.vip", QR_X + QR_SIZE / 2, CTA_Y + 26);
  ctx.textAlign = "left";

  // ── Footer ──────────────────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(14,165,233,0.04)";
  ctx.fillRect(0, H - 44, W, 44);
  ctx.strokeStyle = "rgba(14,165,233,0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 44); ctx.lineTo(W, H - 44); ctx.stroke();

  ctx.font = "12px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.gray600;
  ctx.textAlign = "left";
  ctx.fillText("🌳 futurelabs.vip — Track and share your skill tree", COL_LEFT, H - 15);

  ctx.font = "12px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.gray600;
  ctx.textAlign = "right";
  ctx.fillText(`futurelabs.vip/@${profile.username}`, W - COL_LEFT, H - 15);
  ctx.textAlign = "left";
}

function ShareCardContent() {
  const searchParams = useSearchParams();
  const usernameParam = searchParams.get("username") || "alex";
  const [username, setUsername] = useState(usernameParam);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    setRendering(true);
    drawCard(canvasRef.current, username).finally(() => setRendering(false));
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
    <div className="min-h-screen bg-[#050d1a] text-white">
      {/* Nav */}
      <nav className="border-b border-sky-900/40 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="font-bold text-sky-400 text-lg">
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
            Generate a beautiful card — perfect for Twitter, LinkedIn, or Product Hunt.
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
                  ? "bg-sky-700 border-sky-500 text-white"
                  : "bg-gray-900/80 border-gray-800 text-gray-400 hover:border-sky-800 hover:text-white"
              }`}
            >
              <span>{p.avatarEmoji}</span>
              <span>{p.displayName}</span>
            </button>
          ))}
        </div>

        {/* Canvas preview */}
        <div className="rounded-2xl overflow-hidden border border-sky-900/40 shadow-2xl shadow-sky-900/20 w-full mb-8 relative">
          {rendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#050d1a]/80 z-10">
              <span className="text-sky-400 text-sm">Rendering…</span>
            </div>
          )}
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
            disabled={rendering}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg"
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
    <Suspense fallback={<div className="min-h-screen bg-[#050d1a] flex items-center justify-center text-gray-400">Loading…</div>}>
      <ShareCardContent />
    </Suspense>
  );
}

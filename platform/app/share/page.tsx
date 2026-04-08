'use client';

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import QRCode from "qrcode";
import { getProfile, getProfileSkills, SEED_PROFILES, type Profile } from "@/lib/seed-data";

interface EnrichedSkillRecord {
  skillId: string;
  currentLevel: number;
  xp: number;
  name?: string;
  icon?: string;
  maxLevel?: number;
}

interface Achievement {
  id: string;
  type: string;
  tier: string;
  name: string;
  description?: string;
  icon: string;
  unlockedAt: string;
  shareCount?: number;
}

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

const TIER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  bronze: { bg: "#451a03", border: "#92400e", text: "#d97706" },
  silver: { bg: "#1e293b", border: "#64748b", text: "#94a3b8" },
  gold: { bg: "#422006", border: "#ca8a04", text: "#fbbf24" },
  platinum: { bg: "#1e1b4b", border: "#6366f1", text: "#a5b4fc" },
};

async function fetchProfileForCard(username: string): Promise<Profile | null> {
  const seed = getProfile(username);
  if (seed) return seed as unknown as Profile;
  try {
    const res = await fetch(`/api/v1/profiles/${encodeURIComponent(username)}`);
    if (res.ok) return res.json();
  } catch { /* ignore */ }
  return null;
}

async function fetchAchievements(username: string): Promise<Achievement[]> {
  try {
    const res = await fetch(`/api/v1/profiles/${encodeURIComponent(username)}/achievements`);
    if (res.ok) {
      const data = await res.json();
      return data.achievements || [];
    }
  } catch { /* ignore */ }
  return [];
}

function resolveSkills(profile: Profile): { icon: string; name: string; maxLevel: number; record: { currentLevel: number; xp: number } }[] {
  const enriched = (profile.skills as EnrichedSkillRecord[]).filter((s) => s.name);
  if (enriched.length > 0) {
    return enriched.map((s) => ({
      icon: s.icon ?? "⭐",
      name: s.name!,
      maxLevel: s.maxLevel ?? 10,
      record: { currentLevel: s.currentLevel, xp: s.xp },
    }));
  }
  return getProfileSkills(profile).map((item) => ({
    icon: item.skill.icon ?? "⭐",
    name: item.skill.name,
    maxLevel: item.skill.maxLevel,
    record: { currentLevel: item.record.currentLevel, xp: item.record.xp },
  }));
}

async function drawProfileCard(canvas: HTMLCanvasElement, profile: Profile): Promise<void> {
  if (!profile) return;

  const profileSkills = resolveSkills(profile);
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
  const COL_RIGHT = 820;
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
    ctx.font = "bold 30px system-ui, sans-serif";
    ctx.fillStyle = PALETTE.electricBlue;
    ctx.fillText(stat.value, x, STATS_Y);
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
    ctx.fillText(`${item.icon} ${item.name}`, bx + 14, by + 22);

    // Level badge
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.fillStyle = levelColor;
    ctx.fillText(`Lv.${item.record.currentLevel}`, bx + 14, by + 42);

    // XP pips
    const PIP_X = bx + 68;
    const PIP_Y = by + 36;
    const pipW = (BADGE_W - 82) / item.maxLevel;
    for (let i = 0; i < item.maxLevel; i++) {
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

async function drawMilestoneCard(canvas: HTMLCanvasElement, profile: Profile, achievement: Achievement): Promise<void> {
  if (!profile || !achievement) return;

  const W = 1200;
  const H = 630;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d")!;
  const tierColors = TIER_COLORS[achievement.tier] || TIER_COLORS.gold;

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

  // Tier glow effect
  const tierGlow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 400);
  tierGlow.addColorStop(0, tierColors.border + "20");
  tierGlow.addColorStop(1, "transparent");
  ctx.fillStyle = tierGlow;
  ctx.fillRect(0, 0, W, H);

  // ── Header bar ──────────────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(14,165,233,0.06)";
  ctx.fillRect(0, 0, W, 70);
  ctx.strokeStyle = "rgba(14,165,233,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 70); ctx.lineTo(W, 70); ctx.stroke();

  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.electricBlue;
  ctx.textAlign = "left";
  ctx.fillText("🌳 SkillTree", 44, 44);

  ctx.font = "14px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.gray400;
  ctx.textAlign = "right";
  ctx.fillText("futurelabs.vip", W - 44, 44);
  ctx.textAlign = "left";

  // ── Main Content: Achievement Badge ─────────────────────────────────────────
  const CENTER_X = W / 2;
  const CARD_Y = 110;
  const CARD_W = 480;
  const CARD_H = 340;

  // Card background
  ctx.fillStyle = "rgba(14,165,233,0.05)";
  ctx.strokeStyle = tierColors.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(CENTER_X - CARD_W / 2, CARD_Y, CARD_W, CARD_H, 24);
  ctx.fill();
  ctx.stroke();

  // Type label
  const typeLabels: Record<string, string> = {
    skill_count: "SKILL COLLECTOR",
    level_reached: "LEVEL MASTER",
    first_collaboration: "COLLABORATOR",
    endorsement_received: "RECOGNIZED EXPERT",
    xp_milestone: "XP CHAMPION",
  };

  ctx.font = "bold 14px system-ui, sans-serif";
  ctx.fillStyle = tierColors.text;
  ctx.textAlign = "center";
  ctx.fillText(typeLabels[achievement.type] || "ACHIEVEMENT", CENTER_X, CARD_Y + 40);

  // Large achievement icon
  ctx.font = "120px serif";
  ctx.fillText(achievement.icon, CENTER_X, CARD_Y + 160);

  // Achievement name
  ctx.font = "bold 36px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.white;
  ctx.fillText(achievement.name, CENTER_X, CARD_Y + 220);

  // Description
  if (achievement.description) {
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = PALETTE.gray400;
    ctx.fillText(achievement.description, CENTER_X, CARD_Y + 255);
  }

  // Tier badge
  const tierBadgeY = CARD_Y + 295;
  ctx.fillStyle = tierColors.bg;
  ctx.strokeStyle = tierColors.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(CENTER_X - 60, tierBadgeY - 12, 120, 28, 14);
  ctx.fill();
  ctx.stroke();

  ctx.font = "bold 12px system-ui, sans-serif";
  ctx.fillStyle = tierColors.text;
  ctx.fillText(achievement.tier.toUpperCase(), CENTER_X, tierBadgeY + 5);

  // ── User Info ───────────────────────────────────────────────────────────────
  const USER_Y = CARD_Y + CARD_H + 30;

  // Avatar
  ctx.fillStyle = "rgba(14,165,233,0.08)";
  ctx.strokeStyle = "rgba(14,165,233,0.3)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(CENTER_X - 80, USER_Y, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.font = "32px serif";
  ctx.textAlign = "center";
  ctx.fillText(profile.avatarEmoji, CENTER_X - 80, USER_Y + 10);

  // Name
  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.white;
  ctx.textAlign = "left";
  ctx.fillText(profile.displayName, CENTER_X - 40, USER_Y - 5);

  // Username
  ctx.font = "15px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.electricBlue;
  ctx.fillText(`@${profile.username}`, CENTER_X - 40, USER_Y + 18);

  // Unlocked date
  const unlockedDate = new Date(achievement.unlockedAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  ctx.font = "13px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.gray600;
  ctx.textAlign = "center";
  ctx.fillText(`🏆 Unlocked ${unlockedDate}`, CENTER_X, USER_Y + 55);

  // ── Footer ──────────────────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(14,165,233,0.04)";
  ctx.fillRect(0, H - 44, W, 44);
  ctx.strokeStyle = "rgba(14,165,233,0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 44); ctx.lineTo(W, H - 44); ctx.stroke();

  ctx.font = "13px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.gray400;
  ctx.textAlign = "center";
  ctx.fillText("I just unlocked an achievement on SkillTree — build yours at ", CENTER_X - 60, H - 18);

  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.fillStyle = PALETTE.electricBlue;
  ctx.fillText("futurelabs.vip", CENTER_X + 170, H - 18);
}

function ShareCardContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const sessionUsername = (session?.user as { username?: string })?.username ?? "";
  const usernameParam = searchParams.get("username") || sessionUsername || SEED_PROFILES[0].username;
  const [username, setUsername] = useState(usernameParam);
  const [inputValue, setInputValue] = useState(usernameParam);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "milestone">("profile");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (sessionUsername && !searchParams.get("username")) {
      setUsername(sessionUsername);
      setInputValue(sessionUsername);
    }
  }, [sessionUsername, searchParams]);

  useEffect(() => {
    setRendering(true);
    setNotFound(false);
    fetchProfileForCard(username).then((profile) => {
      if (!profile) {
        setNotFound(true);
        setCurrentProfile(null);
        setRendering(false);
        return;
      }
      setCurrentProfile(profile);
      fetchAchievements(username).then((achievements) => {
        setAchievements(achievements);
        if (achievements.length > 0 && !selectedAchievement) {
          setSelectedAchievement(achievements[0]);
        }
      });
    });
    setDownloaded(false);
  }, [username]);

  useEffect(() => {
    if (!canvasRef.current || !currentProfile) return;
    setRendering(true);

    if (activeTab === "profile") {
      drawProfileCard(canvasRef.current, currentProfile).finally(() => setRendering(false));
    } else if (activeTab === "milestone" && selectedAchievement) {
      drawMilestoneCard(canvasRef.current, currentProfile, selectedAchievement).finally(() => setRendering(false));
    } else {
      setRendering(false);
    }
  }, [activeTab, selectedAchievement, currentProfile]);

  function handleUsernameSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim().replace(/^@/, "");
    if (trimmed) setUsername(trimmed);
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    const suffix = activeTab === "milestone" && selectedAchievement
      ? `-achievement-${selectedAchievement.id.slice(0, 8)}`
      : "";
    a.download = `skilltree-${username}${suffix}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    setDownloaded(true);

    // Track share if milestone
    if (activeTab === "milestone" && selectedAchievement) {
      fetch(`/api/v1/achievements/${selectedAchievement.id}/share`, { method: "POST" })
        .catch(() => { /* ignore */ });
    }
  }

  const ogUrl = activeTab === "profile"
    ? `/api/og?username=${encodeURIComponent(username)}`
    : `/api/og/milestone?username=${encodeURIComponent(username)}${selectedAchievement ? `&achievement=${selectedAchievement.id}` : ""}`;

  return (
    <div className="min-h-screen bg-[#050d1a] text-white">
      {/* Nav */}
      <nav className="border-b border-sky-900/40 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="font-bold text-sky-400 text-lg">
          🌳 SkillTree
        </Link>
        {currentProfile && (
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
            Generate beautiful cards — perfect for Twitter, LinkedIn, or Product Hunt.
          </p>
        </div>

        {/* Username input */}
        <form onSubmit={handleUsernameSubmit} className="flex gap-2 justify-center mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter username…"
            className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-sky-600 w-52"
          />
          <button
            type="submit"
            className="bg-sky-700 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Generate
          </button>
        </form>

        {/* Seed profile quick picks */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          <span className="text-xs text-gray-600 self-center mr-1">Quick picks:</span>
          {SEED_PROFILES.map((p) => (
            <button
              key={p.username}
              onClick={() => { setUsername(p.username); setInputValue(p.username); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
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

        {/* Card Type Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-900 rounded-xl p-1 border border-gray-800">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-sky-700 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              📊 Profile Card
            </button>
            <button
              onClick={() => setActiveTab("milestone")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "milestone"
                  ? "bg-sky-700 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🏆 Milestone Card
            </button>
          </div>
        </div>

        {/* Achievement selector (milestone tab only) */}
        {activeTab === "milestone" && achievements.length > 0 && (
          <div className="flex gap-2 flex-wrap justify-center mb-6">
            <span className="text-xs text-gray-600 self-center mr-1">Select achievement:</span>
            {achievements.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAchievement(a)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  selectedAchievement?.id === a.id
                    ? "bg-amber-700/50 border-amber-500 text-amber-200"
                    : "bg-gray-900/80 border-gray-800 text-gray-400 hover:border-amber-800 hover:text-amber-200"
                }`}
              >
                <span>{a.icon}</span>
                <span>{a.name}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === "milestone" && achievements.length === 0 && (
          <div className="text-center mb-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">No achievements yet. Keep building your skill tree!</p>
          </div>
        )}

        {/* OG Image Preview */}
        <div className="rounded-2xl overflow-hidden border border-sky-900/40 shadow-2xl shadow-sky-900/20 w-full mb-8 relative">
          {rendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#050d1a]/80 z-10">
              <span className="text-sky-400 text-sm">Rendering…</span>
            </div>
          )}
          {notFound && !rendering && (
            <div className="flex items-center justify-center bg-[#050d1a] h-48">
              <span className="text-gray-500 text-sm">Profile &quot;{username}&quot; not found.</span>
            </div>
          )}
          {/* Server-rendered OG image */}
          {!notFound && (
            <img
              src={ogUrl}
              alt={`${activeTab === "profile" ? "Profile" : "Milestone"} card preview`}
              className="w-full h-auto block"
              style={{ aspectRatio: "1200/630" }}
            />
          )}
        </div>

        {/* Hidden canvas for downloads */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />

        {/* Action buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleDownload}
            disabled={rendering || notFound || (activeTab === "milestone" && !selectedAchievement)}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg"
          >
            {downloaded ? "✅ Downloaded!" : "⬇️ Download PNG"}
          </button>
          {currentProfile && (
            <Link
              href={`/profile/${username}`}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg"
            >
              👤 View full profile
            </Link>
          )}
        </div>

        {/* OG URL for sharing */}
        <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <p className="text-xs text-gray-500 mb-2">Direct image URL for sharing:</p>
          <code className="text-xs text-sky-400 break-all">{ogUrl}</code>
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

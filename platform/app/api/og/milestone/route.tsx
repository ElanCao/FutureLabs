import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Node.js runtime for Prisma compatibility
export const runtime = "nodejs";

const TIER_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  bronze: {
    bg: "#451a03",
    border: "#92400e",
    text: "#d97706",
    glow: "rgba(217, 119, 6, 0.3)",
  },
  silver: {
    bg: "#1e293b",
    border: "#64748b",
    text: "#94a3b8",
    glow: "rgba(148, 163, 184, 0.3)",
  },
  gold: {
    bg: "#422006",
    border: "#ca8a04",
    text: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.3)",
  },
  platinum: {
    bg: "#1e1b4b",
    border: "#6366f1",
    text: "#a5b4fc",
    glow: "rgba(99, 102, 241, 0.3)",
  },
};

const ACHIEVEMENT_TYPE_ICONS: Record<string, string> = {
  skill_count: "🌳",
  level_reached: "⭐",
  first_collaboration: "🤝",
  endorsement_received: "💫",
  xp_milestone: "🚀",
  branch_master: "🎯",
  profile_complete: "✨",
  social_share: "📢",
};

const ACHIEVEMENT_TYPE_LABELS: Record<string, string> = {
  skill_count: "Skill Collector",
  level_reached: "Level Master",
  first_collaboration: "Collaborator",
  endorsement_received: "Recognized Expert",
  xp_milestone: "XP Champion",
  branch_master: "Branch Master",
  profile_complete: "Profile Complete",
  social_share: "Influencer",
};

interface AchievementData {
  id: string;
  type: string;
  tier: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  profile: {
    username: string;
    displayName: string;
    avatarEmoji: string;
    totalXp: number;
    skills: { currentLevel: number }[];
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const achievementId = searchParams.get("achievement");

  if (!username) {
    return new Response("Missing username", { status: 400 });
  }

  let achievement: AchievementData | null = null;

  try {
    // Try to fetch from database
    const dbProfile = await prisma.profile.findUnique({
      where: { username },
      include: {
        achievements: achievementId
          ? { where: { id: achievementId } }
          : { orderBy: { unlockedAt: "desc" }, take: 1 },
      },
    });

    if (dbProfile && dbProfile.privacy !== "private" && dbProfile.achievements.length > 0) {
      const dbAchievement = dbProfile.achievements[0];
      achievement = {
        id: dbAchievement.id,
        type: dbAchievement.type,
        tier: dbAchievement.tier,
        name: dbAchievement.name,
        description: dbAchievement.description ?? "",
        icon: dbAchievement.icon,
        unlockedAt: dbAchievement.unlockedAt,
        profile: {
          username: dbProfile.username,
          displayName: dbProfile.displayName ?? dbProfile.username,
          avatarEmoji: dbProfile.avatarEmoji ?? "🧑",
          totalXp: dbProfile.totalXp,
          skills: [], // We don't need full skills for milestone card
        },
      };
    }
  } catch {
    // DB unavailable, use fallback
  }

  // Fallback: generate a sample achievement for demo
  if (!achievement) {
    achievement = generateFallbackAchievement(username);
  }

  const tierColors = TIER_COLORS[achievement.tier] ?? TIER_COLORS.gold;
  const typeIcon = ACHIEVEMENT_TYPE_ICONS[achievement.type] ?? "🏆";
  const typeLabel = ACHIEVEMENT_TYPE_LABELS[achievement.type] ?? "Achievement";
  const unlockedDate = new Date(achievement.unlockedAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const img = new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #050d1a 0%, #071428 60%, #0c1628 100%)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(14,165,233,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Tier-specific glow effect */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "500px",
            height: "500px",
            background: `radial-gradient(circle, ${tierColors.glow} 0%, transparent 70%)`,
            borderRadius: "50%",
          }}
        />

        {/* Bottom-left accent glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* ── Header bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 44px",
            height: "64px",
            borderBottom: "1px solid rgba(14,165,233,0.15)",
            background: "rgba(14,165,233,0.04)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "22px" }}>🌳</span>
            <span style={{ color: "#0ea5e9", fontSize: "20px", fontWeight: "700" }}>SkillTree</span>
          </div>
          <span style={{ color: "#475569", fontSize: "14px" }}>skilltree.app</span>
        </div>

        {/* ── Main content ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            gap: "24px",
          }}
        >
          {/* Achievement Badge Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              background: "rgba(14,165,233,0.03)",
              border: `2px solid ${tierColors.border}`,
              borderRadius: "24px",
              padding: "40px 60px",
              boxShadow: `0 0 60px ${tierColors.glow}`,
            }}
          >
            {/* Tier badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: tierColors.bg,
                border: `1px solid ${tierColors.border}`,
                padding: "6px 16px",
                borderRadius: "20px",
              }}
            >
              <span style={{ fontSize: "14px" }}>{typeIcon}</span>
              <span
                style={{
                  color: tierColors.text,
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {typeLabel}
              </span>
            </div>

            {/* Large achievement icon */}
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${tierColors.bg} 0%, rgba(14,165,233,0.1) 100%)`,
                border: `3px solid ${tierColors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "64px",
                boxShadow: `0 0 40px ${tierColors.glow}`,
              }}
            >
              {achievement.icon}
            </div>

            {/* Achievement name */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  color: tierColors.text,
                  fontSize: "42px",
                  fontWeight: "800",
                  textAlign: "center",
                }}
              >
                {achievement.name}
              </span>
              {achievement.description && (
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "18px",
                    textAlign: "center",
                    maxWidth: "500px",
                  }}
                >
                  {achievement.description}
                </span>
              )}
            </div>

            {/* Unlocked date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#475569",
                fontSize: "14px",
              }}
            >
              <span>🏆</span>
              <span>Unlocked {unlockedDate}</span>
            </div>
          </div>

          {/* User info row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "8px",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(14,165,233,0.08)",
                border: "2px solid rgba(14,165,233,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              {achievement.profile.avatarEmoji}
            </div>

            {/* Name + handle */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ color: "#ffffff", fontSize: "22px", fontWeight: "700" }}>
                {achievement.profile.displayName}
              </span>
              <span style={{ color: "#0ea5e9", fontSize: "15px" }}>@{achievement.profile.username}</span>
            </div>
          </div>
        </div>

        {/* ── Footer: viral CTA ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "52px",
            borderTop: "1px solid rgba(14,165,233,0.1)",
            background: "rgba(14,165,233,0.03)",
            gap: "6px",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#0ea5e9", fontSize: "15px", fontWeight: "600" }}>
            I just unlocked an achievement on SkillTree
          </span>
          <span style={{ color: "#334155", fontSize: "15px" }}>—</span>
          <span style={{ color: "#94a3b8", fontSize: "15px" }}>build yours at</span>
          <span style={{ color: "#0ea5e9", fontSize: "15px", fontWeight: "700" }}>skilltree.app</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );

  // CDN caching: 1h fresh, 24h stale-while-revalidate
  img.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return img;
}

function generateFallbackAchievement(username: string): AchievementData {
  // Generate deterministic fallback achievement based on username
  const achievements = [
    {
      type: "skill_count",
      tier: "gold",
      name: "100 Skills Mapped",
      description: "Added 100 skills to their personal skill tree",
      icon: "🌳",
    },
    {
      type: "level_reached",
      tier: "platinum",
      name: "Level 10 Master",
      description: "Reached level 10 in any skill branch",
      icon: "⭐",
    },
    {
      type: "xp_milestone",
      tier: "gold",
      name: "10,000 XP Earned",
      description: "Accumulated over 10,000 experience points",
      icon: "🚀",
    },
    {
      type: "first_collaboration",
      tier: "silver",
      name: "First Collaboration",
      description: "Completed their first AI-agent collaboration",
      icon: "🤝",
    },
    {
      type: "endorsement_received",
      tier: "bronze",
      name: "Peer Recognized",
      description: "Received 5 skill endorsements from peers",
      icon: "💫",
    },
  ];

  // Pick based on username hash for consistency
  const hash = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selected = achievements[hash % achievements.length];

  return {
    id: "fallback",
    ...selected,
    unlockedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Within last 30 days
    profile: {
      username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      avatarEmoji: "🧑",
      totalXp: 10000 + (hash % 50000),
      skills: [],
    },
  };
}

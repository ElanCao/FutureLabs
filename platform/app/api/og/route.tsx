import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfile, getProfileSkills } from "@/lib/seed-data";

// Node.js runtime for Prisma compatibility
export const runtime = "nodejs";

const LEVEL_COLORS: Record<number, string> = {
  1: "#374151",
  2: "#4B5563",
  3: "#1D4ED8",
  4: "#2563EB",
  5: "#4F46E5",
  6: "#7C3AED",
  7: "#8B5CF6",
  8: "#A78BFA",
  9: "#F59E0B",
  10: "#FBBF24",
};

const BRANCH_ICONS: Record<string, string> = {
  Engineering: "⚙️",
  "AI / ML": "🤖",
  Product: "🎯",
  Design: "🎨",
  "Soft Skills": "🌟",
};

interface SkillEntry {
  id: string;
  name: string;
  icon: string;
  maxLevel: number;
  branchName: string;
  branchColor: string;
  currentLevel: number;
  xp: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return new Response("Missing username", { status: 400 });
  }

  let displayName = username;
  let avatarEmoji = "🧑";
  let totalXp = 0;
  let totalSkillCount = 0;
  let topSkills: SkillEntry[] = [];

  try {
    const dbProfile = await prisma.profile.findUnique({
      where: { username },
      include: {
        skills: {
          include: { skill: { include: { branch: true } } },
          orderBy: { currentLevel: "desc" },
        },
      },
    });

    if (dbProfile && dbProfile.privacy !== "private") {
      displayName = dbProfile.displayName ?? username;
      avatarEmoji = dbProfile.avatarEmoji ?? "🧑";
      totalXp = dbProfile.totalXp;
      totalSkillCount = dbProfile.skills.length;
      topSkills = dbProfile.skills.slice(0, 8).map((s) => ({
        id: s.skillId,
        name: s.skill.name,
        icon: s.skill.icon ?? "⭐",
        maxLevel: s.skill.maxLevel,
        branchName: s.skill.branch.name,
        branchColor: s.skill.branch.color ?? "#6366f1",
        currentLevel: s.currentLevel,
        xp: s.xp,
      }));
    } else {
      throw new Error("not in DB");
    }
  } catch {
    const profile = getProfile(username);
    if (!profile) {
      return new Response("Profile not found", { status: 404 });
    }
    if (profile.privacy === "private") {
      return new Response("Profile not found", { status: 404 });
    }

    displayName = profile.displayName;
    avatarEmoji = profile.avatarEmoji;
    totalXp = profile.totalXp;
    totalSkillCount = profile.skills.length;

    const profileSkills = getProfileSkills(profile);
    topSkills = profileSkills
      .sort((a, b) => b.record.currentLevel - a.record.currentLevel)
      .slice(0, 8)
      .map(({ skill, record, branch }) => ({
        id: skill.id,
        name: skill.name,
        icon: skill.icon,
        maxLevel: skill.maxLevel,
        branchName: branch.name,
        branchColor: branch.color,
        currentLevel: record.currentLevel,
        xp: record.xp,
      }));
  }

  // Domain distribution (from top 8 displayed skills)
  const domainMap: Record<string, { name: string; count: number; color: string }> = {};
  for (const s of topSkills) {
    if (!domainMap[s.branchName]) {
      domainMap[s.branchName] = { name: s.branchName, count: 0, color: s.branchColor };
    }
    domainMap[s.branchName].count++;
  }
  const topDomains = Object.values(domainMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const avgLevel =
    topSkills.length > 0
      ? (topSkills.reduce((s, sk) => s + sk.currentLevel, 0) / topSkills.length).toFixed(1)
      : "0";

  // Layout: 3-column grid for skills (up to 6 shown, 8 fetched)
  const displaySkills = topSkills.slice(0, 6);

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

        {/* Top-right electric blue glow */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "450px",
            height: "450px",
            background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Bottom-left purple glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
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
        <div style={{ display: "flex", flex: 1, padding: "28px 44px 0 44px", gap: "32px" }}>
          {/* Left: profile + skills grid */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Profile row */}
            <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "20px" }}>
              {/* Avatar */}
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "rgba(14,165,233,0.08)",
                  border: "2px solid rgba(14,165,233,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "38px",
                  flexShrink: 0,
                }}
              >
                {avatarEmoji}
              </div>

              {/* Name + handle */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ color: "#ffffff", fontSize: "26px", fontWeight: "700", lineHeight: "1" }}>
                  {displayName}
                </span>
                <span style={{ color: "#0ea5e9", fontSize: "15px" }}>@{username}</span>
              </div>

              {/* Stats inline */}
              <div style={{ display: "flex", gap: "20px", marginLeft: "auto" }}>
                {[
                  { label: "Total XP", value: totalXp.toLocaleString() },
                  { label: "Skills", value: String(totalSkillCount) },
                  { label: "Avg Level", value: avgLevel },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "2px",
                    }}
                  >
                    <span style={{ color: "#0ea5e9", fontSize: "22px", fontWeight: "700" }}>
                      {stat.value}
                    </span>
                    <span style={{ color: "#475569", fontSize: "11px" }}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "rgba(14,165,233,0.12)",
                marginBottom: "16px",
              }}
            />

            {/* Skills grid label */}
            <span
              style={{
                color: "#475569",
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Top Skills
            </span>

            {/* Skills grid — 3 cols × 2 rows */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {displaySkills.map((skill) => {
                const levelColor = LEVEL_COLORS[skill.currentLevel] || "#374151";
                return (
                  <div
                    key={skill.id}
                    style={{
                      width: "244px",
                      background: "rgba(14,165,233,0.04)",
                      border: "1px solid rgba(14,165,233,0.12)",
                      borderLeft: `3px solid ${levelColor}`,
                      borderRadius: "10px",
                      padding: "10px 12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {/* Skill name + icon + level badge */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "18px" }}>{skill.icon}</span>
                        <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: "600" }}>
                          {skill.name}
                        </span>
                      </div>
                      <span
                        style={{
                          background: levelColor,
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "20px",
                        }}
                      >
                        Lv.{skill.currentLevel}
                      </span>
                    </div>

                    {/* Branch label */}
                    <span style={{ color: "#475569", fontSize: "11px" }}>{skill.branchName}</span>

                    {/* Level progress pips */}
                    <div style={{ display: "flex", gap: "3px" }}>
                      {Array.from({ length: Math.min(skill.maxLevel, 10) }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: "4px",
                            borderRadius: "2px",
                            background: i < skill.currentLevel ? levelColor : "rgba(30,41,59,0.8)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: domain distribution */}
          <div
            style={{
              width: "240px",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Domain card */}
            <div
              style={{
                background: "rgba(14,165,233,0.05)",
                border: "1px solid rgba(14,165,233,0.15)",
                borderRadius: "14px",
                padding: "18px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span
                style={{
                  color: "#475569",
                  fontSize: "11px",
                  fontWeight: "600",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Top Domains
              </span>
              {topDomains.map((d) => (
                <div
                  key={d.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: "1px solid rgba(14,165,233,0.07)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "14px" }}>{BRANCH_ICONS[d.name] ?? "📚"}</span>
                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>{d.name}</span>
                  </div>
                  <span
                    style={{
                      background: "rgba(14,165,233,0.1)",
                      color: "#0ea5e9",
                      fontSize: "12px",
                      fontWeight: "700",
                      padding: "2px 8px",
                      borderRadius: "10px",
                    }}
                  >
                    ×{d.count}
                  </span>
                </div>
              ))}
            </div>

            {/* Skill count summary */}
            <div
              style={{
                background: "rgba(124,58,237,0.06)",
                border: "1px solid rgba(124,58,237,0.2)",
                borderRadius: "14px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={{ color: "#8B5CF6", fontSize: "36px", fontWeight: "800" }}>
                {totalSkillCount}
              </span>
              <span style={{ color: "#6B7280", fontSize: "13px" }}>skills mapped</span>
              <span style={{ color: "#A78BFA", fontSize: "22px", fontWeight: "700", marginTop: "4px" }}>
                {totalXp.toLocaleString()}
              </span>
              <span style={{ color: "#6B7280", fontSize: "11px" }}>total XP</span>
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
            marginTop: "16px",
          }}
        >
          <span style={{ color: "#0ea5e9", fontSize: "15px", fontWeight: "600" }}>
            My AI-era skill map
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

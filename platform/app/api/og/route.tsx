import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import {
  getProfile,
  getProfileSkills,
} from "@/lib/seed-data";

export const runtime = "edge";

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return new Response("Missing username", { status: 400 });
  }

  const profile = getProfile(username);
  if (!profile) {
    return new Response("Profile not found", { status: 404 });
  }

  const profileSkills = getProfileSkills(profile);
  const top3 = [...profileSkills]
    .sort((a, b) => b.record.currentLevel - a.record.currentLevel)
    .slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #030712 0%, #0F172A 50%, #0D0B1E 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Header: avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(139,92,246,0.2)",
              border: "2px solid rgba(139,92,246,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            {profile.avatarEmoji}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#FFFFFF", fontSize: "32px", fontWeight: "700", lineHeight: "1" }}>
              {profile.displayName}
            </span>
            <span style={{ color: "#6B7280", fontSize: "18px", marginTop: "6px" }}>
              @{profile.username}
            </span>
          </div>
          <div
            style={{
              marginLeft: "auto",
              background: "rgba(139,92,246,0.15)",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: "12px",
              padding: "8px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#A78BFA", fontSize: "28px", fontWeight: "700" }}>
              {profile.totalXp.toLocaleString()}
            </span>
            <span style={{ color: "#6B7280", fontSize: "13px" }}>Total XP</span>
          </div>
        </div>

        {/* Top skills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0px", flex: 1 }}>
          <span style={{ color: "#4B5563", fontSize: "13px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
            Top Skills
          </span>
          <div style={{ display: "flex", gap: "16px" }}>
            {top3.map(({ skill, record }) => {
              const levelColor = LEVEL_COLORS[record.currentLevel] || "#374151";
              const levelLabel = `Lv.${record.currentLevel}`;
              return (
                <div
                  key={skill.id}
                  style={{
                    flex: 1,
                    background: "rgba(17,24,39,0.8)",
                    border: "1px solid rgba(55,65,81,0.8)",
                    borderRadius: "16px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "28px" }}>{skill.icon}</span>
                      <span style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: "600" }}>{skill.name}</span>
                    </div>
                    <div
                      style={{
                        background: levelColor,
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: "700",
                        padding: "4px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      {levelLabel}
                    </div>
                  </div>
                  {/* Level bar */}
                  <div style={{ display: "flex", gap: "4px" }}>
                    {Array.from({ length: skill.maxLevel }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: "6px",
                          borderRadius: "3px",
                          background: i < record.currentLevel ? levelColor : "rgba(55,65,81,0.6)",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ color: "#6B7280", fontSize: "14px" }}>
                    {record.xp.toLocaleString()} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brand lockup bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "60px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "24px" }}>🌳</span>
          <span style={{ color: "#374151", fontSize: "16px", fontWeight: "600" }}>
            SkillTree · futurelabs.vip
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

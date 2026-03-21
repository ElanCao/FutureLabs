/**
 * Serializes a Prisma Profile (with nested relations) into the
 * skilltree.schema.json-compliant Profile shape.
 */
import type { Profile, UserSkillRecord, EvidenceRecord, Skill } from "@prisma/client";

type FullSkillRecord = UserSkillRecord & {
  evidenceRecords: EvidenceRecord[];
  skill: Skill;
};

type FullProfile = Profile & {
  skillRecords: FullSkillRecord[];
};

export function serializeProfile(profile: FullProfile) {
  return {
    id: profile.id,
    username: profile.username,
    display_name: profile.displayName ?? undefined,
    bio: profile.bio ?? undefined,
    avatar_url: profile.avatarUrl ?? undefined,
    entity_type: profile.entityType,
    privacy: profile.privacy,
    total_xp: profile.totalXp,
    created_at: profile.createdAt.toISOString(),
    skills: profile.skillRecords.map((r) => ({
      skill_id: r.skillId,
      current_level: r.currentLevel,
      xp: r.xp,
      unlocked_at: r.unlockedAt?.toISOString(),
      last_leveled_at: r.lastLeveledAt?.toISOString(),
      evidence: r.evidenceRecords.map((e) => ({
        type: e.type,
        title: e.title ?? undefined,
        url: e.url ?? undefined,
        description: e.description ?? undefined,
        verified: e.verified,
        created_at: e.createdAt.toISOString(),
      })),
    })),
  };
}

-- AlterTable: Add skill taxonomy metadata fields
ALTER TABLE "Skill" ADD COLUMN "subDomain" TEXT;
ALTER TABLE "Skill" ADD COLUMN "workRelevant" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Skill" ADD COLUMN "lifeSkill" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Skill" ADD COLUMN "verifiable" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Skill" ADD COLUMN "trending" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Skill" ADD COLUMN "localizationTags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

/**
 * GET /api/v1/schema — public SkillTree JSON schema (machine-readable)
 * Returns the open SkillTree Schema v1.0 for AI agents and developers.
 */
import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// Cache the schema at module load time
let schemaCache: object | null = null;

function loadSchema(): object {
  if (schemaCache) return schemaCache;
  try {
    const schemaPath = join(process.cwd(), "schemas", "skilltree.schema.json");
    const raw = readFileSync(schemaPath, "utf-8");
    schemaCache = JSON.parse(raw);
    return schemaCache!;
  } catch {
    // Inline minimal fallback if file unreadable at runtime
    return {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "https://futurelabs.vip/api/v1/schema",
      title: "SkillTree Schema",
      version: "1.0.0",
      description: "Open, machine-readable schema for human and AI agent skill trees.",
    };
  }
}

export async function GET() {
  const schema = loadSchema();
  return NextResponse.json(schema, {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

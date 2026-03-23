"use client";

import dynamic from "next/dynamic";
import type { SkillInput } from "@/app/components/SkillTreeGraph";

const SkillTreeGraph = dynamic(() => import("@/app/components/SkillTreeGraph"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-gray-500 text-sm bg-gray-950">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-pulse">🗺️</div>
        <p>Loading path map…</p>
      </div>
    </div>
  ),
});

interface Props {
  skills: SkillInput[];
  pathName: string;
}

export default function PathTreeClient({ skills }: Props) {
  return (
    <div className="h-full">
      <SkillTreeGraph skills={skills} userSkills={[]} />
    </div>
  );
}

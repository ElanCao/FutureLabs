import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import PathTreeClient from "./PathTreeClient";
import { PATH_TEMPLATES, PATH_SKILL_NAMES } from "@/lib/skill-paths";
import { BRANCH_COLORS } from "@/lib/branch-colors";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return PATH_TEMPLATES.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = PATH_TEMPLATES.find((p) => p.id === params.slug);
  if (!path) return { title: "Not Found" };
  return {
    title: `${path.name} Path · SkillTree`,
    description: `${path.description} ${path.skills.length} skills mapped in an interactive skill tree.`,
    alternates: { canonical: `/paths/${path.id}` },
    openGraph: {
      title: `${path.name} Career Path`,
      description: path.tagline,
    },
  };
}

export default function PathPage({ params }: Props) {
  const path = PATH_TEMPLATES.find((p) => p.id === params.slug);
  if (!path) notFound();

  // Build skill nodes for this path
  const skills = path.skills.map((skillId) => {
    const meta = PATH_SKILL_NAMES[skillId];
    return {
      id: skillId,
      name: meta?.name ?? skillId,
      icon: meta?.icon ?? "⭐",
      branch: meta?.branch ?? "engineering",
      maxLevel: 10,
      parentSkillId: null as string | null,
      prerequisites: path.edges
        .filter(([, to]) => to === skillId)
        .map(([from]) => from),
    };
  });

  // Set first prerequisite as parentSkillId for dagre layout
  for (const skill of skills) {
    if (skill.prerequisites.length > 0) {
      skill.parentSkillId = skill.prerequisites[0];
    }
  }

  const uniqueBranches = skills.map((s) => s.branch).filter((b, i, arr) => arr.indexOf(b) === i);
  const branches = uniqueBranches.map((branchId) => ({
    id: branchId,
    color: BRANCH_COLORS[branchId] ?? "#6b7280",
    count: skills.filter((s) => s.branch === branchId).length,
  }));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Nav />

      {/* Hero */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            <div className="text-5xl">{path.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Link href="/paths" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
                  ← All paths
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{path.name}</h1>
              <p className="text-gray-400 max-w-2xl">{path.description}</p>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-sm text-gray-500">{path.skills.length} skills</span>
                <span className="text-gray-700">·</span>
                {branches.map((b) => (
                  <span
                    key={b.id}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: `${b.color}22`, color: b.color }}
                  >
                    {b.count} {b.id.replace("_", "/")}
                  </span>
                ))}
                <Link
                  href="/signin"
                  className="ml-auto text-sm bg-violet-600 hover:bg-violet-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Start this path →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive tree */}
      <div style={{ height: "calc(100vh - 280px)", minHeight: 400 }}>
        <PathTreeClient skills={skills} pathName={path.name} />
      </div>

      {/* SEO content */}
      <section className="border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold text-white mb-6">Skills in this path</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {path.skills.map((skillId, i) => {
              const meta = PATH_SKILL_NAMES[skillId];
              return (
                <div key={skillId} className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3">
                  <span className="text-xl">{meta?.icon ?? "⭐"}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{meta?.name ?? skillId}</div>
                    <div className="text-xs text-gray-500">Step {i + 1}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 bg-violet-900/20 border border-violet-800 rounded-2xl p-6 text-center">
            <p className="text-white font-semibold mb-2">Track your progress on this path</p>
            <p className="text-gray-400 text-sm mb-4">
              Create your free skills passport and map your journey to {path.name}.
            </p>
            <Link
              href="/signin?mode=register"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              🌳 Create your skill tree
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

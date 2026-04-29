import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://futurelabs.vip";

export const metadata: Metadata = {
  title: "What We Learned Shipping 520+ Skills — FutureLabs Blog",
  description:
    "Behind the scenes of building SkillTree's taxonomy: five lessons from mapping 520+ skills across 20 domains.",
  alternates: {
    canonical: "/blog/shipping-520-skills",
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "What We Learned Shipping 520+ Skills",
  description:
    "Behind the scenes of building SkillTree's taxonomy: five lessons from mapping 520+ skills across 20 domains.",
  datePublished: "2026-05-05",
  dateModified: "2026-05-05",
  url: `${SITE_URL}/blog/shipping-520-skills`,
  author: {
    "@type": "Organization",
    name: "FutureLabs",
  },
  publisher: {
    "@type": "Organization",
    name: "FutureLabs",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/futurelabs-logo.svg`,
    },
  },
};

export default function BlogPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      {/* Header */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300">
              Product
            </span>
            <span className="text-xs text-slate-400">May 5, 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-balance">
            What We Learned Shipping 520+ Skills
          </h1>
          <p className="mt-4 text-slate-300 text-lg text-balance">
            Behind the scenes of building a taxonomy that actually reflects how engineers grow
          </p>
        </div>
      </section>

      {/* Hero Illustration — Skill DAG */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
              </marker>
            </defs>
            {/* Edges */}
            <line x1="120" y1="80" x2="240" y2="60" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="120" y1="80" x2="240" y2="140" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="120" y1="200" x2="240" y2="140" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="120" y1="200" x2="240" y2="220" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="360" y1="60" x2="480" y2="80" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="360" y1="140" x2="480" y2="80" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="360" y1="140" x2="480" y2="200" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="360" y1="220" x2="480" y2="200" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="600" y1="80" x2="660" y2="140" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="600" y1="200" x2="660" y2="140" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
            {/* Nodes */}
            <circle cx="120" cy="80" r="32" fill="#4f46e5" />
            <text x="120" y="84" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="system-ui">Python</text>
            <circle cx="120" cy="200" r="32" fill="#4f46e5" />
            <text x="120" y="204" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="system-ui">JavaScript</text>
            <circle cx="300" cy="60" r="32" fill="#6366f1" />
            <text x="300" y="64" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="system-ui">pandas</text>
            <circle cx="300" cy="140" r="32" fill="#6366f1" />
            <text x="300" y="144" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="system-ui">React</text>
            <circle cx="300" cy="220" r="32" fill="#6366f1" />
            <text x="300" y="224" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="system-ui">Node.js</text>
            <circle cx="540" cy="80" r="32" fill="#818cf8" />
            <text x="540" y="84" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="system-ui">scikit</text>
            <circle cx="540" cy="200" r="32" fill="#818cf8" />
            <text x="540" y="204" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="system-ui">Next.js</text>
            <circle cx="660" cy="140" r="40" fill="#312e81" />
            <text x="660" y="137" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="system-ui">MLOps /</text>
            <text x="660" y="151" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="system-ui">Full Stack</text>
            {/* Caption */}
            <text x="360" y="270" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="system-ui">A directed acyclic graph: prerequisites flow left to right, unlocking advanced skills</text>
          </svg>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-slate prose-lg">
          <p className="lead text-xl text-slate-600">
            Six months ago, we set out to answer a deceptively simple question: <strong>what skills should SkillTree track?</strong> Today, our taxonomy covers 520+ skills across 20 domains. The journey taught us more about how engineers actually learn than any framework or methodology ever could.
          </p>

          <p>
            This is not a victory lap. It is a field report from the messy middle of building a <Link href="/blog/building-skill-taxonomy">comprehensive skill taxonomy</Link>—the mistakes we made, the assumptions we abandoned, and the principles that emerged once we stopped trying to be clever and started listening to the data.
          </p>

          <h2>The Wrong Way to List Skills</h2>

          <p>
            Most professional platforms treat skills as tags. LinkedIn lets you add &quot;Python&quot; or &quot;Project Management&quot; to your profile, but there is no structure—no sense of how these skills relate, what they unlock, or how they evolve. It is a flat list that tells you what someone has touched, not what they can actually do.
          </p>

          <p>
            Flat lists break when AI enters the picture. Does &quot;Python&quot; mean writing scripts or designing distributed systems? Does &quot;React&quot; mean reading docs or shipping production apps at scale? A tag cannot capture that nuance. We needed something richer: a structured taxonomy that models relationships, prerequisites, and growth paths.
          </p>

          <p>
            We started by scraping job boards, course catalogs, GitHub topics, and existing competency frameworks. We quickly realized everyone categorizes differently. LinkedIn uses &quot;Industry Knowledge.&quot; O*NET uses occupational clusters. GitHub uses repository tags. None of them model <em>relationships</em>. JavaScript is not a sibling of React—it is a prerequisite.
          </p>

          <h2>Lesson 1: DAG, Not Tree</h2>

          <p>
            Our first instinct was a tree: each skill has one parent, and the world organizes neatly into hierarchies. That lasted about three days. In reality, a skill can have multiple prerequisites. CSS feeds into Tailwind CSS <em>and</em> Styled Components. JavaScript leads to React <em>and</em> Vue.
          </p>

          <p>
            We switched to a directed acyclic graph (DAG). No cycles allowed—if skill A leads to B, B should not lead back to A. This mirrors how learning actually works: you build foundations, then advanced concepts, then expertise. Each edge carries a weight: &quot;core prerequisite&quot; versus &quot;nice to have.&quot;
          </p>

          <p>
            The DAG structure is what lets SkillTree answer questions like &quot;What should I learn next?&quot; or &quot;Which skills are transferable from backend to MLOps?&quot; A tree would have forced us into arbitrary hierarchies that do not reflect reality.
          </p>

          <h2>Lesson 2: Skill Inflation Is Real</h2>

          <p>
            Early in the process, we noticed a pattern: people claim skills they do not actually possess. &quot;Full Stack&quot; is not a skill—it is a role. &quot;Kubernetes&quot; on a resume could mean anything from &quot;I read the docs&quot; to &quot;I debugged a failing pod at 2 AM during an outage.&quot;
          </p>

          <p>
            We solved this by separating <strong>capabilities</strong> (what you can do) from <strong>technologies</strong> (what you use). A capability: &quot;Design a RESTful API.&quot; A technology: &quot;FastAPI.&quot; An agent can design a RESTful API without caring whether you use FastAPI or Express. This distinction is critical for AI collaboration, where the capability matters more than the specific tool.
          </p>

          <p>
            We also built three verification layers. Self-assessment with guided rubrics prevents the Dunning-Kruger effect. Project links (GitHub repos, deployed apps) provide proof of work. Peer endorsements work best when they are specific: &quot;Shipped a zero-downtime Kubernetes migration&quot; is stronger than &quot;Great at K8s.&quot;
          </p>

          <h2>Lesson 3: Relationships Matter More Than Labels</h2>

          <p>
            We spent more time on edge logic than on node labels. The taxonomy is only useful if it answers real questions. A label like &quot;Machine Learning&quot; is meaningless without context: does it unlock Deep Learning? Is it a prerequisite for MLOps? Does it complement Data Engineering?
          </p>

          <p>
            We defined three relationship types. <strong>Prerequisite edges</strong> show what you need first: Python → pandas → scikit-learn. <strong>Unlock edges</strong> show what becomes possible: React → Next.js (App Router). <strong>Complementary edges</strong> show what works together: GraphQL ↔ Apollo Client.
          </p>

          <p>
            The hard part was not the top-level domains—it was the level-3 granularity where most resumes live. &quot;Machine Learning&quot; → &quot;Deep Learning&quot; → &quot;Transformer Architectures&quot; → &quot;Attention Mechanisms.&quot; That depth is where the real insight lives.
          </p>

          <h2>Lesson 4: Community Input Beats Top-Down Classification</h2>

          <p>
            We started with an expert-curated list. It was wrong. Developers disagreed on prerequisites. &quot;Do you need TypeScript before GraphQL?&quot; Opinions vary. &quot;Is Docker a prerequisite for Kubernetes?&quot; Some say yes, others say you can learn them in parallel.
          </p>

          <p>
            Our solution: crowdsource edge votes, weight by confidence, and surface disputed edges. When the community disagrees, we show both paths. The taxonomy becomes a living consensus rather than a dictate from above. This approach aligns with how <a href="https://en.wikipedia.org/wiki/Wiki" target="_blank" rel="noopener noreferrer">wiki-style systems</a> achieve accuracy through iteration and collective intelligence.
          </p>

          <h2>Lesson 5: The Taxonomy Is Alive</h2>

          <p>
            New skills emerge monthly. We added &quot;LLM Prompt Engineering&quot; in Q1. We added &quot;MCP (Model Context Protocol)&quot; in Q2. The graph must version. We snapshot quarterly but allow real-time edge additions. Deprecation is as important as addition: &quot;jQuery&quot; is not dead, but it is a different kind of node now.
          </p>

          <p>
            This dynamism is why static skill lists fail. A 2024 list of top skills is already obsolete in 2026. The <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/" target="_blank" rel="noopener noreferrer">World Economic Forum estimates</a> that 39% of core job skills will change by 2030. A living taxonomy is not a luxury—it is a necessity.
          </p>

          <h2>What This Means for Your Career</h2>

          <p>
            A skill graph is not a vanity metric. It is a decision tool. For individuals, it finds the shortest path from &quot;where you are&quot; to &quot;where you want to be.&quot; For managers, it visualizes team coverage and identifies single points of failure. For AI agents, it is a structured, machine-readable capability description.
          </p>

          <p>
            We are releasing the <Link href="/blog/open-skilltree-schema">Open SkillTree Schema</Link> (SKILL.md) so anyone can export their skill graph, import it into another tool, or contribute edges. The goal is simple: make skill data portable, like a resume—but structured.
          </p>

          <h2>The Road Ahead</h2>

          <p>
            520 skills is a starting point, not a ceiling. We are expanding into soft skills, creative disciplines, and cross-domain hybrids. We are refining our verification models. And we are building the APIs that will let AI agents read and reason about human skill graphs at scale.
          </p>

          <p>
            The most exciting part is not the number. It is the pattern: when users see their skills mapped in SkillTree, something clicks. The visualization matches their mental model of growth. They see not just what they know, but what they could learn next. Good infrastructure is invisible. It just works.
          </p>

          <hr />

          <p className="text-slate-600">
            Want to see how your skills fit into this taxonomy?{" "}
            <Link
              href="/contact"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create your SkillTree profile
            </Link>{" "}
            and visualize your growth. Or open a PR to contribute skills or edges on{" "}
            <a href="https://github.com/ElanCao/FutureLabs" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-medium">GitHub</a>.
          </p>
        </div>
      </article>
    </>
  );
}

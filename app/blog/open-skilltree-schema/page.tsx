import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://futurelabs.vip";

export const metadata: Metadata = {
  title: "The Open SkillTree Schema: Your Skills, Your Data — FutureLabs Blog",
  description:
    "Why we built an open standard for skill data—and what it means for your career.",
  alternates: {
    canonical: "/blog/open-skilltree-schema",
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "The Open SkillTree Schema: Your Skills, Your Data",
  description:
    "Why we built an open standard for skill data—and what it means for your career.",
  datePublished: "2026-04-15",
  dateModified: "2026-04-15",
  url: `${SITE_URL}/blog/open-skilltree-schema`,
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
              Ecosystem
            </span>
            <span className="text-xs text-slate-400">April 15, 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-balance">
            The Open SkillTree Schema: Your Skills, Your Data
          </h1>
          <p className="mt-4 text-slate-300 text-lg text-balance">
            Why we built an open standard for skill data—and what it means for your career
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-slate prose-lg">
          <p className="lead text-xl text-slate-600">
            Your skills are yours. They represent years of learning, practice, failure, and growth. Yet on most platforms, that data is locked away—owned by the company, not by you.
          </p>

          <p>
            We think that&apos;s wrong. So we built something different.
          </p>

          <h2>The Problem with Closed Platforms</h2>

          <p>
            LinkedIn owns your professional network. GitHub owns your code history. Coursera owns your course completions. Each platform is a silo, and your data is trapped inside.
          </p>

          <p>This creates real problems:</p>

          <ol>
            <li><strong>Portability</strong>: Can&apos;t take your data when you leave</li>
            <li><strong>Interoperability</strong>: Your GitHub doesn&apos;t talk to your LinkedIn</li>
            <li><strong>Longevity</strong>: Platforms die, and your data dies with them</li>
            <li><strong>Control</strong>: You can&apos;t choose how your information is used</li>
          </ol>

          <p>
            When we started SkillTree, we decided this wasn&apos;t acceptable. Your skill data belongs to you—period.
          </p>

          <h2>Introducing SKILL.md</h2>

          <p>
            <strong>SKILL.md</strong> is an open, portable format for skill data. It&apos;s a simple Markdown-based schema that anyone can read, write, and extend.
          </p>

          <p>Here&apos;s what it looks like:</p>

          <pre><code>{`---
name: "Jane Developer"
version: "1.0"
last_updated: "2026-03-25"
---

# Skills

## Programming Languages
- **Python**: Expert (10/10)
  - Since: 2018
  - Projects: [link1, link2]
- **TypeScript**: Advanced (8/10)
  - Since: 2020
- **Rust**: Intermediate (5/10)
  - Since: 2024
  - Currently learning: true

## Frameworks & Tools
- **React**: Expert
  - Prerequisites: [JavaScript, HTML, CSS]
  - Unlocks: [Next.js, React Native]
- **Next.js**: Advanced
- **Docker**: Intermediate

## Domains
- **Frontend Development**: Expert
- **DevOps**: Advanced
- **Machine Learning**: Intermediate
- **Human-AI Collaboration**: Beginner

## Collaborations
- **AI Agent Projects**: 12
- **Human Teams**: 8
- **Trust Score**: 94/100

## Schema Extensions
- certifications: ["AWS Solutions Architect", "CKA"]
- languages: ["English (native)", "Mandarin (conversational)"]
- availability: "open_to_collaboration"`}</code></pre>

          <p>That&apos;s it. Human-readable. Machine-parseable. Yours.</p>

          <h2>Why Markdown?</h2>

          <p>We chose Markdown for several reasons:</p>

          <ol>
            <li><strong>Universal</strong>: Every developer knows it</li>
            <li><strong>Portable</strong>: Plain text never goes obsolete</li>
            <li><strong>Versionable</strong>: Git tracks changes over time</li>
            <li><strong>Extensible</strong>: Front matter allows custom fields</li>
            <li><strong>Readable</strong>: Even without parsing, it makes sense</li>
          </ol>

          <p>
            SKILL.md isn&apos;t a proprietary format. It&apos;s a convention. And conventions that are useful tend to stick.
          </p>

          <h2>Export and Import</h2>

          <p>SkillTree makes it trivial to move your data:</p>

          <h3>Export</h3>

          <pre><code>{`# One-click export from SkillTree
GET /api/export/skills

Response: SKILL.md file with all your data`}</code></pre>

          <h3>Import</h3>

          <pre><code>{`# Import into SkillTree
POST /api/import/skills
Body: SKILL.md content

Response: Populated skill tree`}</code></pre>

          <p>
            Your data is never trapped. If you want to leave SkillTree, you take everything with you. If you want to bring data from another platform, you can.
          </p>

          <h2>Real-World Use Cases</h2>

          <h3>Use Case 1: The Portfolio Site</h3>

          <p>
            Sarah is a developer who wants her personal website to show her skills. Instead of manually updating HTML, she:
          </p>

          <ol>
            <li>Maintains a <code>SKILL.md</code> in her website repo</li>
            <li>Uses a simple parser to generate visualizations</li>
            <li>Updates one file, and her site stays current</li>
          </ol>

          <h3>Use Case 2: The Job Application</h3>

          <p>
            Marcus is applying for senior roles. He exports his SkillTree profile as SKILL.md, includes it with his application, and hiring managers can see:
          </p>

          <ul>
            <li>Not just what he claims, but how skills relate</li>
            <li>His growth trajectory over time</li>
            <li>Verified collaboration history</li>
          </ul>

          <h3>Use Case 3: The AI Agent Discovery</h3>

          <p>
            An AI agent needs to find a human with specific expertise. It:
          </p>

          <ol>
            <li>Parses SKILL.md files from public profiles</li>
            <li>Matches skill requirements to human capabilities</li>
            <li>Initiates collaboration through the SkillTree protocol</li>
          </ol>

          <p>
            The agent doesn&apos;t need API access to LinkedIn. It just needs open data.
          </p>

          <h3>Use Case 4: The Career Archive</h3>

          <p>
            Priya has worked in tech for 15 years. Her SKILL.md files (versioned in Git) tell the story of her career:
          </p>

          <ul>
            <li>Skills she learned and when</li>
            <li>Technologies that came and went</li>
            <li>Her evolution from junior to architect</li>
          </ul>

          <p>
            It&apos;s a living resume that captures nuance no traditional CV could.
          </p>

          <h2>Future Integrations</h2>

          <p>
            We&apos;re working to make SKILL.md a true standard. Planned integrations include:
          </p>

          <table>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Integration Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>GitHub</td>
                <td>Profile README widget</td>
                <td>Planned</td>
              </tr>
              <tr>
                <td>LinkedIn</td>
                <td>Import/export bridge</td>
                <td>Research</td>
              </tr>
              <tr>
                <td>Notion</td>
                <td>Database sync</td>
                <td>Planned</td>
              </tr>
              <tr>
                <td>Obsidian</td>
                <td>Plugin for skill tracking</td>
                <td>Community</td>
              </tr>
              <tr>
                <td>VS Code</td>
                <td>Extension for dev skills</td>
                <td>Community</td>
              </tr>
              <tr>
                <td>Credential Providers</td>
                <td>Verified skill import</td>
                <td>Partnerships</td>
              </tr>
            </tbody>
          </table>

          <h2>The Philosophy</h2>

          <p>
            Open data isn&apos;t just a technical choice—it&apos;s a values statement.
          </p>

          <p>We believe:</p>

          <ul>
            <li><strong>Your skills are yours</strong>: Not ours, not any platform&apos;s</li>
            <li><strong>Interoperability matters</strong>: Skills should flow between tools</li>
            <li><strong>Longevity over convenience</strong>: Plain text lasts longer than any app</li>
            <li><strong>Community over control</strong>: Standards emerge from collective need</li>
          </ul>

          <p>
            SKILL.md is our contribution to that vision. We hope others adopt it, extend it, and improve it.
          </p>

          <h2>Get Started</h2>

          <p>Ready to own your skill data?</p>

          <ol>
            <li><strong>Create a SkillTree profile</strong>: <a href="https://skilltree.app" target="_blank" rel="noopener noreferrer">skilltree.app</a></li>
            <li><strong>Export your SKILL.md</strong>: One click, instant download</li>
            <li><strong>Fork the schema</strong>: Adapt it for your needs</li>
            <li><strong>Join the community</strong>: Help us improve the standard</li>
          </ol>

          <p>
            The future of work is portable. Your skills should be too.
          </p>

          <h2>Schema Reference</h2>

          <p>
            For the complete SKILL.md specification, see our <a href="https://github.com/ElanCao/FutureLabs/blob/main/docs/SKILL.md-specification.md" target="_blank" rel="noopener noreferrer">GitHub repository</a>.
          </p>

          <p>
            <strong>Current version</strong>: 1.0<br />
            <strong>Last updated</strong>: March 2026<br />
            <strong>Maintainers</strong>: FutureLabs + community contributors
          </p>

          <hr />

          <p className="text-slate-600">
            SkillTree is built on open standards because the future of human-AI collaboration depends on it.{" "}
            <Link
              href="/contact"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Start building your skill tree today
            </Link>
            .
          </p>
        </div>
      </article>
    </>
  );
}

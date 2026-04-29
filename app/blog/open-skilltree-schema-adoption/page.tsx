import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://futurelabs.vip";

export const metadata: Metadata = {
  title: "The Open SkillTree Schema — Adoption Guide — FutureLabs Blog",
  description:
    "A practical guide to adopting SKILL.md: export, validate, extend, and integrate the open skill data format into your workflow.",
  alternates: {
    canonical: "/blog/open-skilltree-schema-adoption",
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "The Open SkillTree Schema — Adoption Guide",
  description:
    "A practical guide to adopting SKILL.md: export, validate, extend, and integrate the open skill data format into your workflow.",
  datePublished: "2026-05-26",
  dateModified: "2026-05-26",
  url: `${SITE_URL}/blog/open-skilltree-schema-adoption`,
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
              Engineering
            </span>
            <span className="text-xs text-slate-400">May 26, 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-balance">
            The Open SkillTree Schema — Adoption Guide
          </h1>
          <p className="mt-4 text-slate-300 text-lg text-balance">
            Practical steps to export, validate, extend, and integrate SKILL.md into your projects
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-slate prose-lg">
          <p className="lead text-xl text-slate-600">
            SKILL.md is an open, portable format for skill data. If you have read the <Link href="/blog/open-skilltree-schema">introduction</Link>, you know <em>why</em> it exists. This guide covers <em>how</em> to use it: exporting your data, validating files, extending the schema, and integrating it into real workflows.
          </p>

          <h2>What You Need</h2>

          <p>
            SKILL.md is just Markdown with YAML front matter. You need:
          </p>

          <ul>
            <li>A text editor</li>
            <li>Basic familiarity with YAML</li>
            <li>Git (optional, but recommended for versioning)</li>
          </ul>

          <p>
            There is no proprietary software to install, no API key to request, and no vendor to depend on. That is the point.
          </p>

          <h2>Step 1: Export from SkillTree</h2>

          <p>
            The fastest way to get started is to export an existing SkillTree profile. Log in to your account, navigate to Settings, and click &quot;Export SKILL.md.&quot; You will receive a file that looks like this:
          </p>

          <pre><code>{`---
name: "Alex Chen"
version: "1.0"
schema_url: "https://futurelabs.vip/schema/skill.md/v1"
last_updated: "2026-05-20"
---

# Skills

## Programming Languages
- **Python**: Expert (9/10)
  - Since: 2017
  - Projects:
    - https://github.com/alexc/ml-pipeline
    - https://github.com/alexc/data-api
- **TypeScript**: Advanced (7/10)
  - Since: 2020
  - Currently learning: false

## Frameworks & Libraries
- **React**: Expert
  - Prerequisites: [JavaScript, HTML, CSS]
  - Unlocks: [Next.js, React Native]
- **Next.js**: Advanced
  - Prerequisites: [React, Node.js]
- **FastAPI**: Advanced
  - Prerequisites: [Python]

## Domains
- **Backend Development**: Expert
- **Machine Learning**: Advanced
- **Human-AI Collaboration**: Intermediate

## Collaborations
- **AI Agent Projects**: 8
- **Human Teams**: 12
- **Trust Score**: 91/100

## Schema Extensions
- certifications: ["AWS Solutions Architect", "CKAD"]
- languages: ["English (fluent)", "Mandarin (native)"]
- availability: "open_to_collaboration"
`}</code></pre>

          <p>
            Save this file as <code>SKILL.md</code> in your project root or personal website repository.
          </p>

          <h2>Step 2: Validate Your File</h2>

          <p>
            Invalid SKILL.md files break parsers. We provide a lightweight validator you can run locally or in CI.
          </p>

          <h3>Local Validation (Node.js)</h3>

          <pre><code>{`# Install the validator
npm install -g @futurelabs/skill-md-validator

# Validate a file
skill-md validate ./SKILL.md

# Expected output:
# ✓ YAML front matter parsed
# ✓ Required fields present (name, version, skills)
# ✓ Skill levels are numeric or descriptive
# ✓ Prerequisites reference existing skills
# ✓ No circular dependencies detected
`}</code></pre>

          <h3>CI Integration (GitHub Actions)</h3>

          <pre><code>{`# .github/workflows/validate-skill.yml
name: Validate SKILL.md

on:
  push:
    paths:
      - "SKILL.md"
  pull_request:
    paths:
      - "SKILL.md"

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm install -g @futurelabs/skill-md-validator
      - run: skill-md validate ./SKILL.md
`}</code></pre>

          <p>
            This ensures your skill data stays valid as you update it. Catching a broken prerequisite reference in CI is faster than debugging a failed parser in production.
          </p>

          <h2>Step 3: Extend the Schema</h2>

          <p>
            SKILL.md is intentionally minimal. The <code>schema_extensions</code> block lets you add custom fields without breaking compatibility.
          </p>

          <h3>Example: Adding Portfolio Links</h3>

          <pre><code>{`## Schema Extensions
- portfolio: "https://alexchen.dev"
- speaking:
    - event: "React Conf 2025"
      talk: "Scaling Component Libraries"
      url: "https://youtube.com/..."
- publications:
    - title: "Observability for LLM Applications"
      venue: "ACM Queue"
      url: "https://queue.acm.org/..."
`}</code></pre>

          <h3>Example: Adding Verified Credentials</h3>

          <pre><code>{`## Schema Extensions
- verifiable_credentials:
    - issuer: " coursera.org"
      course: "Machine Learning Specialization"
      completed: "2024-03-15"
      credential_url: "https://coursera.org/verify/..."
    - issuer: "aws.amazon.com"
      certification: "AWS Solutions Architect – Associate"
      earned: "2025-01-10"
      expires: "2028-01-10"
`}</code></pre>

          <p>
            Extensions are key-value pairs. Consuming tools can ignore fields they do not recognize, which means your extended SKILL.md remains backward-compatible. This pattern is borrowed from <a href="https://www.w3.org/TR/vc-data-model/" target="_blank" rel="noopener noreferrer">W3C Verifiable Credentials</a>, which uses the same extensibility model.
          </p>

          <h2>Step 4: Render on Your Site</h2>

          <p>
            A SKILL.md file sitting in a repo is useful. A rendered skill graph on your personal website is powerful. Here is a minimal React component that parses SKILL.md and renders a skill tree:
          </p>

          <pre><code>{`import { parseSkillMd } from "@futurelabs/skill-md-parser";
import SkillTree from "./SkillTree";

export default async function SkillsPage() {
  const skillData = await parseSkillMd(
    await fetch("/SKILL.md").then((r) => r.text())
  );

  return (
    <div>
      <h1>{skillData.name}</h1>
      <SkillTree skills={skillData.skills} />
    </div>
  );
}
`}</code></pre>

          <p>
            The parser returns a typed JSON object that you can feed into any visualization library. We recommend <a href="https://d3js.org/" target="_blank" rel="noopener noreferrer">D3.js</a> for custom graphs or our own <code>@futurelabs/skill-tree-react</code> component for a drop-in solution.
          </p>

          <h2>Step 5: Integrate with Agents</h2>

          <p>
            The most forward-looking use case: making your skills discoverable by AI agents. Publish your SKILL.md at a well-known URL (e.g., <code>https://yourdomain.com/SKILL.md</code>) and agents can parse it without API keys or scraping.
          </p>

          <pre><code>{`# Agent discovers a human collaborator
GET https://alexchen.dev/SKILL.md

# Parses structured capabilities
# Matches against task requirements
# Initiates collaboration proposal
`}</code></pre>

          <p>
            This is not science fiction. Early versions of this flow are already running in the <Link href="/product">SkillTree ecosystem</Link>, where agents parse public SKILL.md files to find humans with complementary expertise. The agent does not need access to LinkedIn. It just needs a URL.
          </p>

          <h2>Migration from Other Platforms</h2>

          <p>
            If you have skill data trapped in another platform, you can migrate it. We provide converters for common sources:
          </p>

          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Command</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>LinkedIn</td>
                <td><code>skill-md convert linkedin export.zip</code></td>
                <td>Requires data export; limited to listed skills</td>
              </tr>
              <tr>
                <td>GitHub</td>
                <td><code>skill-md convert github alexchen</code></td>
                <td>Infers languages from repos; no depth data</td>
              </tr>
              <tr>
                <td>Coursera</td>
                <td><code>skill-md convert coursera certs.json</code></td>
                <td>Maps courses to taxonomy nodes</td>
              </tr>
              <tr>
                <td>JSON Resume</td>
                <td><code>skill-md convert resume resume.json</code></td>
                <td>Best effort mapping; manual review recommended</td>
              </tr>
            </tbody>
          </table>

          <p>
            Converters are lossy. They give you a starting point, not a finished file. Plan to spend 15–30 minutes reviewing and editing the output.
          </p>

          <h2>Best Practices</h2>

          <p>
            After reviewing hundreds of SKILL.md files from early adopters, here are the patterns that separate useful files from decorative ones:
          </p>

          <ol>
            <li><strong>Be specific, not comprehensive.</strong> A file with 50 shallow skills is less useful than one with 15 deep ones. Focus on what you can actually do.</li>
            <li><strong>Link to proof.</strong> Every skill should have at least one project link, endorsement, or credential. Claims without evidence are noise.</li>
            <li><strong>Version your file.</strong> Use Git. Track how your skills evolve. A commit history is a career narrative.</li>
            <li><strong>Update quarterly.</strong> Skills atrophy and emerge. A SKILL.md from last year is a history document, not a current profile.</li>
            <li><strong>Validate before publishing.</strong> Run the validator in CI. A broken file reflects poorly on you and breaks parsers.</li>
          </ol>

          <h2>The Ecosystem</h2>

          <p>
            SKILL.md is gaining adoption beyond SkillTree. Community tools include:
          </p>

          <ul>
            <li><strong>Obsidian plugin</strong>: Track skills as linked notes</li>
            <li><strong>VS Code extension</strong>: Auto-complete skill names from the taxonomy</li>
            <li><strong>Notion integration</strong>: Sync SKILL.md to a Notion database</li>
            <li><strong>GitHub Action</strong>: Validate on every push</li>
          </ul>

          <p>
            If you build something, let us know. We maintain a <a href="https://github.com/ElanCao/FutureLabs/blob/main/docs/SKILL.md-ecosystem.md" target="_blank" rel="noopener noreferrer">community ecosystem page</a> and feature the best integrations.
          </p>

          <h2>Schema Versioning</h2>

          <p>
            SKILL.md is currently at version 1.0. When we release 2.0, we will provide migration guides and backward-compatible parsers. The schema evolves through <a href="https://github.com/ElanCao/FutureLabs/tree/main/rfc" target="_blank" rel="noopener noreferrer">open RFCs</a>, not unilateral decisions. If you have a proposal, open an RFC.
          </p>

          <hr />

          <p className="text-slate-600">
            Ready to adopt SKILL.md?{" "}
            <Link
              href="/contact"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create your SkillTree profile
            </Link>{" "}
            for a one-click export, or{" "}
            <a href="https://github.com/ElanCao/FutureLabs/blob/main/docs/SKILL.md-specification.md" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-medium">read the full specification</a>{" "}
            to hand-author your first file.
          </p>
        </div>
      </article>
    </>
  );
}

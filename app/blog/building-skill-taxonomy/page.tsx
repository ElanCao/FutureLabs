import type { Metadata } from "next";
import Link from "next/link";
import WaitlistSignup from "../../components/WaitlistSignup";

const SITE_URL = "https://futurelabs.vip";

export const metadata: Metadata = {
  title: "Building a Skill Taxonomy: 520+ Skills and Counting — FutureLabs Blog",
  description:
    "How we mapped the landscape of human-AI collaboration. The story of building a comprehensive skill taxonomy.",
  alternates: {
    canonical: "/blog/building-skill-taxonomy",
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Building a Skill Taxonomy: 520+ Skills and Counting",
  description:
    "How we mapped the landscape of human-AI collaboration. The story of building a comprehensive skill taxonomy.",
  datePublished: "2026-04-08",
  dateModified: "2026-04-08",
  url: `${SITE_URL}/blog/building-skill-taxonomy`,
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
            <span className="text-xs text-slate-400">April 8, 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-balance">
            Building a Skill Taxonomy: 520+ Skills and Counting
          </h1>
          <p className="mt-4 text-slate-300 text-lg text-balance">
            How we mapped the landscape of human-AI collaboration
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-slate prose-lg">
          <p className="lead text-xl text-slate-600">
            When we started building SkillTree, we faced a deceptively simple question: <strong>What skills should we include?</strong>
          </p>

          <p>
            Simple questions often mask complex problems. A skill taxonomy isn&apos;t just a list—it&apos;s an ontology. It encodes how we think about capability, expertise, and growth. Get it wrong, and the whole product feels off. Get it right, and users see themselves reflected in ways they haven&apos;t before.
          </p>

          <p>This is the story of how we built ours.</p>

          <h2>Why We Needed a Taxonomy</h2>

          <p>
            Most professional platforms treat skills as tags. LinkedIn lets you add &quot;Python&quot; or &quot;Project Management&quot; to your profile, but there&apos;s no structure—no sense of how these skills relate, what they unlock, or how they evolve.
          </p>

          <p>
            We wanted SkillTree to work differently. If you&apos;re learning React, you&apos;re probably headed toward Next.js. If you know TypeScript, advanced patterns become accessible. Skills have prerequisites. They form a graph, not a list.
          </p>

          <p>
            But building that graph requires a foundation: a comprehensive taxonomy that covers not just what people know today, but what they might learn tomorrow—including skills for human-AI collaboration.
          </p>

          <h2>The Research Process</h2>

          <p>We started with a simple methodology: <strong>look at where skills actually show up in the wild.</strong></p>

          <h3>Job Boards (The Demand Side)</h3>

          <p>
            We scraped thousands of job postings across LinkedIn, Indeed, and niche boards. What skills do employers actually ask for? What combinations appear together?
          </p>

          <p>
            <strong>Key insight:</strong> job postings are surprisingly granular. &quot;React&quot; appears, but so does &quot;React Hooks,&quot; &quot;Redux,&quot; and &quot;Next.js.&quot; This granularity mattered—users wanted to track specific capabilities, not broad categories.
          </p>

          <h3>Online Courses (The Supply Side)</h3>

          <p>Platforms like Coursera, Udemy, and egghead.io reveal how skills are taught. We analyzed course catalogs to understand:</p>

          <ul>
            <li>What prerequisites do instructors assume?</li>
            <li>What learning paths do platforms recommend?</li>
            <li>What emerging topics are gaining traction?</li>
          </ul>

          <p>
            <strong>Key insight:</strong> the structure of courses encodes pedagogical relationships. Machine Learning requires Statistics. Advanced TypeScript requires understanding of generics. These weren&apos;t arbitrary—they were natural ordering constraints.
          </p>

          <h3>Documentation &amp; Standards</h3>

          <p>
            Official docs (MDN, React docs, AWS documentation) gave us authoritative skill definitions. Professional certifications (AWS, Google Cloud, Kubernetes) provided validated learning paths.
          </p>

          <p>
            <strong>Key insight:</strong> official sources often lag behind practice. By the time a skill appears in certification, it&apos;s already mainstream. We needed to look ahead too.
          </p>

          <h2>The 20 Domains</h2>

          <p>After synthesis, we organized skills into 20 domains:</p>

          <table>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Skills Count</th>
                <th>Focus Area</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Programming Fundamentals</td>
                <td>35</td>
                <td>Core concepts across languages</td>
              </tr>
              <tr>
                <td>Frontend Development</td>
                <td>68</td>
                <td>React, Vue, Angular, CSS, accessibility</td>
              </tr>
              <tr>
                <td>Backend Development</td>
                <td>54</td>
                <td>APIs, databases, server architecture</td>
              </tr>
              <tr>
                <td>DevOps &amp; SRE</td>
                <td>42</td>
                <td>CI/CD, monitoring, reliability</td>
              </tr>
              <tr>
                <td>Cloud Platforms</td>
                <td>38</td>
                <td>AWS, GCP, Azure services</td>
              </tr>
              <tr>
                <td>Data Engineering</td>
                <td>31</td>
                <td>Pipelines, warehouses, ETL</td>
              </tr>
              <tr>
                <td>Machine Learning</td>
                <td>47</td>
                <td>Classical ML, deep learning, MLOps</td>
              </tr>
              <tr>
                <td>AI &amp; LLMs</td>
                <td>29</td>
                <td>Prompt engineering, agents, fine-tuning</td>
              </tr>
              <tr>
                <td>Mobile Development</td>
                <td>24</td>
                <td>iOS, Android, React Native</td>
              </tr>
              <tr>
                <td>Security</td>
                <td>28</td>
                <td>Application, cloud, and data security</td>
              </tr>
              <tr>
                <td>Product Management</td>
                <td>22</td>
                <td>Strategy, roadmaps, user research</td>
              </tr>
              <tr>
                <td>Design &amp; UX</td>
                <td>26</td>
                <td>UI design, research, systems thinking</td>
              </tr>
              <tr>
                <td>Data Science</td>
                <td>19</td>
                <td>Statistics, visualization, analysis</td>
              </tr>
              <tr>
                <td>Blockchain &amp; Web3</td>
                <td>14</td>
                <td>Smart contracts, DeFi concepts</td>
              </tr>
              <tr>
                <td>Quality Assurance</td>
                <td>18</td>
                <td>Testing strategies, automation</td>
              </tr>
              <tr>
                <td>Technical Writing</td>
                <td>16</td>
                <td>Documentation, DX, communication</td>
              </tr>
              <tr>
                <td>Leadership &amp; Management</td>
                <td>21</td>
                <td>Team building, coaching, strategy</td>
              </tr>
              <tr>
                <td>System Design</td>
                <td>23</td>
                <td>Architecture, scalability, patterns</td>
              </tr>
              <tr>
                <td>Developer Tools</td>
                <td>15</td>
                <td>Git, editors, productivity</td>
              </tr>
              <tr>
                <td>Human-AI Collaboration</td>
                <td>12</td>
                <td>AI workflow design, agent orchestration</td>
              </tr>
            </tbody>
          </table>

          <p><strong>Total: 520+ skills</strong></p>

          <h2>The AI/ML Challenge</h2>

          <p>The fastest-moving domain was AI/ML—not surprising in 2026. Here&apos;s how we handled it:</p>

          <h3>Layer 1: Foundational Skills</h3>

          <ul>
            <li>Python for ML</li>
            <li>Linear Algebra &amp; Calculus</li>
            <li>Statistics &amp; Probability</li>
            <li>Data manipulation (pandas, numpy)</li>
          </ul>

          <h3>Layer 2: Classical ML</h3>

          <ul>
            <li>Supervised learning algorithms</li>
            <li>Unsupervised techniques</li>
            <li>Model evaluation</li>
            <li>Feature engineering</li>
          </ul>

          <h3>Layer 3: Deep Learning</h3>

          <ul>
            <li>Neural network architectures</li>
            <li>Frameworks (PyTorch, TensorFlow)</li>
            <li>Training at scale</li>
            <li>Transfer learning</li>
          </ul>

          <h3>Layer 4: LLMs &amp; Agents</h3>

          <ul>
            <li>Prompt engineering</li>
            <li>RAG architecture</li>
            <li>Fine-tuning techniques</li>
            <li>Agent orchestration</li>
            <li>AI workflow design</li>
          </ul>

          <p>
            The key was recognizing that LLM skills aren&apos;t just &quot;using ChatGPT.&quot; There&apos;s genuine expertise in context window management, chain-of-thought prompting, retrieval augmentation, and multi-agent systems. These are the skills of the AI workflow architect—a role that&apos;s emerging as we speak.
          </p>

          <h2>Relationships: The Hard Part</h2>

          <p>Listing skills was the easy part. The hard part was defining relationships.</p>

          <h3>Prerequisite Edges</h3>

          <p>Some skills obviously require others:</p>

          <pre><code>JavaScript → TypeScript → Advanced TypeScript Patterns
Python → pandas → scikit-learn → PyTorch</code></pre>

          <h3>Unlock Edges</h3>

          <p>Some skills unlock new capabilities:</p>

          <pre><code>React → Next.js (App Router) → Server Components
AWS EC2 → AWS ECS → Kubernetes → Service Mesh</code></pre>

          <h3>Complementary Edges</h3>

          <p>Some skills work together:</p>

          <pre><code>GraphQL ↔ React (Apollo Client)
Terraform ↔ AWS/Azure/GCP</code></pre>

          <p>
            We encoded these as a directed acyclic graph (DAG). No cycles allowed—if skill A leads to B, B shouldn&apos;t (directly or indirectly) lead back to A. This mirrors how learning actually works: you build foundations, then advanced concepts, then expertise.
          </p>

          <h2>What&apos;s Missing (And Why That&apos;s Okay)</h2>

          <p>
            Our taxonomy has gaps. Emerging frameworks appear faster than we can add them. Regional skill variations aren&apos;t fully represented. Soft skills are harder to define than technical ones.
          </p>

          <p>But here&apos;s the thing: <strong>a taxonomy is a living document.</strong></p>

          <p>
            We built SkillTree&apos;s taxonomy to be community-extensible. The Open SkillTree Schema means anyone can propose new skills, define relationships, or fork the taxonomy for their domain. Our 520 skills are a starting point, not a ceiling.
          </p>

          <h2>The Result</h2>

          <p>
            When users see their skills mapped in SkillTree, something clicks. The visualization matches their mental model of growth. They see not just what they know, but what they could learn next. The taxonomy fades into the background—it&apos;s just the structure that makes the insight possible.
          </p>

          <p>That&apos;s the goal. Good infrastructure is invisible.</p>

          <h2>Call for Contributions</h2>

          <p>
            We&apos;re actively expanding our taxonomy. If you see a missing skill, an incorrect relationship, or a whole domain we haven&apos;t covered, we want to hear from you.
          </p>

          <ul>
            <li>Open an issue on <a href="https://github.com/ElanCao/FutureLabs" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li>Suggest edits via the <a href="https://skilltree.app" target="_blank" rel="noopener noreferrer">SkillTree app</a></li>
            <li>Join the discussion in our community</li>
          </ul>

          <p>The future of human-AI collaboration needs a map. Help us draw it.</p>

          <hr />

          <p className="text-slate-600">
            Want to see how your skills fit into this taxonomy?{" "}
            <Link
              href="/contact"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create your SkillTree profile
            </Link>{" "}
            and visualize your growth.
          </p>
        </div>
      </article>

      {/* Waitlist CTA */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-balance">
            Map your skills
          </h2>
          <p className="mt-3 text-indigo-200 text-lg text-balance">
            Join the waitlist and visualize your capabilities in the SkillTree taxonomy.
          </p>
          <div className="mt-6 max-w-md mx-auto">
            <WaitlistSignup variant="inline" page="blog-building-skill-taxonomy" />
          </div>
        </div>
      </section>
    </>
  );
}

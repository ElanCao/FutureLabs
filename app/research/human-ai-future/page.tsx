import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Future Where Humans Live With AI — FutureLabs Research",
  description:
    "FutureLabs founding research report: what it means for humans to live and work alongside AI agents — trends, opportunities, and implications for individuals, organizations, and society.",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sections = [
  {
    id: "agentic-shift",
    label: "The Agentic Shift",
  },
  {
    id: "what-it-means",
    label: "What It Means to Live With AI",
  },
  {
    id: "key-trends",
    label: "Key Trends",
  },
  {
    id: "opportunities",
    label: "Opportunities",
  },
  {
    id: "implications",
    label: "Implications",
  },
  {
    id: "futurelabs-position",
    label: "FutureLabs' Position",
  },
];

export default function HumanAIFuturePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-4 flex items-center gap-3">
            <Link
              href="/research"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              ← Research
            </Link>
            <span className="text-slate-600 text-sm">|</span>
            <span className="text-indigo-400 text-sm font-medium">
              Founding Research Report
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-balance leading-tight">
            The Future Where Humans Live With AI
          </h1>
          <p className="mt-5 text-slate-300 text-lg max-w-2xl text-balance leading-relaxed">
            What it means — and what it requires — for humans and AI agents to
            share the same world of work, learning, and purpose.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">
            <span>FutureLabs Research</span>
            <span>·</span>
            <span>March 2026</span>
            <span>·</span>
            <span>Chief Research Officer</span>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="bg-indigo-600 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-lg sm:text-xl font-medium leading-relaxed">
            &ldquo;The most consequential question of this decade is not what AI
            can do — it is who we become when we do it together.&rdquo;
          </p>
        </div>
      </section>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-20 prose prose-slate prose-lg max-w-none">

        {/* Abstract */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-14 not-prose">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">
            Abstract
          </h2>
          <p className="text-slate-700 leading-relaxed">
            We are at the beginning of a transition from AI as tool to AI as
            agent — systems that perceive, plan, and act with increasing
            autonomy. This report examines what it means for humans to live and
            work alongside such agents: not as a distant future, but as a
            condition that is already taking shape. We identify five defining
            trends, four categories of high-value opportunity, and six
            implications that organizations, individuals, and policymakers must
            reckon with. Our central finding: the human-AI future is not
            determined by the technology. It is determined by the choices we
            make now about governance, skill development, trust architecture,
            and the design of human-AI interfaces. FutureLabs exists to make
            those choices well.
          </p>
        </div>

        {/* Section 1 */}
        <section id="agentic-shift" className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            1. The Agentic Shift
          </h2>
          <p className="text-slate-700 leading-relaxed mb-5">
            For most of the history of computing, AI functioned as an
            instrument: given an input, it produced an output. The human
            remained the agent — the entity with goals, plans, and the capacity
            to act on the world. That architecture is changing.
          </p>
          <p className="text-slate-700 leading-relaxed mb-5">
            Today&apos;s large language models, multimodal systems, and tool-using
            agents can maintain context across long tasks, execute multi-step
            plans, and take consequential actions — scheduling, writing,
            searching, coding, communicating — with decreasing need for
            moment-to-moment human oversight. In enterprise settings, AI agents
            are already drafting contracts, coordinating logistics, generating
            and reviewing code, and conducting research that previously required
            teams of specialists.
          </p>
          <p className="text-slate-700 leading-relaxed mb-5">
            This is the agentic shift: the move from AI-as-tool to AI-as-actor.
            It is not a binary event but a spectrum. At one end, humans remain
            fully in the loop; at the other, agents operate with substantial
            autonomy and humans provide goals, constraints, and judgment. Most
            near-term deployments occupy the middle of this spectrum — and it is
            in that middle space where the most important design problems live.
          </p>
          <div className="bg-indigo-50 border-l-4 border-indigo-500 pl-6 py-4 my-8 rounded-r-lg not-prose">
            <p className="text-indigo-800 font-medium italic">
              &ldquo;The agentic shift does not eliminate human agency. It
              redistributes it — from execution to direction, from repetition to
              judgment, from individual capability to orchestration.&rdquo;
            </p>
          </div>
          <p className="text-slate-700 leading-relaxed">
            The central challenge is not that AI will make humans irrelevant.
            The challenge is that we lack the frameworks, institutions, and
            individual habits to direct AI well — to set goals that are genuine,
            to recognize when agents are wrong, and to take responsibility for
            outcomes that no single human or agent fully controlled.
          </p>
        </section>

        {/* Section 2 */}
        <section id="what-it-means" className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            2. What It Means to Live With AI
          </h2>
          <p className="text-slate-700 leading-relaxed mb-5">
            &ldquo;Living with AI&rdquo; is more than a technological
            description. It describes a social and psychological condition —
            one that is already emerging and will deepen over the next decade.
          </p>

          <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">
            2.1 AI as Colleague
          </h3>
          <p className="text-slate-700 leading-relaxed mb-5">
            In organizations where AI agents handle real work, the question of
            how to relate to them is practical, not philosophical. Do you check
            their output? How much? When do you defer and when do you override?
            These questions have no established answers — most people are
            improvising. The result is inconsistent: some over-trust and stop
            checking; others under-trust and duplicate effort. Neither is
            optimal.
          </p>
          <p className="text-slate-700 leading-relaxed mb-5">
            Calibrated working relationships with AI require something
            analogous to what we develop with human colleagues: a model of their
            capabilities, failure modes, and reliability across contexts. This
            takes time and deliberate effort. It is a skill — and like all
            skills, it can be developed, taught, and documented.
          </p>

          <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">
            2.2 AI as Infrastructure
          </h3>
          <p className="text-slate-700 leading-relaxed mb-5">
            In parallel, AI is becoming infrastructure — embedded in the
            systems and processes people use without necessarily knowing they
            are using AI at all. Search results, hiring screens, content
            recommendations, credit decisions, medical diagnostic aids: AI is
            already structuring the choices available to people at scale. Living
            with AI, in this sense, means navigating systems you did not design
            and often cannot inspect.
          </p>

          <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">
            2.3 AI and Identity
          </h3>
          <p className="text-slate-700 leading-relaxed">
            Perhaps most profoundly, widespread AI use is beginning to affect
            how people understand their own capabilities and contributions.
            &ldquo;Did I do this, or did the AI?&rdquo; is a question that would
            have sounded absurd five years ago and now arises genuinely in
            knowledge work settings every day. Questions of authorship,
            expertise, and professional identity are in flux. The frameworks
            through which people have historically understood their value —
            credentials, experience, track record — are being destabilized by
            systems that can approximate their outputs.
          </p>
        </section>

        {/* Section 3 */}
        <section id="key-trends" className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            3. Key Trends
          </h2>
          <p className="text-slate-700 leading-relaxed mb-8">
            Five trends define the near-term arc of the human-AI relationship.
            Together they create both the urgency for FutureLabs&apos; work and
            the opportunity space it occupies.
          </p>

          {[
            {
              number: "01",
              title: "Rapid capability expansion",
              body: "AI agent capabilities are expanding faster than social and organizational adaptation. The gap between what agents can do and how well humans can direct, evaluate, and govern them is widening. This is the primary source of both risk and opportunity in the near term.",
            },
            {
              number: "02",
              title: "Asymmetric adoption",
              body: "Adoption of AI agents is highly uneven — by sector, by firm size, by geography, and by demographic. Early adopters are compounding advantages in productivity, learning speed, and market position. This asymmetry will widen without deliberate intervention to distribute access and skill development.",
            },
            {
              number: "03",
              title: "Skill landscape disruption",
              body: "The set of skills that generate economic value is shifting faster than education and credentialing systems can track. Rote cognitive tasks — data processing, standard writing, basic analysis — are commoditizing. Higher-order capabilities — judgment, coordination, creative synthesis, ethical reasoning — are becoming the primary differentiators of human value-add.",
            },
            {
              number: "04",
              title: "Trust deficit",
              body: "Both over-trust and under-trust in AI systems are prevalent and costly. We lack reliable signals for when AI outputs are trustworthy in specific domains, creating systematic failures in high-stakes contexts. Building well-calibrated trust between humans and AI agents is an unsolved problem with large economic and safety implications.",
            },
            {
              number: "05",
              title: "Governance vacuum",
              body: "Existing legal, regulatory, and organizational governance frameworks were not designed for environments where agents act autonomously on behalf of principals. Accountability for AI-generated actions is diffuse; liability is unclear; audit trails are incomplete. Governance frameworks will need to be rebuilt from foundations, not patched.",
            },
          ].map((trend) => (
            <div
              key={trend.number}
              className="flex gap-6 mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 not-prose"
            >
              <div className="text-3xl font-bold text-indigo-100 shrink-0 select-none w-10">
                {trend.number}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {trend.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {trend.body}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Section 4 */}
        <section id="opportunities" className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            4. Opportunities
          </h2>
          <p className="text-slate-700 leading-relaxed mb-8">
            The transition to a world of human-AI collaboration creates four
            categories of high-value opportunity. These are not hypothetical —
            early versions of each are already being built.
          </p>

          {[
            {
              title: "Skill infrastructure",
              description:
                "Systems that help individuals understand, develop, and communicate their capabilities — including how those capabilities complement specific AI agents. The value of a skill is increasingly context-dependent: it depends on what AI can and cannot do in that context. Dynamic skill graphs that reflect this are infrastructure for the AI economy.",
              futurelabs:
                "SkillTree is FutureLabs' contribution to this layer — a platform where humans map their skills, discover how they pair with AI agents, and build visible track records of human-AI collaboration.",
            },
            {
              title: "Trust architecture",
              description:
                "Tooling and frameworks that help humans calibrate trust with AI agents over time — logging reliability, communicating uncertainty honestly, and surfacing failure modes before they matter. Trust architecture is to human-AI collaboration what authentication is to secure systems: foundational and invisible when it works.",
              futurelabs:
                "FutureLabs' research program on trust calibration will produce both behavioral research and concrete design recommendations for AI systems.",
            },
            {
              title: "Governance primitives",
              description:
                "Reusable governance patterns — accountability chains, audit mechanisms, decision authority frameworks — that organizations can adapt to their specific human-AI workflows. Just as software engineering produced design patterns that accelerated development, governance primitives will accelerate responsible AI deployment.",
              futurelabs:
                "Our Year 1 governance white paper will articulate the first generation of these primitives, grounded in emerging organizational practice.",
            },
            {
              title: "Meaning and identity scaffolding",
              description:
                "Support for individuals navigating the psychological and professional identity disruption caused by AI adoption — frameworks for understanding one's value in AI-augmented contexts, for finding meaningful contribution, and for maintaining a coherent professional narrative through rapid change.",
              futurelabs:
                "This is the least visible but potentially most important category. FutureLabs' essay work and community building serves this function.",
            },
          ].map((opp, i) => (
            <div
              key={i}
              className="mb-10 p-8 border border-slate-200 rounded-2xl not-prose"
            >
              <h3 className="font-bold text-slate-900 text-lg mb-3">
                {opp.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {opp.description}
              </p>
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                  FutureLabs angle
                </span>
                <p className="text-indigo-800 text-sm mt-1 leading-relaxed">
                  {opp.futurelabs}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Section 5 */}
        <section id="implications" className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            5. Implications
          </h2>
          <p className="text-slate-700 leading-relaxed mb-8">
            Living with AI as a genuine condition — not a future possibility —
            has concrete implications across six domains.
          </p>

          <div className="space-y-6 not-prose">
            {[
              {
                domain: "For individuals",
                implication:
                  "Competitive advantage will increasingly derive from meta-skills: knowing which tasks to delegate to AI, evaluating AI outputs critically, and combining AI capabilities with distinctly human judgment. People who develop these meta-skills early will compound advantages. Those who do not will find their capabilities commoditized by systems that approximate but do not truly replace them.",
              },
              {
                domain: "For organizations",
                implication:
                  "The most consequential organizational design questions of the next five years are human-AI interface questions: how to structure authority, accountability, and escalation paths when agents are taking actions on behalf of the organization. Organizations that treat AI as a tool for cost reduction will underperform relative to those that redesign workflows to genuinely leverage human-AI complementarity.",
              },
              {
                domain: "For education",
                implication:
                  "Curricula designed for a pre-AI knowledge economy are already obsolete in significant parts. The challenge is not adding AI literacy as a subject but rethinking which foundational capabilities — reasoning, communication, judgment, coordination — should be developed more deeply precisely because AI handles their surface expressions. Assessment systems will also need fundamental redesign.",
              },
              {
                domain: "For policymakers",
                implication:
                  "Effective AI governance requires understanding the human-AI interface, not just AI capabilities in isolation. Liability frameworks, audit requirements, and standards for AI communication with humans are more tractable near-term levers than attempting to constrain AI capabilities directly. The governance window for shaping human-AI norms is open now and will close as practices calcify.",
              },
              {
                domain: "For the labor market",
                implication:
                  "The displacement narrative — AI takes jobs — is too simple and too slow. The more accurate near-term picture is task displacement within roles, creating transitions that require rapid skill adaptation. The workers most at risk are those in roles where the cognitive tasks are well-defined and the adjacent human skills (judgment, relationship, context) are not being developed. The workers most positioned to gain are those who can fluidly orchestrate AI toward genuinely complex goals.",
              },
              {
                domain: "For social trust",
                implication:
                  "Pervasive AI mediation of information, communication, and decision-making will stress social trust systems designed for a world of human-generated content and human-made decisions. Epistemic authority — knowing who to trust about what — depends on being able to trace claims to accountable agents. As that traceability degrades, the social infrastructure for shared reality degrades with it. This is one of the most serious second-order consequences of the agentic shift.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-[auto,1fr] gap-5 p-6 bg-white border border-slate-200 rounded-xl"
              >
                <div className="w-1 bg-indigo-500 rounded-full self-stretch" />
                <div>
                  <span className="font-semibold text-slate-900 text-sm">
                    {item.domain}
                  </span>
                  <p className="text-slate-600 text-sm leading-relaxed mt-2">
                    {item.implication}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 */}
        <section id="futurelabs-position" className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            6. FutureLabs&apos; Position
          </h2>
          <p className="text-slate-700 leading-relaxed mb-5">
            FutureLabs was founded on a specific conviction: the future where
            humans live with AI is not a fait accompli waiting to be accepted,
            but a design problem waiting to be solved. The quality of that
            future depends on choices — about products, norms, infrastructure,
            and culture — that are being made now, mostly without sufficient
            deliberation.
          </p>
          <p className="text-slate-700 leading-relaxed mb-5">
            Our work sits at the intersection of three layers:
          </p>

          <div className="grid grid-cols-1 gap-6 my-8 not-prose">
            {[
              {
                layer: "Product",
                description:
                  "SkillTree — infrastructure for mapping, developing, and showcasing human capabilities in an AI-augmented world. The platform is designed to make human-AI complementarity legible and actionable, not as an abstract concept but as a daily practice.",
                color: "border-violet-200 bg-violet-50",
                labelColor: "text-violet-700",
              },
              {
                layer: "Research",
                description:
                  "A Year 1 agenda focused on the five most important and least understood questions at the human-AI interface: governance, trust, complementarity, communication, and meaning. Each question produces a public artifact — designed to move the field, not just contribute to it.",
                color: "border-indigo-200 bg-indigo-50",
                labelColor: "text-indigo-700",
              },
              {
                layer: "Narrative",
                description:
                  "Language and frameworks that make the human-AI future concrete, specific, and navigable — for individuals trying to make career decisions, for organizations designing workflows, and for policymakers trying to govern systems they do not fully understand. The future is not self-explaining. Someone has to do the work of making it intelligible.",
                color: "border-blue-200 bg-blue-50",
                labelColor: "text-blue-700",
              },
            ].map((item) => (
              <div
                key={item.layer}
                className={`p-6 rounded-xl border ${item.color}`}
              >
                <span
                  className={`text-xs font-semibold uppercase tracking-wide ${item.labelColor}`}
                >
                  {item.layer}
                </span>
                <p className="text-slate-700 text-sm leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <p className="text-slate-700 leading-relaxed mb-5">
            Our thesis is that the competitors and the collaborators are not
            determined by the technology — they are determined by us. An AI
            future is coming regardless. A good AI future requires deliberate
            work at every layer: technical, organizational, and cultural.
          </p>
          <p className="text-slate-700 leading-relaxed">
            FutureLabs is doing that work. This report is the beginning.
          </p>
        </section>

        {/* Footnotes / Methods */}
        <section className="border-t border-slate-200 pt-10 mt-10 not-prose">
          <h2 className="text-base font-semibold text-slate-700 mb-4">
            About this report
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-3">
            This is FutureLabs&apos; founding research report, establishing the
            intellectual context for our Year 1 research agenda and product
            direction. It synthesizes publicly available research, internal
            strategic analysis, and the practical experience of building
            human-AI collaborative systems.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            This report will be updated as our research progresses. The most
            current version is always available at{" "}
            <Link href="/research/human-ai-future" className="text-indigo-600 hover:underline">
              futurelabs.vip/research/human-ai-future
            </Link>
            .
          </p>
        </section>
      </article>

      {/* CTA */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl font-bold mb-3">
            Help us get the human-AI future right.
          </h2>
          <p className="text-slate-300 mb-6 text-sm">
            We&apos;re building research partnerships and looking for
            collaborators who share our conviction that this work matters.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/research"
              className="inline-flex items-center px-6 py-2.5 bg-white text-slate-900 font-medium rounded-lg transition-colors text-sm hover:bg-slate-100"
            >
              See full research agenda
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

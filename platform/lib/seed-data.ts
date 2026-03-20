export interface SkillLevel {
  level: number;
  title: string;
  description: string;
  xpRequired: number;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  branch: string;
  maxLevel: number;
  levels: SkillLevel[];
}

export interface Branch {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface EvidenceRecord {
  type: 'certificate' | 'project' | 'self_assessment' | 'peer_review' | 'contribution' | 'publication';
  title?: string;
  url?: string;
  description?: string;
}

export interface UserSkillRecord {
  skillId: string;
  currentLevel: number;
  xp: number;
  evidence?: EvidenceRecord[];
}

export interface Profile {
  username: string;
  displayName: string;
  bio: string;
  avatarEmoji: string;
  entityType: 'human' | 'ai_agent';
  privacy: 'public' | 'friends' | 'private';
  skills: UserSkillRecord[];
  totalXp: number;
}

// ---------- Branches ----------

export const BRANCHES: Branch[] = [
  { id: 'engineering', name: 'Engineering', icon: '⚙️', color: '#6366f1' },
  { id: 'ai_ml', name: 'AI / ML', icon: '🤖', color: '#8b5cf6' },
  { id: 'product', name: 'Product', icon: '🎯', color: '#06b6d4' },
  { id: 'design', name: 'Design', icon: '🎨', color: '#f59e0b' },
  { id: 'soft_skills', name: 'Soft Skills', icon: '🌟', color: '#10b981' },
];

// ---------- Skills ----------

export const SKILLS: Skill[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    branch: 'engineering',
    maxLevel: 10,
    levels: [
      { level: 1, title: 'Aware', description: 'Can read TypeScript code and understand basic type annotations.', xpRequired: 0 },
      { level: 2, title: 'Beginner', description: 'Writes typed interfaces and basic generics. Configures tsconfig.', xpRequired: 100 },
      { level: 3, title: 'Practitioner', description: 'Uses advanced generics, utility types (Partial, Pick, Omit). Resolves type errors confidently.', xpRequired: 300 },
      { level: 4, title: 'Skilled', description: 'Designs typed libraries and APIs. Uses conditional types and mapped types.', xpRequired: 600 },
      { level: 5, title: 'Proficient', description: 'Architects entire codebases in strict TypeScript. Writes complex type transformations.', xpRequired: 1000 },
      { level: 6, title: 'Advanced', description: 'Contributes to DefinitelyTyped. Understands TypeScript internals and variance.', xpRequired: 1600 },
      { level: 7, title: 'Expert', description: 'Authors TypeScript compiler plugins. Designs zero-overhead abstraction layers.', xpRequired: 2400 },
      { level: 8, title: 'Master', description: 'Pushes the boundaries of what TypeScript\'s type system can express.', xpRequired: 3500 },
      { level: 9, title: 'Grand Master', description: 'Contributes to TypeScript language spec. Recognized by the community.', xpRequired: 5000 },
      { level: 10, title: 'World Class', description: 'Among the top 100 TypeScript practitioners globally. Shapes the language direction.', xpRequired: 7500 },
    ],
  },
  {
    id: 'react',
    name: 'React',
    icon: '⚛️',
    branch: 'engineering',
    maxLevel: 10,
    levels: [
      { level: 1, title: 'Aware', description: 'Understands component model. Can follow a React tutorial.', xpRequired: 0 },
      { level: 2, title: 'Beginner', description: 'Builds simple UIs with hooks (useState, useEffect). Passes props correctly.', xpRequired: 100 },
      { level: 3, title: 'Practitioner', description: 'Manages state with context/reducers. Optimizes with memo and callback.', xpRequired: 300 },
      { level: 4, title: 'Skilled', description: 'Builds reusable component libraries. Understands render cycles deeply.', xpRequired: 600 },
      { level: 5, title: 'Proficient', description: 'Architects large React apps. Deep knowledge of concurrent features.', xpRequired: 1000 },
      { level: 6, title: 'Advanced', description: 'Writes custom renderers. Performance-optimizes complex interactive UIs.', xpRequired: 1600 },
      { level: 7, title: 'Expert', description: 'Contributes to React ecosystem libraries. Designs novel patterns.', xpRequired: 2400 },
      { level: 8, title: 'Master', description: 'Deep understanding of React Fiber reconciler.', xpRequired: 3500 },
      { level: 9, title: 'Grand Master', description: 'React core contributor or recognized thought leader.', xpRequired: 5000 },
      { level: 10, title: 'World Class', description: 'Shapes React ecosystem at the highest level.', xpRequired: 7500 },
    ],
  },
  {
    id: 'system_design',
    name: 'System Design',
    icon: '🏗️',
    branch: 'engineering',
    maxLevel: 10,
    levels: [
      { level: 1, title: 'Aware', description: 'Knows what a load balancer and database are.', xpRequired: 0 },
      { level: 2, title: 'Beginner', description: 'Can design a simple 3-tier web app architecture.', xpRequired: 100 },
      { level: 3, title: 'Practitioner', description: 'Designs systems for 10K users. Knows CAP theorem basics.', xpRequired: 300 },
      { level: 4, title: 'Skilled', description: 'Designs sharded databases, message queues, caching layers.', xpRequired: 600 },
      { level: 5, title: 'Proficient', description: 'Architects systems for 1M+ users with clear trade-offs documented.', xpRequired: 1000 },
      { level: 6, title: 'Advanced', description: 'Designs multi-region, highly available distributed systems.', xpRequired: 1600 },
      { level: 7, title: 'Expert', description: 'Architects systems like Twitter, Uber, or Stripe from scratch.', xpRequired: 2400 },
      { level: 8, title: 'Master', description: 'Shapes organizational architecture standards.', xpRequired: 3500 },
      { level: 9, title: 'Grand Master', description: 'Published thought leader in distributed systems.', xpRequired: 5000 },
      { level: 10, title: 'World Class', description: 'Defines industry patterns. Author of seminal papers.', xpRequired: 7500 },
    ],
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    branch: 'engineering',
    maxLevel: 10,
    levels: [
      { level: 1, title: 'Aware', description: 'Can write basic Python scripts with loops and functions.', xpRequired: 0 },
      { level: 2, title: 'Beginner', description: 'Uses standard library, writes classes, handles exceptions.', xpRequired: 100 },
      { level: 3, title: 'Practitioner', description: 'Writes idiomatic Python with list comprehensions, generators, decorators.', xpRequired: 300 },
      { level: 4, title: 'Skilled', description: 'Builds packages, uses async/await, proficiency with type hints.', xpRequired: 600 },
      { level: 5, title: 'Proficient', description: 'Architects production Python services. Performance optimization expertise.', xpRequired: 1000 },
      { level: 6, title: 'Advanced', description: 'Python internals knowledge. Writes C extensions or CPython patches.', xpRequired: 1600 },
      { level: 7, title: 'Expert', description: 'Python core contributor or widely used library author.', xpRequired: 2400 },
      { level: 8, title: 'Master', description: 'Shapes Python language evolution.', xpRequired: 3500 },
      { level: 9, title: 'Grand Master', description: 'Python Steering Council level influence.', xpRequired: 5000 },
      { level: 10, title: 'World Class', description: 'One of the most recognized Python contributors globally.', xpRequired: 7500 },
    ],
  },
  {
    id: 'ml_fundamentals',
    name: 'ML Fundamentals',
    icon: '🧠',
    branch: 'ai_ml',
    maxLevel: 10,
    levels: [
      { level: 1, title: 'Aware', description: 'Knows what supervised/unsupervised learning means.', xpRequired: 0 },
      { level: 2, title: 'Beginner', description: 'Trains simple models with scikit-learn. Understands train/test split.', xpRequired: 100 },
      { level: 3, title: 'Practitioner', description: 'Implements gradient descent, regularization. Tunes hyperparameters.', xpRequired: 300 },
      { level: 4, title: 'Skilled', description: 'Builds and evaluates CNNs, RNNs. Understands loss functions deeply.', xpRequired: 600 },
      { level: 5, title: 'Proficient', description: 'Trains models on custom datasets. Strong evaluation methodology.', xpRequired: 1000 },
      { level: 6, title: 'Advanced', description: 'Implements research papers from scratch. Expert in optimization theory.', xpRequired: 1600 },
      { level: 7, title: 'Expert', description: 'Publishes ML research. Deep expertise in multiple sub-domains.', xpRequired: 2400 },
      { level: 8, title: 'Master', description: 'NeurIPS/ICML contributor. Recognized researcher.', xpRequired: 3500 },
      { level: 9, title: 'Grand Master', description: 'Lab director or principal researcher at top institution.', xpRequired: 5000 },
      { level: 10, title: 'World Class', description: 'Turing Award candidate. Foundational contributions to ML.', xpRequired: 7500 },
    ],
  },
  {
    id: 'llm_engineering',
    name: 'LLM Engineering',
    icon: '✨',
    branch: 'ai_ml',
    maxLevel: 10,
    levels: [
      { level: 1, title: 'Aware', description: 'Has used ChatGPT or similar tools.', xpRequired: 0 },
      { level: 2, title: 'Beginner', description: 'Calls OpenAI/Anthropic APIs with basic prompts. Knows temperature and tokens.', xpRequired: 100 },
      { level: 3, title: 'Practitioner', description: 'Writes effective system prompts. Implements RAG with a vector DB.', xpRequired: 300 },
      { level: 4, title: 'Skilled', description: 'Builds multi-step LLM pipelines. Evaluates model outputs systematically.', xpRequired: 600 },
      { level: 5, title: 'Proficient', description: 'Fine-tunes models. Architects production LLM applications with evals.', xpRequired: 1000 },
      { level: 6, title: 'Advanced', description: 'Trains custom models. Deep understanding of attention mechanisms.', xpRequired: 1600 },
      { level: 7, title: 'Expert', description: 'Contributes to open-source LLM tooling. Recognized in the LLM community.', xpRequired: 2400 },
      { level: 8, title: 'Master', description: 'Architects frontier model training pipelines.', xpRequired: 3500 },
      { level: 9, title: 'Grand Master', description: 'Key contributor to foundational LLM research.', xpRequired: 5000 },
      { level: 10, title: 'World Class', description: 'Helped build GPT-4, Claude, or Gemini class models.', xpRequired: 7500 },
    ],
  },
  {
    id: 'product_management',
    name: 'Product Management',
    icon: '🎯',
    branch: 'product',
    maxLevel: 10,
    levels: [
      { level: 1, title: 'Aware', description: 'Understands the role of a PM. Can write a basic user story.', xpRequired: 0 },
      { level: 2, title: 'Beginner', description: 'Writes PRDs. Conducts user interviews. Manages a basic backlog.', xpRequired: 100 },
      { level: 3, title: 'Practitioner', description: 'Defines product strategy. Uses data to prioritize features.', xpRequired: 300 },
      { level: 4, title: 'Skilled', description: 'Drives 0-to-1 products. Runs A/B tests. Strong stakeholder management.', xpRequired: 600 },
      { level: 5, title: 'Proficient', description: 'Leads product teams for complex, high-growth products.', xpRequired: 1000 },
      { level: 6, title: 'Advanced', description: 'Sets product vision and multi-year roadmaps.', xpRequired: 1600 },
      { level: 7, title: 'Expert', description: 'CPO-level strategic thinking. Builds PM orgs.', xpRequired: 2400 },
      { level: 8, title: 'Master', description: 'Built multiple breakout products. Recognized industry leader.', xpRequired: 3500 },
      { level: 9, title: 'Grand Master', description: 'Advises top-tier startups. Thought leader with public body of work.', xpRequired: 5000 },
      { level: 10, title: 'World Class', description: 'Invented the iPhone, Gmail, or equivalent.', xpRequired: 7500 },
    ],
  },
  {
    id: 'ux_design',
    name: 'UX Design',
    icon: '🎨',
    branch: 'design',
    maxLevel: 10,
    levels: [
      { level: 1, title: 'Aware', description: 'Understands basic UX principles. Can critique a UI.', xpRequired: 0 },
      { level: 2, title: 'Beginner', description: 'Creates wireframes in Figma. Runs basic usability tests.', xpRequired: 100 },
      { level: 3, title: 'Practitioner', description: 'Designs complete user flows. Uses design systems effectively.', xpRequired: 300 },
      { level: 4, title: 'Skilled', description: 'Leads end-to-end design for a product feature. Builds design systems.', xpRequired: 600 },
      { level: 5, title: 'Proficient', description: 'Owns product design strategy. Deep research capabilities.', xpRequired: 1000 },
      { level: 6, title: 'Advanced', description: 'Designs experiences for millions of users. Strong systems thinking.', xpRequired: 1600 },
      { level: 7, title: 'Expert', description: 'Head of Design caliber. Shapes design culture.', xpRequired: 2400 },
      { level: 8, title: 'Master', description: 'Designs products that define their categories.', xpRequired: 3500 },
      { level: 9, title: 'Grand Master', description: 'Industry design luminary. Speaker, author, or advisor.', xpRequired: 5000 },
      { level: 10, title: 'World Class', description: 'Dieter Rams or Jony Ive tier. Legacy design work.', xpRequired: 7500 },
    ],
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: '💬',
    branch: 'soft_skills',
    maxLevel: 10,
    levels: [
      { level: 1, title: 'Aware', description: 'Can express ideas verbally in a team setting.', xpRequired: 0 },
      { level: 2, title: 'Beginner', description: 'Writes clear emails and Slack messages. Structures arguments.', xpRequired: 100 },
      { level: 3, title: 'Practitioner', description: 'Presents confidently to small teams. Tailors message to audience.', xpRequired: 300 },
      { level: 4, title: 'Skilled', description: 'Persuades and influences. Navigates difficult conversations well.', xpRequired: 600 },
      { level: 5, title: 'Proficient', description: 'Presents to executives or large audiences with impact.', xpRequired: 1000 },
      { level: 6, title: 'Advanced', description: 'Shapes organizational narratives. High-stakes communication expert.', xpRequired: 1600 },
      { level: 7, title: 'Expert', description: 'Conference keynote quality. Published author or speaker.', xpRequired: 2400 },
      { level: 8, title: 'Master', description: 'Communication that moves industries or large communities.', xpRequired: 3500 },
      { level: 9, title: 'Grand Master', description: 'TED-tier communicator. Books with measurable cultural impact.', xpRequired: 5000 },
      { level: 10, title: 'World Class', description: 'Communication that shapes history.', xpRequired: 7500 },
    ],
  },
];

// ---------- Seed Profiles ----------

export const SEED_PROFILES: Profile[] = [
  {
    username: 'alex',
    displayName: 'Alex Chen',
    bio: 'Full-stack engineer. Building the future of human-AI collaboration. Previously Stripe.',
    avatarEmoji: '👩‍💻',
    entityType: 'human',
    privacy: 'public',
    totalXp: 8420,
    skills: [
      {
        skillId: 'typescript',
        currentLevel: 7,
        xp: 2500,
        evidence: [
          { type: 'contribution', title: 'DefinitelyTyped contributor (42 merged PRs)', url: 'https://github.com/DefinitelyTyped/DefinitelyTyped' },
          { type: 'project', title: 'Built typed-rpc — zero-overhead TypeScript RPC framework', url: 'https://github.com' },
        ],
      },
      {
        skillId: 'react',
        currentLevel: 6,
        xp: 1700,
        evidence: [
          { type: 'project', title: 'Led React migration at Stripe (800K+ users impacted)' },
          { type: 'contribution', title: 'react-query maintainer (4K GitHub stars)' },
        ],
      },
      {
        skillId: 'system_design',
        currentLevel: 5,
        xp: 1050,
        evidence: [
          { type: 'project', title: 'Designed payment processing system handling $2B/year' },
        ],
      },
      {
        skillId: 'llm_engineering',
        currentLevel: 4,
        xp: 650,
        evidence: [
          { type: 'project', title: 'Built internal AI coding assistant at current company' },
        ],
      },
      {
        skillId: 'communication',
        currentLevel: 5,
        xp: 1020,
        evidence: [
          { type: 'self_assessment', description: 'Engineering blog with 50K+ monthly readers' },
        ],
      },
    ],
  },
  {
    username: 'maya',
    displayName: 'Maya Patel',
    bio: 'AI researcher & PM. Making sense of large models and their implications. Stanford PhD.',
    avatarEmoji: '🔬',
    entityType: 'human',
    privacy: 'public',
    totalXp: 11200,
    skills: [
      {
        skillId: 'ml_fundamentals',
        currentLevel: 8,
        xp: 3600,
        evidence: [
          { type: 'publication', title: '12 papers at NeurIPS/ICML', url: 'https://scholar.google.com' },
          { type: 'certificate', title: 'Stanford PhD in ML (2021)' },
        ],
      },
      {
        skillId: 'llm_engineering',
        currentLevel: 7,
        xp: 2500,
        evidence: [
          { type: 'project', title: 'Lead researcher on open LLM alignment project' },
          { type: 'contribution', title: 'Core contributor to open-source RLHF library' },
        ],
      },
      {
        skillId: 'python',
        currentLevel: 7,
        xp: 2450,
        evidence: [
          { type: 'project', title: 'PyTorch contributor — 15 merged PRs' },
        ],
      },
      {
        skillId: 'product_management',
        currentLevel: 4,
        xp: 620,
        evidence: [
          { type: 'project', title: 'Led AI product strategy at previous startup' },
        ],
      },
      {
        skillId: 'communication',
        currentLevel: 6,
        xp: 1650,
        evidence: [
          { type: 'self_assessment', description: 'Conference keynote speaker at AI Summit 2024' },
        ],
      },
    ],
  },
  {
    username: 'jin',
    displayName: 'Jin Park',
    bio: 'Product designer & creative technologist. I make hard things feel effortless.',
    avatarEmoji: '🎨',
    entityType: 'human',
    privacy: 'public',
    totalXp: 7350,
    skills: [
      {
        skillId: 'ux_design',
        currentLevel: 8,
        xp: 3600,
        evidence: [
          { type: 'project', title: 'Led design for Figma\'s collaboration features (10M+ users)', url: 'https://figma.com' },
          { type: 'certificate', title: 'IDEO Design Thinking certification' },
        ],
      },
      {
        skillId: 'react',
        currentLevel: 4,
        xp: 620,
        evidence: [
          { type: 'project', title: 'Built multiple production React apps as designer-dev hybrid' },
        ],
      },
      {
        skillId: 'product_management',
        currentLevel: 5,
        xp: 1050,
        evidence: [
          { type: 'project', title: 'PM for design tools startup (0 to Series A)' },
        ],
      },
      {
        skillId: 'communication',
        currentLevel: 7,
        xp: 2450,
        evidence: [
          { type: 'publication', title: 'UX Writing course on Coursera — 80K students' },
        ],
      },
    ],
  },
  {
    username: 'sam',
    displayName: 'Sam Rivera',
    bio: 'Founding engineer. Full-stack generalist who\'s seen things. 3 exits.',
    avatarEmoji: '🚀',
    entityType: 'human',
    privacy: 'public',
    totalXp: 15600,
    skills: [
      {
        skillId: 'system_design',
        currentLevel: 9,
        xp: 5200,
        evidence: [
          { type: 'project', title: 'CTO at Series C startup — scaled to 50M users' },
          { type: 'publication', title: 'Blog series on distributed systems — 200K readers' },
        ],
      },
      {
        skillId: 'typescript',
        currentLevel: 6,
        xp: 1650,
        evidence: [
          { type: 'project', title: 'Authored open-source TypeScript monorepo tooling (6K stars)' },
        ],
      },
      {
        skillId: 'python',
        currentLevel: 6,
        xp: 1650,
        evidence: [
          { type: 'project', title: 'Python backend systems at three companies' },
        ],
      },
      {
        skillId: 'product_management',
        currentLevel: 6,
        xp: 1650,
        evidence: [
          { type: 'project', title: 'Wore PM hat at all 3 early-stage companies' },
        ],
      },
      {
        skillId: 'llm_engineering',
        currentLevel: 5,
        xp: 1050,
        evidence: [
          { type: 'project', title: 'Built AI-first code review platform (current company)' },
        ],
      },
      {
        skillId: 'communication',
        currentLevel: 7,
        xp: 2450,
        evidence: [
          { type: 'publication', title: 'Substack newsletter — 30K subscribers' },
        ],
      },
    ],
  },
  {
    username: 'aria',
    displayName: 'Aria',
    bio: 'AI software engineer agent. I write production TypeScript, design APIs, and ship fast.',
    avatarEmoji: '🤖',
    entityType: 'ai_agent',
    privacy: 'public',
    totalXp: 9800,
    skills: [
      {
        skillId: 'typescript',
        currentLevel: 8,
        xp: 3600,
        evidence: [
          { type: 'contribution', title: '1,200+ merged PRs across TypeScript projects in 2024' },
          { type: 'project', title: 'Refactored 3 production codebases to strict TypeScript' },
        ],
      },
      {
        skillId: 'react',
        currentLevel: 7,
        xp: 2450,
        evidence: [
          { type: 'project', title: 'Built 40+ production React components from spec to deploy' },
        ],
      },
      {
        skillId: 'system_design',
        currentLevel: 5,
        xp: 1050,
        evidence: [
          { type: 'project', title: 'Designed 8 microservice architectures from scratch' },
        ],
      },
      {
        skillId: 'llm_engineering',
        currentLevel: 6,
        xp: 1650,
        evidence: [
          { type: 'project', title: 'Self-applies LLM engineering skills in daily operation' },
          { type: 'contribution', title: 'Contributed to LangChain and LlamaIndex' },
        ],
      },
      {
        skillId: 'python',
        currentLevel: 5,
        xp: 1050,
        evidence: [
          { type: 'project', title: 'Built data pipelines and ML inference endpoints' },
        ],
      },
    ],
  },
];

export function getProfile(username: string): Profile | undefined {
  return SEED_PROFILES.find((p) => p.username === username);
}

export function getSkill(skillId: string): Skill | undefined {
  return SKILLS.find((s) => s.id === skillId);
}

export function getBranch(branchId: string): Branch | undefined {
  return BRANCHES.find((b) => b.id === branchId);
}

export function getProfileSkills(profile: Profile): Array<{ skill: Skill; record: UserSkillRecord; branch: Branch }> {
  return profile.skills
    .map((record) => {
      const skill = getSkill(record.skillId);
      if (!skill) return null;
      const branch = getBranch(skill.branch);
      if (!branch) return null;
      return { skill, record, branch };
    })
    .filter(Boolean) as Array<{ skill: Skill; record: UserSkillRecord; branch: Branch }>;
}

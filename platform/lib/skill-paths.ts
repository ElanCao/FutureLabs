/**
 * Pre-built skill path templates defining progression DAGs.
 * Each path defines nodes (skill IDs) and edges (prerequisite → skill).
 */

export interface PathTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  tagline: string;
  skills: string[]; // ordered from beginner to advanced
  edges: [string, string][]; // [from, to] prerequisite edges
}

export const PATH_TEMPLATES: PathTemplate[] = [
  {
    id: "frontend-engineer",
    name: "Frontend Engineer",
    icon: "🖥️",
    description: "Master modern frontend development from fundamentals to production-grade React applications.",
    tagline: "Build beautiful, performant web interfaces",
    skills: [
      "html_css", "javascript", "typescript", "react", "nextjs",
      "tailwindcss", "testing", "git", "web_performance",
    ],
    edges: [
      ["html_css", "javascript"],
      ["javascript", "typescript"],
      ["javascript", "react"],
      ["typescript", "react"],
      ["react", "nextjs"],
      ["html_css", "tailwindcss"],
      ["javascript", "testing"],
      ["javascript", "git"],
      ["react", "web_performance"],
    ],
  },
  {
    id: "ai-engineer",
    name: "AI Engineer",
    icon: "🤖",
    description: "Build AI-powered products and systems, from prompt engineering to production LLM deployments.",
    tagline: "Ship AI systems that work in production",
    skills: [
      "python", "ml_fundamentals", "llm_engineering", "prompt_engineering",
      "langchain", "vector_databases", "mlops", "system_design",
    ],
    edges: [
      ["python", "ml_fundamentals"],
      ["python", "prompt_engineering"],
      ["ml_fundamentals", "llm_engineering"],
      ["prompt_engineering", "llm_engineering"],
      ["llm_engineering", "langchain"],
      ["llm_engineering", "vector_databases"],
      ["langchain", "mlops"],
      ["vector_databases", "mlops"],
      ["mlops", "system_design"],
    ],
  },
  {
    id: "product-manager",
    name: "Product Manager",
    icon: "🎯",
    description: "Define and ship products that users love, balancing strategy with execution.",
    tagline: "Build products people actually want",
    skills: [
      "product_strategy", "user_research", "data_analysis", "roadmapping",
      "stakeholder_management", "agile", "product_metrics", "go_to_market",
    ],
    edges: [
      ["product_strategy", "user_research"],
      ["product_strategy", "roadmapping"],
      ["user_research", "product_metrics"],
      ["data_analysis", "product_metrics"],
      ["roadmapping", "stakeholder_management"],
      ["roadmapping", "agile"],
      ["product_metrics", "go_to_market"],
      ["stakeholder_management", "go_to_market"],
    ],
  },
];

// Map path skill IDs to display names for seed-data fallback
export const PATH_SKILL_NAMES: Record<string, { name: string; icon: string; branch: string }> = {
  // Frontend
  html_css: { name: "HTML & CSS", icon: "🌐", branch: "engineering" },
  javascript: { name: "JavaScript", icon: "🟨", branch: "engineering" },
  typescript: { name: "TypeScript", icon: "🔷", branch: "engineering" },
  react: { name: "React", icon: "⚛️", branch: "engineering" },
  nextjs: { name: "Next.js", icon: "▲", branch: "engineering" },
  tailwindcss: { name: "Tailwind CSS", icon: "🎨", branch: "design" },
  testing: { name: "Testing", icon: "🧪", branch: "engineering" },
  git: { name: "Git", icon: "🔀", branch: "engineering" },
  web_performance: { name: "Web Performance", icon: "⚡", branch: "engineering" },

  // AI Engineer
  python: { name: "Python", icon: "🐍", branch: "engineering" },
  ml_fundamentals: { name: "ML Fundamentals", icon: "📐", branch: "ai_ml" },
  llm_engineering: { name: "LLM Engineering", icon: "🧠", branch: "ai_ml" },
  prompt_engineering: { name: "Prompt Engineering", icon: "💬", branch: "ai_ml" },
  langchain: { name: "LangChain / Agents", icon: "⛓️", branch: "ai_ml" },
  vector_databases: { name: "Vector Databases", icon: "🗄️", branch: "data" },
  mlops: { name: "MLOps", icon: "🚀", branch: "cloud_infra" },
  system_design: { name: "System Design", icon: "🏗️", branch: "engineering" },

  // Product Manager
  product_strategy: { name: "Product Strategy", icon: "🧭", branch: "product" },
  user_research: { name: "User Research", icon: "🔍", branch: "product" },
  data_analysis: { name: "Data Analysis", icon: "📊", branch: "data" },
  roadmapping: { name: "Roadmapping", icon: "🗺️", branch: "product" },
  stakeholder_management: { name: "Stakeholder Mgmt", icon: "🤝", branch: "soft_skills" },
  agile: { name: "Agile / Scrum", icon: "♻️", branch: "product" },
  product_metrics: { name: "Product Metrics", icon: "📈", branch: "data" },
  go_to_market: { name: "Go-to-Market", icon: "🎯", branch: "product" },
};

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on human-AI collaboration, the future of work, and what we're building at FutureLabs.",
  alternates: {
    canonical: "/blog",
  },
};

const blogPosts = [
  {
    title: "The Open SkillTree Schema: Your Skills, Your Data",
    excerpt:
      "Why we built an open standard for skill data—and what it means for your career. Introducing SKILL.md, the portable format for skill data.",
    date: "April 15, 2026",
    category: "Ecosystem",
    slug: "open-skilltree-schema",
    status: "live" as const,
  },
  {
    title: "Building a Skill Taxonomy: 520+ Skills and Counting",
    excerpt:
      "How we mapped the landscape of human-AI collaboration. The story of building a comprehensive skill taxonomy from job boards, courses, and community feedback.",
    date: "April 8, 2026",
    category: "Product",
    slug: "building-skill-taxonomy",
    status: "live" as const,
  },
  {
    title: "Why the future is collaborative, not competitive",
    excerpt:
      "The most important question isn't what AI can do that humans can't — it's what becomes possible when they work together.",
    date: "March 25, 2026",
    category: "Vision",
    slug: "collaborative-future",
    status: "live" as const,
  },
  {
    title: "The economics of human-agent collaboration",
    excerpt:
      "What does fair compensation look like when agents and humans trade value? We're building the infrastructure to find out.",
    date: "Coming soon",
    category: "Ecosystem",
    slug: "economics-collaboration",
    status: "coming_soon" as const,
  },
];

export default function Blog() {
  return (
    <>
      {/* Header */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-balance">
            Blog
          </h1>
          <p className="mt-4 text-slate-300 text-lg max-w-2xl text-balance">
            Thoughts on AI collaboration, the future of work, and what we&apos;re
            learning as we build.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-20 bg-slate-50" aria-labelledby="posts-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 id="posts-heading" className="sr-only">
            Blog posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-400">{post.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 text-balance">
                  {post.status === "live" ? (
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                    >
                      {post.title}
                    </Link>
                  ) : (
                    post.title
                  )}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <div className="mt-6">
                  {post.status === "live" ? (
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                    >
                      Read more →
                    </Link>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Coming soon
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on human-AI collaboration, the future of work, and what we're building at FutureLabs.",
};

const placeholderPosts = [
  {
    title: "Why the future is collaborative, not competitive",
    excerpt:
      "The most important question isn't what AI can do that humans can't — it's what becomes possible when they work together.",
    date: "Coming soon",
    category: "Vision",
  },
  {
    title: "Designing a skill tree for real-world expertise",
    excerpt:
      "Human skills are messy, contextual, and hard to quantify. Here's how we're thinking about representing them in a way agents can actually use.",
    date: "Coming soon",
    category: "Product",
  },
  {
    title: "The economics of human-agent collaboration",
    excerpt:
      "What does fair compensation look like when agents and humans trade value? We're building the infrastructure to find out.",
    date: "Coming soon",
    category: "Ecosystem",
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

      {/* Coming soon banner */}
      <section className="py-6 bg-indigo-50 border-b border-indigo-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-sm text-indigo-700 text-center">
            Our blog is launching soon. Subscribe via the{" "}
            <Link
              href="/contact"
              className="font-medium underline underline-offset-2 hover:text-indigo-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              contact form
            </Link>{" "}
            to get notified when the first posts go live.
          </p>
        </div>
      </section>

      {/* Placeholder posts */}
      <section className="py-20 bg-slate-50" aria-labelledby="posts-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 id="posts-heading" className="sr-only">
            Upcoming posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {placeholderPosts.map((post) => (
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
                  {post.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <div className="mt-6">
                  <span className="text-xs text-slate-400 italic">
                    Coming soon
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

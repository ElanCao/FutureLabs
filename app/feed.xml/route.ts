import { NextResponse } from "next/server";

const SITE_URL = "https://futurelabs.vip";

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    title: "The Open SkillTree Schema — Adoption Guide",
    excerpt:
      "A practical guide to adopting SKILL.md: export, validate, extend, and integrate the open skill data format into your workflow.",
    date: "2026-05-26",
    slug: "open-skilltree-schema-adoption",
  },
  {
    title: "Skill Graphs vs. Skill Lists: Why Structure Matters",
    excerpt:
      "Flat skill lists are failing engineers and hiring managers. Here's why graph structures are the future of capability representation.",
    date: "2026-05-19",
    slug: "skill-graphs-vs-skill-lists",
  },
  {
    title: "What We Learned Shipping 520+ Skills",
    excerpt:
      "Behind the scenes of building SkillTree's taxonomy: five lessons from mapping 520+ skills across 20 domains.",
    date: "2026-05-05",
    slug: "shipping-520-skills",
  },
  {
    title: "Verified Skill Claims: Why Trust Matters in an Era of Vulnerable Agent Skills",
    excerpt:
      "The ClawHavoc crisis exposed a truth about the agent economy: unverified capabilities are a liability. Here's how SkillTree builds verification infrastructure for humans.",
    date: "2026-04-29",
    slug: "verified-skill-claims-security-era",
  },
  {
    title: "The Open SkillTree Schema: Your Skills, Your Data",
    excerpt:
      "Why we built an open standard for skill data—and what it means for your career. Introducing SKILL.md, the portable format for skill data.",
    date: "2026-04-15",
    slug: "open-skilltree-schema",
  },
  {
    title: "Building a Skill Taxonomy: 520+ Skills and Counting",
    excerpt:
      "How we mapped the landscape of human-AI collaboration. The story of building a comprehensive skill taxonomy from job boards, courses, and community feedback.",
    date: "2026-04-08",
    slug: "building-skill-taxonomy",
  },
  {
    title: "Why the future is collaborative, not competitive",
    excerpt:
      "The most important question isn't what AI can do that humans can't — it's what becomes possible when they work together.",
    date: "2026-03-25",
    slug: "collaborative-future",
  },
];

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const now = new Date().toUTCString();

  const items = blogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FutureLabs Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Thoughts on human-AI collaboration, the future of work, and what we're building at FutureLabs.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

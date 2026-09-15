import { getPosts } from "@/lib/posts";
import { Feed } from "feed";

const SITE_URL = "https://study-today.vercel.app";

export async function GET() {
  const posts = getPosts();

  const feed = new Feed({
    title: "今天学了吗",
    description: "记录课程笔记、论文阅读与算法学习",
    id: SITE_URL,
    link: SITE_URL,
    language: "zh-CN",
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} 今天学了吗`,
    feedLinks: {
      rss: `${SITE_URL}/rss.xml`,
    },
    author: {
      name: "今天学了吗",
    },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/posts/${post.slug}`,
      link: `${SITE_URL}/posts/${post.slug}`,
      description: post.description,
      date: new Date(post.date),
      category: post.tags.map((tag) => ({ name: tag })),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
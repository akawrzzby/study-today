import { getPosts, getAllCategories } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import Link from "next/link";

export default function Home() {
  const posts = getPosts();
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
          今天学了吗
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          记录课程笔记、论文阅读、算法学习。
          <br />
          以瑞士现代主义设计为灵感，专注内容，理性排版。
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {categories.slice(0, 6).map(({ category, count }) => (
            <Link
              key={category}
              href={`/categories/${encodeURIComponent(category)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border bg-card hover:bg-muted hover:border-primary/30 transition-all duration-200 no-underline"
            >
              <span>{category}</span>
              <span className="text-xs text-muted-foreground">{count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Posts Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-semibold">最新文章</h2>
          <Link
            href="/search"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            搜索文章
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">还没有文章</p>
            <p className="mt-2 text-sm">
              在 <code className="bg-muted px-1.5 py-0.5 rounded text-xs">content/posts/</code>{" "}
              中添加你的第一篇 MDX 文章
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
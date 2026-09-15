import Link from "next/link";
import type { Post } from "contentlayer/generated";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative rounded-xl border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
        <time dateTime={post.date}>
          {format(new Date(post.date), "yyyy 年 M 月 d 日", { locale: zhCN })}
        </time>
        <span aria-hidden="true">·</span>
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          {post.readingTime.text}
        </span>
      </div>

      <Link href={`/posts/${post.slug}`} className="no-underline">
        <h2 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
          {post.title}
        </h2>
      </Link>

      <p className="mt-2 text-muted-foreground line-clamp-2">{post.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href={`/categories/${encodeURIComponent(post.category)}`}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors no-underline"
        >
          {post.category}
        </Link>
        {post.tags.slice(0, 3).map((tag) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-muted-foreground bg-muted hover:bg-border transition-colors no-underline"
          >
            #{tag}
          </Link>
        ))}
        {post.tags.length > 3 && (
          <span className="text-xs text-muted-foreground">+{post.tags.length - 3}</span>
        )}
      </div>
    </article>
  );
}
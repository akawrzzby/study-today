import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { getPost, getPosts } from "@/lib/posts";
import CommentsWrapper from "./CommentsWrapper";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline mb-8"
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
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        返回首页
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Link
            href={`/categories/${encodeURIComponent(post.category)}`}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors no-underline"
          >
            {post.category}
          </Link>
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-muted-foreground bg-muted hover:bg-border transition-colors no-underline"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          {post.title}
        </h1>

        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={post.date}>
            {format(new Date(post.date), "yyyy 年 M 月 d 日", { locale: zhCN })}
          </time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime.text}</span>
        </div>
      </header>

      {/* Content — using contentlayer2's MDX body code */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.body.html }} />

      {/* Footer separator */}
      <hr className="my-12 border-border" />

      {/* Comments */}
      <CommentsWrapper postSlug={post.slug} />
    </article>
  );
}
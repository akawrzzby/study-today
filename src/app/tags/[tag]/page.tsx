import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({
    tag,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { tag } = await params;
  return {
    title: `#${decodeURIComponent(tag)}`,
    description: `查看标记为 ${decodeURIComponent(tag)} 的所有文章`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <Link
        href="/tags"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline mb-6"
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
        全部标签
      </Link>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
        #{tag}
      </h1>
      <p className="text-muted-foreground mb-8">
        {posts.length} 篇文章
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
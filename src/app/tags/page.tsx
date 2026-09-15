import { getAllTags } from "@/lib/posts";
import Link from "next/link";

export const metadata = {
  title: "标签",
  description: "按标签浏览文章",
};

export default function TagsPage() {
  const tags = getAllTags();
  const maxCount = tags.length > 0 ? tags[0].count : 1;

  // Font size scale based on tag count
  function getFontSize(count: number): string {
    const ratio = count / maxCount;
    if (ratio > 0.8) return "text-lg";
    if (ratio > 0.5) return "text-base";
    if (ratio > 0.2) return "text-sm";
    return "text-xs";
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
        标签
      </h1>
      <p className="text-muted-foreground mb-8">
        共 {tags.length} 个标签
      </p>

      <div className="flex flex-wrap gap-3">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className={`${getFontSize(count)} inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border bg-card hover:bg-muted hover:border-primary/30 transition-all duration-200 no-underline font-medium`}
          >
            <span>#{tag}</span>
            <span className="text-muted-foreground text-xs">{count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
import { getAllCategories } from "@/lib/posts";
import AdminPanelWrapper from "@/components/AdminPanelWrapper";
import Link from "next/link";

export const metadata = {
  title: "分类",
  description: "按分类浏览文章",
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <AdminPanelWrapper />

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
        分类
      </h1>
      <p className="text-muted-foreground mb-8">
        共 {categories.length} 个分类
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map(({ category, count }) => (
          <Link
            key={category}
            href={`/categories/${encodeURIComponent(category)}`}
            className="flex items-center justify-between rounded-xl border bg-card p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 no-underline"
          >
            <span className="font-medium text-foreground">{category}</span>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium text-muted-foreground">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
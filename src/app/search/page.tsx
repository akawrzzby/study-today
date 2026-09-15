"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Post } from "contentlayer/generated";
import { searchPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Post[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    const found = searchPosts(q);
    setResults(found);
    setHasSearched(true);
  }, []);

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery);
    }
  }, [initialQuery, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.replace(`/search?q=${encodeURIComponent(q)}`);
      doSearch(q);
    }
  };

  return (
    <>
      {/* Search form */}
      <form onSubmit={handleSubmit} className="mb-10" role="search">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章..."
            aria-label="搜索文章"
            className="w-full pl-12 pr-24 py-3.5 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow text-base"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors cursor-pointer"
          >
            搜索
          </button>
        </div>
      </form>

      {/* Results */}
      {hasSearched && (
        <div>
          <p className="text-sm text-muted-foreground mb-6">
            找到 {results.length} 篇文章
            {query && (
              <>
                {" "}
                匹配 &ldquo;{query}&rdquo;
              </>
            )}
          </p>
          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>没有找到匹配的文章</p>
              <p className="mt-2 text-sm">试试其他关键词</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {results.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
        搜索
      </h1>
      <p className="text-muted-foreground mb-8">
        搜索文章标题、描述、标签和分类
      </p>
      <Suspense fallback={<div className="text-muted-foreground">加载搜索...</div>}>
        <SearchForm />
      </Suspense>
    </div>
  );
}
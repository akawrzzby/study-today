import { allPosts, Post } from "contentlayer/generated";

export type { Post };

/**
 * Get all published posts sorted by date descending
 */
export function getPosts(): Post[] {
  return allPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single post by slug
 */
export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

/**
 * Get all unique tags with their post counts
 */
export function getAllTags(): { tag: string; count: number }[] {
  const tagMap = new Map<string, number>();
  for (const post of getPosts()) {
    for (const tag of post.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get all unique categories with their post counts
 */
export function getAllCategories(): { category: string; count: number }[] {
  const catMap = new Map<string, number>();
  for (const post of getPosts()) {
    catMap.set(post.category, (catMap.get(post.category) || 0) + 1);
  }
  return Array.from(catMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): Post[] {
  return getPosts().filter((post) => post.tags.includes(tag));
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: string): Post[] {
  return getPosts().filter((post) => post.category === category);
}

/**
 * Search posts by query
 */
export function searchPosts(query: string): Post[] {
  const q = query.toLowerCase();
  return getPosts().filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.description.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q)) ||
      post.category.toLowerCase().includes(q)
  );
}
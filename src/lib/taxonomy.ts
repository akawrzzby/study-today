import fs from "fs";
import path from "path";

interface TaxonomyItem {
  name: string;
  slug: string;
}

export interface TaxonomyConfig {
  categories: TaxonomyItem[];
  tags: TaxonomyItem[];
}

/**
 * 读取 taxonomy.json（仅服务端可用）
 */
export function getTaxonomyConfig(): TaxonomyConfig {
  try {
    const filePath = path.join(process.cwd(), "content", "taxonomy.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { categories: [], tags: [] };
  }
}
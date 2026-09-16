import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function headers() {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

// GET: 读取 taxonomy
export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/taxonomy?id=eq.main&select=*`,
      { headers: headers() }
    );
    const rows = await res.json();

    if (rows && rows.length > 0) {
      const row = rows[0];
      // JSONB 字段在 REST API 中已经是对象
      const categories = Array.isArray(row.categories) ? row.categories : [];
      const tags = Array.isArray(row.tags) ? row.tags : [];
      return NextResponse.json({ categories, tags });
    }

    return NextResponse.json({ categories: [], tags: [] });
  } catch {
    return NextResponse.json(
      { error: "Failed to read taxonomy" },
      { status: 500 }
    );
  }
}

// PUT: 更新 taxonomy
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.categories || !body.tags || !Array.isArray(body.categories) || !Array.isArray(body.tags)) {
      return NextResponse.json(
        { error: "Invalid taxonomy format" },
        { status: 400 }
      );
    }

    for (const item of [...body.categories, ...body.tags]) {
      if (typeof item.name !== "string" || typeof item.slug !== "string") {
        return NextResponse.json(
          { error: "Each item must have name and slug" },
          { status: 400 }
        );
      }
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/taxonomy?id=eq.main`,
      {
        method: "PATCH",
        headers: { ...headers(), Prefer: "return=representation" },
        body: JSON.stringify({
          categories: body.categories,
          tags: body.tags,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: errText }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { categories: body.categories, tags: body.tags } });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Failed to update taxonomy" },
      { status: 500 }
    );
  }
}
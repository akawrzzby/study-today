import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// GET: 读取 taxonomy
export async function GET() {
  try {
    const { data } = await supabase
      .from("taxonomy")
      .select("*")
      .eq("id", "main")
      .single();

    if (data) {
      return NextResponse.json({
        categories: data.categories || [],
        tags: data.tags || [],
      });
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

    const { error } = await supabase
      .from("taxonomy")
      .upsert({
        id: "main",
        categories: body.categories,
        tags: body.tags,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { categories: body.categories, tags: body.tags } });
  } catch {
    return NextResponse.json(
      { error: "Failed to update taxonomy" },
      { status: 500 }
    );
  }
}
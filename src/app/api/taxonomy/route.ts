import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const TAXONOMY_PATH = path.join(process.cwd(), "content", "taxonomy.json");

// GET: 读取 taxonomy
export async function GET() {
  try {
    const raw = fs.readFileSync(TAXONOMY_PATH, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
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

    // 验证格式
    if (!body.categories || !body.tags || !Array.isArray(body.categories) || !Array.isArray(body.tags)) {
      return NextResponse.json(
        { error: "Invalid taxonomy format" },
        { status: 400 }
      );
    }

    // 确保每个 item 有 name 和 slug
    for (const item of [...body.categories, ...body.tags]) {
      if (typeof item.name !== "string" || typeof item.slug !== "string") {
        return NextResponse.json(
          { error: "Each item must have name and slug" },
          { status: 400 }
        );
      }
    }

    // 写入文件
    const json = JSON.stringify(body, null, 2) + "\n";
    fs.writeFileSync(TAXONOMY_PATH, json, "utf-8");

    return NextResponse.json({ success: true, data: body });
  } catch {
    return NextResponse.json(
      { error: "Failed to update taxonomy" },
      { status: 500 }
    );
  }
}
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthProvider";
import AdminPanel from "./AdminPanel";

interface TaxonomyItem {
  name: string;
  slug: string;
}

interface TaxonomyData {
  categories: TaxonomyItem[];
  tags: TaxonomyItem[];
}

export default function AdminPanelWrapper() {
  const { isAdmin } = useAuth();
  const [taxonomy, setTaxonomy] = useState<TaxonomyData>({ categories: [], tags: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // 加载 taxonomy 数据
  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/taxonomy")
      .then((res) => res.json())
      .then((data) => {
        setTaxonomy(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAdmin]);

  const handleUpdate = useCallback(async (newData: TaxonomyData) => {
    setTaxonomy(newData);
    setSaving(true);
    setSaveMessage("");

    try {
      const res = await fetch("/api/taxonomy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (res.ok) {
        setSaveMessage("✓ 已保存");
      } else {
        setSaveMessage("✗ 保存失败");
      }
    } catch {
      setSaveMessage("✗ 网络错误");
    }

    setSaving(false);
    setTimeout(() => setSaveMessage(""), 3000);
  }, []);

  if (!isAdmin) return null;

  if (loading) {
    return (
      <div className="border rounded-xl bg-card p-6 shadow-card">
        <p className="text-sm text-muted-foreground">加载中...</p>
      </div>
    );
  }

  return (
    <div className="mb-12 space-y-4">
      <AdminPanel taxonomy={taxonomy} onUpdate={handleUpdate} />
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          修改分类和标签后，所有页面的筛选选项会自动更新
        </span>
        {saving && <span className="text-muted-foreground">保存中...</span>}
        {saveMessage && (
          <span className={saveMessage.startsWith("✓") ? "text-green-600" : "text-destructive"}>
            {saveMessage}
          </span>
        )}
      </div>
    </div>
  );
}
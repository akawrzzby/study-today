"use client";

import { useState } from "react";

interface TaxonomyItem {
  name: string;
  slug: string;
}

interface TaxonomyData {
  categories: TaxonomyItem[];
  tags: TaxonomyItem[];
}

interface AdminPanelProps {
  taxonomy: TaxonomyData;
  onUpdate: (data: TaxonomyData) => void;
}

export default function AdminPanel({ taxonomy, onUpdate }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"categories" | "tags">("categories");
  const [newName, setNewName] = useState("");
  const [editingItem, setEditingItem] = useState<{ type: "categories" | "tags"; index: number; name: string } | null>(null);
  const [editName, setEditName] = useState("");

  const items = activeTab === "categories" ? taxonomy.categories : taxonomy.tags;

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    const slug = name;
    const key = activeTab;
    const current = [...taxonomy[key]];
    if (current.some((item) => item.slug === slug)) return; // 去重
    onUpdate({
      ...taxonomy,
      [key]: [...current, { name, slug }],
    });
    setNewName("");
  }

  function handleDelete(index: number) {
    const key = activeTab;
    const current = [...taxonomy[key]];
    current.splice(index, 1);
    onUpdate({ ...taxonomy, [key]: current });
  }

  function startEdit(index: number) {
    setEditingItem({ type: activeTab, index, name: items[index].name });
    setEditName(items[index].name);
  }

  function saveEdit() {
    if (!editingItem) return;
    const name = editName.trim();
    if (!name) return;
    const slug = name;
    const key = editingItem.type;
    const current = [...taxonomy[key]];
    if (current.some((item, i) => i !== editingItem.index && item.slug === slug)) return;
    current[editingItem.index] = { name, slug };
    onUpdate({ ...taxonomy, [key]: current });
    setEditingItem(null);
    setEditName("");
  }

  function cancelEdit() {
    setEditingItem(null);
    setEditName("");
  }

  return (
    <div className="border rounded-xl bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-accent"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          管理员面板
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "categories"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          分类管理 ({taxonomy.categories.length})
        </button>
        <button
          onClick={() => setActiveTab("tags")}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "tags"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          标签管理 ({taxonomy.tags.length})
        </button>
      </div>

      {/* Add new */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          placeholder={`添加新${activeTab === "categories" ? "分类" : "标签"}...`}
          aria-label={`新${activeTab === "categories" ? "分类" : "标签"}名称`}
          className="flex-1 px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors cursor-pointer"
        >
          添加
        </button>
      </div>

      {/* Items list */}
      <ul className="space-y-1 max-h-64 overflow-y-auto" role="list">
        {items.map((item, index) => (
          <li
            key={item.slug}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
          >
            {editingItem?.type === activeTab && editingItem?.index === index ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  autoFocus
                />
                <button
                  onClick={saveEdit}
                  className="px-2 py-1 rounded text-xs font-medium bg-primary text-white hover:bg-primary-light transition-colors cursor-pointer"
                  aria-label="保存"
                >
                  保存
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-2 py-1 rounded text-xs font-medium border text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                  aria-label="取消"
                >
                  取消
                </button>
              </div>
            ) : (
              <>
                <span className="text-sm text-foreground">{item.name}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(index)}
                    className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    aria-label={`编辑 ${item.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    aria-label={`删除 ${item.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
        {items.length === 0 && (
          <li className="px-3 py-4 text-sm text-muted-foreground text-center">
            暂无{activeTab === "categories" ? "分类" : "标签"}，请添加
          </li>
        )}
      </ul>
    </div>
  );
}
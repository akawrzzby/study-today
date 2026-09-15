"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!ref.current) return;

    // Clean up previous giscus
    const existingScript = ref.current.querySelector("script");
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "OWNER/REPO"); // TODO: Replace with your repo
    script.setAttribute("data-repo-id", "REPO_ID"); // TODO: Replace with your repo id
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "CATEGORY_ID"); // TODO: Replace
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    ref.current.appendChild(script);
  }, [theme]);

  return (
    <div className="mt-12">
      <h3 className="font-serif text-xl font-semibold mb-6">评论</h3>
      <div ref={ref} />
    </div>
  );
}
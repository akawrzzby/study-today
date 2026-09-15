"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 no-underline ${
        isActive
          ? "bg-primary text-white"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-5xl px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="no-underline flex items-center gap-2 group">
          <span className="font-serif text-xl font-bold text-primary group-hover:text-primary-light transition-colors duration-200">
            今天学了吗
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1" aria-label="主导航">
          <NavLink href="/">首页</NavLink>
          <NavLink href="/categories">分类</NavLink>
          <NavLink href="/tags">标签</NavLink>
          <NavLink href="/search">搜索</NavLink>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {/* Sun icon */}
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          {/* RSS */}
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="RSS 订阅"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 no-underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M4 11a9 9 0 019 9" />
              <path d="M4 4a16 16 0 0116 16" />
              <circle cx="5" cy="19" r="1" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
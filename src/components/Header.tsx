"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";
import { useUserAuth } from "./UserAuthProvider";
import LoginModal from "./LoginModal";
import AuthModal from "./AuthModal";

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
  const { isAdmin, logout } = useAuth();
  const { user, profile, signOut } = useUserAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
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
          <div className="flex items-center gap-1">
            {/* User auth button */}
            {user ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="退出登录"
                title={`当前用户: ${profile?.username || user.email}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4-4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
                <span className="hidden sm:inline">{profile?.username || "用户"}</span>
              </button>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="用户登录/注册"
                title="登录/注册"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4-4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
                <span className="hidden sm:inline">登录</span>
              </button>
            )}

            {/* Admin indicator / login button */}
            {isAdmin ? (
              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-accent hover:bg-muted transition-colors cursor-pointer"
                aria-label="退出管理员"
                title="退出管理员模式"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" />
                  <path d="M16 3.128a9 9 0 010 17.744" />
                  <path d="M22 12h-8M18 9l3 3-3 3" />
                </svg>
                <span className="hidden sm:inline">退出</span>
              </button>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="管理员登录"
                title="管理员登录"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4-4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
                <span className="hidden sm:inline">管理</span>
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
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

      {/* Login Modal (admin) */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      {/* Auth Modal (user login/register) */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
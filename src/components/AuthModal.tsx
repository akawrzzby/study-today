"use client";

import { useState, useRef, useEffect } from "react";
import { useUserAuth } from "./UserAuthProvider";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useUserAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [homepage, setHomepage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setUsername("");
      setHomepage("");
      setError("");
      setSuccess("");
      setMode("login");
      setTimeout(() => emailRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "register") {
      if (!username.trim()) {
        setError("请输入用户名");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("密码至少 6 位");
        setLoading(false);
        return;
      }
      const result = await signUp(email, password, username.trim(), homepage.trim());
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("注册成功！请检查邮箱确认（如未收到可尝试直接登录）。");
      }
    } else {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    }

    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={mode === "login" ? "用户登录" : "用户注册"}
    >
      <div className="w-full max-w-sm mx-4 bg-card border rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
        <h2 className="font-serif text-xl font-semibold text-foreground mb-1">
          {mode === "login" ? "用户登录" : "创建账号"}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === "login" ? "登录后可发表评论" : "注册后可发表评论和互动"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label htmlFor="auth-username" className="block text-sm font-medium text-foreground mb-1.5">
                用户名
              </label>
              <input
                id="auth-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                placeholder="你的用户名"
                autoComplete="username"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-foreground mb-1.5">
              邮箱
            </label>
            <input
              ref={emailRef}
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-foreground mb-1.5">
              密码
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
              placeholder={mode === "register" ? "至少 6 位" : "输入密码"}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {mode === "register" && (
            <div>
              <label htmlFor="auth-homepage" className="block text-sm font-medium text-foreground mb-1.5">
                个人主页 <span className="text-muted-foreground">(选填)</span>
              </label>
              <input
                id="auth-homepage"
                type="url"
                value={homepage}
                onChange={(e) => setHomepage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                placeholder="https://你的主页"
                autoComplete="url"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive" role="alert">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600" role="status">{success}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "处理中..." : mode === "login" ? "登录" : "注册"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-center text-muted-foreground">
          {mode === "login" ? (
            <>还没有账号？{" "}
              <button
                onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
                className="text-primary hover:text-primary-light transition-colors cursor-pointer font-medium"
              >
                注册
              </button>
            </>
          ) : (
            <>已有账号？{" "}
              <button
                onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                className="text-primary hover:text-primary-light transition-colors cursor-pointer font-medium"
              >
                登录
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
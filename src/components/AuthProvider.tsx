"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AuthContextValue {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
});

const ADMIN_USERNAME = "we1renze";
const ADMIN_PASSWORD = "Wrz20020515";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  // 从 localStorage 恢复登录状态
  useEffect(() => {
    const stored = localStorage.getItem("admin_auth");
    if (stored === "true") {
      setIsAdmin(true);
    }
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem("admin_auth", "true");
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    localStorage.removeItem("admin_auth");
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
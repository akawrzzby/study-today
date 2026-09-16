import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { UserAuthProvider } from "@/components/UserAuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "今天学了吗",
    template: "%s | 今天学了吗",
  },
  description:
    "记录课程笔记、论文阅读与算法学习 — 一个干净、理性的个人知识博客",
  metadataBase: new URL("https://study-today.vercel.app"),
  openGraph: {
    title: "今天学了吗",
    description: "记录课程笔记、论文阅读与算法学习",
    type: "website",
    locale: "zh_CN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="今天学了吗 RSS"
          href="/rss.xml"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <UserAuthProvider>
            <AuthProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </AuthProvider>
          </UserAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
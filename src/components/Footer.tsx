export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-auto">
      <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {currentYear} 今天学了吗 · 记录思考，分享知识</p>
        <div className="flex items-center gap-4">
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors no-underline"
          >
            RSS 订阅
          </a>
          <span aria-hidden="true">·</span>
          <span>
            Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Next.js
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
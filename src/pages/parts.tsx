import { site } from '../site.config';

/** 站头：站名用大号衬线，tagline 紧跟，靠一条细线与正文分开 */
export function SiteHeader() {
  return (
    <header className="border-b border-rule pb-8 pt-14 sm:pt-20">
      <a href="/" className="font-serif text-3xl font-semibold tracking-tight text-ink">
        {site.name}
      </a>
      <p className="mt-3 max-w-[34em] font-serif text-[15px] leading-relaxed text-ink-2">
        {site.description}
      </p>
    </header>
  );
}

/** 页脚：作者与联系方式，不做社交图标堆砌 */
export function SiteFooter() {
  return (
    <footer className="mt-4 border-t border-rule py-10 font-sans text-[13px] leading-relaxed text-ink-3">
      <p className="max-w-[34em]">{site.author}，写前端，也写下为什么这么写。</p>
      <p className="mt-4">
        © {new Date().getFullYear()} {site.name} ·{' '}
        <a href="/rss.xml" className="underline decoration-rule-strong hover:text-accent-ink">
          RSS
        </a>
      </p>
    </footer>
  );
}

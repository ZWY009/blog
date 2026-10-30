import { site } from '../data/posts';

/** 站点头部：名字用大字衬线，tagline 紧跟。靠一条细线与正文分开。 */
export function SiteHeader() {
  return (
    <header className="border-b border-rule pb-8 pt-14 sm:pt-20">
      <a
        href="#/"
        className="font-serif text-3xl font-semibold tracking-tight text-ink transition-colors hover:text-accent-ink sm:text-4xl"
      >
        {site.name}
      </a>
      <p className="mt-3 max-w-[34em] font-serif text-[15px] leading-relaxed text-ink-2">
        {site.tagline}
      </p>
    </header>
  );
}

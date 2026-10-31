import { site } from '../site.config';

const NAV = [
  { key: 'projects', href: '/projects/', label: '项目' },
  { key: 'writing', href: '/writing/', label: '文章' },
  { key: 'about', href: '/about/', label: '关于' },
] as const;

/** 站头导航：左边站名，右边「项目 / 文章 / 关于」 */
export function SiteNav({ current }: { current?: 'projects' | 'writing' | 'about' }) {
  return (
    <nav className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule py-6">
      <a href="/" className="font-serif text-lg font-semibold tracking-tight text-ink">
        {site.name}
      </a>
      <ul className="flex items-center gap-6 font-sans text-[13px]">
        {NAV.map((item) => {
          const active = current === item.key;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={
                  active
                    ? 'text-accent-ink underline decoration-accent decoration-1 underline-offset-4'
                    : 'text-ink-2 hover:text-accent-ink'
                }
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** 页脚 */
export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-rule py-10 font-sans text-[13px] leading-relaxed text-ink-3">
      <p className="max-w-[36em]">{site.author} · 写前端，也写让交付不变质的东西。</p>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        <a href={`mailto:${site.email}`} className="hover:text-accent-ink">
          {site.email}
        </a>
        <a href={site.github} className="hover:text-accent-ink">
          GitHub
        </a>
        <a href="/rss.xml" className="hover:text-accent-ink">
          RSS
        </a>
      </p>
      <p className="mt-4">
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}

/** 技术栈小标签 */
export function StackChips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5 font-sans text-[11.5px]">
      {items.map((item) => (
        <li key={item} className="rounded border border-rule px-1.5 py-0.5 text-ink-2">
          {item}
        </li>
      ))}
    </ul>
  );
}

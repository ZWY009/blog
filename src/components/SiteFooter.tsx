import { site } from '../data/posts';

/** 页脚：作者信息与联系方式，保持克制，不做社交图标堆砌。 */
export function SiteFooter() {
  return (
    <footer className="mt-6 border-t border-rule py-10 font-sans text-[13px] text-ink-3">
      <p className="max-w-[34em] leading-relaxed">
        {site.author}，写前端，也写一些关于判断的东西。 想聊可以发信到{' '}
        <a
          href={`mailto:${site.email}`}
          className="text-accent-ink underline decoration-rule-strong hover:decoration-accent"
        >
          {site.email}
        </a>
        。
      </p>
      <p className="mt-4">
        © {new Date().getFullYear()} {site.name} · 用 React + Vite + Tailwind 手工搭的
      </p>
    </footer>
  );
}

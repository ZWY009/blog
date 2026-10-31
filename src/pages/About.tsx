import type { ProjectMeta } from '../lib/posts';
import { site } from '../site.config';
import { SiteFooter, SiteNav, StackChips } from './parts';

type Props = { projects: ProjectMeta[] };

const PRINCIPLES = [
  {
    title: '让结论可证伪',
    body: '「做完了」不是结论，能被工具或数据验证的才算。写校验器时会顺手给它配坏样本，证明它真的会报错。',
  },
  {
    title: '把易变的部分隔开',
    body: '采集会挂、页面会改，但清洗和排版不该跟着重写。段与段之间只用一种数据接口，谁坏了修谁。',
  },
  {
    title: '先问可感知的收益',
    body: '动手前说清楚这个改动改善了哪个能被人感知的指标。说不出来，就不做。',
  },
];

/** 关于：把「怎么做事」讲清楚，比罗列技能更能说明问题 */
export function About({ projects }: Props) {
  const timeline = [...projects].sort((a, b) => b.period.localeCompare(a.period));

  return (
    <div className="mx-auto w-full max-w-[46rem] px-6">
      <SiteNav current="about" />

      <header className="pb-8 pt-12">
        <h1 className="font-serif text-[28px] font-semibold tracking-tight text-ink">关于</h1>
        <p className="mt-4 max-w-[34em] font-serif text-[17px] leading-relaxed text-ink">
          {site.tagline}
        </p>
        <p className="mt-3 max-w-[34em] font-serif text-[15px] leading-relaxed text-ink-2">
          {site.intro}
        </p>
      </header>

      <section aria-labelledby="principles" className="border-t border-rule py-10">
        <h2
          id="principles"
          className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-3"
        >
          怎么做事
        </h2>
        <ul className="mt-6 space-y-6">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="grid gap-1.5 sm:grid-cols-[11rem_1fr] sm:gap-5">
              <span className="font-serif text-[16px] font-semibold text-ink">{p.title}</span>
              <span className="font-serif text-[15px] leading-relaxed text-ink-2">{p.body}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="skills" className="border-t border-rule py-10">
        <h2 id="skills" className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-3">
          技术栈
        </h2>
        <div className="mt-4">
          <StackChips items={site.skills} />
        </div>
      </section>

      <section aria-labelledby="timeline" className="border-t border-rule py-10">
        <h2 id="timeline" className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-3">
          项目时间线
        </h2>
        <ul className="mt-6 divide-y divide-rule">
          {timeline.map((p) => (
            <li key={p.slug} className="py-4">
              <a
                href={`/projects/${p.slug}/`}
                className="group grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-5"
              >
                <span className="font-sans text-[12px] tabular-nums text-ink-3">{p.period}</span>
                <span>
                  <span className="block font-serif text-[16px] text-ink group-hover:text-accent-ink">
                    {p.title}
                  </span>
                  <span className="mt-0.5 block font-sans text-[12px] text-ink-3">{p.role}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="site" className="border-t border-rule py-10">
        <h2 id="site" className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-3">
          这个站本身
        </h2>
        <div className="mt-4 max-w-[34em] font-serif text-[15px] leading-relaxed text-ink-2">
          <p>
            用 React + Vite + Tailwind 写，但
            <strong className="font-semibold text-ink">不是单页应用</strong>
            ：所有页面在构建期生成静态 HTML，浏览器端不需要加载任何 JS。文章与项目都来自
            Markdown，构建时自动生成 RSS、sitemap、SEO 标签和结构化数据。
          </p>
          <p className="mt-3">
            源码在{' '}
            <a
              href={`${site.github}/blog`}
              className="text-accent-ink underline decoration-rule-strong underline-offset-4"
            >
              GitHub
            </a>
            ，推送到 main 自动构建部署。
          </p>
        </div>
      </section>

      <section aria-labelledby="contact" className="border-t border-rule py-10">
        <h2 id="contact" className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-3">
          联系
        </h2>
        <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-sans text-[14px]">
          <a
            href={`mailto:${site.email}`}
            className="text-accent-ink underline decoration-rule-strong underline-offset-4"
          >
            {site.email}
          </a>
          <a href={site.github} className="text-ink-2 hover:text-accent-ink">
            GitHub
          </a>
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}

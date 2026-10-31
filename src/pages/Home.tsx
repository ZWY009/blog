import type { PostMeta, ProjectMeta } from '../lib/posts';
import { formatMonthDay } from '../lib/posts';
import { site } from '../site.config';
import { SiteFooter, SiteNav, StackChips } from './parts';

type Props = { projects: ProjectMeta[]; posts: PostMeta[] };

/**
 * 首页 = 面试官看的第一屏。
 * 目标：10 秒内说清「我是谁 / 会什么 / 做过什么」，所以项目排在文章前面。
 */
export function Home({ projects, posts }: Props) {
  return (
    <div className="mx-auto w-full max-w-[46rem] px-6">
      <SiteNav />

      <header className="pb-12 pt-14 sm:pt-20">
        <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-3">个人项目集</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-[44px]">
          {site.name}
        </h1>
        <p className="mt-5 max-w-[32em] font-serif text-[19px] leading-relaxed text-ink">
          {site.tagline}
        </p>
        <p className="mt-4 max-w-[32em] font-serif text-[15px] leading-relaxed text-ink-2">
          {site.intro}
        </p>
        <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 font-sans text-[13px]">
          <a
            href="/projects/"
            className="text-accent-ink underline decoration-rule-strong underline-offset-4 hover:decoration-accent"
          >
            看项目 →
          </a>
          <a href={site.github} className="text-ink-2 hover:text-accent-ink">
            GitHub
          </a>
          <a href={`mailto:${site.email}`} className="text-ink-2 hover:text-accent-ink">
            {site.email}
          </a>
        </p>
      </header>

      <section aria-labelledby="skills" className="border-t border-rule py-8">
        <h2 id="skills" className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-3">
          常用技术
        </h2>
        <div className="mt-4">
          <StackChips items={site.skills} />
        </div>
      </section>

      <section aria-labelledby="work" className="border-t border-rule py-10">
        <h2 id="work" className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-3">
          项目
        </h2>
        <ul className="mt-6 space-y-9">
          {projects.map((p, index) => (
            <li key={p.slug}>
              <a
                href={`/projects/${p.slug}/`}
                className="group grid gap-2 sm:grid-cols-[3rem_1fr] sm:gap-5"
              >
                <span className="pt-1.5 font-sans text-[11px] tabular-nums text-ink-3">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block font-serif text-[21px] font-semibold leading-snug text-ink group-hover:text-accent-ink">
                    {p.title}
                  </span>
                  <span className="mt-1 block font-serif text-[15px] leading-relaxed text-ink-2">
                    {p.tagline}
                  </span>
                  <span className="mt-2 block font-sans text-[12px] text-accent">
                    {p.highlight}
                  </span>
                  <span className="mt-3 block">
                    <StackChips items={p.stack} />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="writing" className="border-t border-rule py-10">
        <h2 id="writing" className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-3">
          最近写的
        </h2>
        <ul className="mt-6 space-y-3.5">
          {posts.slice(0, 3).map((post) => (
            <li key={post.slug}>
              <a
                href={`/post/${post.slug}/`}
                className="group flex flex-wrap items-baseline gap-x-4 gap-y-1"
              >
                <span className="font-sans text-[12px] tabular-nums text-ink-3">
                  {formatMonthDay(post.date)}
                </span>
                <span className="font-serif text-[16px] text-ink group-hover:text-accent-ink">
                  {post.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-5 font-sans text-[13px]">
          <a
            href="/writing/"
            className="text-accent-ink underline decoration-rule-strong underline-offset-4"
          >
            全部文章 →
          </a>
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}

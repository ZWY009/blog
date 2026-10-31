import { link } from '../site.config';
import type { ProjectMeta } from '../lib/posts';
import { SiteFooter, SiteNav, StackChips } from './parts';

type Props = { projects: ProjectMeta[] };

/** 项目列表页：比首页多给「时间 / 角色」，方便面试官快速扫 */
export function ProjectsIndex({ projects }: Props) {
  return (
    <div className="mx-auto w-full max-w-[46rem] px-6">
      <SiteNav current="projects" />

      <header className="pb-8 pt-12">
        <h1 className="font-serif text-[28px] font-semibold tracking-tight text-ink">项目</h1>
        <p className="mt-3 max-w-[34em] font-serif text-[15px] leading-relaxed text-ink-2">
          每个项目都写了「要解决什么问题」「关键判断是什么」「结果怎么验证」。点进去看细节。
        </p>
      </header>

      <main className="border-t border-rule">
        <ul className="divide-y divide-rule">
          {projects.map((p) => (
            <li key={p.slug} className="py-8">
              <a href={link(`/projects/${p.slug}/`)} className="group block">
                <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-sans text-[12px] text-ink-3">
                  <span className="tabular-nums">{p.period}</span>
                  <span>{p.role}</span>
                </span>
                <span className="mt-2 block font-serif text-[21px] font-semibold leading-snug text-ink group-hover:text-accent-ink">
                  {p.title}
                </span>
                <span className="mt-1.5 block font-serif text-[15px] leading-relaxed text-ink-2">
                  {p.tagline}
                </span>
                <span className="mt-3 block">
                  <StackChips items={p.stack} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </div>
  );
}

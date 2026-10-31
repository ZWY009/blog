import { link } from '../site.config';
import type { Project } from '../lib/posts';
import { SiteFooter, SiteNav, StackChips } from './parts';

type Props = { project: Project };

/** 项目详情：先把「结果」和「关键判断」摆出来，再讲过程。面试官时间有限。 */
export function ProjectPage({ project }: Props) {
  const { links } = project;

  return (
    <div className="mx-auto w-full max-w-[46rem] px-6">
      <SiteNav current="projects" />

      <main>
        <article className="py-12">
          <a
            href={link('/projects/')}
            className="mb-8 inline-block font-sans text-[13px] text-ink-3 hover:text-accent-ink"
          >
            ← 全部项目
          </a>

          <p className="font-sans text-[12px] text-ink-3">
            {project.period} · {project.role}
          </p>

          <h1 className="mt-3 font-serif text-[28px] font-semibold leading-[1.35] tracking-tight text-ink sm:text-[34px]">
            {project.title}
          </h1>

          <p className="mt-4 max-w-[34em] font-serif text-[17px] leading-relaxed text-ink-2">
            {project.tagline}
          </p>

          <div className="mt-6 border-y border-rule py-5">
            <StackChips items={project.stack} />
          </div>

          {project.highlight ? (
            <p className="mt-8 border-l-2 border-accent pl-4 font-serif text-[17px] leading-relaxed text-ink">
              {project.highlight}
            </p>
          ) : null}

          {project.highlights.length > 0 ? (
            <section aria-labelledby="results" className="mt-8">
              <h2
                id="results"
                className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-3"
              >
                可验证的结果
              </h2>
              <ul className="mt-4 space-y-2">
                {project.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-3 font-serif text-[15px] leading-relaxed text-ink"
                  >
                    <span aria-hidden="true" className="text-accent">
                      ·
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* 正文由构建脚本用 marked + shiki 渲染，来源是本仓库的 markdown */}
          <div className="prose mt-10" dangerouslySetInnerHTML={{ __html: project.html }} />

          {(links.repo || links.demo) && (
            <footer className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-6 font-sans text-[13px]">
              {links.demo ? (
                <a
                  href={links.demo}
                  className="text-accent-ink underline decoration-rule-strong underline-offset-4"
                >
                  在线看这个项目 →
                </a>
              ) : null}
              {links.repo ? (
                <a
                  href={links.repo}
                  className="text-accent-ink underline decoration-rule-strong underline-offset-4"
                >
                  源码 →
                </a>
              ) : null}
            </footer>
          )}
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

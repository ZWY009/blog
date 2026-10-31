import { formatMonthDay, yearOf, type PostMeta } from '../lib/posts';
import { SiteFooter, SiteNav } from './parts';

type Props = { posts: PostMeta[] };

/** 文章列表：按年份分组的编辑式排版 */
export function WritingIndex({ posts }: Props) {
  const years = [...new Set(posts.map((p) => yearOf(p.date)))].sort((a, b) => b.localeCompare(a));

  return (
    <div className="mx-auto w-full max-w-[46rem] px-6">
      <SiteNav current="writing" />

      <header className="pb-8 pt-12">
        <h1 className="font-serif text-[28px] font-semibold tracking-tight text-ink">文章</h1>
        <p className="mt-3 max-w-[34em] font-serif text-[15px] leading-relaxed text-ink-2">
          写一些关于工程判断、取舍和踩坑的东西。都是真的发生过的事。
        </p>
      </header>

      <main className="divide-y divide-rule border-t border-rule">
        {years.map((year) => (
          <section key={year} className="py-10" aria-labelledby={`year-${year}`}>
            <h2
              id={`year-${year}`}
              className="mb-6 font-sans text-xs font-medium uppercase tracking-[0.18em] text-ink-3"
            >
              {year}
            </h2>
            <ul className="space-y-8">
              {posts
                .filter((p) => yearOf(p.date) === year)
                .map((post) => (
                  <li key={post.slug}>
                    <a
                      href={`/post/${post.slug}/`}
                      className="group grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-6"
                    >
                      <span className="pt-1 font-sans text-[13px] tabular-nums text-ink-3">
                        {formatMonthDay(post.date)}
                      </span>
                      <span>
                        <span className="block font-serif text-[19px] font-semibold leading-snug text-ink group-hover:text-accent-ink">
                          {post.title}
                        </span>
                        <span className="mt-1.5 block font-serif text-[15px] leading-relaxed text-ink-2">
                          {post.summary}
                        </span>
                        <span className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[12px] text-ink-3">
                          <span>{post.readingMinutes} 分钟</span>
                          {post.tags.map((tag) => (
                            <span key={tag} className="text-accent">
                              #{tag}
                            </span>
                          ))}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}

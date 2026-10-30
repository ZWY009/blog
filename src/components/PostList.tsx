import type { Post } from '../data/posts';
import { formatDate, yearOf } from '../lib/utils';

type Props = { posts: Post[] };

/**
 * 文章列表：按年份分组，每条是「日期列 + 内容列」的两栏。
 * 刻意不用卡片——细线分隔 + 大留白，这是编辑排版的语言。
 */
export function PostList({ posts }: Props) {
  const years = [...new Set(posts.map((p) => yearOf(p.date)))].sort((a, b) => b.localeCompare(a));

  return (
    <div className="divide-y divide-rule">
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
                <li key={post.id}>
                  <a
                    href={`#/post/${post.id}`}
                    className="group grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-6"
                  >
                    <span className="pt-1 font-sans text-[13px] tabular-nums text-ink-3">
                      {formatDate(post.date).replace(/^\d+ 年 /, '')}
                    </span>
                    <span>
                      <span className="block font-serif text-[19px] font-semibold leading-snug text-ink transition-colors group-hover:text-accent-ink">
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
    </div>
  );
}

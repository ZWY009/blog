import { link } from '../site.config';
import { formatDate, type Post } from '../lib/posts';
import { SiteFooter, SiteNav } from './parts';

type Props = { post: Post };

/** 文章页：标题 + 元信息 + 正文（构建期渲染好的 HTML）+ 页脚 */
export function PostPage({ post }: Props) {
  return (
    <div className="mx-auto w-full max-w-[46rem] px-6">
      <SiteNav current="writing" />
      <main>
        <article className="py-12">
          <a
            href={link('/writing/')}
            className="mb-8 inline-block font-sans text-[13px] text-ink-3 hover:text-accent-ink"
          >
            ← 返回文章列表
          </a>

          <h1 className="font-serif text-[28px] font-semibold leading-[1.35] tracking-tight text-ink sm:text-[34px]">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-rule pb-6 font-sans text-[12.5px] text-ink-3">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} 分钟阅读</span>
            {post.tags.map((tag) => (
              <span key={tag} className="text-accent">
                #{tag}
              </span>
            ))}
          </div>

          {/* 正文由构建脚本用 marked + shiki 渲染，可信来源是本仓库的 markdown */}
          <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />

          <footer className="mt-14 border-t border-rule pt-8 font-sans text-[13px] text-ink-3">
            写于 {formatDate(post.date)} ·{' '}
            <a
              href={link('/writing/')}
              className="text-accent-ink underline decoration-rule-strong"
            >
              回到全部文章
            </a>
          </footer>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

/** 404 / 找不到页面 */
export function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[46rem] px-6">
      <SiteNav />
      <main className="py-20">
        <h1 className="font-serif text-2xl font-semibold text-ink">找不到这一页</h1>
        <p className="mt-3 font-serif text-[15px] text-ink-2">
          链接可能失效了，或者这个页面还没写。
        </p>
        <p className="mt-6 flex gap-5 font-sans text-[13px]">
          <a href={link('/')} className="text-accent-ink underline">
            回到首页
          </a>
          <a href={link('/projects/')} className="text-accent-ink underline">
            看项目
          </a>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

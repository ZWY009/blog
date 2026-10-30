import type { Post } from '../data/posts';
import { formatDate } from '../lib/utils';

type Props = { post: Post };

/** 文章详情：标题 + 元信息 + 衬线正文。正文样式在 styles.css 的 .prose 里。 */
export function PostView({ post }: Props) {
  return (
    <article className="py-12">
      <a
        href="#/"
        className="mb-8 inline-block font-sans text-[13px] text-ink-3 transition-colors hover:text-accent-ink"
      >
        ← 返回列表
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

      <div className="prose mt-8">
        {post.body.map((block, index) => {
          const key = `${post.id}-${index}`;
          if (block.type === 'h2') return <h2 key={key}>{block.text}</h2>;
          if (block.type === 'quote') return <blockquote key={key}>{block.text}</blockquote>;
          return <p key={key}>{block.text}</p>;
        })}
      </div>

      <footer className="mt-14 border-t border-rule pt-8 font-sans text-[13px] text-ink-3">
        写于 {formatDate(post.date)} ·{' '}
        <a
          href="#/"
          className="text-accent-ink underline decoration-rule-strong hover:decoration-accent"
        >
          回到全部文章
        </a>
      </footer>
    </article>
  );
}

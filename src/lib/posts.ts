/** 文章元信息（列表页用，不含正文） */
export type PostMeta = {
  slug: string;
  title: string;
  /** ISO 日期 */
  date: string;
  summary: string;
  tags: string[];
  readingMinutes: number;
};

/** 完整文章（正文已渲染成 HTML 字符串，构建期产出） */
export type Post = PostMeta & { html: string };

/** 2026-10-20 → 2026 年 10 月 20 日 */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`;
}

/** 2026-10-20 → 10 月 20 日（列表里省掉年份，因为已按年分组） */
export function formatMonthDay(iso: string): string {
  const [, m, d] = iso.split('-');
  if (!m || !d) return iso;
  return `${Number(m)} 月 ${Number(d)} 日`;
}

export function yearOf(iso: string): string {
  return iso.slice(0, 4);
}

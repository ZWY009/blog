import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Home } from './Home';
import { NotFound, PostPage } from './PostPage';
import { formatDate, formatMonthDay, yearOf, type Post, type PostMeta } from '../lib/posts';

const meta = (over: Partial<PostMeta> = {}): PostMeta => ({
  slug: 'demo-post',
  title: '一篇测试文章',
  date: '2026-10-20',
  summary: '这是摘要，用来说明文章讲了什么。',
  tags: ['测试'],
  readingMinutes: 3,
  ...over,
});

const post = (over: Partial<Post> = {}): Post => ({
  ...meta(),
  html: '<p>正文第一段</p>',
  ...over,
});

describe('日期工具', () => {
  it('格式化成中文日期', () => {
    expect(formatDate('2026-10-20')).toBe('2026 年 10 月 20 日');
    expect(formatMonthDay('2026-10-20')).toBe('10 月 20 日');
    expect(yearOf('2026-10-20')).toBe('2026');
  });

  it('格式坏了原样返回，不抛错', () => {
    expect(formatDate('bad')).toBe('bad');
    expect(formatMonthDay('bad')).toBe('bad');
  });
});

describe('首页', () => {
  it('渲染站名与文章链接', () => {
    render(<Home posts={[meta()]} />);
    expect(screen.getByText('秋蝉源')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /一篇测试文章/ });
    expect(link).toHaveAttribute('href', '/post/demo-post/');
  });

  it('按年份分组，倒序排列', () => {
    render(
      <Home
        posts={[
          meta({ slug: 'a', title: 'A 文', date: '2026-10-20' }),
          meta({ slug: 'b', title: 'B 文', date: '2025-01-05' }),
        ]}
      />,
    );
    const years = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(years).toEqual(['2026', '2025']);
  });

  it('显示阅读时长与标签', () => {
    render(<Home posts={[meta({ readingMinutes: 7, tags: ['性能'] })]} />);
    expect(screen.getByText('7 分钟')).toBeInTheDocument();
    expect(screen.getByText('#性能')).toBeInTheDocument();
  });
});

describe('文章页', () => {
  it('渲染标题、元信息与正文 HTML', () => {
    render(<PostPage post={post()} />);
    expect(screen.getByRole('heading', { level: 1, name: '一篇测试文章' })).toBeInTheDocument();
    expect(screen.getByText('2026 年 10 月 20 日')).toBeInTheDocument();
    expect(screen.getByText('正文第一段')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /返回列表/ })).toHaveAttribute('href', '/');
  });
});

describe('404', () => {
  it('给出回首页的出口', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1, name: '找不到这一页' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /回到首页/ })).toHaveAttribute('href', '/');
  });
});

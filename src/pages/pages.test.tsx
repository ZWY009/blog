import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { About } from './About';
import { Home } from './Home';
import { NotFound, PostPage } from './PostPage';
import { ProjectPage } from './ProjectPage';
import { ProjectsIndex } from './ProjectsIndex';
import { WritingIndex } from './WritingIndex';
import {
  formatDate,
  formatMonthDay,
  yearOf,
  type Post,
  type PostMeta,
  type Project,
  type ProjectMeta,
} from '../lib/posts';

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

const projMeta = (over: Partial<ProjectMeta> = {}): ProjectMeta => ({
  slug: 'demo-project',
  title: '一个测试项目',
  tagline: '一句话说清这个项目做什么',
  period: '2026-10',
  role: '独立实现',
  stack: ['TypeScript'],
  order: 1,
  highlight: '最想让人记住的那一句',
  highlights: ['可验证的结果一'],
  links: { repo: 'https://example.com/repo' },
  ...over,
});

const proj = (over: Partial<Project> = {}): Project => ({
  ...projMeta(),
  html: '<p>项目正文</p>',
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

describe('首页（项目集）', () => {
  const renderHome = () => render(<Home projects={[projMeta()]} posts={[meta()]} />);

  it('首屏有站名与定位语', () => {
    renderHome();
    expect(screen.getByRole('heading', { level: 1, name: '秋蝉源' })).toBeInTheDocument();
    expect(screen.getByText(/我写前端/)).toBeInTheDocument();
  });

  it('项目排在文章之前，且链接到详情页', () => {
    renderHome();
    const projectLink = screen.getByRole('link', { name: /一个测试项目/ });
    expect(projectLink).toHaveAttribute('href', '/projects/demo-project/');
  });

  it('列出最近文章', () => {
    renderHome();
    expect(screen.getByRole('link', { name: /一篇测试文章/ })).toHaveAttribute(
      'href',
      '/post/demo-post/',
    );
  });

  it('导航有三个入口', () => {
    renderHome();
    expect(screen.getByRole('link', { name: '项目' })).toHaveAttribute('href', '/projects/');
    expect(screen.getByRole('link', { name: '文章' })).toHaveAttribute('href', '/writing/');
    expect(screen.getByRole('link', { name: '关于' })).toHaveAttribute('href', '/about/');
  });
});

describe('项目页', () => {
  it('详情页把结果与关键判断摆出来', () => {
    render(<ProjectPage project={proj()} />);
    expect(screen.getByRole('heading', { level: 1, name: '一个测试项目' })).toBeInTheDocument();
    expect(screen.getByText('最想让人记住的那一句')).toBeInTheDocument();
    expect(screen.getByText('可验证的结果一')).toBeInTheDocument();
    expect(screen.getByText('项目正文')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /源码/ })).toHaveAttribute(
      'href',
      'https://example.com/repo',
    );
  });

  it('没有链接时不渲染链接区', () => {
    render(<ProjectPage project={proj({ links: {} })} />);
    expect(screen.queryByRole('link', { name: /源码/ })).toBeNull();
  });

  it('列表页展示时间与角色', () => {
    render(<ProjectsIndex projects={[projMeta()]} />);
    expect(screen.getByRole('heading', { level: 1, name: '项目' })).toBeInTheDocument();
    expect(screen.getByText('2026-10')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /一个测试项目/ })).toHaveAttribute(
      'href',
      '/projects/demo-project/',
    );
  });
});

describe('文章页', () => {
  it('渲染标题、元信息与正文 HTML', () => {
    render(<PostPage post={post()} />);
    expect(screen.getByRole('heading', { level: 1, name: '一篇测试文章' })).toBeInTheDocument();
    expect(screen.getByText('2026 年 10 月 20 日')).toBeInTheDocument();
    expect(screen.getByText('正文第一段')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /返回文章列表/ })).toHaveAttribute('href', '/writing/');
  });

  it('列表页按年份分组，倒序排列', () => {
    render(
      <WritingIndex
        posts={[
          meta({ slug: 'a', title: 'A 文', date: '2026-10-20' }),
          meta({ slug: 'b', title: 'B 文', date: '2025-01-05' }),
        ]}
      />,
    );
    const years = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(years).toEqual(['2026', '2025']);
  });
});

describe('关于页', () => {
  it('给出做事原则、技术栈与时间线', () => {
    render(<About projects={[projMeta()]} />);
    expect(screen.getByRole('heading', { level: 1, name: '关于' })).toBeInTheDocument();
    expect(screen.getByText('让结论可证伪')).toBeInTheDocument();
    expect(screen.getByText('技术栈')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /一个测试项目/ })).toHaveAttribute(
      'href',
      '/projects/demo-project/',
    );
  });
});

describe('404', () => {
  it('给出回首页的出口', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1, name: '找不到这一页' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /回到首页/ })).toHaveAttribute('href', '/');
  });
});

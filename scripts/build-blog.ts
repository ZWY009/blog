/**
 * 静态生成器：把 content/posts/*.md 和 content/projects/*.md 变成 dist 下的纯静态 HTML。
 * ---------------------------------------------------------------------------
 * 为什么不用 SPA：
 *   - 每篇文章、每个项目都要有自己的 URL 和自己的 HTML，这样搜索引擎能索引、
 *     分享能被爬、禁用 JS 也能读。个人站最重要的资产就是「内容能被找到」。
 *   - 站点跑在 GitHub Pages 上，没有 Node 服务端，静态文件是最省事的形态。
 *
 * 流程：
 *   1. vite build 先产出带 hash 的 CSS（本脚本之后运行）
 *   2. 读 markdown → frontmatter → marked 渲染 → shiki 高亮代码
 *   3. 用 renderToStaticMarkup 渲染 React 页面 → 拼完整 HTML 文档
 *   4. 写各页 index.html / 404.html / rss.xml / sitemap.xml / robots.txt
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { createHighlighter } from 'shiki';

import { About } from '../src/pages/About';
import { Home } from '../src/pages/Home';
import { NotFound, PostPage } from '../src/pages/PostPage';
import { ProjectPage } from '../src/pages/ProjectPage';
import { ProjectsIndex } from '../src/pages/ProjectsIndex';
import { WritingIndex } from '../src/pages/WritingIndex';
import { site, basePath } from '../src/site.config';
import type { Post, PostMeta, Project, ProjectMeta } from '../src/lib/posts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'content', 'posts');
const projectsDir = path.join(root, 'content', 'projects');
const distDir = path.join(root, 'dist');

/* ------------------------------------------------------------------ 工具 */

const withBase = (p: string) => `${basePath}${p}`.replace(/\/{2,}/g, '/');
const absoluteUrl = (p: string) => `${site.url}${withBase(p)}`;

const escapeXml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** 中文按 400 字/分钟，外文按 200 词/分钟粗算，至少 1 分钟 */
function readingMinutes(text: string): number {
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = text
    .replace(/[\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
}

/* ------------------------------------------------- Markdown → HTML（含高亮） */

const LANGS = ['ts', 'tsx', 'js', 'jsx', 'css', 'html', 'bash', 'json', 'diff', 'text'] as const;

type Highlighter = Awaited<ReturnType<typeof createHighlighter>>;

/** marked 产出 <pre><code class="language-x">，这里把每块换成 shiki 的高亮结果 */
function highlightBlocks(html: string, highlighter: Highlighter): string {
  return html.replace(
    /<pre><code class="language-([\w-]+)">([\s\S]*?)<\/code><\/pre>/g,
    (_match, lang: string, raw: string) => {
      const code = raw
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&');
      const known = (LANGS as readonly string[]).includes(lang) ? lang : 'text';
      try {
        return highlighter.codeToHtml(code, {
          lang: known,
          themes: { light: 'github-light', dark: 'github-dark' },
          /* defaultColor: false 很关键。
           * 默认情况下 shiki 会把浅色主题的颜色内联成 style="color:#24292E"，
           * 而内联样式优先级高于样式表 —— 暗色模式下 .shiki span { color: var(--shiki-dark) }
           * 会被内联样式压住，结果深色背景上渲染深色文字，代码直接看不见。
           * 关掉它，颜色就只以 --shiki-light / --shiki-dark 两个变量输出，交给 CSS 选。 */
          defaultColor: false,
        });
      } catch {
        return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
      }
    },
  );
}

/* ------------------------------------------------------------- 读内容 */

/**
 * 注意：YAML 会把不带引号的 2026-10-20 解析成 Date 对象，不是字符串。
 * 只判断 typeof === 'string' 会让所有日期悄悄回落到 1970-01-01 —— 这是实际踩过的坑。
 */
function asDate(value: unknown, file: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  throw new Error(`${file} 的 date 字段缺失或格式不对（要 YYYY-MM-DD，建议加引号）`);
}

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asStringArray = (value: unknown): string[] => (Array.isArray(value) ? value.map(String) : []);

async function loadPosts(highlighter: Highlighter): Promise<Post[]> {
  const files = (await fs.readdir(postsDir)).filter((f) => f.endsWith('.md')).sort();
  const marked = new Marked({ gfm: true, breaks: false });
  const posts: Post[] = [];

  for (const file of files) {
    const raw = await fs.readFile(path.join(postsDir, file), 'utf8');
    const { data, content } = matter(raw);
    if (data.draft === true) continue;

    posts.push({
      slug: path.basename(file, '.md'),
      title: asString(data.title, path.basename(file, '.md')),
      date: asDate(data.date, file),
      summary: asString(data.summary),
      tags: asStringArray(data.tags),
      readingMinutes: readingMinutes(content),
      html: highlightBlocks(String(marked.parse(content)), highlighter),
    });
  }

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

async function loadProjects(highlighter: Highlighter): Promise<Project[]> {
  const files = (await fs.readdir(projectsDir)).filter((f) => f.endsWith('.md')).sort();
  const marked = new Marked({ gfm: true, breaks: false });
  const projects: Project[] = [];

  for (const file of files) {
    const raw = await fs.readFile(path.join(projectsDir, file), 'utf8');
    const { data, content } = matter(raw);
    if (data.draft === true) continue;

    const rawLinks = (data.links ?? {}) as Record<string, unknown>;

    projects.push({
      slug: path.basename(file, '.md'),
      title: asString(data.title, path.basename(file, '.md')),
      tagline: asString(data.tagline),
      period: asString(data.period),
      role: asString(data.role),
      stack: asStringArray(data.stack),
      order: typeof data.order === 'number' ? data.order : 99,
      highlight: asString(data.highlight),
      highlights: asStringArray(data.highlights),
      links: {
        repo: typeof rawLinks.repo === 'string' ? rawLinks.repo : undefined,
        demo: typeof rawLinks.demo === 'string' ? rawLinks.demo : undefined,
      },
      html: highlightBlocks(String(marked.parse(content)), highlighter),
    });
  }

  return projects.sort((a, b) => a.order - b.order);
}

/* --------------------------------------------------------- HTML 文档壳 */

function documentFor(opts: {
  title: string;
  description: string;
  canonical: string;
  cssHref: string;
  bodyHtml: string;
  ogType: 'website' | 'article';
  extraHead?: string;
}): string {
  const { title, description, canonical, cssHref, bodyHtml, ogType, extraHead = '' } = opts;
  const fullTitle =
    title === site.name ? `${site.name} · ${site.description}` : `${title} · ${site.name}`;

  return `<!doctype html>
<html lang="${site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:site_name" content="${escapeHtml(site.name)}">
<meta name="twitter:card" content="summary">
<link rel="alternate" type="application/rss+xml" title="${escapeHtml(site.name)}" href="${withBase('/rss.xml')}">
<link rel="stylesheet" href="${cssHref}">
${extraHead}</head>
<body>
<div id="root">${bodyHtml}</div>
</body>
</html>
`;
}

/* ---------------------------------------------------------------- 主流程 */

async function main() {
  // 1. 找 vite 产出的 CSS（带 hash）
  const assetsDir = path.join(distDir, 'assets');
  let assets: string[];
  try {
    assets = await fs.readdir(assetsDir);
  } catch {
    throw new Error('dist/assets 不存在——请先跑 vite build（pnpm build 会自动按顺序执行）');
  }
  const cssFile = assets.find((f) => f.endsWith('.css')) ?? '';
  if (!cssFile) throw new Error('dist/assets 里没有 CSS 产物，样式不会生效');

  // 2. 解析 markdown
  const highlighter = await createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: [...LANGS],
  });
  const posts = await loadPosts(highlighter);
  const projects = await loadProjects(highlighter);

  const postMetas: PostMeta[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    summary: p.summary,
    tags: p.tags,
    readingMinutes: p.readingMinutes,
  }));
  const projectMetas: ProjectMeta[] = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    period: p.period,
    role: p.role,
    stack: p.stack,
    order: p.order,
    highlight: p.highlight,
    highlights: p.highlights,
    links: p.links,
  }));

  const cssHref = withBase(`/assets/${cssFile}`);
  const written: string[] = [];

  /** 写一个页面：dir 是相对 dist 的目录（'' 表示根） */
  const writePage = async (dir: string, opts: Parameters<typeof documentFor>[0]): Promise<void> => {
    const target = path.join(distDir, dir);
    await fs.mkdir(target, { recursive: true });
    await fs.writeFile(path.join(target, 'index.html'), documentFor(opts), 'utf8');
    written.push(dir === '' ? 'index.html' : `${dir}/index.html`);
  };

  // 3. 首页（项目集）
  await writePage('', {
    title: site.name,
    description: site.description,
    canonical: absoluteUrl('/'),
    cssHref,
    bodyHtml: renderToStaticMarkup(Home({ projects: projectMetas, posts: postMetas })),
    ogType: 'website',
  });

  // 4. 项目列表 + 每个项目详情
  await writePage('projects', {
    title: '项目',
    description: '我做过的项目：要解决什么问题、关键判断是什么、结果怎么验证。',
    canonical: absoluteUrl('/projects/'),
    cssHref,
    bodyHtml: renderToStaticMarkup(ProjectsIndex({ projects: projectMetas })),
    ogType: 'website',
  });

  for (const project of projects) {
    await writePage(path.join('projects', project.slug), {
      title: project.title,
      description: project.tagline || site.description,
      canonical: absoluteUrl(`/projects/${project.slug}/`),
      cssHref,
      bodyHtml: renderToStaticMarkup(ProjectPage({ project })),
      ogType: 'article',
    });
  }

  // 5. 文章列表 + 每篇文章详情
  await writePage('writing', {
    title: '文章',
    description: '关于工程判断、取舍和踩坑的记录。',
    canonical: absoluteUrl('/writing/'),
    cssHref,
    bodyHtml: renderToStaticMarkup(WritingIndex({ posts: postMetas })),
    ogType: 'website',
  });

  for (const post of posts) {
    const extraHead = `<meta property="article:published_time" content="${escapeHtml(post.date)}">
<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.date,
      description: post.summary,
      author: { '@type': 'Person', name: site.author },
      mainEntityOfPage: absoluteUrl(`/post/${post.slug}/`),
    })}</script>
`;
    await writePage(path.join('post', post.slug), {
      title: post.title,
      description: post.summary || site.description,
      canonical: absoluteUrl(`/post/${post.slug}/`),
      cssHref,
      bodyHtml: renderToStaticMarkup(PostPage({ post })),
      ogType: 'article',
      extraHead,
    });
  }

  // 6. 关于
  await writePage('about', {
    title: '关于',
    description: `${site.author}：怎么做事、技术栈、项目时间线。`,
    canonical: absoluteUrl('/about/'),
    cssHref,
    bodyHtml: renderToStaticMarkup(About({ projects: projectMetas })),
    ogType: 'website',
  });

  // 7. 404（GitHub Pages 会自动用根目录的 404.html）
  await fs.writeFile(
    path.join(distDir, '404.html'),
    documentFor({
      title: '找不到这一页',
      description: '这一页不存在',
      canonical: absoluteUrl('/404.html'),
      cssHref,
      bodyHtml: renderToStaticMarkup(NotFound()),
      ogType: 'website',
    }),
    'utf8',
  );
  written.push('404.html');

  // 8. RSS —— 订阅入口，别省
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(site.name)}</title>
<link>${escapeXml(site.url + withBase('/'))}</link>
<description>${escapeXml(site.description)}</description>
<language>${site.lang}</language>
<atom:link href="${escapeXml(absoluteUrl('/rss.xml'))}" rel="self" type="application/rss+xml"/>
${posts
  .map(
    (p) => `<item>
<title>${escapeXml(p.title)}</title>
<link>${escapeXml(absoluteUrl(`/post/${p.slug}/`))}</link>
<guid>${escapeXml(absoluteUrl(`/post/${p.slug}/`))}</guid>
<pubDate>${new Date(p.date).toUTCString()}</pubDate>
<description>${escapeXml(p.summary)}</description>
</item>`,
  )
  .join('\n')}
</channel>
</rss>
`;
  await fs.writeFile(path.join(distDir, 'rss.xml'), rss, 'utf8');
  written.push('rss.xml');

  // 9. sitemap / robots
  const urls = [
    { loc: absoluteUrl('/'), lastmod: undefined as string | undefined },
    { loc: absoluteUrl('/projects/'), lastmod: undefined },
    ...projects.map((p) => ({ loc: absoluteUrl(`/projects/${p.slug}/`), lastmod: undefined })),
    { loc: absoluteUrl('/writing/'), lastmod: undefined },
    ...posts.map((p) => ({ loc: absoluteUrl(`/post/${p.slug}/`), lastmod: p.date })),
    { loc: absoluteUrl('/about/'), lastmod: undefined },
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) =>
    u.lastmod
      ? `<url><loc>${escapeXml(u.loc)}</loc><lastmod>${u.lastmod}</lastmod></url>`
      : `<url><loc>${escapeXml(u.loc)}</loc></url>`,
  )
  .join('\n')}
</urlset>
`;
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
  await fs.writeFile(
    path.join(distDir, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`,
    'utf8',
  );
  written.push('sitemap.xml', 'robots.txt');

  await highlighter.dispose();

  console.log(
    `静态站点已生成（${projects.length} 个项目 · ${posts.length} 篇文章 · CSS ${cssFile}）`,
  );
  for (const f of written) console.log(`  dist/${f}`);
  if (posts.length === 0) console.log('  提示：content/posts 里还没有 .md。');
  if (projects.length === 0) console.log('  提示：content/projects 里还没有 .md。');
}

main().catch((error) => {
  console.error('构建失败：', error instanceof Error ? error.message : error);
  process.exit(1);
});

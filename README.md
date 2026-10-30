# 秋蝉源

个人博客。React + Vite + Tailwind 构建，**构建期静态生成**，可直接部署到 GitHub Pages。

## 写文章

在 `content/posts/` 下新建一个 `.md` 文件，文件名就是 URL 里的 slug：

```
content/posts/my-first-post.md   →   /post/my-first-post/
```

文件头部的 frontmatter：

```yaml
---
title: 文章标题
date: 2026-10-20
summary: 一句话摘要，会出现在列表页和 SEO 描述里
tags: [性能, React]
draft: false # 可选，true 则不上线
---
```

正文就是普通 Markdown。代码块会自动高亮（支持 ts / tsx / js / jsx / css / html / bash / json / diff / text）。

**只有写 `.md` 这一件事需要你做**，其余全是自动的：列表排序、年度分组、阅读时长、RSS、sitemap、SEO 标签、JSON-LD 结构化数据。

## 本地预览

```bash
cd examples/blog
pnpm install
pnpm start          # 构建 + 起本地预览（默认 http://localhost:5173）
```

改完文章重新跑 `pnpm start` 即可。`pnpm build` 只构建不预览。

## 改站名 / 域名

全部集中在 `src/site.config.ts`：

```ts
export const site = {
  name: '秋蝉源', // 站名：出现标题、页头、页脚、RSS、SEO
  author: '秋蝉源',
  description: '...', // 首页描述与 SEO
  url: 'https://...', // 部署后的绝对地址
};
```

**改站名只改这一处**，不用翻组件。

## 部署到 GitHub Pages

仓库里已经带了 `.github/workflows/blog-deploy.yml`，推到 main 就会自动构建并部署。

一次性设置：

1. 仓库 **Settings → Pages → Source** 选 **GitHub Actions**
2. 把代码推到 `main`

工作流会自动注入两个环境变量：

| 变量             | 作用                             |
| ---------------- | -------------------------------- |
| `BLOG_BASE_PATH` | 部署子路径，项目页是 `/<仓库名>` |
| `BLOG_SITE_URL`  | canonical / RSS 用的绝对地址     |

> **如果仓库叫 `<你的用户名>.github.io`**（用户页），`BLOG_BASE_PATH` 应该是空字符串。
> 改工作流里那一行：`BLOG_BASE_PATH: ''`，否则所有资源和链接都会多一层路径而 404。

## 目录结构

```
content/posts/*.md        ← 你写文章的地方
scripts/build-blog.ts     ← 静态生成器（md → HTML + RSS + sitemap）
src/pages/                ← 页面组件（构建期渲染成静态 HTML，浏览器不加载 JS）
src/site.config.ts        ← 站名 / 域名 / 描述
src/styles.css            ← 设计 token 与正文排版
dist/                     ← 构建产物，不要手改
```

## 一些设计取舍

- **不做客户端路由**：每篇文章是独立的静态 HTML，禁用 JS 也能读，搜索引擎能索引，首屏不依赖 JS。
- **不做暗色开关**：跟随系统 `prefers-color-scheme`，少一个需要记的状态。
- **代码高亮在构建期完成**（shiki），浏览器端零运行时成本。
- **不用卡片和阴影**：靠细线和留白分隔，这是编辑排版的语言，不是后台面板的。

## 改设计

`src/styles.css` 顶部是全部设计 token：

```css
--paper: #fbfaf8; /* 纸 */
--ink: #1c1b19; /* 墨 */
--accent: #8b5e34; /* 强调：绛棕 */
--serif: ...; /* 标题与正文 */
```

想更冷一点就把 `--accent` 换成墨绿；想更现代就把正文的 `--serif` 换掉。

# 秋蝉源

面试用的个人项目集 + 技术博客。React + Vite + Tailwind 构建，**构建期静态生成**，部署在 GitHub Pages。

线上地址：https://zwy009.github.io/blog/

## 加一个项目（这是主要用途）

在 `content/projects/` 下新建 `.md`，文件名就是 URL：

```
content/projects/my-project.md   →   /projects/my-project/
```

frontmatter：

```yaml
---
title: 项目名
tagline: 一句话说清它做什么（首页和详情页都用）
period: '2026-10' # 建议加引号，否则 YAML 会把 2026-10 解析成日期
role: 独立设计与实现
order: 1 # 越小越靠前
stack: [TypeScript, React] # 技术栈小标签
highlight: 最想让人记住的那一句（详情页高亮块）
highlights: # 可验证的结果，别写形容词
  - 门禁自测 17/17 用例通过
  - 文章页 0 个 script 标签
links:
  repo: https://github.com/...
  demo: https://... # 没有就省略
---
```

正文用 `## 要解决的问题` / `## 我的做法` 这类小节写。**写完刷新即可，索引、排序、SEO 全自动。**

> ⚠️ **中文加粗的坑**：`**「引号开头的句子」**` 不会渲染成粗体，因为 CommonMark 认为 `**` 后面紧跟标点时不构成定界符。要加粗就把引号放到粗体外面，或者让 `**` 前后接字母。

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

## 站内链接必须用 `link()`

组件里**不要手写** `href="/projects/"`。站点部署在 `/blog` 子路径下，手写的绝对路径会解析到
站点根目录，点一下就 404。统一用：

```tsx
import { link } from '../site.config';

<a href={link('/projects/')}>项目</a>;
```

`link()` 会自动拼上 `basePath`，本地和线上都对。

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

| 变量             | 作用                                                                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BLOG_BASE_PATH` | 部署子路径，项目页是 `/<仓库名>`                                                                                                                          |
| `BLOG_SITE_URL`  | canonical / RSS 用的源站地址，**只填源站**（如 `https://zwy009.github.io`），不要带仓库路径 —— 子路径由 `BLOG_BASE_PATH` 拼，两边都写会变成 `/blog/blog/` |

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

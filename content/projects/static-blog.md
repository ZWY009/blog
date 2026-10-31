---
title: 秋蝉源 · 静态博客系统
tagline: 不依赖任何博客平台，从 Markdown 直接生成可被搜索引擎索引的静态站点
period: '2026-10'
role: 独立设计与实现
order: 2
stack: [React, TypeScript, Vite, Tailwind CSS, shiki, GitHub Actions]
links:
  repo: https://github.com/ZWY009/blog
  demo: https://zwy009.github.io/blog/
highlight: 每篇文章是独立静态 HTML，禁用 JS 也能完整阅读
highlights:
  - 文章页 0 个 <script src>，首屏不依赖 JavaScript
  - 自动生成 RSS、sitemap、robots.txt 与 JSON-LD 结构化数据
  - GitHub Actions 构建 + 部署，6 项质量门禁全绿
---

## 为什么不直接用现成的博客框架

想过用 Hexo 或 VitePress，最后决定自己写一遍——因为想弄清楚「静态生成」到底需要哪几块，而不是只会调配置。

## 关键取舍：不做 SPA

大部分 React 博客是单页应用：一个 `index.html` 加一堆 JS，靠前端路由切换。问题是——**搜索引擎抓不到，禁用 JS 就是白屏**。

对一个以"内容被找到"为唯一价值的站点来说，这是根本性错误。所以这里是**构建期静态生成**：

```
Markdown + frontmatter
  → marked 解析
  → shiki 构建期代码高亮
  → React renderToStaticMarkup
  → 每篇文章一个 /post/<slug>/index.html
```

浏览器端**一个字节的 JS 都不需要**。

## 踩过的两个坑

**YAML 会把日期解析成 Date 对象。** frontmatter 里写 `date: 2026-10-20`，解析出来不是字符串而是 `Date`。只判断 `typeof === 'string'` 就会让所有日期静默回落到 1970 年——而且单元测试发现不了，因为测试用的是自己构造的数据。是截图看页面时发现的。

**shiki 的双主题会内联颜色。** 默认输出 `style="color:#24292E"`，而**内联样式优先级高于任何样式表**，暗色模式里深色背景配深色文字，代码直接看不见。解法是 `defaultColor: false`，让颜色只以 CSS 变量输出。

## 工程化

lint / format / typecheck / test / build / size 六项门禁一条命令跑完，推送到 main 自动构建部署到 GitHub Pages。

## 这个站本身就是作品

你正在看的这个页面，从设计、排版到构建管线都是手写的。源码在 [GitHub](https://github.com/ZWY009/blog)。

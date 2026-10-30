/**
 * 全站配置：站名、署名、描述、部署地址都集中在这里。
 * 改站名只改这一处，标题/页脚/SEO/RSS 全站生效。
 */

/** 构建期环境变量（GitHub Actions 会注入），浏览器里没有 process 时退回默认值 */
const env = typeof process !== 'undefined' ? (process.env ?? {}) : {};

export const site = {
  name: '秋蝉源',
  author: '秋蝉源',
  description: '前端工程、性能与判断。写代码，也写下为什么这么写。',
  /**
   * 部署后的绝对地址，用于 canonical / RSS / sitemap。
   * CI 里由 BLOG_SITE_URL 注入；本地不设就退回占位值（不影响构建）。
   */
  url: env.BLOG_SITE_URL ?? 'https://example.com',
  lang: 'zh-CN',
} as const;

/**
 * 部署在子路径下时用这里。
 *   - GitHub Pages 项目页（<user>.github.io/<repo>）：'/repo'
 *   - GitHub Pages 用户页（<user>.github.io）或自有域名：''
 * CI 里由 BLOG_BASE_PATH 注入。
 */
export const basePath = env.BLOG_BASE_PATH ?? '';

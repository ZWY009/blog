/**
 * 全站配置：站名、定位、联系方式、部署地址都集中在这里。
 * 改哪一处都只改这个文件，标题/页头/页脚/SEO/RSS 全站生效。
 */

/** 构建期环境变量（GitHub Actions 会注入），浏览器里没有 process 时退回默认值 */
const env = typeof process !== 'undefined' ? (process.env ?? {}) : {};

export const site: {
  name: string;
  author: string;
  description: string;
  /** 首屏第二行：一句话说清你是谁 */
  tagline: string;
  /** 首屏第三段：补充具体做过什么 */
  intro: string;
  skills: string[];
  email: string;
  github: string;
  url: string;
  lang: string;
} = {
  name: '秋蝉源',
  author: '秋蝉源',
  description: '个人项目集：前端工程、交付工具链、浏览器自动化与数据流水线。',
  tagline: '我写前端，也写让前端交付不变质的那部分。',
  intro:
    '做过浏览器自动化取数、Python 数据流水线，也做过把 AI 拉进交付流程的工程工具。这里是我的项目集——每个项目都写了要解决什么问题、关键判断是什么、结果怎么验证。',
  skills: [
    'TypeScript',
    'React',
    'Vite',
    'Tailwind CSS',
    'Node.js',
    'Python',
    'Playwright',
    'Lighthouse CI',
    'GitHub Actions',
    'Typst',
  ],
  email: '204816799@qq.com',
  github: 'https://github.com/ZWY009',
  /**
   * 部署后的源站地址（不含仓库路径），用于 canonical / RSS / sitemap。
   * CI 里由 BLOG_SITE_URL 注入；本地不设就退回占位值（不影响构建）。
   */
  url: env.BLOG_SITE_URL ?? 'https://example.com',
  lang: 'zh-CN',
};

/**
 * 部署在子路径下时用这里。
 *   - GitHub Pages 项目页（<user>.github.io/<repo>）：'/repo'
 *   - GitHub Pages 用户页（<user>.github.io）或自有域名：''
 * CI 里由 BLOG_BASE_PATH 注入。
 */
export const basePath = env.BLOG_BASE_PATH ?? '';

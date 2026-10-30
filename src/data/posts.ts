export type Block = { type: 'p' | 'h2' | 'quote'; text: string };

export type Post = {
  id: string;
  /** ISO 日期，展示时格式化 */
  date: string;
  title: string;
  summary: string;
  tags: string[];
  readingMinutes: number;
  body: Block[];
};

export const posts: Post[] = [
  {
    id: 'why-i-stopped-optimizing',
    date: '2026-10-12',
    title: '我不再优化那些看不见的地方',
    summary: '把一个函数从 3ms 优化到 1ms，用户没有任何感觉。但把首屏从 3s 降到 1s，他们会记住。',
    tags: ['性能', '取舍'],
    readingMinutes: 6,
    body: [
      {
        type: 'p',
        text: '上个月我把一个列表的排序算法换掉了，从 O(n log n) 换成一个针对我们数据分布特化的实现，单次调用从 3ms 掉到 0.8ms。我很得意，提交了 PR。',
      },
      {
        type: 'p',
        text: '两周后我翻监控：这个页面根本没有性能问题。用户停留时间、错误率、转化率，一条都没动。那 2ms 花在了没人看的地方。',
      },
      { type: 'h2', text: '被什么骗了' },
      {
        type: 'p',
        text: '被「可测量的改进」骗了。工具能告诉我 3ms → 0.8ms，于是这个数就成了目标。但工具测不出「用户有没有因此更舒服」——那需要另一套判断。',
      },
      { type: 'quote', text: '能测量的东西会被优化，但被优化的不一定是重要的东西。' },
      {
        type: 'p',
        text: '现在我给自己立了条规矩：动手前先说清楚这个优化改善了哪个可感知的指标。说不出来，就不做。',
      },
    ],
  },
  {
    id: 'reading-source-code',
    date: '2026-09-28',
    title: '读源码的正确姿势是「带着问题去」',
    summary:
      '漫无目的地读源码和读小说一样，读完什么也没留下。带着一个具体 bug 去读，一小时能顶一周。',
    tags: ['方法', '工程'],
    readingMinutes: 8,
    body: [
      {
        type: 'p',
        text: '我曾经试图「系统地」读一遍 React 的源码。读了三天，画了一张调度器流程图，然后全忘了。',
      },
      {
        type: 'p',
        text: '后来有个 bug：某个状态更新在并发模式下丢了。我盯着这个问题去翻代码，两小时就摸清了 lane 的优先级模型——而且半年后还记得。',
      },
      { type: 'h2', text: '差别在哪' },
      {
        type: 'p',
        text: '差别在于「有没有一个非解决不可的问题」。问题会给你一条路径，你沿着它读，读到的每个细节都挂在路径上，不会散。',
      },
      { type: 'p', text: '没有问题的阅读，得到的是一张没有挂载点的网。' },
    ],
  },
  {
    id: 'boring-technology',
    date: '2026-09-03',
    title: '无聊的技术更值得押注',
    summary: '选型时最该问的不是「哪个更先进」，而是「三年后它还在吗」。',
    tags: ['选型', '工程'],
    readingMinutes: 5,
    body: [
      {
        type: 'p',
        text: '去年我评估过一个很新、很优雅的状态管理库。API 设计漂亮，作者思路清晰，star 涨得也快。我没有用。',
      },
      { type: 'p', text: '理由很朴素：它只有一个人在维护，而且那个人刚毕业。' },
      { type: 'h2', text: '三年测试' },
      {
        type: 'p',
        text: '我现在的标准是：这个技术三年后还会有人修 bug 吗？答案取决于三件事——维护者是否有商业动机、生态是否已经形成、替换成本是否可控。',
      },
      { type: 'p', text: '三项全过的技术通常显得无聊。无聊意味着它已经稳定到没人讨论它了。' },
    ],
  },
  {
    id: 'writing-as-thinking',
    date: '2026-08-17',
    title: '写作是把模糊的想法压成句子',
    summary: '想清楚和写清楚是一回事。写不出来，通常是因为还没想清楚。',
    tags: ['写作', '方法'],
    readingMinutes: 7,
    body: [
      {
        type: 'p',
        text: '我有个习惯：设计一个复杂东西之前，先写一段三百字的说明，说清它是什么、给谁用、为什么这样设计。',
      },
      { type: 'p', text: '写不下去的地方，就是还没想清楚的地方。那些地方在写代码时会变成返工。' },
      { type: 'h2', text: '具体的做法' },
      {
        type: 'p',
        text: '不用写长。三百字足够暴露空洞：如果一句话里出现两个「等等」「之类的」，说明那里是模糊的。',
      },
    ],
  },
];

/** 站点信息集中在这里，改自我介绍不用翻组件 */
export const site = {
  name: '纸上',
  tagline: '一个写代码的人的字。记录判断、方法和那些想清楚了的瞬间。',
  author: '周维岳',
  email: 'hello@example.com',
} as const;

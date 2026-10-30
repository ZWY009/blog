---
title: 别再手写 loading 状态了
date: 2026-09-25
summary: 三态的 loading / empty / error 是同一件事的三个侧面。分开写会漏，合起来写会乱。我的解法是一个状态机。
tags: [工程, 状态管理]
---

一个列表页要处理四个状态：加载中、有数据、空、出错。大部分人的写法是这样：

```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState([]);
```

三个独立的状态，**组合起来有 8 种可能，其中只有 4 种是合法的**。剩下的 4 种是 bug 温床：`loading && error`、`loading && data.length`、`error && data.length`……

## 换成互斥的联合类型

```ts
type State<T> =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'empty' }
  | { kind: 'ready'; data: T[] };
```

现在**不可能**出现非法组合，TypeScript 会帮你排除。渲染时一个 `switch` 就穷尽了：

```tsx
switch (state.kind) {
  case 'loading':
    return <Skeleton />;
  case 'error':
    return <Retry message={state.message} />;
  case 'empty':
    return <EmptyState />;
  case 'ready':
    return <List items={state.data} />;
}
```

## 附带的好处

- 加第五个状态（比如「部分失败」）时，编译器会指出所有需要处理的地方
- 测试从「组合各种布尔值」变成「每个 kind 测一次」
- 不会有人忘记处理空态——因为 `switch` 的穷尽性检查会报错

**状态能互斥就互斥，别让布尔值相乘。**

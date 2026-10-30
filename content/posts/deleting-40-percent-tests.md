---
title: 我在前端项目里删掉了 40% 的测试
date: 2026-08-30
summary: 覆盖率从 82% 掉到 61%，但线上事故没有变多。因为删掉的都是「测实现」而不是「测契约」的用例。
tags: [测试, 工程]
---

团队里有个指标：单测覆盖率必须 80% 以上。我们一直是 82%。

直到有一次重构，我改了三个组件的内部结构——**一行对外行为都没变**——结果 47 个测试全红。

## 那些测试在测什么

看了一个具体的：

```ts
it('sets loading to true when fetching', () => {
  const { result } = renderHook(() => useUsers());
  expect(result.current.loading).toBe(true);
});
```

它测的是 `loading` 这个内部状态变量存不存在、什么时候变成 true。这不是契约，这是**实现细节的快照**。

真正的契约是：_加载期间页面上应该有一个骨架屏_。

## 我改成这样

```ts
it('shows a skeleton while loading', async () => {
  render(<UserList />);
  expect(screen.getByRole('status')).toHaveTextContent(/加载中/);
});
```

现在我可以随便重构 `useUsers` 的内部，只要行为不变，测试就不动。

## 删完之后

- 覆盖率 82% → 61%
- 测试数量少了 40%
- **线上事故数量：持平**
- 重构时红掉的测试：从 47 个变成 3 个

覆盖率是「有多少代码被跑过」，不是「有多少行为被验证」。**这两个数字可以差得很远。**

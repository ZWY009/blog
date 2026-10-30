import { render, screen, act } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';
import { posts } from './data/posts';

/** 直接在 jsdom 里改 hash 并主动派发 hashchange（jsdom 不会自己触发） */
function goto(hash: string) {
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
}

afterEach(() => {
  goto('');
});

describe('博客首页', () => {
  it('渲染站点名与全部文章标题', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: '纸上' })).toBeInTheDocument();
    for (const post of posts) {
      expect(screen.getByRole('link', { name: new RegExp(post.title) })).toBeInTheDocument();
    }
  });

  it('按年份分组显示', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: '2026' })).toBeInTheDocument();
  });
});

describe('文章详情', () => {
  it('hash 指向文章时渲染正文与返回链接', () => {
    render(<App />);
    const first = posts[0]!;
    goto(`#/post/${first.id}`);

    expect(screen.getByRole('heading', { level: 1, name: first.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /返回列表/ })).toBeInTheDocument();
    // 正文第一段应该真实出现在页面上
    const firstBlock = first.body[0]!;
    expect(screen.getByText(firstBlock.text)).toBeInTheDocument();
  });

  it('未知 id 不崩，回落到列表', () => {
    render(<App />);
    goto('#/post/not-a-real-post');
    expect(screen.getByRole('heading', { name: '2026' })).toBeInTheDocument();
  });
});

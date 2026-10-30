import { useEffect, useState } from 'react';
import { PostList } from './components/PostList';
import { PostView } from './components/PostView';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { posts } from './data/posts';

/** 从 hash 里解析文章 id：#/post/<id> */
function activeIdFromHash(hash: string): string | undefined {
  const match = /^#\/post\/(.+)$/.exec(hash);
  return match ? match[1] : undefined;
}

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const activeId = activeIdFromHash(hash);
  const activePost = activeId ? posts.find((p) => p.id === activeId) : undefined;

  return (
    <div className="mx-auto w-full max-w-[46rem] px-6">
      <SiteHeader />
      <main>{activePost ? <PostView post={activePost} /> : <PostList posts={posts} />}</main>
      <SiteFooter />
    </div>
  );
}
